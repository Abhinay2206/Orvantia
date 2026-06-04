"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, onSnapshot, orderBy, doc, getDoc, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BuilderNav = dynamic(() => import("@/app/_builder/BuilderNav"), { ssr: false });

interface Task {
  id: string; title: string; description: string; difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string; skillsRequired: string[]; deadline: Timestamp | null; estimatedDuration: string; status: string;
}

const DIFF = {
  Beginner:     { bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.22)",  text: "#22c55e", dot: "rgba(34,197,94,0.6)" },
  Intermediate: { bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.22)", text: "#fbbf24", dot: "rgba(251,191,36,0.6)" },
  Advanced:     { bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.18)",  text: "#f87171", dot: "rgba(239,68,68,0.6)" },
};

const CATEGORIES = ["All", "AI", "Frontend", "Backend", "Full Stack", "DevOps", "Design"];

function fmtDate(ts: Timestamp | null) {
  if (!ts) return "No deadline";
  const d = ts.toDate();
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff === 0) return "Due today";
  if (diff <= 7) return `${diff}d left`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function CardSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 72, height: 20, borderRadius: 100, background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ width: 48, height: 20, borderRadius: 100, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s infinite 0.2s" }} />
      </div>
      <div style={{ height: 18, borderRadius: 6, background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s infinite 0.1s" }} />
      <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s infinite 0.3s", width: "75%" }} />
      <div style={{ display: "flex", gap: 6 }}>
        {[60, 70, 50].map((w, i) => <div key={i} style={{ width: w, height: 20, borderRadius: 100, background: "rgba(255,255,255,0.04)", animation: `shimmer 1.5s infinite ${i * 0.1}s` }} />)}
      </div>
    </div>
  );
}

