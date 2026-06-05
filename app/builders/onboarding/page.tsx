"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const SKILLS = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Machine Learning", "LLMs / Prompt Engineering", "FastAPI", "Firebase", "AWS", "Docker", "UI/UX Design", "Figma", "Data Science", "Computer Vision", "NLP", "PostgreSQL", "MongoDB", "GraphQL", "DevOps", "Go", "Rust", "TailwindCSS", "Three.js"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduate", "Working Professional"];
const TRACKS = ["AI / LLM", "Full Stack", "DevOps / Infra", "Product / Design"];

export default function BuilderOnboarding() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customSkill, setCustomSkill] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", college: "", branch: "", year: "", github: "", linkedin: "", portfolio: "", track: "", bio: "", skills: [] as string[] });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.replace("/builders/login"); return; }
      if (user.email?.endsWith("@orvantia.ai") && user.emailVerified) {
        router.replace("/admin");
        return;
      }
      const snap = await getDoc(doc(db, "builder_profiles", user.uid));
      if (snap.exists()) { router.replace("/dashboard"); return; }
      setUid(user.uid);
      setForm((p) => ({ ...p, email: user.email || "" }));
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const toggleSkill = (s: string) => setForm((p) => ({ ...p, skills: p.skills.includes(s) ? p.skills.filter((x) => x !== s) : [...p.skills, s] }));
  const addCustom = () => { const t = customSkill.trim(); if (t && !form.skills.includes(t)) toggleSkill(t); setCustomSkill(""); };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.college.trim()) e.college = "Required";
    if (!form.branch.trim()) e.branch = "Required";
    if (!form.year) e.year = "Required";
    if (!form.track) e.track = "Select a track";
    if (form.skills.length === 0) e.skills = "Select at least one skill";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    if (!uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "builder_profiles", uid), { ...form, userId: uid, builderStatus: "applied", createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      router.replace("/dashboard");
    } catch { setErrors({ submit: "Failed to save. Please try again." }); }
    finally { setSaving(false); }
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "12px 14px", color: "rgba(241,245,249,0.9)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 6 };

  if (!authChecked) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.06), transparent 60%)" }} />
      <header style={{ display: "flex", alignItems: "center", padding: "0 32px", height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,10,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/builders" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/logo.png" alt="" style={{ width: 24, height: 24, objectFit: "contain" }} />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.75)" }}>Orvantia Builder</span>
        </a>
        <span style={{ marginLeft: 16, fontSize: 11, color: "rgba(241,245,249,0.25)", letterSpacing: "0.1em" }}>/ Complete Profile</span>
      </header>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 28px" }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 8 }}>Set up your profile</h1>
          <p style={{ fontSize: 14, color: "rgba(241,245,249,0.4)", lineHeight: 1.7 }}>Tell us about yourself so we can match you with the right challenges.</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Personal */}
          <SectionHeader num="01" title="Personal Information" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {[{ id: "fullName", l: "Full Name *", t: "text", ph: "Your full name", col: "span 1" }, { id: "email", l: "Email *", t: "email", ph: "you@example.com", col: "span 1" }, { id: "phone", l: "Phone *", t: "tel", ph: "+91 98765 43210", col: "span 1" }].map((f) => (
              <div key={f.id} style={{ gridColumn: f.col }}>
                <label style={{ ...lbl, color: errors[f.id] ? "rgba(248,113,113,0.7)" : "rgba(241,245,249,0.3)" }}>{f.l}</label>
                <input type={f.t} value={form[f.id as keyof typeof form] as string} onChange={(e) => set(f.id, e.target.value)} placeholder={f.ph}
                  style={{ ...inp, borderColor: errors[f.id] ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = errors[f.id] ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
                {errors[f.id] && <p style={{ fontSize: 10, color: "rgba(248,113,113,0.7)", marginTop: 4 }}>{errors[f.id]}</p>}
              </div>
            ))}
          </div>

          {/* Education */}
          <SectionHeader num="02" title="Education" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>College / University *</label>
              <input type="text" value={form.college} onChange={(e) => set("college", e.target.value)} placeholder="Your college name"
                style={{ ...inp, borderColor: errors.college ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = errors.college ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
              {errors.college && <p style={{ fontSize: 10, color: "rgba(248,113,113,0.7)", marginTop: 4 }}>{errors.college}</p>}
            </div>
            <div>
              <label style={lbl}>Branch / Major *</label>
              <input type="text" value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g. Computer Science"
                style={{ ...inp, borderColor: errors.branch ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = errors.branch ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
              {errors.branch && <p style={{ fontSize: 10, color: "rgba(248,113,113,0.7)", marginTop: 4 }}>{errors.branch}</p>}
            </div>
            <div>
              <label style={lbl}>Year *</label>
              <select value={form.year} onChange={(e) => set("year", e.target.value)} style={{ ...inp, cursor: "pointer", borderColor: errors.year ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = errors.year ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")}>
                <option value="" style={{ background: "#04040a" }}>Select year</option>
                {YEARS.map((y) => <option key={y} value={y} style={{ background: "#04040a" }}>{y}</option>)}
              </select>
              {errors.year && <p style={{ fontSize: 10, color: "rgba(248,113,113,0.7)", marginTop: 4 }}>{errors.year}</p>}
            </div>
          </div>

          {/* Links */}
          <SectionHeader num="03" title="Links" />
          <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
            {[{ id: "github", l: "GitHub", ph: "https://github.com/username" }, { id: "linkedin", l: "LinkedIn", ph: "https://linkedin.com/in/username" }, { id: "portfolio", l: "Portfolio / Personal Site", ph: "https://yoursite.com" }].map((f) => (
              <div key={f.id}>
                <label style={lbl}>{f.l}</label>
                <input type="url" value={form[f.id as keyof typeof form] as string} onChange={(e) => set(f.id, e.target.value)} placeholder={f.ph} style={inp}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
              </div>
            ))}
          </div>

          {/* Experience Track */}
          <SectionHeader num="04" title="Experience Track *" />
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 12, color: "rgba(241,245,249,0.3)", marginBottom: 14, lineHeight: 1.6 }}>Pick the area you want to focus on. This helps us match you with the right challenges.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
              {TRACKS.map((t) => {
                const active = form.track === t;
                const colors: Record<string, string> = { "AI / LLM": "#818cf8", "Full Stack": "#22d3ee", "DevOps / Infra": "#a855f7", "Product / Design": "#fbbf24" };
                const c = colors[t];
                return (
                  <motion.button key={t} type="button" onClick={() => set("track", t)} whileTap={{ scale: 0.97 }}
                    style={{ padding: "14px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "left", background: active ? `${c}12` : "rgba(255,255,255,0.03)", border: active ? `1px solid ${c}40` : "1px solid rgba(255,255,255,0.07)", color: active ? c : "rgba(241,245,249,0.5)", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: active ? c : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    {t}
                  </motion.button>
                );
              })}
            </div>
            {errors.track && <p style={{ fontSize: 11, color: "rgba(248,113,113,0.7)", marginTop: 8 }}>{errors.track}</p>}
          </div>

          {/* Bio */}
          <SectionHeader num="05" title="About You" />
          <div style={{ marginBottom: 32 }}>
            <label style={lbl}>Short Bio <span style={{ color: "rgba(241,245,249,0.18)", fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>(optional)</span></label>
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell us what you've built, what excites you about AI, or anything that gives us a sense of who you are as a builder..." rows={4}
              style={{ ...inp, resize: "vertical", minHeight: 96, lineHeight: 1.65 }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            <p style={{ fontSize: 11, color: "rgba(241,245,249,0.2)", marginTop: 6 }}>Max 300 characters · {form.bio.length}/300</p>
          </div>

          {/* Skills */}
          <SectionHeader num="06" title="Skills *" />
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {SKILLS.map((s) => {
                const active = form.skills.includes(s);
                return (
                  <motion.button key={s} type="button" onClick={() => toggleSkill(s)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer", background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.08)", color: active ? "#818cf8" : "rgba(241,245,249,0.45)", transition: "all 0.15s" }}>
                    {s}
                  </motion.button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())} placeholder="Add custom skill…" style={{ ...inp, flex: 1 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
              <button type="button" onClick={addCustom} style={{ padding: "12px 20px", borderRadius: 10, fontSize: 12, cursor: "pointer", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>Add</button>
            </div>
            {errors.skills && <p style={{ fontSize: 11, color: "rgba(248,113,113,0.7)", marginTop: 8 }}>{errors.skills}</p>}
          </div>

          {errors.submit && <p style={{ fontSize: 13, color: "rgba(248,113,113,0.8)", marginBottom: 20, padding: "12px 16px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10 }}>{errors.submit}</p>}

          <motion.button type="submit" disabled={saving} whileHover={{ scale: saving ? 1 : 1.01, boxShadow: saving ? "none" : "0 0 40px rgba(99,102,241,0.45)" }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "15px", borderRadius: 100, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: saving ? "wait" : "pointer", background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: "0 0 28px rgba(99,102,241,0.35)", border: "none", opacity: saving ? 0.7 : 1 }}>
            {saving ? "Saving…" : "Complete Profile & Start Building →"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
      <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#818cf8", fontFamily: "var(--font-mono), monospace" }}>{num}</span>
      <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.7)" }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}
