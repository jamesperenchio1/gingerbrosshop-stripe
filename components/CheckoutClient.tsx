"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottleImage, Icon, ICONS } from "./shared";
import { useCart } from "@/lib/cart";
import { PRODUCTS, type FlavorId } from "@/lib/products";

export function CheckoutClient() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [addr1, setAddr1] = useState("");
  const [city, setCity] = useState("Bangkok");
  const [zip, setZip] = useState("");
  const [shipMethod, setShipMethod] = useState<"std" | "next">("std");
  const [method, setMethod] = useState<"stripe" | "cod">("stripe");

  const shipping = method === "cod" ? 20 : (shipMethod === "next" ? 120 : (subtotal >= 500 ? 0 : 60));
  const total = subtotal + shipping;
  const codEligible = /^10\d{3}$/.test(zip.trim());

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginBottom: 6, display: "block" };
  const input: React.CSSProperties = { width: "100%", padding: "14px 16px", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 14, background: "#fff", outline: "none", color: "#2C1810" };

  const steps = [{ n: 1, k: "Contact" }, { n: 2, k: "Shipping" }, { n: 3, k: "Payment" }];

  const placeOrder = async () => {
    setBusy(true); setErr(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id, flavor: i.flavor, title: i.title, variant: i.variant,
            priceId: i.priceId, bundlePicks: i.bundlePicks, price: i.price, qty: i.qty, sub: !!i.sub,
          })),
          customer: { email, first, last, phone },
          shipping: { addr1, city, zip, method: shipMethod },
          method,
        }),
      });
      const data: { url?: string; orderId?: string; error?: string } = await res.json();
      if (!res.ok) {
        setErr(data.error || "Checkout failed");
        setBusy(false);
        return;
      }
      if (method === "cod" && data.orderId) {
        clear();
        router.push(`/tracking/${data.orderId}`);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setErr("Unexpected response from server");
      setBusy(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Network error");
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 32, color: "#2C1810" }}>Your cart is empty</h2>
          <p style={{ fontFamily: "var(--gb-font-sans)", color: "rgba(44,24,16,0.6)" }}>Add a brew to get started.</p>
          <button onClick={() => router.push("/")} className="gb-btn gb-btn--primary" style={{ marginTop: 16 }}>Shop the range</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", paddingBottom: 60 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(44,24,16,0.08)", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: 0, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.7)" }}>
          <Icon d={ICONS.arrowLeft} size={14}/> Back to shop
        </button>
        <div style={{ fontFamily: "var(--gb-font-display)", fontWeight: 700, fontSize: 22, color: "#2C1810" }}>
          Ginger<span style={{ color: "#C8893C" }}>bros</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.6)" }}>
          <Icon d={ICONS.shield} size={14} stroke={2}/> Secure checkout
        </div>
      </div>

      <div className="gb-grid-2 gb-pad-40" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 40px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48 }}>
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step >= s.n ? "#2C1810" : "#F5E6D3",
                  color: step >= s.n ? "#FDF6EC" : "rgba(44,24,16,0.5)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--gb-font-sans)", fontSize: 12, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {step > s.n ? <Icon d={ICONS.check} size={14} stroke={2.5}/> : s.n}
                </div>
                <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: step === s.n ? 700 : 500, color: step >= s.n ? "#2C1810" : "rgba(44,24,16,0.5)" }}>{s.k}</div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step > s.n ? "#2C1810" : "rgba(44,24,16,0.1)" }}/>}
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            {step === 1 && (
              <>
                <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#2C1810", margin: "0 0 6px" }}>Contact</h2>
                <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.6)", margin: "0 0 22px" }}>We&apos;ll email your order confirmation and tracking.</p>
                <label style={label}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" style={{ ...input, marginBottom: 16 }}/>
                <button onClick={() => setStep(2)} disabled={!email.includes("@")} className="gb-btn gb-btn--primary" style={{ width: "100%", justifyContent: "center", opacity: email.includes("@") ? 1 : 0.5, cursor: email.includes("@") ? "pointer" : "not-allowed" }}>
                  Continue to shipping <Icon d={ICONS.arrow} size={16}/>
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#2C1810", margin: "0 0 6px" }}>Shipping address</h2>
                <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.6)", margin: "0 0 22px" }}>Bangkok next-day · Thailand-wide 3–5 days.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={label}>First name</label><input value={first} onChange={e => setFirst(e.target.value)} style={input}/></div>
                  <div><label style={label}>Last name</label><input value={last} onChange={e => setLast(e.target.value)} style={input}/></div>
                </div>
                <label style={label}>Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+66 ..." style={{ ...input, marginBottom: 12 }}/>
                <label style={label}>Address</label>
                <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder="Street, unit, floor" style={{ ...input, marginBottom: 12 }}/>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12, marginBottom: 24 }}>
                  <div><label style={label}>City</label><input value={city} onChange={e => setCity(e.target.value)} style={input}/></div>
                  <div><label style={label}>Postcode</label><input value={zip} onChange={e => setZip(e.target.value)} style={input}/></div>
                </div>

                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginBottom: 10 }}>Delivery speed</div>
                <div style={{ display: "grid", gap: 10, marginBottom: 24 }}>
                  {([
                    { id: "std" as const, label: "Standard · Kerry Express", sub: "3–5 business days", price: subtotal >= 500 ? "FREE" : "฿60" },
                    { id: "next" as const, label: "Bangkok next-day", sub: "Order before 2pm", price: "฿120" },
                  ]).map(o => (
                    <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: `2px solid ${shipMethod === o.id ? "#2C1810" : "rgba(44,24,16,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "var(--gb-font-sans)" }}>
                      <input type="radio" name="ship" checked={shipMethod === o.id} onChange={() => setShipMethod(o.id)} style={{ accentColor: "#C8893C" }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C1810" }}>{o.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>{o.sub}</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: o.price === "FREE" ? "#4A7C3F" : "#2C1810" }}>{o.price}</div>
                    </label>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} className="gb-btn gb-btn--ghost" style={{ flex: 1, justifyContent: "center" }}>Back</button>
                  <button onClick={() => setStep(3)} disabled={!first || !addr1 || !zip} className="gb-btn gb-btn--primary" style={{ flex: 2, justifyContent: "center", opacity: first && addr1 && zip ? 1 : 0.5 }}>
                    Continue to payment <Icon d={ICONS.arrow} size={16}/>
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 26, fontWeight: 700, color: "#2C1810", margin: "0 0 6px" }}>Payment</h2>
                <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.6)", margin: "0 0 22px" }}>You&apos;ll be redirected to our secure Stripe-hosted page where you can pay by card, PromptPay QR, Apple Pay, or Google Pay.</p>

                <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
                  {([
                    { id: "stripe" as const, label: "Card / PromptPay / Apple Pay / Google Pay", sub: "Secure Stripe-hosted checkout", icon: ICONS.shield },
                    { id: "cod" as const, label: "Cash on delivery", sub: codEligible ? "Bangkok metro · ฿20 fee" : "Bangkok metro only (postcode 10xxx)", icon: ICONS.truck, disabled: !codEligible },
                  ]).map(o => (
                    <label key={o.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: `2px solid ${method === o.id ? "#2C1810" : "rgba(44,24,16,0.1)"}`, borderRadius: 12, cursor: o.disabled ? "not-allowed" : "pointer", fontFamily: "var(--gb-font-sans)", background: method === o.id ? "#FDF6EC" : "#fff", opacity: o.disabled ? 0.5 : 1 }}>
                      <input type="radio" name="pay" checked={method === o.id} onChange={() => !o.disabled && setMethod(o.id)} disabled={o.disabled} style={{ accentColor: "#C8893C" }}/>
                      <span style={{ color: "#C8893C" }}><Icon d={o.icon} size={18} stroke={2}/></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#2C1810" }}>{o.label}</div>
                        <div style={{ fontSize: 12, color: "rgba(44,24,16,0.55)", marginTop: 2 }}>{o.sub}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {err && <div style={{ padding: 12, background: "#fee", color: "#8B3A1A", borderRadius: 10, marginBottom: 16, fontFamily: "var(--gb-font-sans)", fontSize: 13 }}>{err}</div>}

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(2)} className="gb-btn gb-btn--ghost" style={{ flex: 1, justifyContent: "center" }} disabled={busy}>Back</button>
                  <button onClick={placeOrder} disabled={busy} className="gb-btn gb-btn--primary" style={{ flex: 2, justifyContent: "center", opacity: busy ? 0.6 : 1 }}>
                    {busy ? "Working..." : (method === "cod" ? `Place COD order · ฿${total}` : `Continue to Stripe · ฿${total}`)} <Icon d={ICONS.arrow} size={16}/>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <aside>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 16 }}>Order summary</div>

            <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 16 }}>
              {items.map(i => {
                const heroSrc = PRODUCTS.find(p => p.id === (i.flavor as FlavorId))?.heroImage;
                return (
                <div key={i.uid} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(44,24,16,0.06)", alignItems: "center" }}>
                  <div style={{ width: 60, height: 72, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 4 }}>
                    <BottleImage flavor={i.flavor} size={64} src={heroSrc}/>
                    <span style={{ position: "absolute", top: -6, right: -6, background: "#2C1810", color: "#FDF6EC", fontFamily: "var(--gb-font-sans)", fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{i.qty}</span>
                  </div>
                  <div style={{ fontFamily: "var(--gb-font-sans)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810", fontFamily: "var(--gb-font-display)" }}>{i.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.12em" }}>{i.variant}{i.sub ? " · Subscription" : ""}</div>
                  </div>
                  <div style={{ fontFamily: "var(--gb-font-sans)", fontWeight: 700, color: "#C8893C", fontSize: 13 }}>฿{i.price * i.qty}</div>
                </div>
              );
              })}
            </div>

            <div style={{ borderTop: "1px solid rgba(44,24,16,0.08)", paddingTop: 14, fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 6 }}>
                <span>Subtotal</span><span>฿{subtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 6 }}>
                <span>{method === "cod" ? "COD fee" : "Shipping"}</span><span>{shipping === 0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>Free</span> : `฿${shipping}`}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
                <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>Total</span>
                <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 26, fontWeight: 700, color: "#C8893C" }}>฿{total}</span>
              </div>
            </div>
            <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 10 }}>
              Promo codes (e.g. <strong>WELCOME10</strong>) are entered on the Stripe checkout page.
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "16px 20px", background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.7)", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#4A7C3F" }}><Icon d={ICONS.shield} size={14} stroke={2}/></span> 256-bit TLS · PCI-compliant</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#C8893C" }}><Icon d={ICONS.truck} size={14} stroke={2}/></span> Free over ฿500 · Broken bottle guarantee</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#8B3A1A" }}><Icon d={ICONS.repeat} size={14} stroke={2}/></span> 30-day hassle-free returns</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