export default function TaskBoard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => { setUid(user?.uid || null); });
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tasks"), where("status", "==", "active"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "challenge_assignments"), where("userId", "==", uid));
    return onSnapshot(q, (snap) => setAcceptedIds(new Set(snap.docs.map((d) => d.data().taskId as string))));
  }, [uid]);

  const filtered = useMemo(() => tasks.filter((t) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description?.toLowerCase().includes(q) && !(t.skillsRequired || []).some((s) => s.toLowerCase().includes(q))) return false;
    }
    if (category !== "All" && t.category !== category) return false;
    if (difficulty !== "All" && t.difficulty !== difficulty) return false;
    return true;
  }), [tasks, search, category, difficulty]);

  const catCounts = useMemo(() => {
    const m: Record<string, number> = { All: tasks.length };
    CATEGORIES.slice(1).forEach((c) => { m[c] = tasks.filter((t) => t.category === c).length; });
    return m;
  }, [tasks]);

  const isFiltered = search || category !== "All" || difficulty !== "All";

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui, sans-serif" }}>
      <style>{`@keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 30% at 50% 0%, rgba(99,102,241,0.05), transparent 60%)" }} />
      <Suspense fallback={null}><BuilderNav /></Suspense>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 60px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 4 }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: 6 }}>Challenge Board</p>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "rgba(241,245,249,0.95)", letterSpacing: "-0.02em" }}>Available Challenges</h1>
            </div>
            {loaded && tasks.length > 0 && (
              <span style={{ fontSize: 13, color: "rgba(241,245,249,0.3)" }}>{tasks.length} active · {acceptedIds.size} accepted</span>
            )}
          </div>
        </motion.div>

        {/* Search + Filters row */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", opacity: 0.4 }}>
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search challenges or skills…"
              style={{ width: "100%", paddingLeft: 40, paddingRight: 14, paddingTop: 11, paddingBottom: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "rgba(241,245,249,0.85)", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.45)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
            {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(241,245,249,0.35)", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>}
          </div>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            style={{ padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "rgba(241,245,249,0.65)", fontSize: 12, outline: "none", cursor: "pointer" }}>
            {["All", "Beginner", "Intermediate", "Advanced"].map((d) => <option key={d} value={d} style={{ background: "#04040a" }}>{d === "All" ? "All Difficulties" : d}</option>)}
          </select>
        </motion.div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 28 }}>
          {CATEGORIES.map((cat) => {
            const count = catCounts[cat] || 0;
            const active = category === cat;
            return (
              <motion.button key={cat} onClick={() => setCategory(cat)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ padding: "7px 16px", borderRadius: 100, fontSize: 11, letterSpacing: "0.06em", cursor: "pointer", background: active ? "rgba(99,102,241,0.14)" : "rgba(255,255,255,0.04)", border: active ? "1px solid rgba(99,102,241,0.35)" : "1px solid rgba(255,255,255,0.07)", color: active ? "#818cf8" : "rgba(241,245,249,0.35)", transition: "all 0.15s", fontWeight: active ? 600 : 400 }}>
                {cat}{count > 0 ? ` (${count})` : ""}
              </motion.button>
            );
          })}
          {isFiltered && <button onClick={() => { setSearch(""); setCategory("All"); setDifficulty("All"); }} style={{ padding: "7px 14px", borderRadius: 100, fontSize: 11, cursor: "pointer", background: "none", border: "1px solid rgba(248,113,113,0.2)", color: "rgba(248,113,113,0.65)" }}>✕ Clear</button>}
        </div>

        {/* Results info */}
        {isFiltered && loaded && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: 12, color: "rgba(241,245,249,0.3)", marginBottom: 16 }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </motion.p>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {!loaded ? (
            <motion.div key="skel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ padding: "80px 40px", textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>🔍</div>
              <p style={{ fontSize: 15, color: "rgba(241,245,249,0.35)", marginBottom: 8 }}>No challenges match your filters.</p>
              <p style={{ fontSize: 13, color: "rgba(241,245,249,0.2)" }}>Try different keywords or{" "}<button onClick={() => { setSearch(""); setCategory("All"); setDifficulty("All"); }} style={{ background: "none", border: "none", color: "#818cf8", cursor: "pointer", fontSize: 13, padding: 0 }}>clear all filters</button>.</p>
            </motion.div>
          ) : (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
              {filtered.map((task, i) => {
                const diff = DIFF[task.difficulty] || DIFF.Beginner;
                const accepted = acceptedIds.has(task.id);
                const deadline = fmtDate(task.deadline);
                const deadlineUrgent = deadline.includes("d left") && parseInt(deadline) <= 3;
                return (
                  <motion.div key={task.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.28) }}
                    onClick={() => router.push(`/tasks/${task.id}`)}
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${accepted ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`, borderRadius: 18, padding: "22px 22px", cursor: "pointer", display: "flex", flexDirection: "column", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                    whileHover={{ y: -4, borderColor: accepted ? "rgba(34,197,94,0.35)" : "rgba(99,102,241,0.3)" }}
                  >
                    {/* Top accent line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: accepted ? "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" : "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }} />

                    {/* Header row */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 100, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: diff.bg, border: `1px solid ${diff.border}`, color: diff.text }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: diff.dot }} />{task.difficulty}
                      </span>
                      {accepted && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)", color: "#22c55e" }}>
                          ✓ Accepted
                        </span>
                      )}
                    </div>

                    {task.category && <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(129,140,248,0.6)", marginBottom: 6 }}>{task.category}</p>}
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "rgba(241,245,249,0.95)", lineHeight: 1.3, marginBottom: 10, flex: 1 }}>{task.title}</h3>
                    <p style={{ fontSize: 12, color: "rgba(241,245,249,0.38)", lineHeight: 1.65, marginBottom: 14 }}>
                      {task.description?.slice(0, 100)}{(task.description?.length || 0) > 100 ? "…" : ""}
                    </p>

                    {/* Skills */}
                    {(task.skillsRequired?.length ?? 0) > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                        {task.skillsRequired.slice(0, 3).map((s) => <span key={s} style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(241,245,249,0.35)" }}>{s}</span>)}
                        {task.skillsRequired.length > 3 && <span style={{ fontSize: 10, color: "rgba(241,245,249,0.2)", alignSelf: "center" }}>+{task.skillsRequired.length - 3}</span>}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize: 11, color: deadlineUrgent ? "#f87171" : "rgba(241,245,249,0.28)", display: "flex", alignItems: "center", gap: 4 }}>
                        {deadlineUrgent && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f87171", display: "inline-block" }} />}
                        📅 {deadline}
                      </span>
                      {task.estimatedDuration && <span style={{ fontSize: 11, color: "rgba(241,245,249,0.28)" }}>⏱ {task.estimatedDuration}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
