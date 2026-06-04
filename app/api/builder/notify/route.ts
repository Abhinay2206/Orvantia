import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";
import { checkRateLimit, getIP, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

const FROM = process.env.SMTP_FROM || `"Orvantia AI" <noreply@orvantia.ai>`;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

type NotifyType =
  | "account_created"
  | "task_accepted"
  | "submission_received"
  | "meeting_scheduled"
  | "review_completed"
  | "shortlisted"
  | "contributor_invited";

interface Payload {
  type: NotifyType;
  userId: string;
  userEmail?: string;
  taskTitle?: string;
  totalScore?: number;
  meetingDate?: string;
  meetingTime?: string;
  meetingLink?: string;
}

async function getBuilder(userId: string): Promise<{ name: string; email: string } | null> {
  try {
    const snap = await adminDb.collection("builder_profiles").doc(userId).get();
    if (!snap.exists) return null;
    const d = snap.data()!;
    return { name: d.fullName as string, email: d.email as string };
  } catch { return null; }
}

function base(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#04040a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
<div style="max-width:560px;margin:40px auto;background:#04040a;color:#f1f5f9;padding:40px 32px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px">
    <div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7)"></div>
    <span style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(241,245,249,0.3)">Orvantia Builder Program</span>
  </div>
  ${content}
  <div style="margin-top:40px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)">
    <p style="font-size:11px;color:rgba(241,245,249,0.18);margin:0">Orvantia AI · Building Autonomous Intelligence</p>
  </div>
</div></body></html>`;
}

function hi(name: string) {
  return `<p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 16px">Hi <strong style="color:#f1f5f9">${name}</strong>,</p>`;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://orvantia.vercel.app";

const templates: Record<NotifyType, (name: string, p: Payload) => { subject: string; html: string }> = {
  account_created: (name) => ({
    subject: "Welcome to the Orvantia Builder Program",
    html: base(`
      <h1 style="font-size:24px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Welcome, ${name}! 🚀</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 20px">Your builder account is ready. Complete your profile and start browsing real-world challenges.</p>
      <a href="${APP_URL}/tasks" style="display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#6366f1,#a855f7);border-radius:100px;color:white;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-top:8px">Browse Challenges →</a>
    `),
  }),

  task_accepted: (name, p) => ({
    subject: `Challenge Accepted — ${p.taskTitle}`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Challenge Accepted!</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 16px">You've accepted: <strong style="color:#818cf8">${p.taskTitle}</strong>.</p>
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 24px">Start building and submit your solution when ready. Document your approach and push your code to GitHub before submitting.</p>
      <div style="padding:16px 20px;background:rgba(99,102,241,0.07);border:1px solid rgba(99,102,241,0.15);border-radius:10px">
        <p style="font-size:13px;color:rgba(241,245,249,0.5);margin:0">Tip: A clear README and live demo make a strong impression on reviewers.</p>
      </div>
    `),
  }),

  submission_received: (name, p) => ({
    subject: `Submission Received — ${p.taskTitle}`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Submission Received!</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 16px">We've received your solution for <strong style="color:#818cf8">${p.taskTitle}</strong>.</p>
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 24px">Our team will review it and notify you once the review is complete.</p>
      <div style="padding:16px 20px;background:rgba(34,197,94,0.06);border:1px solid rgba(34,197,94,0.15);border-radius:10px">
        <p style="font-size:13px;color:rgba(34,197,94,0.7);margin:0">Thank you for building with Orvantia.</p>
      </div>
    `),
  }),

  meeting_scheduled: (name, p) => ({
    subject: `Discussion Meeting Scheduled — ${p.taskTitle}`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Meeting Scheduled 📅</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 20px">The Orvantia team has scheduled a discussion about your work on <strong style="color:#a855f7">${p.taskTitle}</strong>.</p>
      ${p.meetingDate ? `
        <div style="background:rgba(168,85,247,0.07);border:1px solid rgba(168,85,247,0.15);border-radius:12px;padding:18px 20px;margin:0 0 20px">
          <p style="font-size:11px;color:rgba(168,85,247,0.6);margin:0 0 10px;letter-spacing:0.15em;text-transform:uppercase">Meeting Details</p>
          <p style="font-size:14px;color:rgba(241,245,249,0.75);margin:0 0 4px">📅 ${p.meetingDate} at ${p.meetingTime || ""}</p>
          ${p.meetingLink ? `<p style="font-size:13px;margin:10px 0 0"><a href="${p.meetingLink}" style="color:#a855f7;text-decoration:none">Join Meeting →</a></p>` : ""}
        </div>
      ` : ""}
      <p style="font-size:14px;line-height:1.7;color:rgba(241,245,249,0.5);margin:0">Be prepared to walk through your technical decisions and what you learned.</p>
    `),
  }),

  review_completed: (name, p) => ({
    subject: `Your Review is Ready — Score: ${p.totalScore}/50`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Review Complete!</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 20px">Your submission for <strong style="color:#818cf8">${p.taskTitle}</strong> has been reviewed.</p>
      ${p.totalScore !== undefined ? `
        <div style="text-align:center;padding:28px;background:rgba(99,102,241,0.08);border:1px solid rgba(99,102,241,0.2);border-radius:14px;margin:0 0 20px">
          <div style="font-size:52px;font-weight:800;color:#818cf8;line-height:1">${p.totalScore}</div>
          <div style="font-size:13px;color:rgba(241,245,249,0.3);margin-top:6px">out of 50</div>
        </div>
      ` : ""}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 20px">Log in to see your detailed scores, feedback, and notes from the team.</p>
      <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);border-radius:100px;color:#818cf8;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase">View Dashboard →</a>
    `),
  }),

  shortlisted: (name, p) => ({
    subject: `You've Been Shortlisted! 🎉`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">You've Been Shortlisted! 🎉</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 16px">Based on your submission for <strong style="color:#fbbf24">${p.taskTitle}</strong>, you've been shortlisted by the Orvantia team.</p>
      <div style="padding:20px;background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.2);border-radius:12px;margin:0 0 20px">
        <p style="font-size:14px;font-weight:600;color:rgba(251,191,36,0.85);margin:0">You're one step closer to contributing to Orvantia AI products.</p>
      </div>
      <p style="font-size:14px;line-height:1.7;color:rgba(241,245,249,0.5);margin:0">Our team will reach out with next steps shortly.</p>
    `),
  }),

  contributor_invited: (name) => ({
    subject: `You're Invited to Join as a Contributor`,
    html: base(`
      <h1 style="font-size:22px;font-weight:700;margin:0 0 20px;color:#f1f5f9">Welcome to the Team 🏆</h1>
      ${hi(name)}
      <p style="font-size:15px;line-height:1.7;color:rgba(241,245,249,0.65);margin:0 0 16px">The Orvantia team is inviting you to become a <strong style="color:#a855f7">Contributor</strong> on our products.</p>
      <div style="padding:20px;background:rgba(168,85,247,0.07);border:1px solid rgba(168,85,247,0.15);border-radius:12px;margin:0 0 20px">
        <p style="font-size:14px;color:rgba(168,85,247,0.8);margin:0">Your work stood out. We'd love to have you building with us on Enteraflux, Continuum, and ClinicalAgents.</p>
      </div>
      <p style="font-size:14px;line-height:1.7;color:rgba(241,245,249,0.5);margin:0">Our team will reach out with the details of your contribution role.</p>
    `),
  }),
};

