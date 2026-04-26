import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Footer } from "@/components/Footer";
import { ClearCartOnMount } from "@/components/ClearCartOnMount";
import { Icon, ICONS } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  if (!session_id) redirect("/");

  let email = "your email";
  let orderId = session_id.slice(-10);
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    email = session.customer_details?.email ?? session.customer_email ?? email;
    orderId = (session.metadata?.orderId as string) ?? orderId;
  } catch {/* swallow */}

  return (
    <div style={{ background: "#FDF6EC", minHeight: "100vh", padding: "80px 24px", textAlign: "center" }}>
      <ClearCartOnMount/>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ width: 80, height: 80, margin: "0 auto 24px", borderRadius: "50%", background: "#4A7C3F", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICONS.check} size={36} stroke={3}/>
        </div>
        <h1 style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Thank you. <span style={{ fontStyle: "italic", color: "#C8893C" }}>It&apos;s on the way.</span>
        </h1>
        <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 16, color: "rgba(44,24,16,0.7)", margin: "0 0 28px" }}>
          We&apos;ve sent a confirmation to <strong>{email}</strong>. Bottling, packing, and shipping take 24–48 hours.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/tracking/${orderId}`} className="gb-btn gb-btn--primary">
            Track this order <Icon d={ICONS.arrow} size={14}/>
          </Link>
          <Link href="/" className="gb-btn gb-btn--ghost">Back to shop</Link>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
