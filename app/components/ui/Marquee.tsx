"use client";

const ROW1 = [
  "ENTERPRISE INTELLIGENCE", "·", "AUTONOMOUS ENGINEERING", "·", "HEALTHCARE AI", "·",
  "ORVANTIA AI", "·", "BUILDING AUTONOMOUS PRODUCTS", "·",
  "ENTERPRISE INTELLIGENCE", "·", "AUTONOMOUS ENGINEERING", "·", "HEALTHCARE AI", "·",
  "ORVANTIA AI", "·", "BUILDING AUTONOMOUS PRODUCTS", "·",
];

const ROW2 = [
  "847+ WORKFLOWS AUTOMATED", "·", "AI PRODUCT DEVELOPMENT", "·",
  "12,400+ CLINICAL TRIALS INDEXED", "·", "SOC 2 TYPE II", "·",
  "HIPAA COMPLIANT", "·", "ENTERPRISE GRADE", "·",
  "847+ WORKFLOWS AUTOMATED", "·", "AI PRODUCT DEVELOPMENT", "·",
  "12,400+ CLINICAL TRIALS INDEXED", "·", "SOC 2 TYPE II", "·",
  "HIPAA COMPLIANT", "·", "ENTERPRISE GRADE", "·",
];

export default function Marquee() {
  return (
    <div
      className="relative w-full overflow-hidden py-4 border-y"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      {/* Row 1 — left */}
      <div className="flex w-max animate-marquee-left-fast mb-3">
        {ROW1.map((t, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.22em] whitespace-nowrap px-3 font-mono"
            style={{
              color: t === "·" ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.18)",
              fontFamily: "var(--mono)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Row 2 — right */}
      <div className="flex w-max animate-marquee-right">
        {ROW2.map((t, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.22em] whitespace-nowrap px-3"
            style={{
              color: t === "·" ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.12)",
              fontFamily: "var(--mono)",
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Fade edges */}
      <div
        className="absolute inset-y-0 left-0 w-20 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, var(--bg), transparent)" }}
      />
    </div>
  );
}
