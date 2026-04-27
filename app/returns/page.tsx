import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Returns & freshness guarantee · Gingerbros" };

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Returns"
      title="Freshness guarantee."
      intro="Because we ship a perishable product, we don't accept open-bottle returns. We do guarantee every bottle arrives intact and tastes like it should — and if it doesn't, we make it right."
      sections={[
        { h: "Broken on arrival", body: "Snap a photo within 48 hours of delivery and email gingerbros.brew@gmail.com. We'll ship a replacement free, no questions asked." },
        { h: "Off-flavor or fizz issues", body: "Same drill — email us with the order number and what's wrong. We'll send a replacement or refund the affected bottles." },
        { h: "Wrong order", body: "If we packed the wrong flavors, email us and we'll send the right ones at no charge. Keep what arrived — drink it or pass it along." },
        { h: "Subscription cancellations", body: "Cancel any time from the 'Manage subscription' link in your subscription confirmation email. No phone calls, no retention nonsense." },
        { h: "Refunds", body: "Refunds go back to the original payment method via Stripe. Allow 5–10 business days for the bank to credit your account." },
      ]}
    />
  );
}