function adminHtml(title: string, rows: [string, string][]) {
  return base(`
    <h2 style="font-size:18px;color:#818cf8;margin:0 0 16px">${title}</h2>
    <table style="width:100%;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(241,245,249,0.3);width:110px;vertical-align:top">${k}</td><td style="padding:8px 0;font-size:13px;color:rgba(241,245,249,0.7)">${v}</td></tr>`).join("")}
    </table>
  `);
}

export async function POST(req: NextRequest) {
  // Rate limit: 15 notification triggers per IP per hour (internal use).
  const ip = getIP(req);
  const rl = checkRateLimit(ip, "notify", 15, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: "Rate limited" }, { status: 429, headers: rateLimitHeaders(rl, 15) });
  }

  const payload = await req.json() as Payload;
  const { type, userId, userEmail } = payload;

  let builderEmail = userEmail || "";
  let builderName = "Builder";

  const profile = await getBuilder(userId);
  if (profile) { builderEmail = profile.email; builderName = profile.name; }
  if (!builderEmail) return NextResponse.json({ ok: false, error: "No email found" });

  const templateFn = templates[type];
  if (!templateFn) return NextResponse.json({ ok: false, error: "Unknown type" });

  const { subject, html } = templateFn(builderName, payload);

  try {
    const transporter = getTransporter();

    // Send to builder
    await transporter.sendMail({ from: FROM, to: builderEmail, subject, html });

    // Admin copy for key events
    if (ADMIN_EMAIL && (type === "submission_received" || type === "shortlisted" || type === "contributor_invited")) {
      const adminSubject = `[Builder] ${type === "submission_received" ? "New Submission" : type === "shortlisted" ? "Builder Shortlisted" : "Contributor Invited"} — ${payload.taskTitle || builderName}`;
      await transporter.sendMail({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: adminSubject,
        html: adminHtml(adminSubject, [
          ["Builder", builderName],
          ["Email", builderEmail],
          ["Task", payload.taskTitle || "—"],
        ]),
      });
    }

    // Log activity in Firestore
    await adminDb.collection("notifications").add({
      userId, type,
      message: `${builderName}: ${subject}`,
      timestamp: new Date(),
    });
  } catch (err) {
    // Email failure is non-blocking — log but don't crash
    console.error("[builder/notify] email error:", err);
  }

  return NextResponse.json({ ok: true });
}
