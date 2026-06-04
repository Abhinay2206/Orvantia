"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import BuilderNav from "@/app/_builder/BuilderNav";

export default function SubmitTask() {
  const router = useRouter();
  const { taskId } = useParams() as { taskId: string };

  const [uid, setUid] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ githubRepo: "", liveDemo: "", videoDemo: "", technicalExplanation: "", architectureExplanation: "", challengesFaced: "", learnings: "", notes: "", attachments: "" });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.replace("/builders/login"); return; }
      const pSnap = await getDoc(doc(db, "builder_profiles", user.uid));
      if (!pSnap.exists()) { router.replace("/builders/onboarding"); return; }
      const aSnap = await getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", user.uid), where("taskId", "==", taskId)));
      if (aSnap.empty) { router.replace(`/tasks/${taskId}`); return; }
      const tSnap = await getDoc(doc(db, "tasks", taskId));
      if (tSnap.exists()) setTaskTitle(tSnap.data().title as string);
      setUid(user.uid);
      setAuthReady(true);
    });
    return unsub;
  }, [taskId]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.githubRepo.trim()) { setErrors({ githubRepo: "GitHub URL is required." }); document.getElementById("githubRepo")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (!form.technicalExplanation.trim()) { setErrors({ technicalExplanation: "Technical explanation is required." }); document.getElementById("techExp")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    if (!uid) return;
    setSubmitting(true);

    try {
      const attachments = form.attachments.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);

      await addDoc(collection(db, "submissions"), { userId: uid, taskId, taskTitle, ...form, attachments, status: "submitted", submittedAt: serverTimestamp() });

      const aSnap = await getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", uid), where("taskId", "==", taskId)));
      if (!aSnap.empty) await updateDoc(doc(db, "challenge_assignments", aSnap.docs[0].id), { status: "submitted", submittedAt: serverTimestamp() });

      await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "submission_received", userId: uid, taskTitle }) });
      setSuccess(true);
    } catch { setErrors({ submit: "Submission failed. Please try again." }); }
    finally { setSubmitting(false); }
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "12px 14px", color: "rgba(241,245,249,0.9)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { display: "block", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", marginBottom: 6 };

  if (!authReady) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
    </div>
  );

  if (success) return (
    <div style={{ minHeight: "100vh", background: "#04040a", fontFamily: "var(--font-space), system-ui" }}>
      <BuilderNav />
      <div style={{ maxWidth: 540, margin: "80px auto", padding: "0 28px", textAlign: "center" }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </motion.div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 10 }}>Submission Received!</h1>
        <p style={{ fontSize: 14, color: "rgba(241,245,249,0.45)", lineHeight: 1.7, marginBottom: 32 }}>
          Your solution for <strong style={{ color: "rgba(241,245,249,0.75)" }}>{taskTitle}</strong> has been submitted. The Orvantia team will review it and share feedback.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <a href="/dashboard" style={{ padding: "11px 24px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#818cf8", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", textDecoration: "none" }}>Go to Dashboard</a>
          <a href="/tasks" style={{ padding: "11px 24px", borderRadius: 100, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>More Tasks</a>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 30% at 50% 0%, rgba(99,102,241,0.05), transparent 60%)" }} />
      <BuilderNav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "36px 28px 80px", position: "relative", zIndex: 1 }}>
        <button onClick={() => router.push(`/tasks/${taskId}`)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(241,245,249,0.3)", cursor: "pointer", fontSize: 12, marginBottom: 28, padding: 0 }}>← Back to Task</button>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 6 }}>Submit Solution</h1>
          {taskTitle && <p style={{ fontSize: 14, color: "rgba(99,102,241,0.7)" }}>{taskTitle}</p>}
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Links */}
          <Sec num="01" title="Project Links">
            <Field id="githubRepo" label="GitHub Repository *" error={errors.githubRepo}>
              <input type="url" value={form.githubRepo} onChange={(e) => set("githubRepo", e.target.value)} placeholder="https://github.com/username/repo"
                style={{ ...inp, borderColor: errors.githubRepo ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")} onBlur={(e) => (e.target.style.borderColor = errors.githubRepo ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
            </Field>
            <Field id="liveDemo" label="Live Demo URL">
              <input type="url" value={form.liveDemo} onChange={(e) => set("liveDemo", e.target.value)} placeholder="https://your-demo.vercel.app" style={inp}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            </Field>
            <Field id="videoDemo" label="Demo Video URL">
              <input type="url" value={form.videoDemo} onChange={(e) => set("videoDemo", e.target.value)} placeholder="https://loom.com/share/…" style={inp}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")} />
            </Field>
          </Sec>

          {/* Explanations */}
          <Sec num="02" title="Explanation">
            {[
              { id: "techExp", key: "technicalExplanation", label: "Technical Explanation *", ph: "Describe your approach, technical decisions, and implementation…", rows: 5, err: errors.technicalExplanation },
              { id: "arch", key: "architectureExplanation", label: "Architecture Explanation", ph: "Describe the system design and data flow…", rows: 4 },
              { id: "challenges", key: "challengesFaced", label: "Challenges Faced", ph: "What were the hardest parts and how did you solve them?", rows: 3 },
              { id: "learnings", key: "learnings", label: "Key Learnings", ph: "What did you learn from this challenge?", rows: 3 },
              { id: "notes", key: "notes", label: "Additional Notes", ph: "Anything else you'd like the team to know…", rows: 2 },
            ].map((f) => (
              <Field key={f.id} id={f.id} label={f.label} error={f.err}>
                <textarea id={f.id} value={form[f.key as keyof typeof form]} onChange={(e) => set(f.key, e.target.value)} placeholder={f.ph} rows={f.rows}
                  style={{ ...inp, resize: "vertical", lineHeight: 1.7, borderColor: f.err ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")} onBlur={(e) => (e.target.style.borderColor = f.err ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
              </Field>
            ))}
          </Sec>

          {/* External Links / Attachments */}
          <Sec num="03" title="Attachments & External Resources">
            <Field id="attachments" label="Resource URLs" error={errors.attachments}>
              <textarea id="attachments" value={form.attachments} onChange={(e) => set("attachments", e.target.value)} placeholder="Paste links to Google Drive, Figma, Notion, etc. (one per line)" rows={3}
                style={{ ...inp, resize: "vertical", lineHeight: 1.7, borderColor: errors.attachments ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)" }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")} onBlur={(e) => (e.target.style.borderColor = errors.attachments ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.09)")} />
            </Field>
          </Sec>

          {errors.submit && <p style={{ fontSize: 13, color: "rgba(248,113,113,0.8)", marginBottom: 18, padding: "12px 14px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10 }}>{errors.submit}</p>}

          <motion.button type="submit" disabled={submitting} whileHover={{ scale: submitting ? 1 : 1.01, boxShadow: submitting ? "none" : "0 0 40px rgba(99,102,241,0.45)" }} whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "15px", borderRadius: 100, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: submitting ? "wait" : "pointer", background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: "0 0 28px rgba(99,102,241,0.3)", border: "none", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Submitting…" : "Submit Solution →"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}

function Sec({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#818cf8", fontFamily: "var(--font-mono), monospace" }}>{num}</span>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.7)" }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{children}</div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div id={id}>
      <label style={{ display: "block", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: error ? "rgba(248,113,113,0.7)" : "rgba(241,245,249,0.3)", marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 11, color: "rgba(248,113,113,0.7)", marginTop: 5 }}>{error}</p>}
    </div>
  );
}
