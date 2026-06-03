"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) router.replace("/admin");
    });
    return unsub;
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch {
      setError("Invalid credentials. Check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    padding: "13px 16px",
    color: "rgba(241,245,249,0.9)",
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#04040a",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, cursor: "auto",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99,102,241,0.07), transparent 70%)",
      }} />

      <div style={{
        width: "100%", maxWidth: 400, position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8,
          }}>
            <div style={{ position: "relative", width: 28, height: 28 }}>
              <img src="/logo.png" alt="Orvantia Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <span style={{
              fontSize: 15, fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "rgba(241,245,249,0.9)",
            }}>
              Orvantia
            </span>
          </div>
          <p style={{ fontSize: 12, color: "rgba(241,245,249,0.25)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Admin Access
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: 32,
          boxShadow: "0 0 60px rgba(99,102,241,0.06)",
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 11, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@orvantia.ai"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 11, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 7,
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
              />
            </div>

            {error && (
              <p style={{
                fontSize: 12, color: "rgba(248,113,113,0.85)", marginBottom: 16,
                padding: "10px 14px", background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
              }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px 24px", borderRadius: 100,
                fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase",
                fontWeight: 600, color: "white", cursor: loading ? "wait" : "pointer",
                background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                border: "none", opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
