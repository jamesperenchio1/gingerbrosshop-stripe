import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Footer } from "@/components/Footer";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { Icon, ICONS } from "@/components/shared";

export const dynamic = "force-dynamic";

type LineItemView = { name: string; qty: number; total: number };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  let email = "your email";
  let orderId = session_id.slice(-10).toUpperCase();
  let items: LineItemView[] = [];
  let amountSubtotal = 0;
  let amountShipping = 0;
  let amountTotal = 0;
  let address: string | null = null;
  let isSubscription = false;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "shipping_cost.shipping_rate"],
    });
    email = session.customer_details?.email ?? session.customer_email ?? email;
    orderId = (session.metadata?.orderId as string) ?? orderId;
    isSubscription = session.mode === "subscription";
    amountSubtotal = (session.amount_subtotal ?? 0) / 100;
    amountShipping = (session.shipping_cost?.amount_total ?? 0) / 100;
    amountTotal = (session.amount_total ?? 0) / 100;

    type Addr = { line1?: string | null; line2?: string | null; city?: string | null; postal_code?: string | null; country?: string | null };
    const sessionAny = session as unknown as { shipping_details?: { address?: Addr } | null; customer_details?: { address?: Addr | null } | null };
    const ad: Addr | null | undefined =
      sessionAny.shipping_details?.address ?? sessionAny.customer_details?.address ?? null;
    if (ad) {
      address = [ad.line1, ad.line2, ad.city, ad.postal_code, ad.country].filter(Boolean).join(", ");
    }

    items = (session.line_items?.data ?? []).map(li => ({
      name: li.description ?? "Item",
      qty: li.quantity ?? 1,
      total: (li.amount_total ?? 0) / 100,
    }));
  } catch { /* swallow — show fallback */ }

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh" }}>
      <ClearCartOnMount/>

      <section style={{ padding: "72px 24px 48px", textAlign: "center" }}>
        <div style={{ width: 84, height: 84, margin: "0 auto 24px", borderRadius: "50%", background: "#4A7C3F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 28px rgba(74,124,63,0.3)" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Thank you. <span style={{ fontStyle: "italic", color: "#C8893C" }}>It&apos;s on the way.</span>
        </h1>
        <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 15, color: "rgba(44,24,16,0.65)", margin: "0 0 4px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          Order <strong style={{ color: "#2C1810" }}>#{orderId}</strong> · confirmation sent to <strong style={{ color: "#2C1810" }}>{email}</strong>
        </p>
      </section>

      <section style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>
          {/* Order summary */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Order summary</div>
              <Link href={`/tracking/${orderId}`} style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, fontWeight: 700, color: "#C8893C", textDecoration: "underline" }}>
                Track order →
              </Link>
            </div>

            {items.length > 0 ? (
              <div style={{ display: "grid", gap: 8 }}>
                {items.map((it, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid rgba(44,24,16,0.06)", fontFamily: "var(--gb-font-sans)", fontSize: 14 }}>
                    <span style={{ color: "#2C1810" }}>{it.qty}× {it.name}</span>
                    <span style={{ fontWeight: 700, color: "#C8893C" }}>฿{it.total}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.55)", padding: "12px 0" }}>
                Your full receipt is in the confirmation email.
              </div>
            )}

            {amountTotal > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(44,24,16,0.08)", fontFamily: "var(--gb-font-sans)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 4 }}>
                  <span>Subtotal</span><span>฿{amountSubtotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(44,24,16,0.7)", marginBottom: 10 }}>
                  <span>Shipping</span>
                  <span>{amountShipping === 0 ? <span style={{ color: "#4A7C3F", fontWeight: 700 }}>Free</span> : `฿${amountShipping}`}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: "1px solid rgba(44,24,16,0.08)" }}>
                  <span style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810" }}>Total</span>
                  <span style={{ fontFamily: "var(--gb-font-sans)", fontSize: 22, fontWeight: 700, color: "#C8893C" }}>฿{amountTotal}</span>
                </div>
              </div>
            )}

            {address && (
              <div style={{ marginTop: 18, padding: "14px 16px", background: "#FDF6EC", borderRadius: 10, fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.72)" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 700, color: "rgba(44,24,16,0.55)", marginBottom: 4 }}>Shipping to</div>
                {address}
              </div>
            )}
          </div>

          {/* What happens next */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 28 }}>
            <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 20, fontWeight: 700, color: "#2C1810", marginBottom: 16 }}>What happens next</div>
            <div style={{ display: "grid", gap: 14 }}>
              {[
                { icon: ICONS.flame,  title: "Bottling",  body: "Your bottles get packed within 24 hours of payment." },
                { icon: ICONS.truck,  title: "Shipping",  body: "Kerry Express picks up the same day or next morning. Bangkok next-day · Thailand-wide 3–5 business days." },
                { icon: ICONS.box,    title: "Delivery",  body: isSubscription ? "First box arrives within a few days. Then every 30 days — manage anytime via the link in your subscription email." : "We'll email you when it ships, with a live link to your order page." },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ width: 36, height: 36, borderRadius: "50%", background: "#FDF6EC", color: "#C8893C", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon d={s.icon} size={18} stroke={2}/>
                  </span>
                  <div style={{ paddingTop: 4 }}>
                    <div style={{ fontFamily: "var(--gb-font-display)", fontSize: 15, fontWeight: 700, color: "#2C1810" }}>{s.title}</div>
                    <div style={{ fontFamily: "var(--gb-font-sans)", fontSize: 13, color: "rgba(44,24,16,0.7)", lineHeight: 1.5, marginTop: 2 }}>{s.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            <Link href={`/tracking/${orderId}`} className="gb-btn gb-btn--primary">
              Track this order <Icon d={ICONS.arrow} size={14}/>
            </Link>
            <Link href="/" className="gb-btn gb-btn--ghost">Back to shop</Link>
          </div>

          <p style={{ textAlign: "center", marginTop: 8, marginBottom: 64, fontFamily: "var(--gb-font-sans)", fontSize: 12, color: "rgba(44,24,16,0.55)" }}>
            Questions? Reply to your confirmation email or <Link href="/contact" style={{ color: "#C8893C", textDecoration: "underline" }}>say hi via LINE</Link>.
          </p>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
