"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

// ─── Types ──────────────────────────────────────────────────────────────────
type Phase = "disclosure" | "form" | "success";

interface FormState {
  name: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  linkedin: string;
  github: string;
  portfolio: string;
  role: string;
  skills: string[];
  customSkill: string;
  bestProject: string;
  projectLinks: string;
  builtAgent: "yes" | "no" | "";
  agentDescription: string;
  productIdea: string;
  technicalChallenge: string;
  motivation: string;
  autonomousAIInterest: string;
  availabilityHours: string;
  startDate: string;
}

type FieldErrors = Partial<Record<keyof FormState | "resume", string>>;

// ─── Constants ───────────────────────────────────────────────────────────────
const ROLES = [
  "AI Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "UI/UX Designer",
  "AI Researcher",
  "Product Builder",
  "Open Source Contributor",
];

const SKILL_OPTIONS = [
  "Python", "Java", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS",
  "LangChain", "CrewAI", "AutoGen", "OpenAI", "Gemini", "Claude",
  "Machine Learning", "Deep Learning", "UI/UX", "DevOps",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Graduated"];

const DISCLOSURE_SECTIONS = [
  {
    label: "Introduction",
    content: [
      "Orvantia is an early-stage technology company focused on building autonomous AI products that solve real-world problems across engineering, enterprise operations, and healthcare.",
      "Current products include:",
    ],
    bullets: [
      "Enteraflux — GLP-1 Companion for Weight Loss",
      "Continuum — Autonomous Engineering Platform",
      "ClinicalAgents — Healthcare Intelligence Platform",
    ],
  },
  {
    label: "Our Mission",
    content: [
      "We believe the future will be powered by autonomous systems capable of reasoning, planning, collaborating, and executing complex work.",
      "Our mission is to build intelligent products that transform how software is built, how organizations operate, and how industries leverage AI.",
    ],
    bullets: [],
  },
  {
    label: "What We Look For",
    content: ["We care more about what you've built, your initiative, and your curiosity than GPA or certifications."],
    bullets: [
      "Love creating products & take ownership",
      "Learn quickly & solve difficult problems",
      "Want startup + agentic AI experience",
      "Self-driven and collaborative",
    ],
  },
  {
    label: "Open Roles",
    content: [],
    bullets: [
      "AI Engineers · Full Stack Developers · Frontend Developers",
      "Backend Developers · DevOps Engineers · UI/UX Designers",
      "AI Researchers · Product Builders · Open Source Contributors",
    ],
  },
  {
    label: "What You Gain",
    content: [],
    bullets: [
      "Experience building real AI products & production-grade systems",
      "Startup experience and portfolio-worthy projects",
      "Collaboration with driven builders",
      "Priority consideration for paid opportunities as the company grows",
    ],
  },
  {
    label: "Transparency Notice",
    content: [
      "Orvantia is currently in the product-building and client-acquisition stage.",
    ],
    bullets: [
      "We do not guarantee salaries or stipends at this stage",
      "We do not currently have recurring revenue",
      "We are building products and acquiring clients",
      "Future paid opportunities based on contribution quality & business growth",
    ],
    highlight: true,
  },
];

const EMPTY_FORM: FormState = {
  name: "", email: "", phone: "", college: "", branch: "", year: "",
  linkedin: "", github: "", portfolio: "",
  role: "",
  skills: [], customSkill: "",
  bestProject: "", projectLinks: "",
  builtAgent: "", agentDescription: "",
  productIdea: "", technicalChallenge: "",
  motivation: "", autonomousAIInterest: "",
  availabilityHours: "", startDate: "",
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function SectionHeader({ num, title, subtitle }: { num: string; title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#6366f1", opacity: 0.8,
        }}>{num}</span>
        <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }} />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "rgba(241,245,249,0.95)", margin: 0, marginBottom: subtitle ? 4 : 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 13, color: "rgba(241,245,249,0.4)", margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{
      display: "block", fontSize: 11, letterSpacing: "0.15em",
      textTransform: "uppercase", color: "rgba(241,245,249,0.4)",
      marginBottom: 8, fontFamily: "var(--mono)",
    }}>
      {children}
      {required && <span style={{ color: "rgba(99,102,241,0.8)", marginLeft: 4 }}>*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p style={{ fontSize: 11, color: "rgba(248,113,113,0.85)", marginTop: 5, fontFamily: "var(--mono)" }}>
      {msg}
    </p>
  );
}

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 10,
  padding: "13px 16px",
  color: "rgba(241,245,249,0.9)",
  fontSize: 14,
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s",
  boxSizing: "border-box",
};

