"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function BuilderSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.email?.endsWith("@orvantia.ai") && user.emailVerified) {
          router.replace("/admin");
          return;
        }
        const snap = await getDoc(doc(db, "builder_profiles", user.uid));
        router.replace(snap.exists() ? "/dashboard" : "/builders/onboarding");
      }
    });
    return unsub;
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (cred.user.email?.endsWith("@orvantia.ai") && cred.user.emailVerified) {
        router.replace("/admin");
        return;
      }
      await setDoc(doc(db, "users", cred.user.uid), { role: "builder", createdAt: serverTimestamp() }, { merge: true });
      await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "account_created", userId: cred.user.uid, userEmail: email }) });
      router.replace("/builders/onboarding");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/email-already-in-use") setError("An account with this email already exists.");
      else if (code === "auth/weak-password") setError("Password is too weak. Use at least 8 characters.");
      else setError("Signup failed. Please try again.");
    } finally { setLoading(false); }
  };

  if (!mounted) return null;

  const fieldStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "13px 16px", color: "rgba(241,245,249,0.9)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" };

  const strengthScore = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColor = ["transparent", "#f87171", "#fbbf24", "#22c55e"][strengthScore];
  const strengthLabel = ["", "Too short", "Good", "Strong"][strengthScore];

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", fontFamily: "var(--font-space), system-ui, sans-serif" }}>
      {/* Left branding panel */}
      <div style={{ flex: "0 0 44%", display: "none", background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(168,85,247,0.05) 100%)", borderRight: "1px solid rgba(255,255,255,0.06)", padding: "60px 48px", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }} className="signup-left">
        <div style={{ position: "absolute", top: "-10%", right: "-15%", width: "60%", height: "60%", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <a href="/builders" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", position: "relative" }}>
          <img src="/logo.png" alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>Orvantia</span>
        </a>
        <div style={{ position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#818cf8" }}>Free to join</span>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 700, color: "rgba(241,245,249,0.9)", lineHeight: 1.25, marginBottom: 16, letterSpacing: "-0.02em" }}>
            Start building<br />today.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(241,245,249,0.4)", lineHeight: 1.7, marginBottom: 32 }}>Create your account and access challenges built around real Orvantia products.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[["🎯", "Real challenges"], ["📊", "Detailed scores"], ["💬", "Team feedback"], ["🏆", "Contributor path"]].map(([icon, label]) => (
              <div key={label} style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 12, color: "rgba(241,245,249,0.55)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: "rgba(241,245,249,0.18)", letterSpacing: "0.1em", position: "relative" }}>© 2025 Orvantia AI</p>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 50% at 40% 30%, rgba(168,85,247,0.05), transparent 60%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}
        >
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <a href="/builders" style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src="/logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(241,245,249,0.5)" }}>Orvantia Builder</span>
            </a>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(241,245,249,0.95)", letterSpacing: "-0.02em", marginBottom: 6 }}>Create account</h1>
            <p style={{ fontSize: 14, color: "rgba(241,245,249,0.35)" }}>Join the Orvantia Builder Program – free forever</p>
          </div>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(241,245,249,0.5)", marginBottom: 8 }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" style={fieldStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.55)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(241,245,249,0.5)", marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required style={fieldStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.55)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
              {password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${strengthScore * 33.3}%` }} style={{ height: "100%", background: strengthColor, borderRadius: 100, transition: "all 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: strengthColor, flexShrink: 0 }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "rgba(241,245,249,0.5)", marginBottom: 8 }}>Confirm password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required style={{ ...fieldStyle, borderColor: confirm && confirm !== password ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = confirm !== password ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.55)")} onBlur={(e) => (e.target.style.borderColor = confirm && confirm !== password ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="1.5"/><path d="M12 8v4m0 4h.01" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <p style={{ fontSize: 12, color: "rgba(248,113,113,0.9)", margin: 0 }}>{error}</p>
              </motion.div>
            )}

            <motion.button type="submit" disabled={loading} whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "14px", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "white", cursor: loading ? "wait" : "pointer", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", marginTop: 4, boxShadow: loading ? "none" : "0 0 24px rgba(99,102,241,0.35)", transition: "all 0.2s" }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }} style={{ display: "inline-block", width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  Creating account…
                </span>
              ) : "Create account →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", marginTop: 28, fontSize: 13, color: "rgba(241,245,249,0.3)" }}>
            Already have an account?{" "}
            <a href="/builders/login" style={{ color: "#818cf8", textDecoration: "none", fontWeight: 500 }}>Sign in</a>
          </p>
        </motion.div>
      </div>
      <style>{`@media (min-width: 900px) { .signup-left { display: flex !important; } }`}</style>
    </div>
  );
}
