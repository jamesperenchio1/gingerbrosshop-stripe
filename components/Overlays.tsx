"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BottleImage, Icon, ICONS } from "./shared";
import { PRODUCTS } from "@/lib/products";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const matches = q ? PRODUCTS.filter(p => (p.title + " " + p.blurb).toLowerCase().includes(q.toLowerCase())) : PRODUCTS.slice(0, 3);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.5)", backdropFilter: "blur(4px)", zIndex: 200 }}/>
      <div style={{ position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", width: "min(640px, calc(100% - 40px))", background: "#fff", borderRadius: 20, zIndex: 201, boxShadow: "0 24px 60px rgba(44,24,16,0.25)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 20px", borderBottom: "1px solid rgba(44,24,16,0.08)" }}>
          <span style={{ color: "rgba(44,24,16,0.5)" }}><Icon d={ICONS.search} size={18}/></span>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search drinks, recipes, FAQs..." style={{ flex: 1, border: 0, outline: "none", fontFamily: "var(--gb-font-sans)", fontSize: 16, background: "transparent", color: "#2C1810" }}/>
          <button onClick={onClose} style={{ background: "#FDF6EC", border: 0, borderRadius: 9999, padding: "4px 10px", fontFamily: "var(--gb-font-sans)", fontSize: 11, fontWeight: 600, cursor: "pointer", color: "rgba(44,24,16,0.6)" }}>Esc</button>
        </div>
        <div style={{ padding: "12px 20px 20px", maxHeight: 420, overflowY: "auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.5)", fontFamily: "var(--gb-font-sans)", margin: "12px 0 10px" }}>
            {q ? `${matches.length} results` : "Popular drinks"}
          </div>
          {matches.map(p => (
            <Link key={p.id} href={`/shop/${p.id}`} onClick={onClose} style={{ width: "100%", display: "flex", gap: 14, alignItems: "center", padding: 12, borderRadius: 12, fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ width: 44, height: 54, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 3 }}>
                <BottleImage flavor={p.flavor} size={48} src={p.heroImage}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, fontWeight: 600, color: "#2C1810" }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "rgba(44,24,16,0.6)", marginTop: 2 }}>{p.subtitle} · ฿{p.single}</div>
              </div>
              <Icon d={ICONS.arrow} size={14}/>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function AccountOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(44,24,16,0.5)", backdropFilter: "blur(4px)", zIndex: 200 }}/>
      <div style={{ position: "fixed", top: 60, right: 40, width: 340, background: "#fff", borderRadius: 20, zIndex: 201, boxShadow: "0 24px 60px rgba(44,24,16,0.25)", padding: 24, fontFamily: "var(--gb-font-sans)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>Your account</div>
          <button onClick={onClose} style={{ background: "none", border: 0, cursor: "pointer" }}><Icon d={ICONS.close} size={18}/></button>
        </div>
        <div style={{ padding: 16, background: "#FDF6EC", borderRadius: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 8 }}>
            Guest checkout for now. Track your order using the link in your confirmation email.
          </div>
          <Link href="/tracking" onClick={onClose} style={{ width: "100%", padding: "10px 14px", background: "#2C1810", color: "#FDF6EC", border: 0, borderRadius: 9999, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
            Track an order <Icon d={ICONS.arrow} size={14}/>
          </Link>
        </div>
        <div style={{ fontSize: 12, color: "rgba(44,24,16,0.55)", lineHeight: 1.5 }}>
          Subscribers can manage their plan from the &ldquo;Manage subscription&rdquo; link in any subscription email — that opens our Stripe customer portal.
        </div>
      </div>
    </>
  );
}
