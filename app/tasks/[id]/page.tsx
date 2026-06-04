"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter, useParams } from "next/navigation";
import BuilderNav from "@/app/_builder/BuilderNav";

interface Task {
  id: string; title: string; description: string; difficulty: string; category: string;
  skillsRequired: string[]; deadline: Timestamp | null; estimatedDuration: string;
  requirements: string; deliverables: string; evaluationCriteria: string; resources?: string;
}

const DIFF_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Beginner:     { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  text: "#22c55e" },
  Intermediate: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.25)", text: "#fbbf24" },
  Advanced:     { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)",   text: "#f87171" },
};

function fmtDate(ts: Timestamp | null) {
  if (!ts) return "Open-ended";
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function TaskDetail() {
  const router = useRouter();
  const { id: taskId } = useParams() as { id: string };
  const [task, setTask] = useState<Task | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSubmission, setHasSubmission] = useState(false);
  const [hasActiveOtherTask, setHasActiveOtherTask] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user?.uid || null);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!authReady || !taskId) return;
    getDoc(doc(db, "tasks", taskId)).then((snap) => {
      if (!snap.exists()) { setError("Task not found."); setLoading(false); return; }
      setTask({ id: snap.id, ...snap.data() } as Task);
      setLoading(false);
    });
  }, [authReady, taskId]);

  useEffect(() => {
    if (!uid || !taskId) return;
    getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", uid), where("taskId", "==", taskId))).then((snap) => setAccepted(!snap.empty));
    getDocs(query(collection(db, "submissions"), where("userId", "==", uid), where("taskId", "==", taskId))).then((snap) => setHasSubmission(!snap.empty));
    getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", uid), where("status", "==", "in_progress"))).then((snap) => {
      setHasActiveOtherTask(snap.docs.some(d => d.data().taskId !== taskId));
    });
  }, [uid, taskId]);

  const handleAccept = async () => {
    if (!uid) { router.push("/builders/login"); return; }
    if (hasActiveOtherTask) { setError("You must complete your active task before accepting a new one."); return; }
    setAccepting(true);
    try {
      await setDoc(doc(db, "challenge_assignments", `${uid}_${taskId}`), {
        userId: uid, taskId, taskTitle: task?.title || "", acceptedAt: serverTimestamp(), status: "in_progress",
      });
      await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "task_accepted", userId: uid, taskTitle: task?.title }) });
      setAccepted(true);
    } catch { setError("Failed to accept task. Try again."); }
    finally { setAccepting(false); }
  };

  if (loading || !authReady) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.2)", borderTopColor: "#6366f1" }} />
    </div>
  );

  if (error || !task) return (
    <div style={{ minHeight: "100vh", background: "#04040a", fontFamily: "var(--font-space), system-ui" }}>
      <BuilderNav />
      <div style={{ maxWidth: 600, margin: "80px auto", padding: "0 28px", textAlign: "center" }}>
        <p style={{ color: "rgba(241,245,249,0.4)", fontSize: 15, marginBottom: 20 }}>{error || "Task not found."}</p>
        <button onClick={() => router.push("/tasks")} style={{ padding: "9px 22px", borderRadius: 100, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8", cursor: "pointer", fontSize: 12 }}>← Back to Tasks</button>
      </div>
    </div>
  );

  const diff = DIFF_COLORS[task.difficulty] || DIFF_COLORS.Beginner;

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 30% at 50% 0%, rgba(99,102,241,0.05), transparent 60%)" }} />
      <BuilderNav />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 28px 80px", position: "relative", zIndex: 1 }}>
        <button onClick={() => router.push("/tasks")} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(241,245,249,0.3)", cursor: "pointer", fontSize: 12, marginBottom: 28, padding: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.color = "rgba(241,245,249,0.65)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "rgba(241,245,249,0.3)"}>
          ← All Challenges
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, background: diff.bg, border: `1px solid ${diff.border}`, color: diff.text }}>{task.difficulty}</span>
            {task.category && <span style={{ display: "inline-block", padding: "3px 12px", borderRadius: 100, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}>{task.category}</span>}
            {accepted && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 12px", borderRadius: 100, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />Accepted</span>}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: "rgba(241,245,249,0.95)", lineHeight: 1.2, marginBottom: 16 }}>{task.title}</h1>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "rgba(241,245,249,0.3)" }}>📅 Deadline: {fmtDate(task.deadline)}</span>
            {task.estimatedDuration && <span style={{ fontSize: 12, color: "rgba(241,245,249,0.3)" }}>⏱ Est. {task.estimatedDuration}</span>}
          </div>
        </motion.div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { title: "Description", content: task.description },
            { title: "Problem Statement", content: task.description },
            { title: "Requirements", content: task.requirements },
            { title: "Expected Deliverables", content: task.deliverables },
            { title: "Evaluation Criteria", content: task.evaluationCriteria },
            { title: "Resources", content: task.resources },
          ].filter((s, i, arr) => {
            if (!s.content) return false;
            if (i === 1 && s.content === arr[0].content) return false;
            return true;
          }).map((section) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 22px" }}>
              <h2 style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(241,245,249,0.28)", marginBottom: 14 }}>{section.title}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(241,245,249,0.7)", whiteSpace: "pre-wrap" }}>{section.content}</p>
            </motion.div>
          ))}

          {(task.skillsRequired?.length ?? 0) > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 22px" }}>
              <h2 style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(241,245,249,0.28)", marginBottom: 14 }}>Skills Required</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {task.skillsRequired.map((s) => <span key={s} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 12, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)", color: "#818cf8" }}>{s}</span>)}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sticky CTA */}
        <div style={{ position: "sticky", bottom: 0, paddingTop: 20, paddingBottom: 20, background: "linear-gradient(to top, #04040a 70%, transparent)", marginTop: 24 }}>
          {accepted ? (
            <div style={{ display: "flex", gap: 10 }}>
              {!hasSubmission ? (
                <motion.button whileHover={{ scale: 1.01, boxShadow: "0 0 40px rgba(99,102,241,0.45)" }} whileTap={{ scale: 0.98 }} onClick={() => router.push(`/submit/${taskId}`)}
                  style={{ flex: 1, padding: "14px", borderRadius: 100, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: "pointer", background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: "0 0 28px rgba(99,102,241,0.3)", border: "none" }}>
                  Submit Solution →
                </motion.button>
              ) : (
                <div style={{ flex: 1, padding: "14px", borderRadius: 100, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", textAlign: "center" }}>
                  ✓ Solution Submitted
                </div>
              )}
              <button onClick={() => router.push("/dashboard")} style={{ padding: "14px 22px", borderRadius: 100, fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.45)" }}>
                Dashboard
              </button>
            </div>
          ) : (
            <motion.button onClick={handleAccept} disabled={accepting || hasActiveOtherTask} whileHover={{ scale: (accepting || hasActiveOtherTask) ? 1 : 1.01, boxShadow: (accepting || hasActiveOtherTask) ? "none" : "0 0 40px rgba(99,102,241,0.45)" }} whileTap={{ scale: (accepting || hasActiveOtherTask) ? 1 : 0.98 }}
              style={{ width: "100%", padding: "14px", borderRadius: 100, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, color: "white", cursor: (accepting || hasActiveOtherTask) ? "not-allowed" : "pointer", background: (accepting || hasActiveOtherTask) ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))", boxShadow: (accepting || hasActiveOtherTask) ? "none" : "0 0 28px rgba(99,102,241,0.3)", border: "none", opacity: (accepting || hasActiveOtherTask) ? 0.5 : 1 }}>
              {accepting ? "Accepting…" : hasActiveOtherTask ? "Complete Active Task First" : "Accept Challenge →"}
            </motion.button>
          )}
          {error && <p style={{ textAlign: "center", fontSize: 12, color: "rgba(248,113,113,0.8)", marginTop: 8 }}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
