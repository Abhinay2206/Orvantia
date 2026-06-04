"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, onSnapshot, doc, getDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BuilderNav = dynamic(() => import("@/app/_builder/BuilderNav"), { ssr: false });

// ─── Types ───────────────────────────────────────────────────────────────────

interface Profile { fullName: string; email: string; phone?: string; college?: string; branch?: string; year?: string; github?: string; linkedin?: string; skills?: string[]; builderStatus?: string; }
interface Assignment { id: string; taskId: string; taskTitle?: string; status: string; acceptedAt: Timestamp | null; }
interface Review { id: string; taskId?: string; taskTitle?: string; totalScore: number; technicalSkill: number; problemSolving: number; communication: number; ownership: number; learningAbility: number; feedback?: string; meetingNotes?: string; reviewedAt: Timestamp | null; }
interface Submission { id: string; taskId: string; taskTitle?: string; status: string; submittedAt: Timestamp | null; }
interface Meeting { id: string; taskId?: string; taskTitle?: string; date: string; time: string; meetingLink: string; status: string; scheduledAt: Timestamp | null; }

const STATUS_CFG: Record<string, { bg: string; border: string; text: string; dot: string; label: string }> = {
  in_progress:       { bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.22)",  text: "#818cf8", dot: "#818cf8", label: "In Progress" },
  submitted:         { bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.22)",  text: "#fbbf24", dot: "#fbbf24", label: "Submitted" },
  under_review:      { bg: "rgba(34,211,238,0.08)",  border: "rgba(34,211,238,0.22)",  text: "#22d3ee", dot: "#22d3ee", label: "Under Review" },
  meeting_scheduled: { bg: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.22)",  text: "#a855f7", dot: "#a855f7", label: "Meeting Scheduled" },
  reviewed:          { bg: "rgba(34,197,94,0.08)",   border: "rgba(34,197,94,0.22)",   text: "#22c55e", dot: "#22c55e", label: "Reviewed" },
  shortlisted:       { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.35)",  text: "#fbbf24", dot: "#fbbf24", label: "Shortlisted ⭐" },
};

const BUILDER_STATUS: Record<string, { color: string; bg: string; label: string }> = {
  applied:          { color: "#818cf8", bg: "rgba(99,102,241,0.1)",  label: "Applied" },
  task_accepted:    { color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  label: "Task Accepted" },
  submitted:        { color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  label: "Submitted" },
  reviewed:         { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   label: "Reviewed" },
  shortlisted:      { color: "#fbbf24", bg: "rgba(251,191,36,0.12)", label: "Shortlisted ⭐" },
  contributor:      { color: "#a855f7", bg: "rgba(168,85,247,0.1)",  label: "Contributor" },
  core_contributor: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Core Contributor 🏆" },
};

function fmt(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ w = "100%", h = 16, r = 8 }: { w?: string | number; h?: number; r?: number }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s infinite" }} />;
}

function StatSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 22px" }}>
      <Skeleton h={28} w="40%" r={6} />
      <div style={{ marginTop: 8 }}><Skeleton h={10} w="65%" r={4} /></div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton h={14} w="55%" r={6} />
        <Skeleton h={10} w="30%" r={4} />
      </div>
      <Skeleton h={28} w={90} r={100} />
    </div>
  );
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, max = 50 }: { score: number; max?: number }) {
  const pct = Math.min(score / max, 1);
  const r = 44, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}>
      <svg width="108" height="108" style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
        <motion.circle cx="54" cy="54" r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth="7"
          strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - pct * circ }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }} strokeLinecap="round" />
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontSize: 22, fontWeight: 800, color: "rgba(241,245,249,0.95)", lineHeight: 1 }}>
          {score}
        </motion.span>
        <span style={{ fontSize: 10, color: "rgba(241,245,249,0.3)", marginTop: 2 }}>/{max}</span>
      </div>
    </div>
  );
}

