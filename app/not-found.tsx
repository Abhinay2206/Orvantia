import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#04040a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(24px, 6vw, 96px)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(99,102,241,0.1), rgba(168,85,247,0.06) 45%, transparent 70%)",
        }}
      />

      {/* Large watermark 404 */}
      <div
        style={{
          position: "absolute",
          fontFamily: "var(--font-space), system-ui, sans-serif",
          fontSize: "clamp(200px, 38vw, 520px)",
          fontWeight: 700,
          letterSpacing: "-0.06em",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px rgba(99,102,241,0.08)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        404
      </div>

      {/* Content */}
      <div className="relative z-10" style={{ maxWidth: "480px" }}>
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 28,
          }}
        >
          <div style={{ width: 24, height: 1, background: "rgba(99,102,241,0.4)" }} />
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(99,102,241,0.7)",
            }}
          >
            Error 404
          </span>
          <div style={{ width: 24, height: 1, background: "rgba(99,102,241,0.4)" }} />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-space), system-ui, sans-serif",
            fontSize: "clamp(28px, 4vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "rgba(241,245,249,0.9)",
            marginBottom: 16,
          }}
        >
          Page not found.
        </h1>

        <p
          style={{
            fontFamily: "var(--font-space), system-ui, sans-serif",
            fontSize: "clamp(14px, 1.1vw, 16px)",
            color: "rgba(241,245,249,0.3)",
            lineHeight: 1.65,
            marginBottom: 40,
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: "100px",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "white",
            background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))",
            boxShadow: "0 0 24px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
            textDecoration: "none",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
        >
          ← Back to Orvantia
        </Link>

        {/* Bottom tagline */}
        <div
          style={{
            marginTop: 48,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(241,245,249,0.1)",
          }}
        >
          Orvantia · AI · 2026
        </div>
      </div>
    </div>
  );
}