const textareaBase: React.CSSProperties = {
  ...inputBase,
  resize: "vertical",
  lineHeight: 1.65,
  minHeight: 120,
};

function TextInput({
  value, onChange, placeholder, type = "text", error,
  onFocus, onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          ...inputBase,
          borderColor: error
            ? "rgba(239,68,68,0.45)"
            : focused
            ? "rgba(99,102,241,0.5)"
            : "rgba(255,255,255,0.09)",
          background: focused ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.035)",
        }}
        onFocus={() => { setFocused(true); onFocus?.(); }}
        onBlur={() => { setFocused(false); onBlur?.(); }}
      />
      <FieldError msg={error} />
    </div>
  );
}

function TextArea({
  value, onChange, placeholder, rows = 5, error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          ...textareaBase,
          borderColor: error
            ? "rgba(239,68,68,0.45)"
            : focused
            ? "rgba(99,102,241,0.5)"
            : "rgba(255,255,255,0.09)",
          background: focused ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.035)",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ApplyPage() {
  const [phase, setPhase] = useState<Phase>("disclosure");
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const set = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    const trimmed = form.customSkill.trim();
    if (!trimmed || form.skills.includes(trimmed)) { set("customSkill", ""); return; }
    setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed], customSkill: "" }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, resume: "Only PDF files are accepted." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resume: "File must be under 5 MB." }));
      return;
    }
    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resume: undefined }));
  };

  const validate = (): boolean => {
    const e: FieldErrors = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.college.trim()) e.college = "College/University is required.";
    if (!form.branch.trim()) e.branch = "Degree/Branch is required.";
    if (!form.year) e.year = "Year of study is required.";
    if (!form.role) e.role = "Please select a role.";
    if (!form.motivation.trim()) e.motivation = "Please tell us why you want to join.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setSubmitting(true);
    setSubmitError("");

    try {
      let resumeUrl = "";
      if (resumeFile) {
        const fileRef = ref(storage, `resumes/${Date.now()}_${resumeFile.name.replace(/\s+/g, "_")}`);
        await uploadBytes(fileRef, resumeFile);
        resumeUrl = await getDownloadURL(fileRef);
      }

      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        college: form.college.trim(),
        branch: form.branch.trim(),
        year: form.year,
        linkedin: form.linkedin.trim(),
        github: form.github.trim(),
        portfolio: form.portfolio.trim(),
        resumeUrl,
        role: form.role,
        skills: form.skills,
        bestProject: form.bestProject.trim(),
        projectLinks: form.projectLinks.trim(),
        builtAgent: form.builtAgent,
        agentDescription: form.agentDescription.trim(),
        productIdea: form.productIdea.trim(),
        technicalChallenge: form.technicalChallenge.trim(),
        motivation: form.motivation.trim(),
        autonomousAIInterest: form.autonomousAIInterest.trim(),
        availabilityHours: form.availabilityHours.trim(),
        startDate: form.startDate,
      };

      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed.");
      }

      setPhase("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Disclosure Phase ────────────────────────────────────────────────────
  if (phase === "disclosure") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#04040a",
        color: "rgba(241,245,249,0.85)",
        fontFamily: "var(--font, system-ui, sans-serif)",
        overflowX: "hidden",
      }}>
        {/* Background */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto", padding: "48px 24px 80px" }}
        >
          {/* Nav bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/logo.png" alt="Orvantia" style={{ width: 26, height: 26, objectFit: "contain" }} />
              <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.85)" }}>
                Orvantia
              </span>
            </div>
            <span style={{
              fontFamily: "var(--mono, monospace)", fontSize: 10, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(99,102,241,0.7)",
              padding: "5px 12px", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100,
            }}>
              Founding Builders
            </span>
          </div>

          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
              padding: "5px 16px", borderRadius: 100,
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(34,197,94,0.9)", animation: "pulse-glow 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "var(--mono, monospace)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(241,245,249,0.5)" }}>
                Now Accepting Applications
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, lineHeight: 1.15,
              marginBottom: 16, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #f1f5f9 0%, rgba(129,140,248,0.95) 45%, rgba(99,102,241,0.85) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              Join the Founding Builder<br />Community at Orvantia 
            </h1>
            <p style={{ fontSize: 16, color: "rgba(241,245,249,0.45)", lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>
              Help us build the next generation of autonomous AI products. Read the information below before applying.
            </p>
          </div>

          {/* Disclosure card */}
          <div style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, overflow: "hidden",
            boxShadow: "0 0 80px rgba(99,102,241,0.06), 0 40px 100px rgba(0,0,0,0.4)",
          }}>
            {DISCLOSURE_SECTIONS.map((section, i) => (
              <div key={i} style={{
                padding: "28px 36px",
                borderBottom: i < DISCLOSURE_SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: section.highlight ? "rgba(251,191,36,0.03)" : "transparent",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  {section.highlight && (
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(251,191,36,0.8)", flexShrink: 0 }} />
                  )}
                  <span style={{
                    fontFamily: "var(--mono, monospace)", fontSize: 10, letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: section.highlight ? "rgba(251,191,36,0.7)" : "rgba(99,102,241,0.7)",
                  }}>
                    {section.label}
                  </span>
                </div>
                {section.content.map((p, j) => (
                  <p key={j} style={{ fontSize: 14, color: "rgba(241,245,249,0.6)", lineHeight: 1.75, marginBottom: 10 }}>{p}</p>
                ))}
                {section.bullets.length > 0 && (
                  <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
                    {section.bullets.map((b, j) => (
                      <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <span style={{
                          width: 4, height: 4, borderRadius: "50%", flexShrink: 0, marginTop: 7,
                          background: section.highlight ? "rgba(251,191,36,0.6)" : "rgba(99,102,241,0.6)",
                        }} />
                        <span style={{ fontSize: 14, color: "rgba(241,245,249,0.55)", lineHeight: 1.6 }}>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Commitment section */}
            <div style={{ padding: "28px 36px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: 14, color: "rgba(241,245,249,0.6)", lineHeight: 1.75, marginBottom: 0 }}>
                We are looking for people who want to help create meaningful technology rather than simply complete an internship requirement.
                If you are excited about autonomous AI, startups, and building impactful products, we encourage you to apply.
              </p>
            </div>

            {/* Agreement */}
            <div style={{
              padding: "28px 36px",
              background: "rgba(99,102,241,0.04)",
              borderTop: "1px solid rgba(99,102,241,0.1)",
            }}>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer",
              }}>
                <div
                  onClick={() => setAgreed(!agreed)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${agreed ? "#6366f1" : "rgba(255,255,255,0.2)"}`,
                    background: agreed ? "rgba(99,102,241,0.25)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s", cursor: "pointer",
                  }}
                >
                  {agreed && (
                    <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 14, color: "rgba(241,245,249,0.65)", lineHeight: 1.65, userSelect: "none" }}>
                  I have read and understood the information above and wish to continue with my application.
                </span>
              </label>
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <motion.button
              onClick={() => { if (agreed) { setPhase("form"); window.scrollTo({ top: 0, behavior: "instant" }); } }}
              whileHover={agreed ? { scale: 1.02, y: -1 } : {}}
              whileTap={agreed ? { scale: 0.98 } : {}}
              style={{
                padding: "16px 48px", borderRadius: 100,
                fontFamily: "var(--mono, monospace)", fontSize: 12,
                letterSpacing: "0.14em", textTransform: "uppercase",
                fontWeight: 600, color: "white", border: "none",
                background: agreed
                  ? "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))"
                  : "rgba(255,255,255,0.05)",
                boxShadow: agreed ? "0 0 30px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.1)" : "none",
                cursor: agreed ? "pointer" : "not-allowed",
                opacity: agreed ? 1 : 0.4,
                transition: "all 0.3s",
              }}
            >
              Continue to Application →
            </motion.button>
            {!agreed && (
              <p style={{ marginTop: 12, fontSize: 12, fontFamily: "var(--mono, monospace)", color: "rgba(241,245,249,0.25)", letterSpacing: "0.05em" }}>
                Accept the agreement above to continue
              </p>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Success Phase ───────────────────────────────────────────────────────
  if (phase === "success") {
    return (
      <div style={{
        minHeight: "100vh", background: "#04040a",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px", fontFamily: "var(--font, system-ui, sans-serif)",
      }}>
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "relative", zIndex: 1, maxWidth: 560, width: "100%", textAlign: "center" }}
        >
          {/* Success icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 80, height: 80, borderRadius: "50%", margin: "0 auto 32px",
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 40px rgba(34,197,94,0.15)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M6 16L13 23L26 9" stroke="rgba(34,197,94,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, lineHeight: 1.2,
              marginBottom: 16, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #f1f5f9 0%, rgba(129,140,248,0.95) 50%, rgba(99,102,241,0.85) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}
          >
            Application Submitted Successfully
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            <p style={{ fontSize: 15, color: "rgba(241,245,249,0.5)", lineHeight: 1.75, marginBottom: 12 }}>
              Thank you for applying to Orvantia.
            </p>
            <p style={{ fontSize: 15, color: "rgba(241,245,249,0.5)", lineHeight: 1.75, marginBottom: 12 }}>
              Your application has been received and is currently under review.
            </p>
            <p style={{ fontSize: 15, color: "rgba(241,245,249,0.5)", lineHeight: 1.75, marginBottom: 40 }}>
              We appreciate your interest in contributing to our mission of building autonomous AI products.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <a
              href="/"
              style={{
                padding: "14px 32px", borderRadius: 100,
                fontFamily: "var(--mono, monospace)", fontSize: 11,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "white", textDecoration: "none",
                background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))",
                boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                transition: "transform 0.2s, box-shadow 0.2s",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              Return Home
            </a>
            <a
              href="/"
              style={{
                padding: "14px 32px", borderRadius: 100,
                fontFamily: "var(--mono, monospace)", fontSize: 11,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(241,245,249,0.5)", textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "border-color 0.2s, color 0.2s, transform 0.2s",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(99,102,241,0.4)";
                el.style.color = "rgba(241,245,249,0.85)";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.1)";
                el.style.color = "rgba(241,245,249,0.5)";
                el.style.transform = "translateY(0)";
              }}
            >
              Visit Orvantia Website ↗
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ─── Form Phase ──────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#04040a",
      color: "rgba(241,245,249,0.85)",
      fontFamily: "var(--font, system-ui, sans-serif)",
      overflowX: "hidden",
    }}>
      {/* Background */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 70%)",
      }} />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
        backgroundSize: "64px 64px",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", zIndex: 1, maxWidth: 760, margin: "0 auto", padding: "40px 24px 100px" }}
        ref={formTopRef}
      >
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="Orvantia" style={{ width: 26, height: 26, objectFit: "contain" }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Orvantia
            </span>
          </div>
          <button
            onClick={() => setPhase("disclosure")}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 100,
              padding: "6px 14px", fontSize: 11, fontFamily: "var(--mono, monospace)",
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: "rgba(241,245,249,0.35)", cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.65)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.35)"; }}
          >
            ← Back
          </button>
        </div>

        {/* Page title */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--mono, monospace)", fontSize: 10, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(99,102,241,0.7)", marginBottom: 12,
          }}>
            Founding Builder Application
          </p>
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, lineHeight: 1.2,
            letterSpacing: "-0.02em", marginBottom: 10,
            background: "linear-gradient(135deg, #f1f5f9 0%, rgba(129,140,248,0.95) 45%, rgba(99,102,241,0.85) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Apply to Orvantia 
          </h1>
          <p style={{ fontSize: 14, color: "rgba(241,245,249,0.4)", lineHeight: 1.65 }}>
            Fields marked with <span style={{ color: "rgba(99,102,241,0.8)" }}>*</span> are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* ─── Section 1: Personal Info ──────────────────────────── */}
          <FormSection>
            <SectionHeader num="01" title="Personal Information" />
            <FormGrid>
              <FormField>
                <FieldLabel required>Full Name</FieldLabel>
                <TextInput value={form.name} onChange={(v) => set("name", v)} placeholder="Your full name" error={errors.name} />
              </FormField>
              <FormField>
                <FieldLabel required>Email Address</FieldLabel>
                <TextInput value={form.email} onChange={(v) => set("email", v)} type="email" placeholder="you@email.com" error={errors.email} />
              </FormField>
              <FormField>
                <FieldLabel required>Phone Number</FieldLabel>
                <TextInput value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 98765 43210" error={errors.phone} />
              </FormField>
              <FormField>
                <FieldLabel required>College / University</FieldLabel>
                <TextInput value={form.college} onChange={(v) => set("college", v)} placeholder="Institution name" error={errors.college} />
              </FormField>
              <FormField>
                <FieldLabel required>Degree / Branch</FieldLabel>
                <TextInput value={form.branch} onChange={(v) => set("branch", v)} placeholder="e.g. B.Tech Computer Science" error={errors.branch} />
              </FormField>
              <FormField>
                <FieldLabel required>Current Year of Study</FieldLabel>
                <SelectInput
                  value={form.year}
                  onChange={(v) => set("year", v)}
                  options={YEARS}
                  placeholder="Select year"
                  error={errors.year}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 2: Professional Profiles ─────────────────── */}
          <FormSection>
            <SectionHeader num="02" title="Professional Profiles" subtitle="Optional but highly recommended." />
            <FormGrid>
              <FormField>
                <FieldLabel>LinkedIn URL</FieldLabel>
                <TextInput value={form.linkedin} onChange={(v) => set("linkedin", v)} placeholder="linkedin.com/in/username" />
              </FormField>
              <FormField>
                <FieldLabel>GitHub URL</FieldLabel>
                <TextInput value={form.github} onChange={(v) => set("github", v)} placeholder="github.com/username" />
              </FormField>
              <FormField>
                <FieldLabel>Portfolio Website</FieldLabel>
                <TextInput value={form.portfolio} onChange={(v) => set("portfolio", v)} placeholder="yourportfolio.dev" />
              </FormField>
              <FormField>
                <FieldLabel>Resume (PDF)</FieldLabel>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: "20px 24px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px dashed ${errors.resume ? "rgba(239,68,68,0.45)" : resumeFile ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.12)"}`,
                    background: resumeFile ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.02)",
                    textAlign: "center", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.4)"; }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = errors.resume
                      ? "rgba(239,68,68,0.45)" : resumeFile
                      ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.12)";
                  }}
                >
                  {resumeFile ? (
                    <div>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                      <p style={{ fontSize: 13, color: "rgba(99,102,241,0.9)", fontWeight: 500, marginBottom: 2 }}>{resumeFile.name}</p>
                      <p style={{ fontSize: 11, color: "rgba(241,245,249,0.3)", fontFamily: "var(--mono, monospace)" }}>
                        {(resumeFile.size / 1024).toFixed(0)} KB · Click to replace
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>↑</div>
                      <p style={{ fontSize: 13, color: "rgba(241,245,249,0.5)", marginBottom: 4 }}>
                        Click to upload your resume
                      </p>
                      <p style={{ fontSize: 11, color: "rgba(241,245,249,0.25)", fontFamily: "var(--mono, monospace)" }}>
                        PDF only · Max 5 MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <FieldError msg={errors.resume} />
              </FormField>
            </FormGrid>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 3: Role ───────────────────────────────────── */}
          <FormSection>
            <SectionHeader num="03" title="Role Selection" />
            <div>
              <FieldLabel required>Primary Role You're Applying For</FieldLabel>
              <SelectInput
                value={form.role}
                onChange={(v) => set("role", v)}
                options={ROLES}
                placeholder="Select a role"
                error={errors.role}
              />
            </div>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 4: Skills ────────────────────────────────── */}
          <FormSection>
            <SectionHeader num="04" title="Skills" subtitle="Select all that apply. Add custom skills below." />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {SKILL_OPTIONS.map((skill) => {
                const active = form.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: "7px 14px", borderRadius: 100, fontSize: 12, cursor: "pointer",
                      fontFamily: "var(--mono, monospace)", letterSpacing: "0.05em",
                      background: active ? "rgba(99,102,241,0.18)" : "rgba(255,255,255,0.04)",
                      border: active ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(255,255,255,0.09)",
                      color: active ? "#818cf8" : "rgba(241,245,249,0.45)",
                      transition: "all 0.15s",
                    }}
                  >
                    {active ? "✓ " : ""}{skill}
                  </button>
                );
              })}
            </div>
            {/* Custom skill input */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                value={form.customSkill}
                onChange={(e) => set("customSkill", e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill(); } }}
                placeholder="Add a custom skill…"
                style={{ ...inputBase, flex: 1 }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
              />
              <button
                type="button"
                onClick={addCustomSkill}
                style={{
                  padding: "13px 20px", borderRadius: 10, fontSize: 12, cursor: "pointer",
                  background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818cf8", fontFamily: "var(--mono, monospace)", letterSpacing: "0.08em",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.25)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(99,102,241,0.15)")}
              >
                + Add
              </button>
            </div>
            {/* Custom skills display */}
            {form.skills.filter((s) => !SKILL_OPTIONS.includes(s)).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {form.skills.filter((s) => !SKILL_OPTIONS.includes(s)).map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: "5px 12px", borderRadius: 100, fontSize: 12,
                      background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
                      color: "#c084fc", display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }))}
                      style={{ background: "none", border: "none", color: "#c084fc", cursor: "pointer", padding: 0, lineHeight: 1, fontSize: 14 }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </FormSection>

          <SectionDivider />

          {/* ─── Section 5: Project Experience ───────────────────── */}
          <FormSection>
            <SectionHeader num="05" title="Project Experience" />
            <FormField style={{ marginBottom: 20 }}>
              <FieldLabel>Tell us about your best project.</FieldLabel>
              <TextArea
                value={form.bestProject}
                onChange={(v) => set("bestProject", v)}
                placeholder="Describe what you built, the problem it solved, your role, and the tech stack used…"
                rows={6}
              />
            </FormField>
            <FormField style={{ marginBottom: 24 }}>
              <FieldLabel>Share links to projects you've built.</FieldLabel>
              <TextArea
                value={form.projectLinks}
                onChange={(v) => set("projectLinks", v)}
                placeholder="GitHub links, live demos, deployed URLs, or any relevant project links…"
                rows={3}
              />
            </FormField>

            {/* AI Agent question */}
            <FormField>
              <FieldLabel>Have you ever built an AI Agent or Agentic Workflow?</FieldLabel>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                {(["yes", "no"] as const).map((opt) => (
                  <label
                    key={opt}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                  >
                    <div
                      onClick={() => set("builtAgent", opt)}
                      style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        border: `2px solid ${form.builtAgent === opt ? "#6366f1" : "rgba(255,255,255,0.2)"}`,
                        background: form.builtAgent === opt ? "rgba(99,102,241,0.25)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s", cursor: "pointer",
                      }}
                    >
                      {form.builtAgent === opt && (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8" }} />
                      )}
                    </div>
                    <span style={{ fontSize: 14, color: "rgba(241,245,249,0.65)", textTransform: "capitalize" }}>{opt}</span>
                  </label>
                ))}
              </div>
            </FormField>

            <AnimatePresence>
              {form.builtAgent === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: "hidden" }}
                >
                  <FieldLabel>Describe what you built.</FieldLabel>
                  <TextArea
                    value={form.agentDescription}
                    onChange={(v) => set("agentDescription", v)}
                    placeholder="What agent or workflow did you build? What was its purpose? What tools or frameworks did you use?"
                    rows={5}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 6: Problem Solving ──────────────────────── */}
          <FormSection>
            <SectionHeader num="06" title="Problem Solving" />
            <FormField style={{ marginBottom: 20 }}>
              <FieldLabel>If you had one month to build an autonomous AI product, what would you build and why?</FieldLabel>
              <TextArea
                value={form.productIdea}
                onChange={(v) => set("productIdea", v)}
                placeholder="Describe your vision — the problem, the solution, and why it matters…"
                rows={6}
              />
            </FormField>
            <FormField>
              <FieldLabel>Describe a difficult technical challenge you solved.</FieldLabel>
              <TextArea
                value={form.technicalChallenge}
                onChange={(v) => set("technicalChallenge", v)}
                placeholder="What was the challenge, how did you approach it, and what was the outcome?"
                rows={5}
              />
            </FormField>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 7: Motivation ───────────────────────────── */}
          <FormSection>
            <SectionHeader num="07" title="Motivation" />
            <FormField style={{ marginBottom: 20 }}>
              <FieldLabel required>Why do you want to join Orvantia ?</FieldLabel>
              <TextArea
                value={form.motivation}
                onChange={(v) => set("motivation", v)}
                placeholder="Tell us what draws you to Orvantia specifically and what you hope to contribute…"
                rows={6}
                error={errors.motivation}
              />
            </FormField>
            <FormField>
              <FieldLabel>What excites you most about autonomous AI systems?</FieldLabel>
              <TextArea
                value={form.autonomousAIInterest}
                onChange={(v) => set("autonomousAIInterest", v)}
                placeholder="Share your perspective on agentic AI and what you find most interesting or promising…"
                rows={5}
              />
            </FormField>
          </FormSection>

          <SectionDivider />

          {/* ─── Section 8: Availability ─────────────────────────── */}
          <FormSection>
            <SectionHeader num="08" title="Availability" />
            <FormGrid>
              <FormField>
                <FieldLabel>Hours Available Per Week</FieldLabel>
                <SelectInput
                  value={form.availabilityHours}
                  onChange={(v) => set("availabilityHours", v)}
                  options={["5–10 hours", "10–20 hours", "20–30 hours", "30–40 hours", "40+ hours (Full-time)"]}
                  placeholder="Select availability"
                />
              </FormField>
              <FormField>
                <FieldLabel>Earliest Start Date</FieldLabel>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => set("startDate", e.target.value)}
                  style={{ ...inputBase, colorScheme: "dark" }}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.5)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          {/* ─── Submit ───────────────────────────────────────────── */}
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: 24, padding: "14px 18px",
                background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 10, fontSize: 13, color: "rgba(248,113,113,0.85)", lineHeight: 1.5,
              }}
            >
              {submitError}
            </motion.div>
          )}

          <div style={{ textAlign: "center", paddingTop: 8 }}>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={!submitting ? { scale: 1.02, y: -1 } : {}}
              whileTap={!submitting ? { scale: 0.98 } : {}}
              style={{
                padding: "18px 56px", borderRadius: 100, fontSize: 13,
                fontFamily: "var(--mono, monospace)", letterSpacing: "0.14em",
                textTransform: "uppercase", fontWeight: 600,
                color: "white", border: "none", cursor: submitting ? "wait" : "pointer",
                background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(168,85,247,0.95))",
                boxShadow: "0 0 30px rgba(99,102,241,0.35), 0 0 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
                opacity: submitting ? 0.7 : 1,
                transition: "opacity 0.2s, box-shadow 0.2s",
              }}
            >
              {submitting ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Spinner /> Submitting Application…
                </span>
              ) : (
                "Apply to Orvantia AI →"
              )}
            </motion.button>
            <p style={{
              marginTop: 14, fontSize: 11, fontFamily: "var(--mono, monospace)",
              color: "rgba(241,245,249,0.22)", letterSpacing: "0.05em",
            }}>
              Your data is stored securely. We will reach out if there's a fit.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────
