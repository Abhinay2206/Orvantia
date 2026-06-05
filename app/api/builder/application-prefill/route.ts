import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = authHeader.slice(7);
  let email: string;
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    email = decoded.email ?? "";
    if (!email) return NextResponse.json({ data: null });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const snap = await adminDb
    .collection("applications")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ data: null });

  const d = snap.docs[0].data();
  return NextResponse.json({
    data: {
      name: d.name ?? "",
      phone: d.phone ?? "",
      college: d.college ?? "",
      branch: d.branch ?? "",
      year: d.year ?? "",
      github: d.github ?? "",
      linkedin: d.linkedin ?? "",
      portfolio: d.portfolio ?? "",
      skills: d.skills ?? [],
      role: d.role ?? "",
    },
  });
}
