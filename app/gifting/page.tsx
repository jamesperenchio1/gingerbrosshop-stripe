import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Gifting · Gingerbros" };

export default function GiftingPage() {
  return (
    <InfoPage
      eyebrow="Gifting"
      title="Send a 6-pack with a note."
      intro="Birthdays, housewarmings, hangover-prevention kits — Gingerbros makes a good 'thinking of you' present for someone in Thailand."
      sections={[
        { h: "How it works", body: "1. Pick a 6-pack or build-your-own. 2. At checkout, set the shipping address to the recipient's. 3. Reply to your order confirmation with the note you'd like included — we'll handwrite it onto a kraft card." },
        { h: "Packaging", body: "Bundles ship in a custom kraft box with foam protection. The card goes on top." },
        { h: "Lead time", body: "Order by 2pm for Bangkok next-day. Thailand-wide arrives in 3–5 business days. Plan a little extra for peak holidays." },
        { h: "Bigger orders / corporate gifting", body: "Sending 20+ to a team or event? Email gingerbros.brew@gmail.com with quantity, address, and date. We'll quote a discount." },
      ]}
      cta={{ href: "/#bundle", label: "Build a 6-pack" }}
    />
  );
}
