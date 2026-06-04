import { NextRequest, NextResponse } from "next/server";

// ─── Constants ────────────────────────────────────────────────────────────────

// User-agent fragments that are almost certainly automated abuse.
const BLOCKED_UA_PATTERNS = [
  "scrapy", "ahrefsbot", "semrushbot", "dotbot", "majestic",
  "mj12bot", "petalbot", "blexbot", "bytespider", "claudebot",
  "go-http-client", "python-requests", "libwww-perl", "curl/",
  "wget/", "axios/0.", "node-fetch",
  "zgrab", "masscan", "nmap", "nuclei", "nikto", "sqlmap",
];

// Paths that require no processing (static assets, Next.js internals).
const BYPASS_PREFIXES = ["/_next/", "/favicon", "/logo", "/icon", "/robots", "/.well-known"];

// Security response headers added to every reply.
const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

// Simple edge-level in-memory store for tracking request counts per IP.
// Each edge instance has its own counter — good enough for burst detection.
// Persistent cross-instance blocking is handled by the Node.js rate-limit.ts.
const edgeStore = new Map<string, { count: number; windowStart: number; blocked: boolean }>();

/** Max requests to any /api/* path within the edge window. */
const EDGE_API_LIMIT = 60;      // 60 req per 60 s per IP
const EDGE_WINDOW_MS = 60_000;  // 1 minute

// ─── IP extraction ────────────────────────────────────────────────────────────

function extractIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim() ||
    (req as any).ip ||
    "unknown"
  );
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip static assets and Next.js internals — no processing needed.
  if (BYPASS_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ── 1. Block malicious user-agents ──────────────────────────────────────────
  const ua = (req.headers.get("user-agent") || "").toLowerCase();
  const isBlockedUA = BLOCKED_UA_PATTERNS.some((p) => ua.includes(p));
  if (isBlockedUA) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Content-Type": "text/plain", ...SECURITY_HEADERS },
    });
  }

  // ── 2. Reject requests with no User-Agent on API routes ─────────────────────
  if (pathname.startsWith("/api/") && !ua) {
    return new NextResponse(JSON.stringify({ error: "Bad Request" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...SECURITY_HEADERS },
    });
  }

  // ── 3. Edge-level burst protection on API routes ─────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip = extractIP(req);
    const now = Date.now();
    const key = ip;

    let entry = edgeStore.get(key);

    // Reset window when it expires.
    if (!entry || now - entry.windowStart > EDGE_WINDOW_MS) {
      entry = { count: 0, windowStart: now, blocked: false };
    }

    // If already flagged as blocked in this window, reject immediately.
    if (entry.blocked) {
      const retryAfter = Math.ceil((entry.windowStart + EDGE_WINDOW_MS - now) / 1000);
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(EDGE_API_LIMIT),
            "X-RateLimit-Remaining": "0",
            ...SECURITY_HEADERS,
          },
        },
      );
    }

    entry.count += 1;

    if (entry.count > EDGE_API_LIMIT) {
      entry.blocked = true;
      edgeStore.set(key, entry);
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil(EDGE_WINDOW_MS / 1000)),
            "X-RateLimit-Limit": String(EDGE_API_LIMIT),
            "X-RateLimit-Remaining": "0",
            ...SECURITY_HEADERS,
          },
        },
      );
    }

    edgeStore.set(key, entry);
  }

  // ── 4. Attach security headers to all responses ──────────────────────────────
  const response = NextResponse.next();
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
}

// Only run middleware on relevant paths — skip static files entirely.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.png|icon.png|robots.txt).*)",
  ],
};
