"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  collection, onSnapshot, doc, updateDoc, deleteDoc, orderBy, query, Timestamp, writeBatch,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────
type AppStatus = "pending" | "shortlisted" | "interview-scheduled" | "accepted" | "rejected";

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  linkedin: string;
  github: string;
  portfolio: string;
  resumeUrl: string;
  role: string;
  skills: string[];
  bestProject: string;
  projectLinks: string;
  builtAgent: string;
  agentDescription: string;
  productIdea: string;
  technicalChallenge: string;
  motivation: string;
  autonomousAIInterest: string;
  availabilityHours: string;
  startDate: string;
  status: AppStatus;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_STATUSES: AppStatus[] = ["pending", "shortlisted", "interview-scheduled", "accepted", "rejected"];

const STATUS_STYLES: Record<AppStatus, { bg: string; border: string; text: string; dot: string }> = {
  pending:              { bg: "rgba(99,102,241,0.10)",  border: "rgba(99,102,241,0.30)",  text: "#818cf8",          dot: "#818cf8" },
  shortlisted:          { bg: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.35)",  text: "#fbbf24",          dot: "#fbbf24" },
  "interview-scheduled":{ bg: "rgba(34,211,238,0.10)",  border: "rgba(34,211,238,0.30)",  text: "#22d3ee",          dot: "#22d3ee" },
  accepted:             { bg: "rgba(34,197,94,0.10)",   border: "rgba(34,197,94,0.30)",   text: "#22c55e",          dot: "#22c55e" },
  rejected:             { bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   text: "rgba(248,113,113,0.75)", dot: "#f87171" },
};

const STATUS_LABELS: Record<AppStatus, string> = {
  pending: "Pending",
  shortlisted: "Shortlisted",
  "interview-scheduled": "Interview",
  accepted: "Accepted",
  rejected: "Rejected",
};

const ROLES = [
  "AI Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "DevOps Engineer", "UI/UX Designer", "AI Researcher", "Product Builder", "Open Source Contributor",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function dateStamp() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: AppStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100,
      fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
      background: s.bg, border: `1px solid ${s.border}`, color: s.text,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {STATUS_LABELS[status]}
    </span>
  );
}

