"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection, onSnapshot, query, orderBy, doc, updateDoc, addDoc,
  deleteDoc, serverTimestamp, Timestamp, getDocs, where, setDoc, getDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

// ─── Types ───────────────────────────────────────────────────────────────────

type BuilderStatus = "applied" | "task_accepted" | "submitted" | "reviewed" | "shortlisted" | "contributor" | "core_contributor";
type SubmissionStatus = "submitted" | "under_review" | "meeting_scheduled" | "reviewed" | "shortlisted" | "rejected";
type TaskStatus = "draft" | "active" | "closed";
type AdminTab = "submissions" | "tasks" | "builders" | "contributors" | "security";

interface Submission {
  id: string; userId: string; taskId: string; taskTitle?: string;
  githubRepo: string; liveDemo?: string; videoDemo?: string;
  technicalExplanation: string; architectureExplanation?: string;
  challengesFaced?: string; learnings?: string; notes?: string;
  attachments?: string[]; status: SubmissionStatus; submittedAt: Timestamp | null;
}
interface BuilderProfile {
  id: string; userId: string; fullName: string; email: string; phone?: string;
  college?: string; branch?: string; year?: string; github?: string; linkedin?: string;
  skills?: string[]; builderStatus?: BuilderStatus; createdAt: Timestamp | null;
  totalScore?: number;
}
interface Task {
  id: string; title: string; description: string; difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string; skillsRequired: string[]; deadline: Timestamp | null;
  estimatedDuration: string; requirements: string; deliverables: string;
  evaluationCriteria: string; status: TaskStatus; createdAt: Timestamp | null;
}
interface Meeting {
  id: string; submissionId: string; userId: string; taskTitle?: string;
  builderName?: string; date: string; time: string; meetingLink: string;
  notes: string; status: string; scheduledAt: Timestamp | null;
}
interface ActivityItem {
  id: string; type: string; message: string; timestamp: Timestamp | null;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const BUILDER_STATUS_LABELS: Record<BuilderStatus, { label: string; color: string; bg: string; border: string }> = {
  applied:          { label: "Applied",          color: "#818cf8", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)" },
  task_accepted:    { label: "Task Accepted",    color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.25)" },
  submitted:        { label: "Submitted",        color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)" },
  reviewed:         { label: "Reviewed",         color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)" },
  shortlisted:      { label: "Shortlisted ⭐",   color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.4)" },
  contributor:      { label: "Contributor",      color: "#a855f7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.25)" },
  core_contributor: { label: "Core Contributor", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" },
};

const SUB_STATUS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  submitted:         { label: "Submitted",          color: "#818cf8", bg: "rgba(99,102,241,0.1)",  border: "rgba(99,102,241,0.25)" },
  under_review:      { label: "Under Review",       color: "#22d3ee", bg: "rgba(34,211,238,0.1)",  border: "rgba(34,211,238,0.25)" },
  meeting_scheduled: { label: "Meeting Scheduled",  color: "#a855f7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.25)" },
  reviewed:          { label: "Reviewed",           color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)" },
  shortlisted:       { label: "Shortlisted",        color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.4)" },
  rejected:          { label: "Rejected",           color: "#f87171", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(ts: Timestamp | null) {
  if (!ts) return "-";
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtTime(ts: Timestamp | null) {
  if (!ts) return "-";
  const d = ts.toDate();
  return `${fmt(ts)} · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}

const th: React.CSSProperties = { padding: "11px 14px", textAlign: "left", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 14px", fontSize: 13, color: "rgba(241,245,249,0.7)", verticalAlign: "middle" };

// ─── Score Slider ─────────────────────────────────────────────────────────────

function ScoreSlider({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
        <label style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)" }}>{label}</label>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{value}<span style={{ fontSize: 10, color: "rgba(241,245,249,0.2)" }}>/10</span></span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 100, overflow: "hidden", marginBottom: 4 }}>
          <div style={{ height: "100%", width: `${value * 10}%`, background: `linear-gradient(90deg, ${color}70, ${color})`, borderRadius: 100, transition: "width 0.15s ease" }} />
        </div>
        <input type="range" min={0} max={10} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: color, cursor: "pointer", height: 16, margin: 0 }} />
      </div>
    </div>
  );
}

// ─── Task Form ─────────────────────────────────────────────────────────────────

function TaskForm({ task, onSave, onCancel }: { task?: Partial<Task>; onSave: (d: Partial<Task>) => void; onCancel: () => void }) {
  const [f, setF] = useState({ title: task?.title || "", description: task?.description || "", difficulty: task?.difficulty || "Intermediate", category: task?.category || "", skillsRequired: task?.skillsRequired?.join(", ") || "", estimatedDuration: task?.estimatedDuration || "", requirements: task?.requirements || "", deliverables: task?.deliverables || "", evaluationCriteria: task?.evaluationCriteria || "", deadline: "" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 11px", color: "rgba(241,245,249,0.8)", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  const handleSave = () => { if (!f.title.trim()) return; onSave({ ...f, skillsRequired: f.skillsRequired.split(",").map((s) => s.trim()).filter(Boolean), deadline: f.deadline ? Timestamp.fromDate(new Date(f.deadline)) : null } as Partial<Task>); };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
      {[{ id: "title", l: "Title *", t: "input" }, { id: "category", l: "Category", t: "input" }, { id: "estimatedDuration", l: "Estimated Duration", t: "input" }, { id: "skillsRequired", l: "Skills (comma separated)", t: "input" }, { id: "deadline", l: "Deadline", t: "date" }].map((field) => (
        <div key={field.id}>
          <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>{field.l}</label>
          <input type={field.t === "date" ? "date" : "text"} value={f[field.id as keyof typeof f] as string} onChange={(e) => set(field.id, e.target.value)} style={{ ...inp, colorScheme: "dark" }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
        </div>
      ))}
      <div>
        <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>Difficulty</label>
        <select value={f.difficulty} onChange={(e) => set("difficulty", e.target.value)} style={{ ...inp, cursor: "pointer" }}>
          {["Beginner", "Intermediate", "Advanced"].map((d) => <option key={d} value={d} style={{ background: "#04040a" }}>{d}</option>)}
        </select>
      </div>
      {["description", "requirements", "deliverables", "evaluationCriteria"].map((k) => (
        <div key={k}>
          <label style={{ display: "block", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>{k.replace(/([A-Z])/g, " $1").trim()}</label>
          <textarea value={f[k as keyof typeof f] as string} onChange={(e) => set(k, e.target.value)} rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={handleSave} style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>{task?.id ? "Update" : "Create"} Task</button>
        <button onClick={onCancel} style={{ padding: "10px 16px", borderRadius: 10, fontSize: 11, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.35)" }}>Cancel</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminBuilderDashboard() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<AdminTab>("submissions");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [blockedIPs, setBlockedIPs] = useState<{ id: string; ip: string; route: string; violations: number; lastBlockedAt: { toDate(): Date } | null; blockedUntil: { toDate(): Date } | null }[]>([]);

  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [selectedBuilder, setSelectedBuilder] = useState<BuilderProfile | null>(null);

  // Review form
  const [review, setReview] = useState({ technicalSkill: 0, problemSolving: 0, communication: 0, ownership: 0, learningAbility: 0, feedback: "", meetingNotes: "" });
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewSaved, setReviewSaved] = useState(false);

  // Meeting form
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", meetingLink: "", notes: "" });
  const [schedulingMeeting, setSchedulingMeeting] = useState(false);

  // Task form
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Contributor filters
  const [minScore, setMinScore] = useState(0);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterStatus, setFilterStatus] = useState<BuilderStatus | "all">("all");

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.replace("/");
        return;
      }
      if (user.email?.endsWith("@orvantia.ai") && user.emailVerified) {
        setAuthChecked(true);
      } else if (user.email?.endsWith("@orvantia.ai")) {
        await user.reload();
        if (auth.currentUser?.emailVerified) {
          setAuthChecked(true);
        } else {
          router.replace("/");
        }
      } else {
        router.replace("/");
      }
    });
    return unsub;
  }, [router]);

  // ── Listeners ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authChecked) return;
    const unsubs = [
      onSnapshot(query(collection(db, "submissions"), orderBy("submittedAt", "desc")), (s) => { setSubmissions(s.docs.map((d) => ({ id: d.id, ...d.data() } as Submission))); setDataLoaded(true); }),
      onSnapshot(query(collection(db, "builder_profiles"), orderBy("createdAt", "desc")), (s) => setBuilders(s.docs.map((d) => ({ id: d.id, userId: d.id, ...d.data() } as BuilderProfile)))),
      onSnapshot(query(collection(db, "tasks"), orderBy("createdAt", "desc")), (s) => setTasks(s.docs.map((d) => ({ id: d.id, ...d.data() } as Task)))),
      onSnapshot(query(collection(db, "meetings"), orderBy("scheduledAt", "desc")), (s) => setMeetings(s.docs.map((d) => ({ id: d.id, ...d.data() } as Meeting)))),
      onSnapshot(query(collection(db, "notifications"), orderBy("timestamp", "desc")), (s) => setActivity(s.docs.slice(0, 20).map((d) => ({ id: d.id, ...d.data() } as ActivityItem)))),
      onSnapshot(query(collection(db, "blocked_ips"), orderBy("lastBlockedAt", "desc")), (s) => setBlockedIPs(s.docs.map((d) => ({ id: d.id, ...d.data() } as { id: string; ip: string; route: string; violations: number; lastBlockedAt: { toDate(): Date } | null; blockedUntil: { toDate(): Date } | null })))),
    ];
    return () => unsubs.forEach((u) => u());
  }, [authChecked]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const updateSubStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "submissions", id), { status });
    setSelectedSub((p) => p ? { ...p, status: status as SubmissionStatus } : p);
    if (selectedSub) {
      const q = await getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", selectedSub.userId), where("taskId", "==", selectedSub.taskId)));
      if (!q.empty) await updateDoc(doc(db, "challenge_assignments", q.docs[0].id), { status });
    }
    await logActivity(`Submission status updated to ${status}`, "status_update");
  };

  const saveReview = async () => {
    if (!selectedSub) return;
    setReviewSaving(true);
    try {
      const total = review.technicalSkill + review.problemSolving + review.communication + review.ownership + review.learningAbility;
      await setDoc(doc(db, "reviews", `${selectedSub.userId}_${selectedSub.taskId}`), {
        submissionId: selectedSub.id, userId: selectedSub.userId, taskId: selectedSub.taskId,
        taskTitle: selectedSub.taskTitle || "", ...review, totalScore: total, reviewedAt: serverTimestamp(),
      }, { merge: true });
      await updateDoc(doc(db, "builder_profiles", selectedSub.userId), { totalScore: total });
      await updateSubStatus(selectedSub.id, "reviewed");
      await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "review_completed", userId: selectedSub.userId, taskTitle: selectedSub.taskTitle, totalScore: total }) });
      await logActivity(`Review completed for ${selectedSub.taskTitle}`, "review");
      setReviewSaved(true);
    } finally { setReviewSaving(false); }
  };

  const scheduleMeeting = async () => {
    if (!selectedSub || !meetingForm.date || !meetingForm.time) return;
    setSchedulingMeeting(true);
    try {
      const builder = builders.find((b) => b.userId === selectedSub.userId);
      await addDoc(collection(db, "meetings"), { submissionId: selectedSub.id, userId: selectedSub.userId, taskTitle: selectedSub.taskTitle, builderName: builder?.fullName || "", ...meetingForm, status: "scheduled", scheduledAt: serverTimestamp() });
      await updateSubStatus(selectedSub.id, "meeting_scheduled");
      await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "meeting_scheduled", userId: selectedSub.userId, taskTitle: selectedSub.taskTitle, meetingDate: meetingForm.date, meetingTime: meetingForm.time, meetingLink: meetingForm.meetingLink }) });
      await logActivity(`Meeting scheduled for ${builder?.fullName}`, "meeting");
      setShowMeetingForm(false);
      setMeetingForm({ date: "", time: "", meetingLink: "", notes: "" });
    } finally { setSchedulingMeeting(false); }
  };

  const shortlistBuilder = async () => {
    if (!selectedSub) return;
    await updateSubStatus(selectedSub.id, "shortlisted");
    await setDoc(doc(db, "reviews", `${selectedSub.userId}_${selectedSub.taskId}`), { status: "shortlisted" }, { merge: true });
    await updateDoc(doc(db, "builder_profiles", selectedSub.userId), { builderStatus: "shortlisted" });
    await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "shortlisted", userId: selectedSub.userId, taskTitle: selectedSub.taskTitle }) });
    await logActivity(`Builder shortlisted`, "shortlist");
  };

  const rejectSubmission = async () => {
    if (!selectedSub) return;
    await updateSubStatus(selectedSub.id, "rejected");
  };

  const inviteContributor = async (builder: BuilderProfile) => {
    await updateDoc(doc(db, "builder_profiles", builder.userId), { builderStatus: "contributor" });
    await setDoc(doc(db, "contributors", builder.userId), { userId: builder.userId, fullName: builder.fullName, email: builder.email, skills: builder.skills || [], totalScore: builder.totalScore || 0, college: builder.college, github: builder.github, builderStatus: "contributor", invitedAt: serverTimestamp() }, { merge: true });
    await fetch("/api/builder/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contributor_invited", userId: builder.userId }) });
    await logActivity(`${builder.fullName} invited as Contributor`, "contributor");
  };

  const updateBuilderStatus = async (builder: BuilderProfile, status: BuilderStatus) => {
    await updateDoc(doc(db, "builder_profiles", builder.userId), { builderStatus: status });
    if (status === "contributor" || status === "core_contributor") {
      await setDoc(doc(db, "contributors", builder.userId), { userId: builder.userId, fullName: builder.fullName, email: builder.email, skills: builder.skills || [], totalScore: builder.totalScore || 0, college: builder.college, github: builder.github, builderStatus: status, updatedAt: serverTimestamp() }, { merge: true });
    }
    setSelectedBuilder((p) => p ? { ...p, builderStatus: status } : p);
  };

  const deleteBuilder = async (builderId: string) => {
    if (!confirm("Are you sure you want to delete this builder? All their submissions, scores, and assignments will be permanently deleted.")) return;
    
    await deleteDoc(doc(db, "builder_profiles", builderId));
    await deleteDoc(doc(db, "contributors", builderId));
    
    const subSnap = await getDocs(query(collection(db, "submissions"), where("userId", "==", builderId)));
    for (const d of subSnap.docs) await deleteDoc(doc(db, "submissions", d.id));
    
    const asgnSnap = await getDocs(query(collection(db, "challenge_assignments"), where("userId", "==", builderId)));
    for (const d of asgnSnap.docs) await deleteDoc(doc(db, "challenge_assignments", d.id));
    
    const revSnap = await getDocs(query(collection(db, "reviews"), where("userId", "==", builderId)));
    for (const d of revSnap.docs) await deleteDoc(doc(db, "reviews", d.id));
    
    const meetSnap = await getDocs(query(collection(db, "meetings"), where("userId", "==", builderId)));
    for (const d of meetSnap.docs) await deleteDoc(doc(db, "meetings", d.id));
    
    await logActivity(`Deleted builder profile for ${builderId}`, "delete");
    setSelectedBuilder(null);
  };


  const handleSaveTask = async (data: Partial<Task>) => {
    if (editingTask?.id) await updateDoc(doc(db, "tasks", editingTask.id), { ...data, updatedAt: serverTimestamp() });
    else await addDoc(collection(db, "tasks"), { ...data, status: "active", createdAt: serverTimestamp() });
    setShowTaskForm(false); setEditingTask(null);
  };

  const logActivity = async (message: string, type: string) => {
    await addDoc(collection(db, "notifications"), { message, type, timestamp: serverTimestamp() });
  };

  const handleSignOut = async () => { await signOut(auth); router.replace("/admin/gate-x7q9"); };

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = {
    totalBuilders: builders.length,
    activeTasks: tasks.filter((t) => t.status === "active").length,
    pendingReviews: submissions.filter((s) => s.status === "submitted" || s.status === "under_review").length,
    reviewed: submissions.filter((s) => s.status === "reviewed" || s.status === "shortlisted").length,
    contributors: builders.filter((b) => b.builderStatus === "contributor" || b.builderStatus === "core_contributor").length,
  };

  const totalReviewScore = review.technicalSkill + review.problemSolving + review.communication + review.ownership + review.learningAbility;

  const contributorPool = builders.filter((b) => {
    if (minScore > 0 && (b.totalScore || 0) < minScore) return false;
    if (filterStatus !== "all" && b.builderStatus !== filterStatus) return false;
    if (filterSkill && !(b.skills || []).some((s) => s.toLowerCase().includes(filterSkill.toLowerCase()))) return false;
    return true;
  });

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "9px 11px", color: "rgba(241,245,249,0.8)", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

  if (!authChecked) return (
    <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "auto" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "system-ui, sans-serif", cursor: "auto" }}>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(4,4,10,0.92)", backdropFilter: "blur(24px)", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/admin" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>Orvantia</span>
          </a>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)" }}>/</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#818cf8" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#818cf8" }} />
            Builder Program
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {[{ href: "/admin", l: "Leads" }, { href: "/admin/applications", l: "Applications" }].map((link) => (
            <a key={link.href} href={link.href} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.4)", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)"; (e.currentTarget as HTMLElement).style.color = "#818cf8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.4)"; }}
            >{link.l}</a>
          ))}
          <button onClick={handleSignOut} style={{ padding: "6px 14px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.4)", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "rgba(248,113,113,0.75)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(241,245,249,0.4)"; }}>
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 28px", maxWidth: 1600, margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Total Builders", value: stats.totalBuilders, color: "#818cf8", icon: "👥" },
            { label: "Active Tasks", value: stats.activeTasks, color: "#22d3ee", icon: "🎯" },
            { label: "Pending Reviews", value: stats.pendingReviews, color: "#fbbf24", icon: "⏳" },
            { label: "Reviewed", value: stats.reviewed, color: "#22c55e", icon: "✅" },
            { label: "Contributors", value: stats.contributors, color: "#a855f7", icon: "🏆" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${s.color}30`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${s.color}60, transparent)` }} />
              {!dataLoaded ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ width: "40%", height: 24, borderRadius: 6, background: "rgba(255,255,255,0.06)", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ width: "65%", height: 9, borderRadius: 4, background: "rgba(255,255,255,0.04)", animation: "shimmer 1.5s infinite 0.2s" }} />
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 11, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 5, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                  <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{s.label}</div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        {activity.length > 0 && (
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
              <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>Live Activity</p>
            </div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {activity.slice(0, 8).map((a) => (
                <span key={a.id} style={{ fontSize: 11, color: "rgba(241,245,249,0.5)", padding: "4px 11px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 100, whiteSpace: "nowrap" }}>
                  {a.message}
                  <span style={{ color: "rgba(241,245,249,0.22)", marginLeft: 5 }}>{fmt(a.timestamp)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {([["submissions", `Submissions (${submissions.length})`], ["tasks", `Tasks (${tasks.length})`], ["builders", `Builders (${builders.length})`], ["contributors", `Contributors (${stats.contributors})`], ["security", `Security ${blockedIPs.length > 0 ? `(${blockedIPs.length})` : ""}`]] as const).map(([t, l]) => (
            <button key={t} onClick={() => { setTab(t); setSelectedSub(null); setSelectedBuilder(null); }}
              style={{ padding: "8px 18px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: tab === t ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)", border: tab === t ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.08)", color: tab === t ? "#818cf8" : "rgba(241,245,249,0.35)", transition: "all 0.15s" }}>
              {l}
            </button>
          ))}
        </div>

        {/* ── SUBMISSIONS ── */}
        {tab === "submissions" && (
          <div style={{ display: "grid", gridTemplateColumns: selectedSub ? "1fr 420px" : "1fr", gap: 16, alignItems: "start" }}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {submissions.length === 0 ? <Placeholder text="No submissions yet." /> : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>{["Builder", "Task", "Status", "Submitted", "Repo", "Action"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {submissions.map((s) => {
                        const ss = SUB_STATUS[s.status] || SUB_STATUS.submitted;
                        const builder = builders.find((b) => b.userId === s.userId);
                        const isSelected = selectedSub?.id === s.id;
                        return (
                          <tr key={s.id} onClick={() => { setSelectedSub(s); setReview({ technicalSkill: 0, problemSolving: 0, communication: 0, ownership: 0, learningAbility: 0, feedback: "", meetingNotes: "" }); setReviewSaved(false); setShowMeetingForm(false); }}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s", background: isSelected ? "rgba(99,102,241,0.06)" : "transparent" }}
                            onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                            onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                            <td style={{ ...td, fontWeight: 500 }}>{builder?.fullName || s.userId.slice(0, 8) + "…"}</td>
                            <td style={{ ...td, color: "rgba(241,245,249,0.5)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.taskTitle || s.taskId}</td>
                            <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, background: ss.bg, border: `1px solid ${ss.border}`, color: ss.color, whiteSpace: "nowrap" }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: ss.color }} />{ss.label}</span></td>
                            <td style={{ ...td, color: "rgba(241,245,249,0.35)", fontSize: 12 }}>{fmt(s.submittedAt)}</td>
                            <td style={td}>{s.githubRepo && <a href={s.githubRepo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 11, color: "#818cf8", textDecoration: "none", padding: "3px 9px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>GitHub ↗</a>}</td>
                            <td style={td}><button onClick={(e) => { e.stopPropagation(); setSelectedSub(s); setReview({ technicalSkill: 0, problemSolving: 0, communication: 0, ownership: 0, learningAbility: 0, feedback: "", meetingNotes: "" }); setReviewSaved(false); setShowMeetingForm(false); }} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", color: "#818cf8" }}>Review</button></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Review Panel */}
            {selectedSub && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22, position: "sticky", top: 76, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 3 }}>{builders.find((b) => b.userId === selectedSub.userId)?.fullName || "Builder"}</h3>
                    <p style={{ fontSize: 12, color: "rgba(241,245,249,0.35)" }}>{selectedSub.taskTitle}</p>
                  </div>
                  <button onClick={() => setSelectedSub(null)} style={{ background: "none", border: "none", color: "rgba(241,245,249,0.3)", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</button>
                </div>

                {/* Links */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {selectedSub.githubRepo && <a href={selectedSub.githubRepo} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", textDecoration: "none" }}>GitHub ↗</a>}
                  {selectedSub.liveDemo && <a href={selectedSub.liveDemo} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "#22d3ee", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", textDecoration: "none" }}>Live ↗</a>}
                  {selectedSub.videoDemo && <a href={selectedSub.videoDemo} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "#a855f7", background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", textDecoration: "none" }}>Video ↗</a>}
                  {(selectedSub.attachments || []).map((url, i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "rgba(241,245,249,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none" }}>File {i + 1} ↗</a>)}
                </div>

                {/* Technical explanation preview */}
                {selectedSub.technicalExplanation && (
                  <div style={{ padding: "12px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 16 }}>
                    <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)", marginBottom: 7 }}>Technical Explanation</p>
                    <p style={{ fontSize: 12, color: "rgba(241,245,249,0.6)", lineHeight: 1.7, whiteSpace: "pre-wrap", maxHeight: 120, overflow: "hidden" }}>{selectedSub.technicalExplanation}</p>
                  </div>
                )}

                {/* Status controls */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 9 }}>Status</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {Object.entries(SUB_STATUS).map(([status, s]) => (
                      <button key={status} onClick={() => updateSubStatus(selectedSub.id, status)}
                        style={{ padding: "4px 10px", borderRadius: 100, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", background: selectedSub.status === status ? s.bg : "rgba(255,255,255,0.04)", border: selectedSub.status === status ? `1px solid ${s.border}` : "1px solid rgba(255,255,255,0.07)", color: selectedSub.status === status ? s.color : "rgba(241,245,249,0.3)", transition: "all 0.15s" }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  <button onClick={() => setShowMeetingForm(!showMeetingForm)} style={{ padding: "6px 12px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>📅 Schedule Meeting</button>
                  <button onClick={shortlistBuilder} style={{ padding: "6px 12px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}>⭐ Shortlist</button>
                  <button onClick={rejectSubmission} style={{ padding: "6px 12px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>Reject</button>
                </div>

                {/* Meeting form */}
                {showMeetingForm && (
                  <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
                    <p style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(168,85,247,0.6)", marginBottom: 12 }}>Schedule Discussion</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <label style={{ display: "block", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>Date *</label>
                        <input type="date" value={meetingForm.date} onChange={(e) => setMeetingForm((p) => ({ ...p, date: e.target.value }))} style={{ ...inp, colorScheme: "dark" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>Time *</label>
                        <input type="time" value={meetingForm.time} onChange={(e) => setMeetingForm((p) => ({ ...p, time: e.target.value }))} style={{ ...inp, colorScheme: "dark" }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ display: "block", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>Meeting Link</label>
                      <input type="url" value={meetingForm.meetingLink} onChange={(e) => setMeetingForm((p) => ({ ...p, meetingLink: e.target.value }))} placeholder="https://meet.google.com/…" style={inp} />
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 4 }}>Notes</label>
                      <textarea value={meetingForm.notes} onChange={(e) => setMeetingForm((p) => ({ ...p, notes: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={scheduleMeeting} disabled={schedulingMeeting} style={{ flex: 1, padding: "9px", borderRadius: 8, fontSize: 11, letterSpacing: "0.08em", cursor: schedulingMeeting ? "wait" : "pointer", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", opacity: schedulingMeeting ? 0.7 : 1 }}>
                        {schedulingMeeting ? "Scheduling…" : "Confirm Meeting"}
                      </button>
                      <button onClick={() => setShowMeetingForm(false)} style={{ padding: "9px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(241,245,249,0.35)" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Review form */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 16 }}>Evaluation</p>
                  {[{ k: "technicalSkill", l: "Technical Skill", c: "#818cf8" }, { k: "problemSolving", l: "Problem Solving", c: "#22d3ee" }, { k: "communication", l: "Communication", c: "#a855f7" }, { k: "ownership", l: "Ownership", c: "#fbbf24" }, { k: "learningAbility", l: "Learning Ability", c: "#22c55e" }].map((cat) => (
                    <ScoreSlider key={cat.k} label={cat.l} value={review[cat.k as keyof typeof review] as number} onChange={(v) => setReview((p) => ({ ...p, [cat.k]: v }))} color={cat.c} />
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.35)" }}>Total Score</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#818cf8" }}>{totalReviewScore}<span style={{ fontSize: 10, color: "rgba(241,245,249,0.2)" }}>/50</span></span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 5 }}>Feedback</label>
                    <textarea value={review.feedback} onChange={(e) => setReview((p) => ({ ...p, feedback: e.target.value }))} rows={3} placeholder="Detailed feedback for the builder…" style={{ ...inp, resize: "vertical", lineHeight: 1.65 }} onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: "block", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)", marginBottom: 5 }}>Meeting Notes</label>
                    <textarea value={review.meetingNotes} onChange={(e) => setReview((p) => ({ ...p, meetingNotes: e.target.value }))} rows={2} placeholder="Notes from discussion…" style={{ ...inp, resize: "vertical", lineHeight: 1.65 }} onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")} onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")} />
                  </div>
                  <button onClick={saveReview} disabled={reviewSaving} style={{ width: "100%", padding: "10px", borderRadius: 10, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: reviewSaving ? "wait" : "pointer", background: reviewSaved ? "rgba(34,197,94,0.12)" : "rgba(99,102,241,0.15)", border: reviewSaved ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(99,102,241,0.3)", color: reviewSaved ? "#22c55e" : "#818cf8", opacity: reviewSaving ? 0.7 : 1, transition: "all 0.25s" }}>
                    {reviewSaving ? "Saving…" : reviewSaved ? "✓ Review Saved" : "Save Review & Notify Builder"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TASKS ── */}
        {tab === "tasks" && (
          <div style={{ display: "grid", gridTemplateColumns: showTaskForm ? "1fr 360px" : "1fr", gap: 16, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
                <button onClick={() => { setShowTaskForm(true); setEditingTask(null); }} style={{ padding: "8px 18px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#818cf8" }}>+ Add Task</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
                {tasks.length === 0 ? <Placeholder text="No tasks yet." /> : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead><tr>{["Title", "Difficulty", "Category", "Status", "Deadline", "Actions"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {tasks.map((task) => {
                        const s = task.status === "active" ? { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)", label: "Active" } : task.status === "draft" ? { color: "#818cf8", bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.25)", label: "Draft" } : { color: "rgba(241,245,249,0.35)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)", label: "Closed" };
                        return (
                          <tr key={task.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ ...td, fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</td>
                            <td style={td}><span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 100, background: "rgba(255,255,255,0.05)", color: "rgba(241,245,249,0.45)" }}>{task.difficulty}</span></td>
                            <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{task.category || "-"}</td>
                            <td style={td}><span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: s.bg, border: `1px solid ${s.border}`, color: s.color }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: s.color }} />{s.label}</span></td>
                            <td style={{ ...td, color: "rgba(241,245,249,0.4)", fontSize: 12 }}>{fmt(task.deadline)}</td>
                            <td style={td}>
                              <div style={{ display: "flex", gap: 5 }}>
                                <button onClick={() => { setEditingTask(task); setShowTaskForm(true); }} style={{ padding: "4px 9px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.45)" }}>Edit</button>
                                <button onClick={() => updateDoc(doc(db, "tasks", task.id), { status: task.status === "active" ? "closed" : "active" })} style={{ padding: "4px 9px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: task.status === "active" ? "rgba(255,255,255,0.04)" : "rgba(34,197,94,0.1)", border: task.status === "active" ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(34,197,94,0.25)", color: task.status === "active" ? "rgba(241,245,249,0.4)" : "#22c55e" }}>{task.status === "active" ? "Close" : "Activate"}</button>
                                <button onClick={() => { if (confirm("Delete this task?")) deleteDoc(doc(db, "tasks", task.id)); }} style={{ padding: "4px 9px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(248,113,113,0.55)" }}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {showTaskForm && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22, position: "sticky", top: 76, maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(241,245,249,0.85)", marginBottom: 18 }}>{editingTask ? "Edit Task" : "New Task"}</h3>
                <TaskForm task={editingTask || undefined} onSave={handleSaveTask} onCancel={() => { setShowTaskForm(false); setEditingTask(null); }} />
              </div>
            )}
          </div>
        )}

        {/* ── BUILDERS ── */}
        {tab === "builders" && (
          <div style={{ display: "grid", gridTemplateColumns: selectedBuilder ? "1fr 360px" : "1fr", gap: 16, alignItems: "start" }}>
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {builders.length === 0 ? <Placeholder text="No builders yet." /> : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Name", "Email", "College", "Skills", "Status", "Score", "Joined"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {builders.map((b) => {
                      const bs = b.builderStatus ? BUILDER_STATUS_LABELS[b.builderStatus] : null;
                      return (
                        <tr key={b.id} onClick={() => setSelectedBuilder(b)}
                          style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s", background: selectedBuilder?.id === b.id ? "rgba(99,102,241,0.06)" : "transparent" }}
                          onMouseEnter={(e) => { if (selectedBuilder?.id !== b.id) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                          onMouseLeave={(e) => { if (selectedBuilder?.id !== b.id) e.currentTarget.style.background = "transparent"; }}>
                          <td style={{ ...td, fontWeight: 500 }}>{b.fullName}</td>
                          <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{b.email}</td>
                          <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{b.college || "-"}</td>
                          <td style={td}><div style={{ display: "flex", gap: 4 }}>{(b.skills || []).slice(0, 2).map((s) => <span key={s} style={{ padding: "2px 7px", borderRadius: 100, fontSize: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(241,245,249,0.35)" }}>{s}</span>)}{(b.skills?.length || 0) > 2 && <span style={{ fontSize: 10, color: "rgba(241,245,249,0.2)", alignSelf: "center" }}>+{b.skills!.length - 2}</span>}</div></td>
                          <td style={td}>{bs ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: bs.bg, border: `1px solid ${bs.border}`, color: bs.color, whiteSpace: "nowrap" }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: bs.color }} />{bs.label}</span> : <span style={{ fontSize: 11, color: "rgba(241,245,249,0.2)" }}>-</span>}</td>
                          <td style={{ ...td, fontWeight: 600, color: "#818cf8" }}>{b.totalScore ? `${b.totalScore}/50` : "-"}</td>
                          <td style={{ ...td, color: "rgba(241,245,249,0.35)", fontSize: 12 }}>{fmt(b.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {selectedBuilder && (
              <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 22, position: "sticky", top: 76 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "rgba(241,245,249,0.95)", marginBottom: 4 }}>{selectedBuilder.fullName}</h3>
                    {selectedBuilder.totalScore && <p style={{ fontSize: 18, fontWeight: 800, color: "#818cf8" }}>{selectedBuilder.totalScore}<span style={{ fontSize: 11, color: "rgba(241,245,249,0.3)" }}>/50</span></p>}
                  </div>
                  <button onClick={() => setSelectedBuilder(null)} style={{ background: "none", border: "none", color: "rgba(241,245,249,0.3)", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}>×</button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 18 }}>
                  {[["Email", selectedBuilder.email], ["Phone", selectedBuilder.phone || "-"], ["College", selectedBuilder.college || "-"], ["Branch", selectedBuilder.branch || "-"], ["Year", selectedBuilder.year || "-"], ["Joined", fmt(selectedBuilder.createdAt)]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{l}</span>
                      <span style={{ fontSize: 12, color: "rgba(241,245,249,0.6)", textAlign: "right", wordBreak: "break-all" }}>{v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
                  {selectedBuilder.github && <a href={selectedBuilder.github} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", textDecoration: "none" }}>GitHub ↗</a>}
                  {selectedBuilder.linkedin && <a href={selectedBuilder.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: "5px 11px", borderRadius: 100, fontSize: 10, color: "#22d3ee", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", textDecoration: "none" }}>LinkedIn ↗</a>}
                </div>

                {/* Builder status */}
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 9 }}>Builder Status</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {(Object.keys(BUILDER_STATUS_LABELS) as BuilderStatus[]).map((s) => {
                      const style = BUILDER_STATUS_LABELS[s];
                      const active = selectedBuilder.builderStatus === s;
                      return (
                        <button key={s} onClick={() => updateBuilderStatus(selectedBuilder, s)} style={{ padding: "4px 9px", borderRadius: 100, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", background: active ? style.bg : "rgba(255,255,255,0.04)", border: active ? `1px solid ${style.border}` : "1px solid rgba(255,255,255,0.07)", color: active ? style.color : "rgba(241,245,249,0.3)", transition: "all 0.15s", whiteSpace: "nowrap" }}>{style.label}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => inviteContributor(selectedBuilder)} style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>
                    Invite Contributor
                  </button>
                  <button onClick={() => deleteBuilder(selectedBuilder.userId)} style={{ flex: 1, padding: "10px", borderRadius: 10, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171" }}>
                    Delete Builder
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CONTRIBUTORS ── */}
        {tab === "contributors" && (
          <div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
                <label style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.3)", whiteSpace: "nowrap" }}>Min Score</label>
                <input type="number" min={0} max={50} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} style={{ width: 52, background: "none", border: "none", outline: "none", color: "#818cf8", fontSize: 13, fontWeight: 700, textAlign: "center" }} />
              </div>
              <input type="text" placeholder="Filter by skill…" value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(241,245,249,0.7)", fontSize: 12, outline: "none" }} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as BuilderStatus | "all")} style={{ padding: "8px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(241,245,249,0.7)", fontSize: 12, outline: "none", cursor: "pointer" }}>
                <option value="all" style={{ background: "#04040a" }}>All Statuses</option>
                {(Object.keys(BUILDER_STATUS_LABELS) as BuilderStatus[]).map((s) => <option key={s} value={s} style={{ background: "#04040a" }}>{BUILDER_STATUS_LABELS[s].label}</option>)}
              </select>
              <span style={{ fontSize: 12, color: "rgba(241,245,249,0.3)", marginLeft: "auto" }}>{contributorPool.length} builder{contributorPool.length !== 1 ? "s" : ""}</span>
            </div>

            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {contributorPool.length === 0 ? <Placeholder text="No builders match these filters." /> : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr>{["Name", "College", "Skills", "Score", "Status", "GitHub", "Action"].map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {contributorPool.map((b) => {
                      const bs = b.builderStatus ? BUILDER_STATUS_LABELS[b.builderStatus] : null;
                      return (
                        <tr key={b.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ ...td, fontWeight: 500 }}>{b.fullName}</td>
                          <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{b.college || "-"}</td>
                          <td style={td}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{(b.skills || []).slice(0, 3).map((s) => <span key={s} style={{ padding: "2px 7px", borderRadius: 100, fontSize: 9, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}>{s}</span>)}{(b.skills?.length || 0) > 3 && <span style={{ fontSize: 9, color: "rgba(241,245,249,0.25)" }}>+{b.skills!.length - 3}</span>}</div></td>
                          <td style={{ ...td, fontWeight: 700, color: "#818cf8" }}>{b.totalScore ? `${b.totalScore}/50` : "-"}</td>
                          <td style={td}>{bs ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 100, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, background: bs.bg, border: `1px solid ${bs.border}`, color: bs.color, whiteSpace: "nowrap" }}><span style={{ width: 4, height: 4, borderRadius: "50%", background: bs.color }} />{bs.label}</span> : "-"}</td>
                          <td style={td}>{b.github && <a href={b.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#818cf8", textDecoration: "none" }}>GitHub ↗</a>}</td>
                          <td style={td}>
                            {b.builderStatus !== "contributor" && b.builderStatus !== "core_contributor" ? (
                              <button onClick={() => inviteContributor(b)} style={{ padding: "4px 10px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)", color: "#a855f7" }}>Invite</button>
                            ) : (
                              <button onClick={() => updateBuilderStatus(b, "core_contributor")} style={{ padding: "4px 10px", borderRadius: 100, fontSize: 10, cursor: "pointer", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#f59e0b" }}>Promote ↑</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── SECURITY ── */}
        {tab === "security" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(241,245,249,0.85)", marginBottom: 4 }}>Rate Limit Violations</h2>
                <p style={{ fontSize: 12, color: "rgba(241,245,249,0.35)" }}>IPs blocked due to suspicious activity. Records auto-expire when blocks lift.</p>
              </div>
              {blockedIPs.length > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", fontSize: 11, color: "#f87171" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", animation: "pulse 2s infinite" }} />
                  {blockedIPs.length} blocked IP{blockedIPs.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
              {blockedIPs.length === 0 ? (
                <div style={{ padding: "60px 40px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
                  <p style={{ fontSize: 13, color: "rgba(241,245,249,0.3)", marginBottom: 4 }}>No blocked IPs.</p>
                  <p style={{ fontSize: 12, color: "rgba(241,245,249,0.18)" }}>Rate limits are active on all API routes. Violations appear here.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["IP Address", "Route", "Violations", "Blocked Until", "Last Triggered"].map((h) => <th key={h} style={th}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {blockedIPs.map((entry) => {
                        const isActive = entry.blockedUntil && entry.blockedUntil.toDate() > new Date();
                        const fmtDate = (d: { toDate(): Date } | null) => d ? d.toDate().toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";
                        return (
                          <tr key={entry.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                            <td style={{ ...td, fontFamily: "monospace", fontSize: 12, color: isActive ? "#f87171" : "rgba(241,245,249,0.6)" }}>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                {isActive && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />}
                                {entry.ip}
                              </span>
                            </td>
                            <td style={td}><span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{entry.route}</span></td>
                            <td style={td}>
                              <span style={{
                                fontWeight: 700, fontSize: 14,
                                color: entry.violations >= 4 ? "#f87171" : entry.violations >= 2 ? "#fbbf24" : "#818cf8",
                              }}>
                                {entry.violations}
                              </span>
                              <span style={{ fontSize: 10, color: "rgba(241,245,249,0.25)", marginLeft: 4 }}>violation{entry.violations !== 1 ? "s" : ""}</span>
                            </td>
                            <td style={{ ...td, color: isActive ? "#f87171" : "rgba(241,245,249,0.35)", fontSize: 12 }}>
                              {isActive ? fmtDate(entry.blockedUntil) : <span style={{ color: "rgba(34,197,94,0.7)" }}>Expired</span>}
                            </td>
                            <td style={{ ...td, color: "rgba(241,245,249,0.35)", fontSize: 12 }}>{fmtDate(entry.lastBlockedAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Rate limit config reference */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 20 }}>
              {[
                { route: "POST /api/apply", limit: "3 / hour", window: "1 hour", color: "#818cf8" },
                { route: "POST /api/submit-lead", limit: "5 / hour", window: "1 hour", color: "#22d3ee" },
                { route: "POST /api/builder/notify", limit: "15 / hour", window: "1 hour", color: "#a855f7" },
                { route: "ALL /api/*", limit: "60 / min (edge)", window: "1 minute", color: "#fbbf24" },
              ].map((r) => (
                <div key={r.route} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: 10, fontFamily: "monospace", color: r.color, marginBottom: 6, letterSpacing: "0.05em" }}>{r.route}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(241,245,249,0.85)", marginBottom: 3 }}>{r.limit}</p>
                  <p style={{ fontSize: 11, color: "rgba(241,245,249,0.25)" }}>Window: {r.window}</p>
                </div>
              ))}
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        )}

      </div>
    </div>
  );
}

function Placeholder({ text }: { text: string }) {
  return <div style={{ padding: "60px 40px", textAlign: "center", color: "rgba(241,245,249,0.2)", fontSize: 13 }}>{text}</div>;
}