// ─── Score Bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, color, delay = 0 }: { label: string; value: number; color: string; delay?: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 11, color: "rgba(241,245,249,0.45)", letterSpacing: "0.02em" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 600, color, fontVariantNumeric: "tabular-nums" }}>{value}<span style={{ fontSize: 10, color: "rgba(241,245,249,0.22)" }}>/10</span></span>
      </div>
      <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value * 10}%` }} transition={{ duration: 0.9, ease: "easeOut", delay }}
          style={{ height: "100%", background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: 100 }} />
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "reviews">("tasks");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) { router.replace("/builders/login"); return; }
      if (user.email?.endsWith("@orvantia.ai") && user.emailVerified) { router.replace("/admin"); return; }
      const snap = await getDoc(doc(db, "builder_profiles", user.uid));
      if (!snap.exists()) { router.replace("/builders/onboarding"); return; }
      setProfile(snap.data() as Profile);
      setUid(user.uid);
      setDataReady(true);
    });
    return unsub;
  }, [router]);

  useEffect(() => {
    if (!uid) return;
    const unsubA = onSnapshot(query(collection(db, "challenge_assignments"), where("userId", "==", uid)), (s) => setAssignments(s.docs.map((d) => ({ id: d.id, ...d.data() } as Assignment))));
    const unsubS = onSnapshot(query(collection(db, "submissions"), where("userId", "==", uid)), (s) => setSubmissions(s.docs.map((d) => ({ id: d.id, ...d.data() } as Submission))));
    const unsubR = onSnapshot(query(collection(db, "reviews"), where("userId", "==", uid)), async (s) => {
      const data = s.docs.map((d) => ({ id: d.id, ...d.data() } as Review));
      const enriched = await Promise.all(data.map(async (r) => {
        if (!r.taskTitle && r.taskId) {
          const ts = await getDoc(doc(db, "tasks", r.taskId));
          return ts.exists() ? { ...r, taskTitle: ts.data().title as string } : r;
        }
        return r;
      }));
      setReviews(enriched);
      if (enriched.length > 0 && !selectedReview) setSelectedReview(enriched[0]);
    });
    const unsubM = onSnapshot(query(collection(db, "meetings"), where("userId", "==", uid)), (s) => setMeetings(s.docs.map((d) => ({ id: d.id, ...d.data() } as Meeting))));
    return () => { unsubA(); unsubS(); unsubR(); unsubM(); };
  }, [uid]);

  const avgScore = reviews.length > 0 ? Math.round(reviews.reduce((a, r) => a + r.totalScore, 0) / reviews.length) : null;
  const bs = profile?.builderStatus ? BUILDER_STATUS[profile.builderStatus] : null;

  const loading = !dataReady;

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "var(--font-space), system-ui, sans-serif" }}>
      <style>{`
        @keyframes shimmer { 0%,100% { opacity:0.6 } 50% { opacity:1 } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.05), transparent 60%)" }} />
      <Suspense fallback={null}><BuilderNav /></Suspense>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 60px", position: "relative", zIndex: 1 }}>

        {/* Profile Banner */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: "100%", background: "radial-gradient(ellipse at 100% 50%, rgba(99,102,241,0.08), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Skeleton h={22} w={180} r={6} />
                <Skeleton h={12} w={120} r={4} />
              </div>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "rgba(241,245,249,0.3)", marginBottom: 4, letterSpacing: "0.06em" }}>Welcome back,</p>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 10, letterSpacing: "-0.01em" }}>{profile?.fullName}</h1>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                  {bs && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: bs.bg, border: `1px solid ${bs.color}30`, color: bs.color }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: bs.color }} />{bs.label}
                    </span>
                  )}
                  {profile?.college && <span style={{ fontSize: 12, color: "rgba(241,245,249,0.3)" }}>🎓 {profile.college}</span>}
                </div>
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", position: "relative" }}>
            {!loading && <>
              {profile?.github && <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 100, fontSize: 11, letterSpacing: "0.06em", color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", textDecoration: "none", transition: "all 0.2s" }} onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.18)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.1)"; }}>GitHub ↗</a>}
              {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 100, fontSize: 11, letterSpacing: "0.06em", color: "#22d3ee", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", textDecoration: "none" }}>LinkedIn ↗</a>}
              <a href="/tasks" style={{ padding: "8px 20px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, color: "white", background: "linear-gradient(135deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))", textDecoration: "none", boxShadow: "0 0 18px rgba(99,102,241,0.3)" }}>Browse Tasks →</a>
            </>}
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
          {loading ? Array(4).fill(0).map((_, i) => <StatSkeleton key={i} />) : (
            [
              { label: "Accepted", value: assignments.length, color: "#818cf8", icon: "🎯" },
              { label: "Submitted", value: submissions.length, color: "#22d3ee", icon: "📤" },
              { label: "Reviewed", value: reviews.length, color: "#22c55e", icon: "✅" },
              { label: "Avg Score", value: avgScore !== null ? `${avgScore}` : "—", sub: avgScore !== null ? "/ 50" : "", color: "#fbbf24", icon: "⭐" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}40, transparent)` }} />
                <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
                  {s.value}{s.sub && <span style={{ fontSize: 12, color: "rgba(241,245,249,0.25)", fontWeight: 400 }}>{s.sub}</span>}
                </div>
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{s.label}</div>
              </motion.div>
            ))
          )}
        </div>

        {/* Meetings */}
        {!loading && meetings.length > 0 && (
          <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {meetings.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: 16, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 16 }}>📅</span>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "rgba(241,245,249,0.95)" }}>Discussion: {m.taskTitle || "Task Review"}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "rgba(241,245,249,0.5)", marginLeft: 24 }}>{m.date} at {m.time}</p>
                </div>
                {m.meetingLink && (
                  <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" style={{ padding: "8px 16px", borderRadius: 100, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, color: "white", background: "linear-gradient(135deg, rgba(168,85,247,0.9), rgba(99,102,241,0.9))", textDecoration: "none", boxShadow: "0 0 16px rgba(168,85,247,0.3)" }}>
                    Join Meeting ↗
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Skills strip */}
        {!loading && (profile?.skills?.length ?? 0) > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", flexShrink: 0 }}>Skills</span>
            {profile!.skills!.map((s) => <span key={s} style={{ padding: "3px 11px", borderRadius: 100, fontSize: 11, background: "rgba(99,102,241,0.09)", border: "1px solid rgba(99,102,241,0.18)", color: "#818cf8" }}>{s}</span>)}
          </motion.div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
          {(["tasks", "reviews"] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "8px 20px", borderRadius: 100, fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500, cursor: "pointer",
              background: activeTab === t ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.04)",
              border: activeTab === t ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.07)",
              color: activeTab === t ? "#818cf8" : "rgba(241,245,249,0.35)", transition: "all 0.15s",
            }}>
              {t === "tasks" ? `My Tasks ${!loading ? `(${assignments.length})` : ""}` : `Reviews ${!loading ? `(${reviews.length})` : ""}`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── MY TASKS ── */}
          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {loading ? Array(3).fill(0).map((_, i) => <div key={i} style={{ marginBottom: 10 }}><TaskSkeleton /></div>) :
                assignments.length === 0 ? (
                  <EmptyState icon="🎯" message="No tasks accepted yet." sub="Pick a challenge and start building." cta="Browse Challenges →" href="/tasks" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {assignments.map((a, i) => {
                      const s = STATUS_CFG[a.status] || STATUS_CFG.in_progress;
                      return (
                        <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", transition: "border-color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.9)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.taskTitle || a.taskId}</h3>
                            <p style={{ fontSize: 11, color: "rgba(241,245,249,0.3)" }}>Accepted {fmt(a.acceptedAt)}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                              <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, animation: a.status === "in_progress" ? "pulse 2s infinite" : "none" }} />{s.label}
                            </span>
                            {a.status === "in_progress" && (
                              <motion.a href={`/submit/${a.taskId}`} whileHover={{ scale: 1.03 }} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 10, letterSpacing: "0.08em", cursor: "pointer", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", color: "#818cf8", textDecoration: "none" }}>Submit →</motion.a>
                            )}
                            {(a.status === "reviewed" || a.status === "shortlisted") && (
                              <button onClick={() => setActiveTab("reviews")} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#22c55e" }}>View Score</button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
            </motion.div>
          )}

          {/* ── REVIEWS ── */}
          {activeTab === "reviews" && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              {loading ? <div style={{ padding: 60, textAlign: "center" }}><Skeleton h={200} r={16} /></div> :
                reviews.length === 0 ? (
                  <EmptyState icon="📊" message="No reviews yet." sub="Submit a solution and the team will review and score your work." cta="Browse Tasks →" href="/tasks" />
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: reviews.length > 1 ? "260px 1fr" : "1fr", gap: 16, alignItems: "start" }}>
                    {/* List */}
                    {reviews.length > 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {reviews.map((r) => (
                          <motion.button key={r.id} onClick={() => setSelectedReview(r)} whileHover={{ scale: 1.01 }}
                            style={{ textAlign: "left", padding: "14px 16px", borderRadius: 12, cursor: "pointer", background: selectedReview?.id === r.id ? "rgba(99,102,241,0.1)" : "rgba(255,255,255,0.025)", border: selectedReview?.id === r.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.06)", transition: "all 0.15s" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(241,245,249,0.85)", marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.taskTitle || "Review"}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: 11, color: "rgba(241,245,249,0.3)" }}>{fmt(r.reviewedAt)}</span>
                              <span style={{ fontSize: 16, fontWeight: 700, color: "#818cf8" }}>{r.totalScore}<span style={{ fontSize: 10, color: "rgba(241,245,249,0.25)" }}>/50</span></span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Score card */}
                    {selectedReview && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
                        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />

                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
                          <div>
                            <h2 style={{ fontSize: 17, fontWeight: 700, color: "rgba(241,245,249,0.95)", marginBottom: 5 }}>{selectedReview.taskTitle || "Task Review"}</h2>
                            <p style={{ fontSize: 12, color: "rgba(241,245,249,0.3)" }}>Reviewed {fmt(selectedReview.reviewedAt)}</p>
                          </div>
                          <ScoreRing score={selectedReview.totalScore} />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 24 }}>
                          {[
                            { label: "Technical Skill", value: selectedReview.technicalSkill, color: "#818cf8" },
                            { label: "Problem Solving", value: selectedReview.problemSolving, color: "#22d3ee" },
                            { label: "Communication", value: selectedReview.communication, color: "#a855f7" },
                            { label: "Ownership", value: selectedReview.ownership, color: "#fbbf24" },
                            { label: "Learning Ability", value: selectedReview.learningAbility, color: "#22c55e" },
                          ].map((cat, i) => <ScoreBar key={cat.label} {...cat} delay={i * 0.1} />)}
                        </div>

                        {selectedReview.feedback && (
                          <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 12 }}>
                            <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)", marginBottom: 8 }}>Feedback</p>
                            <p style={{ fontSize: 13, color: "rgba(241,245,249,0.65)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{selectedReview.feedback}</p>
                          </div>
                        )}
                        {selectedReview.meetingNotes && (
                          <div style={{ padding: "14px 16px", background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 12 }}>
                            <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(129,140,248,0.4)", marginBottom: 8 }}>Meeting Notes</p>
                            <p style={{ fontSize: 13, color: "rgba(241,245,249,0.6)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{selectedReview.meetingNotes}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

function EmptyState({ icon, message, sub, cta, href }: { icon: string; message: string; sub: string; cta: string; href: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ padding: "60px 24px", textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16 }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>{icon}</div>
      <p style={{ fontSize: 15, fontWeight: 500, color: "rgba(241,245,249,0.55)", marginBottom: 6 }}>{message}</p>
      <p style={{ fontSize: 13, color: "rgba(241,245,249,0.28)", marginBottom: 24 }}>{sub}</p>
      <motion.a href={href} whileHover={{ scale: 1.03 }} style={{ display: "inline-block", padding: "9px 22px", borderRadius: 100, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", textDecoration: "none" }}>{cta}</motion.a>
    </motion.div>
  );
}
