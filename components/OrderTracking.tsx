"use client";
import Link from "next/link";
import { Bottle, Icon, ICONS } from "./shared";

export type TrackingStep = { label: string; time: string; done: boolean; active?: boolean; icon: typeof ICONS.check };
export type TrackingItem = { flavor: "beer"; name: string };

export function OrderTracking({ orderId, status, items, customerEmail }: {
  orderId?: string;
  status?: "received" | "brewing" | "packed" | "shipped" | "delivered";
  items?: TrackingItem[];
  customerEmail?: string;
}) {
  // No status from KV → don't fake one. The component handles a missing-status
  // state explicitly (no timeline, just the "we don't have this on file" hint).
  const knownStatus = status;
  const order = (
    [
      { key: "received",  label: "Order received",  icon: ICONS.check },
      { key: "brewing",   label: "Bottling",        icon: ICONS.flame },
      { key: "packed",    label: "Packed",          icon: ICONS.box },
      { key: "shipped",   label: "Shipped",         icon: ICONS.truck },
      { key: "delivered", label: "Delivered",       icon: ICONS.check },
    ] as const
  );
  const idx = knownStatus ? order.findIndex(s => s.key === knownStatus) : -1;
  const steps: TrackingStep[] = order.map((s, i) => ({
    label: s.label, time: "", icon: s.icon,
    done: idx >= 0 && i < idx, active: idx >= 0 && i === idx,
  }));
  if (idx >= 0) steps[steps.length - 1].done = knownStatus === "delivered";

  // Only render real items from KV/Stripe. No hardcoded fallback.
  const display = items ?? [];

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <Link href="/" style={{ background:"none", border:0, color:"rgba(44,24,16,0.6)", fontFamily:"var(--gb-font-sans)", fontSize:13, marginBottom:24, display:"flex", gap:6, alignItems:"center" }}>
          <Icon d={ICONS.arrowLeft} size={14}/> Back to home
        </Link>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ color: "#C8893C", fontFamily: "var(--gb-font-sans)", fontWeight: 700, letterSpacing: "0.24em", textTransform: "uppercase", fontSize: 11, margin: "0 0 10px" }}>
              {orderId ? `Order #${orderId}` : "Order tracking"}
            </p>
            <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", margin: 0, letterSpacing: "-0.02em" }}>
              {knownStatus === "delivered"
                ? <>Order <span style={{ fontStyle: "italic", color: "#C8893C" }}>delivered.</span></>
                : knownStatus === "shipped"
                  ? <>Out for <span style={{ fontStyle: "italic", color: "#C8893C" }}>delivery.</span></>
                  : knownStatus
                    ? <>Your ginger is <span style={{ fontStyle: "italic", color: "#C8893C" }}>on its way.</span></>
                    : <>Order <span style={{ fontStyle: "italic", color: "#C8893C" }}>lookup.</span></>}
            </h1>
            {knownStatus && (
              <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.65)", margin: "10px 0 0" }}>
                We&apos;ll email you when the status changes{customerEmail ? ` · ${customerEmail}` : ""}
              </p>
            )}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(44,24,16,0.04)" }}>
          {!knownStatus ? (
            <div style={{ padding: "24px 4px", textAlign: "center", fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810", marginBottom: 8 }}>
                We don&apos;t have this order on file
              </div>
              <p style={{ fontSize: 14, color: "rgba(44,24,16,0.65)", lineHeight: 1.6, margin: "0 0 18px" }}>
                Double-check the order number — it&apos;s the GB-… code from your confirmation email. If you&apos;re sure it&apos;s right, reach out and we&apos;ll dig into it.
              </p>
              <Link href="/contact" className="gb-btn gb-btn--primary" style={{ fontSize: 13 }}>Contact support</Link>
            </div>
          ) : (
            <div>
              {steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, position: "relative", paddingBottom: i === steps.length - 1 ? 0 : 28 }}>
                  {i < steps.length - 1 && (
                    <div style={{ position: "absolute", left: 19, top: 40, bottom: 0, width: 2, background: s.done && steps[i+1].done ? "#4A7C3F" : s.done ? "linear-gradient(180deg, #4A7C3F, rgba(44,24,16,0.1))" : "rgba(44,24,16,0.1)" }}/>
                  )}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: s.active ? "#C8893C" : s.done ? "#4A7C3F" : "#F5E6D3",
                    color: s.done || s.active ? "#fff" : "rgba(44,24,16,0.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: s.active ? "0 0 0 6px rgba(200,137,60,0.2)" : "none",
                  }}>
                    <Icon d={s.icon} size={18} stroke={2}/>
                  </div>
                  <div style={{ flex: 1, paddingTop: 10 }}>
                    <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 17, fontWeight: 600, color: s.done || s.active ? "#2C1810" : "rgba(44,24,16,0.5)" }}>
                      {s.label}
                      {s.active && <span style={{ marginLeft: 10, padding: "3px 8px", background: "#C8893C", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", verticalAlign: "middle" }}>NOW</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {display.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
              <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.5)", marginBottom: 16, fontFamily: "var(--gb-font-sans)" }}>In the box</div>
              <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
                {display.map((x, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "#FDF6EC", borderRadius: 12 }}>
                    <div style={{ width: 44, height: 56, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bottle flavor={x.flavor} size={44}/>
                    </div>
                    <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 600, color: "#2C1810" }}>{x.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
