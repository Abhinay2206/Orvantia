"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function BuilderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "builder_profiles", user.uid));
        router.replace(snap.exists() ? "/dashboard" : "/builders/onboarding");
      }
    });
    return unsub;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const snap = await getDoc(doc(db, "builder_profiles", cred.user.uid));
      router.replace(snap.exists() ? "/dashboard" : "/builders/onboarding");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", fontFamily: "var(--font-space), system-ui, sans-serif" }}>
      {/* Left panel — branding */}
      <div style={{ flex: 1, display: "none", background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 100%)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "60px 48px", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }} className="login-left">
        <div style={{ position: "absolute", top: "20%", left: "-20%", width: "70%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "50%", height: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <a href="/builders" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo.png" alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>Orvantia</span>
          </a>
        </div>
        <div style={{ position: "relative" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: 20 }}>Builder Program</p>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: "rgba(241,245,249,0.9)", lineHeight: 1.25, marginBottom: 20, letterSpacing: "-0.02em" }}>
            Prove your skills.<br />Build real products.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(241,245,249,0.4)", lineHeight: 1.7 }}>
            Work on challenges from Enteraflux, Continuum, and ClinicalAgents. Get reviewed, scored, and discovered.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 36 }}>
            {["Real-world challenges from live products", "Detailed feedback on every submission", "Path from builder to core contributor"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="10" height="7" viewBox="0 0 10 7" fill="none"><path d="M1 3.5L3.5 6L9 1" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <span style={{ fontSize: 13, color: "rgba(241,245,249,0.55)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(241,245,249,0.18)", letterSpacing: "0.1em", position: "relative" }}>© 2025 Orvantia AI</p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 60% 20%, rgba(99,102,241,0.06), transparent 60%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}
        >
          {/* Mobile logo */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <a href="/builders" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(241,245,249,0.5)" }}>Orvantia Builder</span>
            </a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(241,245,249,0.95)", letterSpacing: "-0.02em", marginBottom: 6 }}>Sign in</h1>
            <p style={{ fontSize: 14, color: "rgba(241,245,249,0.35)" }}>Continue to your builder account</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(241,245,249,0.5)", marginBottom: 8 }}>Email address</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required autoComplete="email"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "13px 16px", color: "rgba(241,245,249,0.9)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: "rgba(241,245,249,0.5)" }}>Password</label>
              </div>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "13px 16px", color: "rgba(241,245,249,0.9)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.55)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.5"/><path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <p style={{ fontSize: 12, color: "rgba(248,113,113,0.9)", margin: 0 }}>{error}</p>
              </motion.div>
            )}

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "white", cursor: loading ? "wait" : "pointer", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", marginTop: 4, boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.35)", transition: "all 0.2s" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  Signing in…
                </span>
              ) : "Sign in →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "rgba(241,245,249,0.3)" }}>
            No account?{" "}
            <a href="/builders/signup" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>Create one free</a>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 900px) { .login-left { display: flex !important; } }
      `}</style>
    </div>
  );
}
