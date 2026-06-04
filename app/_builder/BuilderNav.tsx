"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

export default function BuilderNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, "builder_profiles", user.uid));
        if (snap.exists()) setName((snap.data().fullName as string)?.split(" ")[0] || "");
      }
    });
    return unsub;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace("/builders/login");
  };

  const links = [
    { href: "/tasks", label: "Tasks" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", height: 60,
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(4,4,10,0.88)", backdropFilter: "blur(20px)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/builders" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(241,245,249,0.75)", fontFamily: "var(--font-space), system-ui" }}>Orvantia</span>
        </a>
        <nav style={{ display: "flex", gap: 2 }}>
          {links.map((link) => (
            <a key={link.href} href={link.href} style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 11,
              letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none",
              background: isActive(link.href) ? "rgba(99,102,241,0.12)" : "transparent",
              border: isActive(link.href) ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
              color: isActive(link.href) ? "#818cf8" : "rgba(241,245,249,0.4)",
              transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.75)"; }}
              onMouseLeave={(e) => { if (!isActive(link.href)) (e.currentTarget as HTMLElement).style.color = "rgba(241,245,249,0.4)"; }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {name && <span style={{ fontSize: 12, color: "rgba(241,245,249,0.3)" }}>Hi, {name}</span>}
        <button onClick={handleSignOut} style={{ padding: "7px 16px", borderRadius: 100, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,245,249,0.4)", cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.35)"; e.currentTarget.style.color = "rgba(248,113,113,0.75)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(241,245,249,0.4)"; }}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
