import { Chrome } from "@/components/Chrome";
import { OrderTracking, type TrackingItem } from "@/components/OrderTracking";
import { Footer } from "@/components/Footer";
import { kv } from "@vercel/kv";
import { stripe } from "@/lib/stripe";
import { PRICE_TO_PRODUCT, getProduct } from "@/lib/products";

export const dynamic = "force-dynamic";

type StoredOrder = {
  orderId: string;
  status: "received" | "brewing" | "packed" | "shipped" | "delivered";
  email?: string;
  sessionId?: string;
  paymentIntentId?: string;
  method?: "stripe" | "cod";
  items?: { priceId?: string; flavor: string; title: string; variant: string; qty: number }[];
};

async function loadOrder(orderId: string): Promise<StoredOrder | null> {
  if (!process.env.KV_REST_API_URL) return null;
  return await kv.get<StoredOrder>(`gb:order:${orderId}`);
}

export default async function TrackingByIdPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const stored = await loadOrder(orderId);

  let items: TrackingItem[] | undefined;
  let status = stored?.status;
  if (stored?.sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(stored.sessionId, { expand: ["line_items"] });
      if (session.payment_status === "paid" && status === "received") status = "brewing";
      items = (session.line_items?.data ?? []).map(li => {
        const priceId = li.price?.id ?? "";
        const meta = PRICE_TO_PRODUCT[priceId];
        if (meta) {
          const p = getProduct(meta.id);
          return { flavor: p.flavor, name: `${p.title} ${meta.variant}` };
        }
        return { flavor: "beer" as const, name: li.description ?? "Item" };
      });
    } catch {/* swallow */}
  } else if (stored?.items) {
    items = stored.items.map(i => ({ flavor: (i.flavor as TrackingItem["flavor"]) ?? "beer", name: `${i.title} · ${i.variant}` }));
  }

  return (
    <Chrome>
      <OrderTracking
        orderId={orderId}
        status={status ?? "received"}
        items={items}
        eta={stored ? undefined : "We don't have this order on file"}
        customerEmail={stored?.email}
      />
      <Footer/>
    </Chrome>
  );
}
