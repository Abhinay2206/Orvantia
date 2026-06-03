import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Orvantia AI",
  description: "Cookie Policy for Orvantia AI products and services.",
};

export default function CookiesPage() {
  return (
    <div
      className="relative w-full min-h-screen"
      style={{
        paddingTop: "clamp(120px, 15vw, 180px)",
        paddingBottom: "clamp(80px, 10vw, 120px)",
        paddingLeft: "clamp(24px, 5vw, 72px)",
        paddingRight: "clamp(24px, 5vw, 72px)",
        background: "var(--bg)",
      }}
    >
      <div className="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <div style={{ marginBottom: "clamp(48px, 8vw, 80px)" }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "rgba(99,102,241,0.8)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            03 / Legal
          </div>
          <h1
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "rgba(241,245,249,0.95)",
              marginBottom: 24,
            }}
          >
            Cookie Policy
          </h1>
          <p
            style={{
              fontFamily: "var(--font)",
              fontSize: "clamp(15px, 1.2vw, 18px)",
              color: "rgba(241,245,249,0.4)",
              lineHeight: 1.6,
            }}
          >
            Last Updated: June 2026
          </p>
        </div>

        <div
          className="glass-card"
          style={{
            padding: "clamp(32px, 5vw, 64px)",
            fontFamily: "var(--font)",
            fontSize: "15px",
            lineHeight: 1.8,
            color: "rgba(241,245,249,0.7)",
          }}
        >
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              1. What Are Cookies?
            </h2>
            <p style={{ marginBottom: 16 }}>
              Cookies are small text files stored on your device when you interact with the Orvantia AI platform. We use them to enhance your experience, analyze site usage, and ensure the secure operation of our enterprise systems.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              2. How We Use Cookies
            </h2>
            <ul style={{ listStyleType: "disc", paddingLeft: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Essential Cookies:</strong> Required for core functionality, such as authenticating administrators into the management dashboard and securing API endpoints.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how our products are used, monitor latency, and maintain our 99.98% uptime SLA.</li>
              <li><strong>Preference Cookies:</strong> Store your interface settings and autonomous agent configurations across sessions.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              3. Managing Cookies
            </h2>
            <p style={{ marginBottom: 16 }}>
              You can control and/or delete cookies through your browser settings. However, disabling essential cookies may impact your ability to access our enterprise dashboards or deploy autonomous agents.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
