import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const FROM = process.env.SMTP_FROM || `"Orvantia AI" <noreply@orvantia.ai>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://orvantia.vercel.app";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function invitationHtml(applicantName: string, invitationDate: string) {
  const builderPortal = `${APP_URL}/builders`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Invitation to Join the Orvantia Builder Program</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0f;padding:48px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

        <!-- Logo / Brand -->
        <tr><td style="padding-bottom:40px">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:7px;height:7px;border-radius:50%;background:#6366f1;vertical-align:middle"></td>
              <td style="padding-left:8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(241,245,249,0.28);vertical-align:middle">Orvantia AI</td>
            </tr>
          </table>
        </td></tr>

        <!-- Main card -->
        <tr><td style="background:#111118;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:40px 40px 36px">

          <!-- Subject line -->
          <p style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(99,102,241,0.7);margin:0 0 16px;font-weight:600">Builder Program Invitation</p>

          <h1 style="font-size:22px;font-weight:700;color:#f1f5f9;margin:0 0 24px;line-height:1.3;letter-spacing:-0.02em">You're invited to the<br>Orvantia Builder Program</h1>

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:28px"></div>

          <p style="font-size:15px;line-height:1.75;color:rgba(241,245,249,0.6);margin:0 0 6px">Hello <strong style="color:#f1f5f9;font-weight:600">${applicantName}</strong>,</p>

          <p style="font-size:15px;line-height:1.75;color:rgba(241,245,249,0.6);margin:0 0 6px">Thank you for your interest in Orvantia AI.</p>

          <p style="font-size:15px;line-height:1.75;color:rgba(241,245,249,0.6);margin:0 0 28px">After reviewing your application, we'd like to invite you to our <span style="color:#a78bfa;font-weight:500">Builder Program</span> – a practical evaluation through real-world execution, not traditional interviews.</p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:36px">
            <tr>
              <td style="background:#6366f1;border-radius:8px">
                <a href="${builderPortal}" style="display:inline-block;padding:13px 28px;color:#fff;text-decoration:none;font-size:14px;font-weight:600;letter-spacing:0.02em">Access Builder Portal →</a>
              </td>
            </tr>
          </table>

          <p style="font-size:12px;color:rgba(241,245,249,0.25);margin:0 0 36px">${builderPortal}</p>

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.06);margin-bottom:28px"></div>

          <!-- Steps -->
          <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(241,245,249,0.28);margin:0 0 20px;font-weight:500">How it works</p>

          <table cellpadding="0" cellspacing="0" width="100%">
            ${[
              ["Create your account", "Use the same email address from your application"],
              ["Choose a challenge", "Browse available tasks and pick one that fits your skills"],
              ["Build your solution", "Work independently – no time pressure, just real execution"],
              ["Submit your work", "Share your GitHub repo, deployment link, and a short writeup"],
              ["Technical discussion", "Walk our team through your thinking and architecture decisions"],
            ].map(([title, desc], i) => `
            <tr>
              <td style="padding-bottom:${i === 4 ? "0" : "18px"};vertical-align:top">
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="width:28px;vertical-align:top;padding-top:1px">
                      <span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:rgba(99,102,241,0.12);text-align:center;line-height:20px;font-size:10px;font-weight:700;color:#818cf8">${i + 1}</span>
                    </td>
                    <td style="padding-left:4px">
                      <p style="font-size:14px;font-weight:600;color:rgba(241,245,249,0.85);margin:0 0 2px">${title}</p>
                      <p style="font-size:13px;color:rgba(241,245,249,0.38);margin:0;line-height:1.5">${desc}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`).join("")}
          </table>

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.06);margin:28px 0"></div>

          <!-- What you receive -->
          <p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(241,245,249,0.28);margin:0 0 16px;font-weight:500">After your review</p>

          <table cellpadding="0" cellspacing="0">
            ${["Technical score and detailed feedback", "Contributor status update", "Opportunity to build on Enteraflux, Continuum, and ClinicalAgents"].map((item) => `
            <tr>
              <td style="padding-bottom:10px;vertical-align:top">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:16px;vertical-align:top;padding-top:3px">
                      <div style="width:4px;height:4px;border-radius:50%;background:rgba(99,102,241,0.5)"></div>
                    </td>
                    <td style="padding-left:8px">
                      <p style="font-size:13px;color:rgba(241,245,249,0.5);margin:0;line-height:1.5">${item}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`).join("")}
          </table>

          <!-- Divider -->
          <div style="height:1px;background:rgba(255,255,255,0.06);margin:28px 0"></div>

          <p style="font-size:14px;line-height:1.7;color:rgba(241,245,249,0.5);margin:0">We look forward to seeing what you build.</p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 0 0">
          <table cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <p style="font-size:13px;font-weight:600;color:rgba(241,245,249,0.55);margin:0 0 2px">Orvantia AI</p>
                <p style="font-size:11px;color:rgba(241,245,249,0.2);margin:0">Building Autonomous AI Products &nbsp;·&nbsp; ${invitationDate}</p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: { applicationIds?: string[]; forceResend?: boolean; adminEmail?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { applicationIds, forceResend = false, adminEmail } = body;

  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    return NextResponse.json({ ok: false, error: "No application IDs provided" }, { status: 400 });
  }

  if (applicationIds.length > 50) {
    return NextResponse.json({ ok: false, error: "Maximum 50 invitations per request" }, { status: 400 });
  }

  const transporter = getTransporter();
  const invitationDate = new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const now = new Date();

  const results: { id: string; email: string; name: string; status: "sent" | "skipped" | "error"; reason?: string }[] = [];

  for (const appId of applicationIds) {
    try {
      const appSnap = await adminDb.collection("applications").doc(appId).get();
      if (!appSnap.exists) {
        results.push({ id: appId, email: "", name: "", status: "error", reason: "Application not found" });
        continue;
      }

      const appData = appSnap.data()!;
      const applicantName = appData.name as string;
      const applicantEmail = appData.email as string;

      if (!applicantEmail) {
        results.push({ id: appId, email: "", name: applicantName, status: "error", reason: "No email on record" });
        continue;
      }

      // Check for existing invitation unless forceResend
      if (!forceResend) {
        const existingSnap = await adminDb.collection("builder_invitations")
          .where("applicationId", "==", appId)
          .limit(1)
          .get();

        if (!existingSnap.empty) {
          results.push({ id: appId, email: applicantEmail, name: applicantName, status: "skipped", reason: "Already invited" });
          continue;
        }
      }

      // Send invitation email
      await transporter.sendMail({
        from: FROM,
        to: applicantEmail,
        subject: "Invitation to Join the Orvantia Builder Program",
        html: invitationHtml(applicantName, invitationDate),
      });

      // Create or update builder_invitations document
      const invitationData = {
        applicationId: appId,
        applicantName,
        email: applicantEmail,
        invitedAt: now,
        invitedBy: adminEmail || "admin",
        invitationStatus: "invited",
        builderAccountCreated: false,
        acceptedTask: false,
        submittedTask: false,
        reviewed: false,
      };

      if (forceResend) {
        const existingSnap = await adminDb.collection("builder_invitations")
          .where("applicationId", "==", appId)
          .limit(1)
          .get();

        if (!existingSnap.empty) {
          await existingSnap.docs[0].ref.update({
            invitedAt: now,
            invitedBy: adminEmail || "admin",
            invitationStatus: "resent",
          });
        } else {
          await adminDb.collection("builder_invitations").add(invitationData);
        }
      } else {
        await adminDb.collection("builder_invitations").add(invitationData);
      }

      // Update application status and record invitation timestamp
      await adminDb.collection("applications").doc(appId).update({
        status: "invited",
        invitedAt: now,
        invitationStatus: forceResend ? "resent" : "invited",
        invitedBy: adminEmail || "admin",
        updatedAt: now,
      });

      results.push({ id: appId, email: applicantEmail, name: applicantName, status: "sent" });
    } catch (err) {
      console.error(`[invite-builders] error for ${appId}:`, err);
      results.push({ id: appId, email: "", name: "", status: "error", reason: "Internal error" });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const skipped = results.filter((r) => r.status === "skipped").length;
  const errors = results.filter((r) => r.status === "error").length;

  return NextResponse.json({ ok: true, sent, skipped, errors, results });
}
