"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  collection, onSnapshot, doc, updateDoc, orderBy, query,
  Timestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

type LeadStatus = "new" | "contacted" | "qualified" | "closed";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  type: string;
  products: string[];
  message: string;
  status: LeadStatus;
  notes: string;
  createdAt: Timestamp | null;
}

const STATUS_COLORS: Record<LeadStatus, { bg: string; border: string; text: string }> = {
  new:       { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.35)",  text: "#818cf8" },
  contacted: { bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.35)",  text: "#fbbf24" },
  qualified: { bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.35)",   text: "#22c55e" },
  closed:    { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", text: "rgba(241,245,249,0.35)" },
};

const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "closed"];
const FILTERS = ["all", ...ALL_STATUSES] as const;
type Filter = typeof FILTERS[number];

function fmt(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 100,
      fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      fontWeight: 600,
    }}>
      {status}
    </span>
  );
}

function LeadRow({ lead, onSelect }: { lead: Lead; onSelect: (l: Lead) => void }) {
  return (
    <tr
      onClick={() => onSelect(lead)}
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        cursor: "pointer", transition: "background 0.15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={td}>{lead.name}</td>
      <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{lead.email}</td>
      <td style={td}>{lead.company}</td>
      <td style={{ ...td, color: "rgba(241,245,249,0.45)" }}>{lead.type}</td>
      <td style={td}>
        {lead.products?.length
          ? lead.products.map((p) => (
              <span key={p} style={{
                display: "inline-block", marginRight: 4, padding: "2px 7px",
                borderRadius: 100, fontSize: 9, letterSpacing: "0.1em",
                textTransform: "uppercase", background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.4)",
              }}>{p}</span>
            ))
          : <span style={{ color: "rgba(241,245,249,0.2)" }}>—</span>}
      </td>
      <td style={td}><StatusBadge status={lead.status} /></td>
      <td style={{ ...td, color: "rgba(241,245,249,0.35)", fontSize: 12 }}>{fmt(lead.createdAt)}</td>
    </tr>
  );
}

