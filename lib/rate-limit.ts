/**
 * In-memory sliding-window rate limiter.
 *
 * Lives at module scope inside each Node.js API route worker — shared across
 * requests handled by the same process, which is the right granularity for
 * burst protection.  In serverless environments (Vercel) each cold-start gets
 * a fresh store; warm instances share state, which still blocks real abuse.
 *
 * For persistent cross-instance blocking the limiter also writes to Firestore
 * (fire-and-forget) so the admin panel can surface blocked IPs.
 */

interface Entry {
  hits: number;
  windowStart: number;
  violations: number;
  blockedUntil: number;
}

// Eviction: remove entries older than 2 × the max window we ever use (1 h).
const MAX_AGE_MS = 2 * 60 * 60 * 1000;
const store = new Map<string, Entry>();

// Periodic cleanup so the Map doesn't grow unbounded in long-lived processes.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const cutoff = Date.now() - MAX_AGE_MS;
    for (const [k, v] of store) {
      if (v.windowStart < cutoff && v.blockedUntil < Date.now()) store.delete(k);
    }
  }, 5 * 60 * 1000); // every 5 min
}

// Progressive block durations based on violation count.
const BLOCK_DURATIONS_MS = [
  60_000,       // 1st offence  → 1 min
  5 * 60_000,   // 2nd          → 5 min
  30 * 60_000,  // 3rd          → 30 min
  3 * 3600_000, // 4th          → 3 h
  24 * 3600_000,// 5th+         → 24 h
];

function blockDuration(violations: number): number {
  const idx = Math.min(violations - 1, BLOCK_DURATIONS_MS.length - 1);
  return BLOCK_DURATIONS_MS[idx];
}

// ─── Result type ──────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;   // unix ms
  retryAfter: number; // seconds
}

// ─── Core check ───────────────────────────────────────────────────────────────

/**
 * @param ip     - The client IP address
 * @param route  - Short identifier for the route (e.g. "apply", "submit")
 * @param limit  - Max allowed hits within the window
 * @param windowMs - Sliding window size in milliseconds
 */
export function checkRateLimit(
  ip: string,
  route: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const key = `${ip}::${route}`;
  const now = Date.now();

  let entry = store.get(key);

  // If currently blocked, refuse immediately.
  if (entry && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Reset window if it has expired.
  if (!entry || now - entry.windowStart > windowMs) {
    entry = { hits: 0, windowStart: now, violations: entry?.violations ?? 0, blockedUntil: 0 };
  }

  entry.hits += 1;

  if (entry.hits > limit) {
    entry.violations += 1;
    const duration = blockDuration(entry.violations);
    entry.blockedUntil = now + duration;
    store.set(key, entry);

    // Log to Firestore asynchronously (best-effort, non-blocking).
    logBlocked(ip, route, entry.violations, entry.blockedUntil).catch(() => {});

    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      retryAfter: Math.ceil(duration / 1000),
    };
  }

  store.set(key, entry);

  return {
    allowed: true,
    remaining: Math.max(0, limit - entry.hits),
    resetAt: entry.windowStart + windowMs,
    retryAfter: 0,
  };
}

// ─── Firestore logging (fire-and-forget) ──────────────────────────────────────

async function logBlocked(ip: string, route: string, violations: number, blockedUntil: number) {
  try {
    const { adminDb } = await import("@/lib/firebase-admin");
    await adminDb.collection("blocked_ips").doc(`${ip}_${route}`).set(
      {
        ip,
        route,
        violations,
        blockedUntil: new Date(blockedUntil),
        lastBlockedAt: new Date(),
      },
      { merge: true },
    );
  } catch {
    // Silently ignore — logging must never break the request path.
  }
}

// ─── Convenience: build response headers ──────────────────────────────────────

export function rateLimitHeaders(result: RateLimitResult, limit: number): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.retryAfter > 0 ? { "Retry-After": String(result.retryAfter) } : {}),
  };
}

// ─── IP extraction helper ─────────────────────────────────────────────────────

export function getIP(req: Request): string {
  // Standard proxy headers in order of preference.
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const realIP = req.headers.get("x-real-ip");
  if (realIP) return realIP.trim();

  // Vercel adds this custom header.
  const vercelIP = req.headers.get("x-vercel-forwarded-for");
  if (vercelIP) return vercelIP.split(",")[0].trim();

  return "unknown";
}