function FormSection({ children }: { children: React.ReactNode }) {
  return <div style={{ marginBottom: 48 }}>{children}</div>;
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px 24px",
    }}>
      {children}
    </div>
  );
}

function FormField({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={style}>{children}</div>;
}

function SectionDivider() {
  return (
    <div style={{
      height: 1, margin: "0 0 48px",
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
    }} />
  );
}

function SelectInput({
  value, onChange, options, placeholder, error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputBase,
          appearance: "none",
          WebkitAppearance: "none",
          backgroundColor: focused ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.035)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4L6 8L10 4' stroke='rgba(241,245,249,0.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
          paddingRight: 40,
          borderColor: error
            ? "rgba(239,68,68,0.45)"
            : focused
            ? "rgba(99,102,241,0.5)"
            : "rgba(255,255,255,0.09)",
          cursor: "pointer",
          colorScheme: "dark",
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="" disabled style={{ background: "#04040a", color: "rgba(241,245,249,0.4)" }}>
          {placeholder || "Select…"}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ background: "#04040a", color: "rgba(241,245,249,0.9)" }}>
            {opt}
          </option>
        ))}
      </select>
      <FieldError msg={error} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: "50%",
      border: "2px solid rgba(255,255,255,0.2)",
      borderTopColor: "rgba(255,255,255,0.9)",
      animation: "spin 0.7s linear infinite",
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
