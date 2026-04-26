"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, ICONS } from "./shared";

export function TrackLookup() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const id = orderId.trim().toUpperCase();
    const em = email.trim().toLowerCase();
    if (!id || !em.includes("@")) { setErr("Enter your order number and email."); setBusy(false); return; }
    try {
      const res = await fetch(`/api/track?orderId=${encodeURIComponent(id)}&email=${encodeURIComponent(em)}`);
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error || "We couldn't find that order.");
        setBusy(false);
        return;
      }
      router.push(`/tracking/${data.orderId}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Network error");
      setBusy(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", border: "1px solid rgba(44,24,16,0.15)",
    borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 14, background: "#fff",
    outline: "none", color: "#2C1810",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
    color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginBottom: 6, display: "block",
  };

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "56px 24px 80px" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 10px" }}>Track an order</p>
        <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Where&apos;s my <span style={{ fontStyle: "italic", color: "#C8893C" }}>brew?</span>
        </h1>
        <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.7)", lineHeight: 1.6, margin: "0 0 28px" }}>
          Enter your order number (it starts with <code style={{ background: "rgba(44,24,16,0.08)", padding: "1px 6px", borderRadius: 4 }}>GB-</code>) and the email you used at checkout. We&apos;ll show you exactly where it is in our flow.
        </p>

        <form onSubmit={submit} style={{ background: "#fff", borderRadius: 16, padding: 24, display: "grid", gap: 14 }}>
          <div>
            <label style={labelStyle}>Order number</label>
            <input
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="GB-20260427-XXXXXX"
              autoComplete="off"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email used at checkout</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>
          {err && (
            <div style={{ padding: "10px 12px", background: "#fee", color: "#8B3A1A", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 13 }}>
              {err}
            </div>
          )}
          <button type="submit" disabled={busy} className="gb-btn gb-btn--primary" style={{ justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
            {busy ? "Looking it up..." : "Show me where it is"} <Icon d={ICONS.arrow} size={16}/>
          </button>
        </form>

        <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)", lineHeight: 1.55, margin: "16px 4px 0" }}>
          Can&apos;t find your order number? It&apos;s in the subject line of your <strong>Gingerbros order</strong> confirmation email. Still stuck? Reply to that email and we&apos;ll dig it up by hand.
        </p>
      </div>
    </div>
  );
}
