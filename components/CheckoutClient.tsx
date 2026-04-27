"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottleImage, Icon, ICONS, MixBottles } from "./shared";
import { useCart } from "@/lib/cart";
import { formatBundlePicks, PRODUCTS, type FlavorId } from "@/lib/products";

export function CheckoutClient() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"stripe" | "cod">("cod");

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [addr1, setAddr1] = useState("");
  const [city, setCity] = useState("Bangkok");
  const [zip, setZip] = useState("");

  const shippingPreview = method === "cod" ? (subtotal >= 500 ? 0 : 60) : (subtotal >= 500 ? 0 : 60);
  const total = subtotal + shippingPreview;

  const isSubscription = items.some(i => i.sub);
  const codDisabled = isSubscription;

  const stripeReady = email.includes("@") && items.length > 0;
  const codReady = stripeReady && first && last && phone && addr1 && zip.trim().length >= 4 && !codDisabled;

  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(44,24,16,0.6)", fontFamily: "var(--gb-font-sans)", marginBottom: 6, display: "block" };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "14px 16px", border: "1px solid rgba(44,24,16,0.15)", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 14, background: "#fff", outline: "none", color: "#2C1810" };

  const submit = async () => {
    setErr(null);
    if (method === "stripe" && !stripeReady) { setErr("Enter your email to continue."); return; }
    if (method === "cod" && !codReady) { setErr("Fill in name, phone, address, city, and postcode."); return; }
    setBusy(true);
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
          shipping: { addr1, city, zip, method: "std" },
          method,
        }),
      });
      const data: { url?: string; orderId?: string; error?: string } = await res.json();
      if (!res.ok) { setErr(data.error || "Checkout failed"); setBusy(false); return; }
      if (method === "cod" && data.orderId) {
        clear();
        router.push(`/tracking/${data.orderId}`);
        return;
      }
      if (data.url) { window.location.href = data.url; return; }
      setErr("Unexpected response from server"); setBusy(false);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Network error"); setBusy(false);
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

      <div className="gb-grid-2 gb-pad-40" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 40 }}>
        <div>
          <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 36, fontWeight: 700, color: "#2C1810", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Checkout</h1>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 14, color: "rgba(44,24,16,0.65)", margin: "0 0 28px" }}>
            Pay on delivery is set up below. Want to pay online instead? <button type="button" onClick={() => setMethod("stripe")} style={{ background: "none", border: 0, padding: 0, color: "#C8893C", fontWeight: 700, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit" }}>Switch to online checkout →</button>
          </p>

          {/* Email — needed for both paths */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <label style={labelStyle}>Email · order updates land here</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          {/* Payment method picker */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ ...labelStyle, marginBottom: 12 }}>Payment method</div>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: `2px solid ${method === "stripe" ? "#2C1810" : "rgba(44,24,16,0.1)"}`, borderRadius: 12, cursor: "pointer", fontFamily: "var(--gb-font-sans)", background: method === "stripe" ? "#FDF6EC" : "#fff" }}>
                <input type="radio" name="pay" checked={method === "stripe"} onChange={() => setMethod("stripe")} style={{ accentColor: "#C8893C" }}/>
                <span style={{ color: "#C8893C" }}><Icon d={ICONS.shield} size={20} stroke={2}/></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2C1810" }}>Pay online · card, PromptPay, Apple Pay, Google Pay</div>
                  <div style={{ fontSize: 12, color: "rgba(44,24,16,0.6)", marginTop: 2 }}>One click — Stripe&apos;s secure page collects address &amp; payment.</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#4A7C3F", letterSpacing: "0.16em", textTransform: "uppercase" }}>Recommended</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: `2px solid ${method === "cod" ? "#2C1810" : "rgba(44,24,16,0.1)"}`, borderRadius: 12, cursor: codDisabled ? "not-allowed" : "pointer", fontFamily: "var(--gb-font-sans)", background: method === "cod" ? "#FDF6EC" : "#fff", opacity: codDisabled ? 0.5 : 1 }}>
                <input type="radio" name="pay" checked={method === "cod"} onChange={() => !codDisabled && setMethod("cod")} disabled={codDisabled} style={{ accentColor: "#C8893C" }}/>
                <span style={{ color: "#C8893C" }}><Icon d={ICONS.truck} size={20} stroke={2}/></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#2C1810" }}>Pay on delivery</div>
                  <div style={{ fontSize: 12, color: "rgba(44,24,16,0.6)", marginTop: 2 }}>
                    {codDisabled ? "Subscriptions need an online payment." : "Hand cash to the driver. Available Thailand-wide via Kerry Express."}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* COD form (only when COD picked) */}
          {method === "cod" && !codDisabled && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ ...labelStyle, marginBottom: 12 }}>Delivery address</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div><label style={labelStyle}>First name</label><input value={first} onChange={e => setFirst(e.target.value)} autoComplete="given-name" style={inputStyle}/></div>
                <div><label style={labelStyle}>Last name</label><input value={last} onChange={e => setLast(e.target.value)} autoComplete="family-name" style={inputStyle}/></div>
              </div>
              <label style={labelStyle}>Phone (driver will call)</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+66 81 234 5678" autoComplete="tel" style={{ ...inputStyle, marginBottom: 12 }}/>
              <label style={labelStyle}>Street address</label>
              <input value={addr1} onChange={e => setAddr1(e.target.value)} placeholder="House no. / soi / unit" autoComplete="street-address" style={{ ...inputStyle, marginBottom: 12 }}/>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
                <div><label style={labelStyle}>City / district</label><input value={city} onChange={e => setCity(e.target.value)} style={inputStyle}/></div>
                <div>
                  <label style={labelStyle}>Postcode</label>
                  <input value={zip} onChange={e => setZip(e.target.value)} placeholder="10110" autoComplete="postal-code" style={inputStyle}/>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 12, color: "rgba(44,24,16,0.6)", lineHeight: 1.5 }}>
                COD orders ship via Kerry Express. The driver will call before they arrive. Have the exact amount in cash ready.
              </p>
            </div>
          )}

          {err && <div style={{ padding: 12, background: "#fee", color: "#8B3A1A", borderRadius: 10, marginBottom: 16, fontFamily: "var(--gb-font-sans)", fontSize: 13 }}>{err}</div>}

          <button
            onClick={submit}
            disabled={busy || (method === "stripe" ? !stripeReady : !codReady)}
            className="gb-btn gb-btn--primary"
            style={{
              width: "100%", justifyContent: "center", fontSize: 15, padding: "18px 28px",
              opacity: busy ? 0.6 : ((method === "stripe" ? stripeReady : codReady) ? 1 : 0.45),
              cursor: busy ? "wait" : "pointer",
            }}
          >
            {busy ? "Working..." : method === "cod" ? `Place COD order · ฿${total}` : `Continue to secure checkout · ฿${total}`}
            <Icon d={ICONS.arrow} size={16}/>
          </button>

          {method === "stripe" && (
            <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)", margin: "12px 4px 0", lineHeight: 1.5 }}>
              You&apos;ll land on Stripe&apos;s secure page next. Promo code field, shipping address, and payment all live there. Final total may include the chosen shipping option.
            </p>
          )}
        </div>

        <aside>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24 }}>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 16 }}>Order summary</div>

            <div style={{ maxHeight: 320, overflowY: "auto", marginBottom: 16 }}>
              {items.map(i => {
                const heroSrc = PRODUCTS.find(p => p.id === (i.flavor as FlavorId))?.heroImage;
                const isBundle = i.id === "bundle";
                return (
                  <div key={i.uid} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(44,24,16,0.06)", alignItems: "center" }}>
                    <div style={{ width: 60, height: 72, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 4 }}>
                      {isBundle ? <MixBottles flavors={i.bundlePicks} size={42}/> : <BottleImage flavor={i.flavor} size={64} src={heroSrc}/>}
                      <span style={{ position: "absolute", top: -6, right: -6, background: "#2C1810", color: "#FDF6EC", fontFamily: "var(--gb-font-sans)", fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{i.qty}</span>
                    </div>
                    <div style={{ fontFamily: "var(--gb-font-sans)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810", fontFamily: "var(--gb-font-display)" }}>{i.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.12em" }}>{isBundle ? formatBundlePicks(i.bundlePicks) : i.variant}{i.sub ? " · Subscription" : ""}</div>
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
                <span>{method === "cod" ? "COD fee" : "Shipping"}</span>
                <span>{shippingPreview === 0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>Free</span> : `฿${shippingPreview}`}</span>
              </div>
              {method === "stripe" && (
                <div style={{ fontSize: 11, color: "rgba(44,24,16,0.5)", marginBottom: 6 }}>
                  Final shipping (standard ฿60 / next-day ฿120) is picked on Stripe&apos;s page. Free over ฿500.
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
                <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#2C1810" }}>{method === "stripe" ? "Estimated total" : "Total"}</span>
                <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 26, fontWeight: 700, color: "#C8893C" }}>฿{total}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "16px 20px", background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.7)", display: "grid", gap: 10 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#4A7C3F" }}><Icon d={ICONS.shield} size={14} stroke={2}/></span> 256-bit TLS · PCI-compliant via Stripe</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#C8893C" }}><Icon d={ICONS.truck} size={14} stroke={2}/></span> Bangkok next-day · Thailand-wide 3–5 days</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#8B3A1A" }}><Icon d={ICONS.flame} size={14} stroke={2}/></span> Freshness guarantee — broken bottle, we replace it free</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