const th: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left",
  fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
  color: "rgba(241,245,249,0.22)", fontWeight: 500,
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  whiteSpace: "nowrap",
};
const td: React.CSSProperties = {
  padding: "13px 16px", fontSize: 13,
  color: "rgba(241,245,249,0.75)", verticalAlign: "middle",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ApplicationsDashboard() {
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<AppStatus | "all">("all");
  const [filterRole, setFilterRole] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Refresh
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerRefresh = useCallback(() => {
    setRefreshing(true);
    setCountdown(5);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  // Auth guard
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.replace("/admin/login");
      else setAuthChecked(true);
    });
    return unsub;
  }, [router]);

  // Real-time listener — re-subscribes whenever refreshKey changes
  useEffect(() => {
    if (!authChecked) return;
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Application)));
      setLastRefreshed(new Date());
      setRefreshing(false);
    });
    return unsub;
  }, [authChecked, refreshKey]);

  // 5-second countdown + auto-refresh
  useEffect(() => {
    if (!authChecked) return;
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerRefresh();
          return 5;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [authChecked, triggerRefresh]);

  const handleSelect = useCallback((app: Application) => {
    setSelected(app);
  }, []);

  const updateStatus = async (id: string, status: AppStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, "applications", id), {
        status,
        updatedAt: new Date(),
      });
      setSelected((prev) => prev ? { ...prev, status } : prev);
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    } finally {
      setUpdating(false);
    }
  };

  // Counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: apps.length };
    ALL_STATUSES.forEach((s) => { c[s] = apps.filter((a) => a.status === s).length; });
    return c;
  }, [apps]);

  // Filtered list
  const filtered = useMemo(() => {
    return apps.filter((a) => {
      if (filterStatus !== "all" && a.status !== filterStatus) return false;
      if (filterRole !== "all" && a.role !== filterRole) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q) && !a.college?.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [apps, filterStatus, filterRole, searchQuery]);

  // ─── Selection + delete ──────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggleSelectAll = () =>
    setSelectedIds(selectedIds.size === filtered.length ? new Set() : new Set(filtered.map((a) => a.id)));

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      selectedIds.forEach((id) => batch.delete(doc(db, "applications", id)));
      await batch.commit();
      setSelectedIds(new Set());
      if (selected && selectedIds.has(selected.id)) setSelected(null);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  // ─── Export helpers ──────────────────────────────────────────────────────────
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  const exportRows = (list: Application[]) =>
    list.map((a) => ({
      Name: a.name,
      Email: a.email,
      Phone: a.phone || "",
      College: a.college || "",
      "Degree / Branch": a.branch || "",
      Year: a.year || "",
      Role: a.role || "",
      Skills: (a.skills || []).join(", "),
      Status: STATUS_LABELS[a.status] ?? a.status,
      LinkedIn: a.linkedin || "",
      GitHub: a.github || "",
      Portfolio: a.portfolio || "",
      "Resume URL": a.resumeUrl || "",
      "Best Project": a.bestProject || "",
      "Project Links": a.projectLinks || "",
      "Built AI Agent": a.builtAgent === "yes" ? "Yes" : "No",
      "Agent Description": a.agentDescription || "",
      "Product Idea": a.productIdea || "",
      "Technical Challenge": a.technicalChallenge || "",
      "Why Orvantia AI": a.motivation || "",
      "Autonomous AI Interest": a.autonomousAIInterest || "",
      "Hours / Week": a.availabilityHours || "",
      "Start Date": a.startDate || "",
      "Applied On": a.createdAt ? fmt(a.createdAt) : "",
    }));

  const handleExcelExport = () => {
    setExporting("excel");
    try {
      const rows = exportRows(filtered);
      const ws = XLSX.utils.json_to_sheet(rows);
      // Column widths
      ws["!cols"] = Object.keys(rows[0] ?? {}).map((k) =>
        ({ wch: Math.max(k.length + 2, 18) })
      );
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Applications");
      const label = filterStatus !== "all" ? `_${filterStatus}` : "";
      XLSX.writeFile(wb, `orvantia_applications${label}_${dateStamp()}.xlsx`);
    } finally {
      setExporting(null);
    }
  };

  const handlePdfExport = async () => {
    setExporting("pdf");
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      // Header
      doc.setFillColor(4, 4, 10);
      doc.rect(0, 0, 297, 210, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(129, 140, 248);
      doc.text("Orvantia AI — Founding Builder Applications", 14, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 140);
      doc.text(
        `Exported ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · ${filtered.length} applicant${filtered.length !== 1 ? "s" : ""}${filterStatus !== "all" ? ` · ${STATUS_LABELS[filterStatus as AppStatus]}` : ""}`,
        14, 22
      );

      autoTable(doc, {
        startY: 28,
        head: [["Name", "Email", "College", "Role", "Skills", "Status", "Date"]],
        body: filtered.map((a) => [
          a.name,
          a.email,
          a.college || "—",
          a.role || "—",
          (a.skills || []).slice(0, 5).join(", ") + ((a.skills?.length ?? 0) > 5 ? `… +${a.skills.length - 5}` : ""),
          STATUS_LABELS[a.status] ?? a.status,
          a.createdAt ? fmt(a.createdAt) : "—",
        ]),
        styles: {
          fontSize: 8,
          cellPadding: 3,
          textColor: [220, 225, 235],
          fillColor: [10, 10, 20],
          lineColor: [35, 35, 55],
          lineWidth: 0.2,
        },
        headStyles: {
          fillColor: [25, 25, 50],
          textColor: [129, 140, 248],
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: { fillColor: [14, 14, 26] },
        columnStyles: {
          0: { cellWidth: 36 },
          1: { cellWidth: 52 },
          2: { cellWidth: 48 },
          3: { cellWidth: 36 },
          4: { cellWidth: 56 },
          5: { cellWidth: 22 },
          6: { cellWidth: 24 },
        },
        margin: { left: 14, right: 14 },
      });

      // Footer page numbers
      const pageCount = (doc as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 80);
        doc.text(`Page ${i} of ${pageCount} · Orvantia AI`, 14, 205);
      }

      const label = filterStatus !== "all" ? `_${filterStatus}` : "";
      doc.save(`orvantia_applications${label}_${dateStamp()}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(4,4,10,0.92)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Orvantia</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 14 }}>/</span>
          <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>Applications</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Refresh button + countdown */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={triggerRefresh}
              title="Refresh now"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 32, height: 32, borderRadius: 8, cursor: "pointer",
                background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                color: "#818cf8", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)"; }}
            >
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ transition: "transform 0.6s", transform: refreshing ? "rotate(360deg)" : "rotate(0deg)" }}
              >
                <path d="M12.5 2.5A6 6 0 1 0 13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M13 2.5V5.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: 28, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    background: "rgba(99,102,241,0.7)",
                    width: `${(countdown / 5) * 100}%`,
                    transition: "width 0.9s linear",
                  }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(241,245,249,0.25)", minWidth: 14 }}>
                  {countdown}s
                </span>
              </div>
              {lastRefreshed && (
                <span style={{ fontSize: 9, color: "rgba(241,245,249,0.18)", letterSpacing: "0.05em" }}>
                  {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              )}
            </div>
          </div>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.07)" }} />

          <a
            href="/admin"
            style={{
              padding: "7px 14px", borderRadius: 100, fontSize: 11, textDecoration: "none",
              letterSpacing: "0.1em", textTransform: "uppercase",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(241,245,249,0.4)", transition: "all 0.2s",
            }}
          >
            Leads
          </a>
          <button
            onClick={async () => { await signOut(auth); router.replace("/admin/login"); }}
            style={{
              padding: "7px 14px", borderRadius: 100, fontSize: 11,
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(241,245,249,0.4)", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(248,113,113,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(241,245,249,0.4)"; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ padding: "28px 28px 60px", maxWidth: 1500, margin: "0 auto" }}>
        {/* Title + Export */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Founding Builder Applications</h1>
            <p style={{ fontSize: 13, color: "rgba(241,245,249,0.3)", margin: 0 }}>Manage, review, and update applicant statuses.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <ExportButton
              label="Excel"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 4.5L7 9.5M10 4.5L7 9.5M4 9.5H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              }
              loading={exporting === "excel"}
              disabled={filtered.length === 0 || exporting !== null}
              onClick={handleExcelExport}
              accent="rgba(34,197,94"
            />
            <ExportButton
              label="PDF"
              icon={
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 1h6l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.5 7.5h2a1 1 0 0 1 0 2h-2V6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              loading={exporting === "pdf"}
              disabled={filtered.length === 0 || exporting !== null}
              onClick={handlePdfExport}
              accent="rgba(248,113,113"
            />
          </div>
        </div>

        {/* Metrics */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12, marginBottom: 24,
        }}>
          {[
            { label: "Total", value: apps.length, color: "#818cf8" },
            { label: "Pending", value: counts.pending, color: STATUS_STYLES.pending.text },
            { label: "Shortlisted", value: counts.shortlisted, color: STATUS_STYLES.shortlisted.text },
            { label: "Interview", value: counts["interview-scheduled"], color: STATUS_STYLES["interview-scheduled"].text },
            { label: "Accepted", value: counts.accepted, color: STATUS_STYLES.accepted.text },
            { label: "Rejected", value: counts.rejected, color: STATUS_STYLES.rejected.text },
          ].map((m) => (
            <div key={m.label} style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 5, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or college…"
            style={{
              flex: "1 1 220px", minWidth: 180, padding: "8px 14px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(241,245,249,0.8)", fontSize: 13, outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.45)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
          />

          {/* Status filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as AppStatus | "all")}
            style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(241,245,249,0.7)", fontSize: 12, outline: "none", cursor: "pointer",
              fontFamily: "inherit", colorScheme: "dark",
            }}
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} style={{ background: "#04040a" }}>{STATUS_LABELS[s]}</option>
            ))}
          </select>

          {/* Role filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(241,245,249,0.7)", fontSize: 12, outline: "none", cursor: "pointer",
              fontFamily: "inherit", colorScheme: "dark",
            }}
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r} style={{ background: "#04040a" }}>{r}</option>
            ))}
          </select>

          {(filterStatus !== "all" || filterRole !== "all" || searchQuery) && (
            <button
              onClick={() => { setFilterStatus("all"); setFilterRole("all"); setSearchQuery(""); }}
              style={{
                padding: "8px 14px", borderRadius: 8, fontSize: 11, cursor: "pointer",
                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(241,245,249,0.35)", letterSpacing: "0.08em", textTransform: "uppercase",
                fontFamily: "inherit",
              }}
            >
              Clear filters
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 11, color: "rgba(241,245,249,0.25)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            {filtered.length} of {apps.length} applicants
          </span>
        </div>

        {/* Selection action bar */}
        {selectedIds.size > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
            padding: "10px 16px", borderRadius: 10,
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
          }}>
            <span style={{ fontSize: 13, color: "rgba(241,245,249,0.7)" }}>
              <strong style={{ color: "rgba(248,113,113,0.9)" }}>{selectedIds.size}</strong> application{selectedIds.size !== 1 ? "s" : ""} selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              style={{
                background: "none", border: "none", fontSize: 12, cursor: "pointer",
                color: "rgba(241,245,249,0.35)", padding: 0,
              }}
            >
              Deselect all
            </button>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "7px 16px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                    color: "rgba(248,113,113,0.9)", fontFamily: "inherit",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 3.5h9M5 3.5V2.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5.5 6v3.5M7.5 6v3.5M3 3.5l.5 7a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  Delete selected
                </button>
              ) : (
                <>
                  <span style={{ fontSize: 12, color: "rgba(248,113,113,0.8)", alignSelf: "center" }}>
                    Delete {selectedIds.size} record{selectedIds.size !== 1 ? "s" : ""}? This cannot be undone.
                  </span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      padding: "7px 16px", borderRadius: 8, fontSize: 12, cursor: deleting ? "wait" : "pointer",
                      background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)",
                      color: "rgba(248,113,113,0.95)", fontFamily: "inherit", opacity: deleting ? 0.6 : 1,
                    }}
                  >
                    {deleting ? "Deleting…" : "Confirm Delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                      color: "rgba(241,245,249,0.4)", fontFamily: "inherit",
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: selected ? "1fr 420px" : "1fr",
          gap: 16, alignItems: "start",
        }}>
          {/* Table */}
          <div style={{
            background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, overflow: "hidden",
          }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "60px 24px", textAlign: "center", color: "rgba(241,245,249,0.2)", fontSize: 13 }}>
                No applications match your filters.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, width: 44, paddingRight: 0 }}>
                        <Checkbox
                          checked={selectedIds.size === filtered.length && filtered.length > 0}
                          indeterminate={selectedIds.size > 0 && selectedIds.size < filtered.length}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      {["Name", "Email", "College", "Role", "Status", "Date"].map((h) => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app) => (
                      <AppRow
                        key={app.id}
                        app={app}
                        selected={selected?.id === app.id}
                        checked={selectedIds.has(app.id)}
                        onSelect={handleSelect}
                        onCheck={toggleSelect}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <DetailPanel
              app={selected}
              onClose={() => setSelected(null)}
              onStatusChange={updateStatus}
              updating={updating}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────
function AppRow({ app, selected, checked, onSelect, onCheck }: {
  app: Application;
  selected: boolean;
  checked: boolean;
  onSelect: (a: Application) => void;
  onCheck: (id: string) => void;
}) {
  return (
    <tr
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: "background 0.15s",
        background: checked
          ? "rgba(239,68,68,0.04)"
          : selected
          ? "rgba(99,102,241,0.06)"
          : "transparent",
      }}
      onMouseEnter={(e) => { if (!selected && !checked) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
      onMouseLeave={(e) => { if (!selected && !checked) e.currentTarget.style.background = "transparent"; }}
    >
      <td style={{ ...td, paddingRight: 0, width: 44 }} onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={checked} onChange={() => onCheck(app.id)} />
      </td>
      <td style={{ ...td, cursor: "pointer" }} onClick={() => onSelect(app)}>
        <div>
          <div style={{ fontWeight: 500, color: "rgba(241,245,249,0.9)", marginBottom: 1 }}>{app.name}</div>
          {app.year && <div style={{ fontSize: 11, color: "rgba(241,245,249,0.3)", fontFamily: "monospace" }}>{app.year}</div>}
        </div>
      </td>
      <td style={{ ...td, color: "rgba(241,245,249,0.45)", cursor: "pointer" }} onClick={() => onSelect(app)}>{app.email}</td>
      <td style={{ ...td, color: "rgba(241,245,249,0.55)", maxWidth: 180, cursor: "pointer" }} onClick={() => onSelect(app)}>
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.college || "—"}</div>
      </td>
      <td style={{ ...td, cursor: "pointer" }} onClick={() => onSelect(app)}>
        <span style={{
          padding: "3px 9px", borderRadius: 100, fontSize: 10,
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(241,245,249,0.45)", letterSpacing: "0.05em", whiteSpace: "nowrap",
        }}>
          {app.role || "—"}
        </span>
      </td>
      <td style={{ ...td, cursor: "pointer" }} onClick={() => onSelect(app)}><StatusBadge status={app.status || "pending"} /></td>
      <td style={{ ...td, color: "rgba(241,245,249,0.3)", fontSize: 12, cursor: "pointer" }} onClick={() => onSelect(app)}>{fmt(app.createdAt)}</td>
    </tr>
  );
}

function Checkbox({ checked, indeterminate, onChange }: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        width: 16, height: 16, borderRadius: 4, cursor: "pointer", flexShrink: 0,
        border: `1.5px solid ${checked || indeterminate ? "#6366f1" : "rgba(255,255,255,0.2)"}`,
        background: checked || indeterminate ? "rgba(99,102,241,0.2)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}
    >
      {indeterminate && !checked ? (
        <div style={{ width: 7, height: 1.5, background: "#818cf8", borderRadius: 1 }} />
      ) : checked ? (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="#818cf8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
}

// ─── Detail Panel ──────────────────────────────────────────────────────────────
function DetailPanel({
  app, onClose, onStatusChange, updating,
}: {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: AppStatus) => void;
  updating: boolean;
}) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14, overflow: "hidden", position: "sticky", top: 76,
      maxHeight: "calc(100vh - 100px)", overflowY: "auto",
    }}>
      {/* Panel header */}
      <div style={{
        padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        position: "sticky", top: 0, background: "rgba(4,4,10,0.95)", backdropFilter: "blur(12px)", zIndex: 2,
      }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 2px", color: "rgba(241,245,249,0.95)" }}>{app.name}</h3>
          <p style={{ fontSize: 12, color: "rgba(241,245,249,0.35)", margin: 0 }}>{app.college || "—"}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(241,245,249,0.3)", fontSize: 22, lineHeight: 1, padding: 4,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.7)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(241,245,249,0.3)")}
        >
          ×
        </button>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Status selector */}
        <div style={{ marginBottom: 20 }}>
          <PanelLabel>Update Status</PanelLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_STATUSES.map((s) => {
              const active = app.status === s;
              const style = STATUS_STYLES[s];
              return (
                <button
                  key={s}
                  onClick={() => !updating && onStatusChange(app.id, s)}
                  disabled={updating}
                  style={{
                    padding: "6px 12px", borderRadius: 100, fontSize: 10, cursor: updating ? "wait" : "pointer",
                    letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600,
                    background: active ? style.bg : "rgba(255,255,255,0.04)",
                    border: active ? `1px solid ${style.border}` : "1px solid rgba(255,255,255,0.08)",
                    color: active ? style.text : "rgba(241,245,249,0.3)",
                    transition: "all 0.2s", opacity: updating ? 0.6 : 1,
                  }}
                >
                  {STATUS_LABELS[s]}
                </button>
              );
            })}
          </div>
        </div>

        <Divider />

        {/* Personal info */}
        <Section title="Personal Information">
          {[
            ["Email", app.email],
            ["Phone", app.phone || "—"],
            ["Degree", app.branch || "—"],
            ["Year", app.year || "—"],
            ["Applied For", app.role || "—"],
            ["Applied On", fmt(app.createdAt)],
            ["Availability", app.availabilityHours || "—"],
            ["Start Date", app.startDate || "—"],
          ].map(([label, value]) => (
            <InfoRow key={label} label={label} value={value} />
          ))}
        </Section>

        <Divider />

        {/* Links */}
        {(app.linkedin || app.github || app.portfolio || app.resumeUrl) && (
          <>
            <Section title="Links">
              {app.linkedin && <InfoRow label="LinkedIn" value={<a href={app.linkedin} target="_blank" rel="noreferrer" style={{ color: "#818cf8", wordBreak: "break-all" }}>{app.linkedin}</a>} />}
              {app.github && <InfoRow label="GitHub" value={<a href={app.github} target="_blank" rel="noreferrer" style={{ color: "#818cf8", wordBreak: "break-all" }}>{app.github}</a>} />}
              {app.portfolio && <InfoRow label="Portfolio" value={<a href={app.portfolio} target="_blank" rel="noreferrer" style={{ color: "#818cf8", wordBreak: "break-all" }}>{app.portfolio}</a>} />}
              {app.resumeUrl && (
                <InfoRow label="Resume" value={
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" style={{
                    color: "#22d3ee", display: "inline-flex", alignItems: "center", gap: 5,
                  }}>
                    Download PDF ↗
                  </a>
                } />
              )}
            </Section>
            <Divider />
          </>
        )}

        {/* Skills */}
        {app.skills?.length > 0 && (
          <>
            <Section title="Skills">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {app.skills.map((skill) => (
                  <span key={skill} style={{
                    padding: "4px 10px", borderRadius: 100, fontSize: 11,
                    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
                    color: "#818cf8",
                  }}>{skill}</span>
                ))}
              </div>
            </Section>
            <Divider />
          </>
        )}

        {/* Projects */}
        {(app.bestProject || app.projectLinks) && (
          <>
            <Section title="Projects">
              {app.bestProject && <TextBlock label="Best Project" value={app.bestProject} />}
              {app.projectLinks && <TextBlock label="Project Links" value={app.projectLinks} />}
              {app.builtAgent && (
                <InfoRow label="Built AI Agent" value={app.builtAgent === "yes" ? "Yes" : "No"} />
              )}
              {app.agentDescription && <TextBlock label="Agent Description" value={app.agentDescription} />}
            </Section>
            <Divider />
          </>
        )}

        {/* Problem Solving */}
        {(app.productIdea || app.technicalChallenge) && (
          <>
            <Section title="Problem Solving">
              {app.productIdea && <TextBlock label="Product Idea (1 Month)" value={app.productIdea} />}
              {app.technicalChallenge && <TextBlock label="Technical Challenge" value={app.technicalChallenge} />}
            </Section>
            <Divider />
          </>
        )}

        {/* Motivation */}
        {(app.motivation || app.autonomousAIInterest) && (
          <Section title="Motivation">
            {app.motivation && <TextBlock label="Why Orvantia AI" value={app.motivation} />}
            {app.autonomousAIInterest && <TextBlock label="Autonomous AI Interest" value={app.autonomousAIInterest} />}
          </Section>
        )}
      </div>
    </div>
  );
}

// ─── Panel helpers ────────────────────────────────────────────────────────────
function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
      color: "rgba(241,245,249,0.22)", marginBottom: 10, fontWeight: 500,
    }}>{children}</p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <PanelLabel>{title}</PanelLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 11, color: "rgba(241,245,249,0.28)", whiteSpace: "nowrap", paddingTop: 1 }}>{label}</span>
      <span style={{ fontSize: 12, color: "rgba(241,245,249,0.65)", textAlign: "right", wordBreak: "break-word" }}>{value}</span>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      padding: "12px 14px",
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 8,
    }}>
      <p style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 7 }}>{label}</p>
      <p style={{ fontSize: 12, color: "rgba(241,245,249,0.6)", lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{value}</p>
    </div>
  );
}

function ExportButton({
  label, icon, loading, disabled, onClick, accent,
}: {
  label: string;
  icon: React.ReactNode;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "8px 16px", borderRadius: 8, fontSize: 12, cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600,
        background: `${accent},0.1)`,
        border: `1px solid ${accent},0.25)`,
        color: `${accent},0.9)`,
        opacity: disabled ? 0.45 : 1,
        transition: "all 0.2s",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.background = `${accent},0.18)`; e.currentTarget.style.borderColor = `${accent},0.45)`; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = `${accent},0.1)`; e.currentTarget.style.borderColor = `${accent},0.25)`; }}
    >
      {loading ? (
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          border: `1.5px solid ${accent},0.3)`, borderTopColor: `${accent},0.9)`,
          animation: "spin 0.7s linear infinite",
        }} />
      ) : icon}
      {loading ? "Exporting…" : `Export ${label}`}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
