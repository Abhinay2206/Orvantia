import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import nodemailer from "nodemailer";
import { checkRateLimit, getIP, rateLimitHeaders } from "@/lib/rate-limit";

export const runtime = "nodejs";

function buildAdminEmail(data: Record<string, unknown>) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#04040a;color:#f1f5f9;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
      <h2 style="color:#818cf8;margin:0 0 24px">New Lead — Orvantia AI</h2>
      <table style="width:100%;border-collapse:collapse">
        ${[
          ["Name", data.name],
          ["Email", data.email],
          ["Company", data.company],
          ["Phone", data.phone || "—"],
          ["Inquiry Type", data.type],
          ["Products", Array.isArray(data.products) ? (data.products as string[]).join(", ") || "—" : "—"],
        ]
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:rgba(241,245,249,0.4);font-size:13px;width:140px">${label}</td>
            <td style="padding:8px 0;color:#f1f5f9;font-size:13px">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08)">
        <p style="color:rgba(241,245,249,0.4);font-size:13px;margin:0 0 8px">Message</p>
        <p style="color:#f1f5f9;font-size:14px;line-height:1.6;margin:0">${data.message}</p>
      </div>
      <p style="margin-top:32px;color:rgba(241,245,249,0.25);font-size:11px">Orvantia AI · Admin Notification</p>
    </div>
  `;
}

function buildConfirmationEmail(name: string, type: string) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#04040a;color:#f1f5f9;padding:32px;border-radius:12px;border:1px solid rgba(255,255,255,0.08)">
      <h2 style="color:#818cf8;margin:0 0 16px">We got your message, ${name}.</h2>
      <p style="color:rgba(241,245,249,0.55);font-size:15px;line-height:1.7;margin:0 0 24px">
        Thanks for reaching out about <strong style="color:#f1f5f9">${type}</strong>. Our team will review your inquiry and get back to you within 1–2 business days.
      </p>
      <p style="color:rgba(241,245,249,0.55);font-size:15px;line-height:1.7;margin:0">
        In the meantime, explore our products:<br>
        <a href="https://continuumos.vercel.app/" style="color:#a78bfa">Continuum OS</a> &nbsp;·&nbsp;
        <a href="https://www.enteraflux.tech/" style="color:#818cf8">EnteraFlux</a>
      </p>
      <p style="margin-top:40px;color:rgba(241,245,249,0.25);font-size:12px">— The Orvantia AI Team</p>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 lead submissions per IP per hour.
  const ip = getIP(req);
  const rl = checkRateLimit(ip, "lead", 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before submitting again." },
      { status: 429, headers: rateLimitHeaders(rl, 5) },
    );
  }

  try {
    const body = await req.json();
    const { name, email, company, phone, type, products, message } = body;

    if (!name?.trim() || !email?.trim() || !company?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Persist lead to Firestore
    await adminDb.collection("leads").add({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company.trim(),
      phone: (phone || "").trim(),
      type: type || "General Inquiry",
      products: products || [],
      message: message.trim(),
      status: "new",
      notes: "",
      createdAt: FieldValue.serverTimestamp(),
    });

    // Send emails only if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      const from = process.env.SMTP_FROM || `"Orvantia AI" <${process.env.SMTP_USER}>`;

      await Promise.all([
        // Admin notification
        process.env.ADMIN_EMAIL &&
          transporter.sendMail({
            from,
            to: process.env.ADMIN_EMAIL,
            subject: `New Lead: ${name} from ${company}`,
            html: buildAdminEmail({ name, email, company, phone, type, products, message }),
          }),
        // Confirmation to submitter
        transporter.sendMail({
          from,
          to: email,
          subject: "We received your message — Orvantia AI",
          html: buildConfirmationEmail(name, type),
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[submit-lead]", err);
    return NextResponse.json({ error: "Submission failed. Please try again." }, { status: 500 });
  }
}
