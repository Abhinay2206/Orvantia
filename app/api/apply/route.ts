import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function buildConfirmationEmail(name: string) {
  return `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#04040a;color:#f1f5f9;padding:40px 32px;border-radius:16px;border:1px solid rgba(255,255,255,0.08)">
      <div style="margin-bottom:32px;display:flex;align-items:center;gap:10px">
        <div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#a855f7)"></div>
        <span style="font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(241,245,249,0.3)">Orvantia AI</span>
      </div>

      <h1 style="font-size:24px;font-weight:700;margin:0 0 8px;color:#f1f5f9">
        Application Received
      </h1>
      <p style="font-size:15px;color:rgba(241,245,249,0.45);margin:0 0 32px;letter-spacing:0.01em">
        — Orvantia AI
      </p>

      <p style="font-size:15px;line-height:1.8;color:rgba(241,245,249,0.7);margin:0 0 20px">
        Hi <strong style="color:#f1f5f9">${name}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.8;color:rgba(241,245,249,0.7);margin:0 0 20px">
        Thank you for applying to Orvantia AI.
      </p>
      <p style="font-size:15px;line-height:1.8;color:rgba(241,245,249,0.7);margin:0 0 20px">
        We have successfully received your application. Our team will review your submission and reach out if there is a suitable opportunity.
      </p>
      <p style="font-size:15px;line-height:1.8;color:rgba(241,245,249,0.7);margin:0 0 32px">
        We appreciate your interest in helping build the future of autonomous AI products.
      </p>

      <div style="padding:24px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.15);border-radius:12px;margin-bottom:32px">
        <p style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(241,245,249,0.3);margin:0 0 14px">Current Products</p>
        <div style="display:flex;flex-direction:column;gap:10px">
          ${[
            ["Enteraflux", "Enterprise Agent Operating System"],
            ["Continuum", "Autonomous Engineering Platform"],
            ["ClinicalAgents", "Healthcare Intelligence Platform"],
          ]
            .map(
              ([name, desc]) => `
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:4px;height:4px;border-radius:50%;background:#818cf8;flex-shrink:0"></div>
            <span style="font-size:13px;color:#f1f5f9;font-weight:600">${name}</span>
            <span style="font-size:12px;color:rgba(241,245,249,0.35)">— ${desc}</span>
          </div>`
            )
            .join("")}
        </div>
      </div>

      <p style="font-size:13px;line-height:1.7;color:rgba(241,245,249,0.55);margin:0 0 8px">
        Regards,<br>
        <strong style="color:rgba(241,245,249,0.8)">Orvantia AI</strong>
      </p>

      <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06)">
        <p style="font-size:11px;color:rgba(241,245,249,0.18);margin:0">
          Orvantia AI · Building Autonomous Intelligence
        </p>
      </div>
    </div>
  `;
}

function buildAdminNotificationEmail(data: Record<string, unknown>) {
  const skills = Array.isArray(data.skills) ? (data.skills as string[]).join(", ") : "—";
  return `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:700px;margin:0 auto;background:#04040a;color:#f1f5f9;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
      <h2 style="color:#818cf8;margin:0 0 4px;font-size:20px">New Builder Application</h2>
      <p style="color:rgba(241,245,249,0.3);font-size:12px;margin:0 0 28px;letter-spacing:0.1em">Orvantia AI — Founding Builder Program</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${[
          ["Name", data.name],
          ["Email", data.email],
          ["Phone", data.phone || "—"],
          ["College", data.college],
          ["Degree/Branch", data.branch],
          ["Year", data.year],
          ["Role Applied", data.role],
          ["Skills", skills],
          ["Built AI Agent", data.builtAgent === "yes" ? "Yes" : "No"],
          ["Hours/Week", data.availabilityHours],
          ["Start Date", data.startDate],
          ["LinkedIn", data.linkedin || "—"],
          ["GitHub", data.github || "—"],
          ["Portfolio", data.portfolio || "—"],
          ["Resume", data.resumeUrl || "Not uploaded"],
        ]
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:rgba(241,245,249,0.35);font-size:12px;width:160px;vertical-align:top;text-transform:uppercase;letter-spacing:0.1em">${label}</td>
            <td style="padding:8px 0;color:#f1f5f9;font-size:13px;word-break:break-all">${value}</td>
          </tr>`
          )
          .join("")}
      </table>

      ${
        data.bestProject
          ? `<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06)">
              <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(241,245,249,0.25);margin:0 0 8px">Best Project</p>
              <p style="font-size:13px;color:rgba(241,245,249,0.7);line-height:1.65;margin:0">${data.bestProject}</p>
            </div>`
          : ""
      }
      ${
        data.motivation
          ? `<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06)">
              <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(241,245,249,0.25);margin:0 0 8px">Motivation</p>
              <p style="font-size:13px;color:rgba(241,245,249,0.7);line-height:1.65;margin:0">${data.motivation}</p>
            </div>`
          : ""
      }

      <p style="margin-top:24px;color:rgba(241,245,249,0.2);font-size:11px">Orvantia AI · Admin Notification</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, college, branch, year,
      linkedin, github, portfolio, resumeUrl,
      role, skills,
      bestProject, projectLinks, builtAgent, agentDescription,
      productIdea, technicalChallenge,
      motivation, autonomousAIInterest,
      availabilityHours, startDate,
    } = body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !college?.trim() || !role?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await adminDb.collection("applications").add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || "").trim(),
      college: (college || "").trim(),
      branch: (branch || "").trim(),
      year: (year || "").trim(),
      linkedin: (linkedin || "").trim(),
      github: (github || "").trim(),
      portfolio: (portfolio || "").trim(),
      resumeUrl: resumeUrl || "",
      role: role || "",
      skills: skills || [],
      bestProject: (bestProject || "").trim(),
      projectLinks: (projectLinks || "").trim(),
      builtAgent: builtAgent || "no",
      agentDescription: (agentDescription || "").trim(),
      productIdea: (productIdea || "").trim(),
      technicalChallenge: (technicalChallenge || "").trim(),
      motivation: (motivation || "").trim(),
      autonomousAIInterest: (autonomousAIInterest || "").trim(),
      availabilityHours: (availabilityHours || "").trim(),
      startDate: (startDate || "").trim(),
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const from = process.env.SMTP_FROM || `"Orvantia AI" <${process.env.SMTP_USER}>`;

      await Promise.all([
        transporter.sendMail({
          from,
          to: email.trim().toLowerCase(),
          subject: "Application Received — Orvantia AI",
          html: buildConfirmationEmail(name.trim()),
        }),
        process.env.ADMIN_EMAIL &&
          transporter.sendMail({
            from,
            to: process.env.ADMIN_EMAIL,
            subject: `New Builder Application: ${name.trim()} — ${role}`,
            html: buildAdminNotificationEmail(body),
          }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[apply]", err);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
