import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Orvantia AI",
  description: "Privacy Policy for Orvantia AI products and services.",
};

export default function PrivacyPage() {
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
            01 / Legal
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
            Privacy Policy
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
              1. Information We Collect
            </h2>
            <p style={{ marginBottom: 16 }}>
              At Orvantia AI, we build autonomous AI products for enterprise operations, engineering, and healthcare. To power our systems effectively and securely, we may collect:
            </p>
            <ul style={{ listStyleType: "disc", paddingLeft: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Account & Organization Data:</strong> Name, email, company details, and role when you partner with us or use our products.</li>
              <li><strong>Telemetry & Usage Data:</strong> Interactions with our autonomous agents, API usage logs, and latency metrics to ensure our 99.98% uptime.</li>
              <li><strong>Domain-Specific Inputs:</strong> For products like Continuum or ClinicalAgents, we process code repositories, clinical documentation, or system architecture diagrams strictly within your designated and isolated tenant environment.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              2. How We Use Your Data
            </h2>
            <p style={{ marginBottom: 16 }}>
              We use the collected information exclusively to provide and improve our autonomous products:
            </p>
            <ul style={{ listStyleType: "disc", paddingLeft: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>To deploy, operate, and maintain intelligence layers for your organization.</li>
              <li>To continuously calibrate and refine our reasoning engines and workflow automation.</li>
              <li>To monitor security, detect fraud, and maintain our strict HIPAA and SOC 2 Type II compliance standards.</li>
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              3. Data Security & Isolation
            </h2>
            <p style={{ marginBottom: 16 }}>
              Security is foundational to our architecture. Orvantia AI employs strict tenant isolation, at-rest and in-transit encryption, and continuous auditing. We do not use your proprietary enterprise data or clinical research to train our foundational models without explicit, written agreement.
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 16 }}>
              4. Contact Us
            </h2>
            <p style={{ marginBottom: 16 }}>
              If you have any questions about this Privacy Policy or our data practices, please contact our privacy team at:
            </p>
            <p style={{ fontFamily: "var(--mono)", color: "rgba(99,102,241,0.9)" }}>
              orvantia.ai@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