const th: React.CSSProperties = {
  padding: "12px 16px", textAlign: "left",
  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
  color: "rgba(241,245,249,0.22)", fontWeight: 500, whiteSpace: "nowrap",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
};
const td: React.CSSProperties = {
  padding: "14px 16px", fontSize: 13,
  color: "rgba(241,245,249,0.75)", verticalAlign: "middle",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Auth guard
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/admin/login");
      } else {
        setAuthChecked(true);
      }
    });
    return unsub;
  }, [router]);

  // Real-time leads listener
  useEffect(() => {
    if (!authChecked) return;
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setLeads(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead))
      );
    });
    return unsub;
  }, [authChecked]);

  const handleSelect = useCallback((lead: Lead) => {
    setSelected(lead);
    setNotesDraft(lead.notes || "");
  }, []);

  const updateStatus = async (id: string, status: LeadStatus) => {
    await updateDoc(doc(db, "leads", id), { status });
    setSelected((prev) => prev ? { ...prev, status } : prev);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    await updateDoc(doc(db, "leads", selected.id), { notes: notesDraft });
    setSelected((prev) => prev ? { ...prev, notes: notesDraft } : prev);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/admin/login");
  };

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter((l) => l.status === s).length;
    return acc;
  }, {} as Record<LeadStatus, number>);

  if (!authChecked) {
    return (
      <div style={{ minHeight: "100vh", background: "#04040a", display: "flex", alignItems: "center", justifyContent: "center", cursor: "auto" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#04040a", color: "rgba(241,245,249,0.85)", fontFamily: "system-ui, sans-serif", cursor: "auto" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 60,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(4,4,10,0.9)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", width: 24, height: 24 }}>
            <img src="/logo.png" alt="Orvantia Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>Orvantia</span>
          <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(241,245,249,0.2)", marginLeft: 4 }}>/ Leads</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href="/admin/applications"
            style={{
              padding: "7px 16px", borderRadius: 100, fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none",
              background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
              color: "#818cf8", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.5)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.3)"; }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />
            Applications
          </a>
          <button
            onClick={handleSignOut}
            style={{
              padding: "7px 16px", borderRadius: 100, fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(241,245,249,0.4)", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "rgba(248,113,113,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(241,245,249,0.4)"; }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={{ padding: "32px 28px", maxWidth: 1400, margin: "0 auto" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Leads", value: leads.length, color: "#818cf8" },
            { label: "New", value: counts.new, color: STATUS_COLORS.new.text },
            { label: "Contacted", value: counts.contacted, color: STATUS_COLORS.contacted.text },
            { label: "Qualified", value: counts.qualified, color: STATUS_COLORS.qualified.text },
            { label: "Closed", value: counts.closed, color: STATUS_COLORS.closed.text },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "18px 20px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1, marginBottom: 6, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
              <div style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px", borderRadius: 100, fontSize: 11,
                letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                background: filter === f ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                border: filter === f ? "1px solid rgba(99,102,241,0.45)" : "1px solid rgba(255,255,255,0.08)",
                color: filter === f ? "#818cf8" : "rgba(241,245,249,0.35)",
                transition: "all 0.2s",
              }}
            >
              {f === "all" ? `All (${leads.length})` : `${f} (${counts[f as LeadStatus]})`}
            </button>
          ))}
        </div>

        {/* Main grid: table + detail panel */}
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 16, alignItems: "start" }}>
          {/* Table */}
          <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center", color: "rgba(241,245,249,0.2)", fontSize: 13 }}>
                No leads yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Name", "Email", "Company", "Type", "Products", "Status", "Date"].map((h) => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((lead) => (
                      <LeadRow key={lead.id} lead={lead} onSelect={handleSelect} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: 24, position: "sticky", top: 76,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 3, color: "rgba(241,245,249,0.95)" }}>{selected.name}</h3>
                  <p style={{ fontSize: 12, color: "rgba(241,245,249,0.35)" }}>{selected.company}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", color: "rgba(241,245,249,0.3)", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: 4 }}
                >×</button>
              </div>

              {/* Contact info */}
              <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Email", selected.email],
                  ["Phone", selected.phone || "—"],
                  ["Type", selected.type],
                  ["Date", fmt(selected.createdAt)],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>{label}</span>
                    <span style={{ fontSize: 12, color: "rgba(241,245,249,0.65)", textAlign: "right", wordBreak: "break-all" }}>{value}</span>
                  </div>
                ))}
                {(selected.products?.length ?? 0) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.25)" }}>Products</span>
                    <span style={{ fontSize: 12, color: "rgba(241,245,249,0.65)", textAlign: "right" }}>{selected.products.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Message */}
              <div style={{ marginBottom: 20, padding: 14, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 8 }}>Message</p>
                <p style={{ fontSize: 13, color: "rgba(241,245,249,0.6)", lineHeight: 1.65 }}>{selected.message}</p>
              </div>

              {/* Status update */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 10 }}>Status</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {ALL_STATUSES.map((s) => {
                    const active = selected.status === s;
                    const c = STATUS_COLORS[s];
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        style={{
                          padding: "6px 12px", borderRadius: 100, fontSize: 10,
                          letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                          background: active ? c.bg : "rgba(255,255,255,0.04)",
                          border: active ? `1px solid ${c.border}` : "1px solid rgba(255,255,255,0.08)",
                          color: active ? c.text : "rgba(241,245,249,0.3)",
                          transition: "all 0.2s",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.22)", marginBottom: 8 }}>Admin Notes</p>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={4}
                  placeholder="Add internal notes…"
                  style={{
                    width: "100%", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10,
                    padding: "10px 12px", color: "rgba(241,245,249,0.75)",
                    fontSize: 13, outline: "none", resize: "vertical",
                    fontFamily: "inherit", lineHeight: 1.6,
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.4)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
                <button
                  onClick={saveNotes}
                  disabled={saving}
                  style={{
                    marginTop: 8, width: "100%", padding: "10px",
                    borderRadius: 10, fontSize: 11, letterSpacing: "0.12em",
                    textTransform: "uppercase", cursor: saving ? "wait" : "pointer",
                    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8", transition: "all 0.2s", opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? "Saving…" : "Save Notes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
