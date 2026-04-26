import Link from "next/link";
import { PRODUCTS } from "@/lib/products";
import { getAllStock } from "@/lib/inventory";
import { Chrome } from "@/components/Chrome";
import { Hero } from "@/components/Hero";
import { ShopSection, TasteGuide } from "@/components/Shop";
import { BundleBuilder, SubscriptionBlock } from "@/components/BundleBuilder";
import { StoryStrip, Footer } from "@/components/Footer";
import { Icon, ICONS } from "@/components/shared";

export const dynamic = "force-dynamic";

export default async function Home() {
  const stock = await getAllStock();
  return (
    <Chrome>
      <Hero variant="maker"/>
      <ShopSection products={PRODUCTS} stock={stock}/>
      <TasteGuide products={PRODUCTS}/>
      <BundleBuilder products={PRODUCTS}/>
      <StoryStrip/>
      <SubscriptionBlock/>
      <section style={{ padding: "80px 0", background: "#FDF6EC", textAlign: "center" }}>
        <div className="gb-pad-40" style={{ maxWidth: 720, margin: "0 auto", padding: "0 40px" }}>
          <h2 className="gb-h2" style={{ fontFamily: "var(--gb-font-display)", fontSize: 44, fontWeight: 700, color: "#2C1810", margin: "0 0 14px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Already ordered? <span style={{ fontStyle: "italic", color: "#C8893C" }}>Track your brew.</span>
          </h2>
          <p style={{ fontFamily: "var(--gb-font-sans)", fontSize: 16, color: "rgba(44,24,16,0.7)", margin: "0 0 28px" }}>
            Live timeline from bottle-line to your door. Because &ldquo;it&apos;ll get there&rdquo; isn&apos;t an update.
          </p>
          <Link href="/tracking" className="gb-btn gb-btn--outline">
            See the tracking page <Icon d={ICONS.arrow} size={14}/>
          </Link>
        </div>
      </section>
      <Footer/>
    </Chrome>
  );
}
