"use client";
import Link from "next/link";
import { Bottle, Icon, ICONS } from "./shared";

export type TrackingStep = { label: string; time: string; done: boolean; active?: boolean; icon: typeof ICONS.check };
export type TrackingItem = { flavor: "beer" | "shot" | "ale" | "unpast"; name: string };

export function OrderTracking({ orderId, status, items, eta, customerEmail }: {
  orderId?: string;
  status?: "received" | "brewing" | "packed" | "shipped" | "delivered";
  items?: TrackingItem[];
  eta?: string;
  customerEmail?: string;
}) {
  const safeStatus = status ?? "shipped";
  const order = (
    [
      { key: "received", label: "Order received", time: "Confirmed",         icon: ICONS.check },
      { key: "brewing",  label: "Brewed & bottled", time: "Within 24h",       icon: ICONS.flame },
      { key: "packed",   label: "Packed at warehouse", time: "Bangkok depot", icon: ICONS.box },
      { key: "shipped",  label: "Out for delivery", time: "Kerry Express",   icon: ICONS.truck },
      { key: "delivered",label: "Delivered", time: eta ?? "Soon",             icon: ICONS.check },
    ] as const
  );
  const idx = order.findIndex(s => s.key === safeStatus);
  const steps: TrackingStep[] = order.map((s, i) => ({
    label: s.label, time: s.time, icon: s.icon,
    done: i < idx, active: i === idx,
  }));
  steps[steps.length - 1].done = safeStatus === "delivered";

  const display = items ?? [{f:"beer" as const, n:"Ginger Beer 6-Pack"},{f:"ale" as const, n:"Ginger Ale Single"},{f:"shot" as const, n:"Ginger Shot Single"}].map(x => ({ flavor: x.f, name: x.n }));

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
              Your ginger is <span style={{ fontStyle: "italic", color: "#C8893C" }}>on its way.</span>
            </h1>
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.65)", margin: "10px 0 0" }}>
              {eta ? `Arriving ${eta}` : "We'll email you when it ships"}{customerEmail ? ` · ${customerEmail}` : ""}
            </p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(44,24,16,0.04)" }}>
          <div style={{ height: 200, borderRadius: 14, background: "linear-gradient(145deg, #F5E6D3, #E8D5BC)", marginBottom: 32, position: "relative", overflow: "hidden" }}>
            <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
              <path d="M 40 160 Q 200 80 400 120 T 760 40" stroke="#C8893C" strokeWidth="3" strokeDasharray="6 6" fill="none"/>
              <circle cx="40" cy="160" r="10" fill="#4A7C3F"/>
              <circle cx="760" cy="40" r="10" fill="#C8893C" stroke="#fff" strokeWidth="3"/>
              <circle cx="500" cy="95" r="14" fill="#C8893C">
                <animate attributeName="r" values="14;18;14" dur="2s" repeatCount="indefinite"/>
              </circle>
              <circle cx="500" cy="95" r="28" fill="rgba(200,137,60,0.3)">
                <animate attributeName="r" values="20;40;20" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite"/>
              </circle>
            </svg>
            <div style={{ position: "absolute", top: 16, left: 16, padding: "8px 14px", background: "rgba(253,246,236,0.95)", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", fontSize: 11, fontWeight: 700, color: "#2C1810" }}>
              Bangkok warehouse
            </div>
            <div style={{ position: "absolute", bottom: 16, right: 16, padding: "8px 14px", background: "rgba(253,246,236,0.95)", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", fontSize: 11, fontWeight: 700, color: "#2C1810" }}>
              📍 Your door
            </div>
          </div>

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
                <div style={{ flex: 1, paddingTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 17, fontWeight: 600, color: s.done || s.active ? "#2C1810" : "rgba(44,24,16,0.5)" }}>
                      {s.label}
                      {s.active && <span style={{ marginLeft: 10, padding: "3px 8px", background: "#C8893C", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", borderRadius: 9999, fontFamily: "var(--gb-font-sans)", verticalAlign: "middle" }}>NOW</span>}
                    </div>
                    <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)" }}>{s.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
            <div style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.5)", marginBottom: 16, fontFamily: "var(--gb-font-sans)" }}>In the box</div>
            <div className="gb-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
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
        </div>
      </div>
    </div>
  );
}
