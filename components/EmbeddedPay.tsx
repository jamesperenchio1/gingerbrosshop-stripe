"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Icon, ICONS, BottleImage, MixBottles } from "./shared";
import { useCart } from "@/lib/cart";
import { formatBundlePicks, PRODUCTS, type FlavorId } from "@/lib/products";

const stripePromise = (() => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return null;
  return loadStripe(key);
})();

export function EmbeddedPay() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const requested = useRef(false);

  // Snapshot the cart at mount so a subsequent /success cart-clear doesn't
  // wipe the order summary while Stripe is still rendering.
  const snapshot = useMemo(() => items.map(i => ({ ...i })), []); // eslint-disable-line react-hooks/exhaustive-deps
  const snapshotSubtotal = useMemo(() => snapshot.reduce((a, i) => a + i.price * i.qty, 0), [snapshot]);
  const snapshotShipping = snapshotSubtotal === 0 ? 0 : snapshotSubtotal >= 500 ? 0 : 60;

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    if (snapshot.length === 0) { setLoading(false); return; }

    void (async () => {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: snapshot.map(i => ({
              id: i.id, flavor: i.flavor, title: i.title, variant: i.variant,
              priceId: i.priceId, bundlePicks: i.bundlePicks, price: i.price, qty: i.qty, sub: !!i.sub,
            })),
            customer: { email: "" },
            shipping: { method: "std" },
            method: "stripe",
            embedded: true,
          }),
        });
        const data: { clientSecret?: string; error?: string } = await res.json();
        if (!res.ok || !data.clientSecret) {
          setErr(data.error || "Couldn't start checkout. Please try again.");
        } else {
          setClientSecret(data.clientSecret);
        }
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Network error");
      } finally {
        setLoading(false);
      }
    })();
  }, [snapshot]);

  const onComplete = () => {
    // Stripe calls this after a successful payment; the iframe will then
    // navigate the parent to return_url. Clear the cart locally for safety.
    clear();
  };

  if (snapshot.length === 0) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, fontFamily: "var(--gb-font-sans)" }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--gb-font-display)", fontSize: 32, color: "#2C1810" }}>Your cart is empty</h2>
          <p style={{ color: "rgba(44,24,16,0.6)" }}>Add a drink to get started.</p>
          <Link href="/" className="gb-btn gb-btn--primary" style={{ marginTop: 16 }}>Shop the range</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", paddingBottom: 60 }}>
      {/* Minimal trust header */}
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(44,24,16,0.08)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => router.back()} style={{ background: "none", border: 0, cursor: "pointer", display: "flex", gap: 8, alignItems: "center", fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.7)" }}>
          <Icon d={ICONS.arrowLeft} size={14}/> Back to cart
        </button>
        <Link href="/" style={{ fontFamily: "var(--gb-font-display)", fontWeight: 700, fontSize: 22, color: "#2C1810", textDecoration: "none" }}>
          Ginger<span style={{ color: "#C8893C" }}>bros</span>
        </Link>
        <div style={{ display: "flex", gap: 6, alignItems: "center", fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.6)" }}>
          <Icon d={ICONS.shield} size={14} stroke={2}/> Secure
        </div>
      </div>

      <div className="gb-grid-2 gb-pad-40" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)", gap: 32 }}>
        {/* Stripe embedded form on the left */}
        <div style={{ minHeight: 600 }}>
          {loading && <CheckoutSkeleton/>}
          {!loading && err && (
            <div style={{ padding: 28, background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#8B3A1A", marginBottom: 8 }}>Couldn&apos;t start checkout</div>
              <p style={{ color: "rgba(44,24,16,0.7)", lineHeight: 1.6, fontSize: 14, margin: "0 0 16px" }}>
                {err} If this keeps happening, send a screenshot to <a href="/contact" style={{ color: "#C8893C", textDecoration: "underline" }}>support</a> and we&apos;ll help.
              </p>
              <button onClick={() => router.refresh()} className="gb-btn gb-btn--primary" style={{ fontSize: 13, padding: "10px 18px" }}>Try again</button>
            </div>
          )}
          {!loading && !err && clientSecret && stripePromise && (
            <div style={{ background: "#fff", borderRadius: 16, padding: 6, overflow: "hidden" }}>
              <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret, onComplete }}>
                <EmbeddedCheckout/>
              </EmbeddedCheckoutProvider>
            </div>
          )}
          {!loading && !err && (!clientSecret || !stripePromise) && (
            <div style={{ padding: 28, background: "#fff", borderRadius: 16, fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 22, fontWeight: 700, color: "#8B3A1A" }}>Stripe is unavailable</div>
              <p style={{ color: "rgba(44,24,16,0.7)", marginTop: 8 }}>
                The Stripe publishable key isn&apos;t configured for this deployment. Pay-on-delivery still works — head back to the cart and pick that.
              </p>
            </div>
          )}
        </div>

        {/* Order summary on the right */}
        <aside>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, position: "sticky", top: 24 }}>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 16 }}>Order summary</div>

            <div style={{ marginBottom: 14, maxHeight: 320, overflowY: "auto" }}>
              {snapshot.map(i => {
                const heroSrc = PRODUCTS.find(p => p.id === (i.flavor as FlavorId))?.heroImage;
                const isBundle = i.id === "bundle";
                return (
                  <div key={i.uid} style={{ display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(44,24,16,0.06)", alignItems: "center" }}>
                    <div style={{ width: 60, height: 72, background: "linear-gradient(145deg,#F5E6D3,#FDF6EC)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 4, position: "relative" }}>
                      {isBundle ? <MixBottles flavors={i.bundlePicks} size={42}/> : <BottleImage flavor={i.flavor} size={64} src={heroSrc}/>}
                      <span style={{ position: "absolute", top: -6, right: -6, background: "#2C1810", color: "#FDF6EC", fontFamily: "var(--gb-font-sans)", fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{i.qty}</span>
                    </div>
                    <div style={{ fontFamily: "var(--gb-font-sans)" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#2C1810", fontFamily: "var(--gb-font-display)" }}>{i.title}</div>
                      <div style={{ fontSize: 11, color: "rgba(44,24,16,0.55)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        {isBundle ? formatBundlePicks(i.bundlePicks) : i.variant}{i.sub ? " · Subscription" : ""}
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--gb-font-sans)", fontWeight: 700, color: "#C8893C", fontSize: 13 }}>฿{i.price * i.qty}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ paddingTop: 12, borderTop: "1px solid rgba(44,24,16,0.08)", fontFamily: "var(--gb-font-sans)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 6 }}>
                <span>Subtotal</span><span>฿{snapshotSubtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 6 }}>
                <span>Shipping</span><span>{snapshotShipping === 0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>Free</span> : `฿${snapshotShipping}`}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(44,24,16,0.5)", marginBottom: 6 }}>
                Final shipping picked on the form. Free over ฿500.
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
                <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Estimated total</span>
                <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 24, fontWeight: 700, color: "#C8893C" }}>฿{snapshotSubtotal + snapshotShipping}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, padding: "14px 18px", background: "#fff", borderRadius: 14, fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.65)", display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#4A7C3F" }}><Icon d={ICONS.shield} size={14} stroke={2}/></span> Powered by Stripe · 256-bit TLS</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#C8893C" }}><Icon d={ICONS.truck} size={14} stroke={2}/></span> Bangkok next-day · Thailand-wide 3–5 days</div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span style={{ color: "#8B3A1A" }}><Icon d={ICONS.flame} size={14} stroke={2}/></span> Broken bottle? We replace it free.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CheckoutSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 28, fontFamily: "var(--gb-font-sans)" }}>
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{ height: i === 0 ? 28 : 48, background: "rgba(44,24,16,0.05)", borderRadius: 8, marginBottom: 14, animation: "gbPulse 1.5s ease-in-out infinite" }}/>
      ))}
      <div style={{ height: 48, background: "linear-gradient(90deg, #C8893C, #8B3A1A)", opacity: 0.18, borderRadius: 9999, marginTop: 24, animation: "gbPulse 1.5s ease-in-out infinite" }}/>
    </div>
  );
}
