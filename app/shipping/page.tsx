import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Shipping · Gingerbros" };

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Shipping"
      title="Bangkok next-day. Thailand-wide in 3–5 days."
      intro="We ship via Kerry Express across Thailand. Orders placed by 2pm on weekdays leave the warehouse the same day."
      sections={[
        { h: "Bangkok metro (postcodes 10xxx)", body: "Standard 1–2 business days · ฿60. Next-day available for ฿120 if ordered before 2pm." },
        { h: "Thailand-wide", body: "Standard 3–5 business days · ฿60. Free over ฿500." },
        { h: "Cash on delivery", body: "Available for Bangkok metro postcodes only. ฿20 fee. Driver will call before arriving." },
        { h: "International", body: "We don't ship outside Thailand yet — but we're working on a Singapore launch. Add yourself to the newsletter to hear when." },
        { h: "Damaged or broken bottles", body: "If a bottle arrives broken, send a photo to gingerbros.brew@gmail.com within 48 hours and we'll ship a replacement free." },
      ]}
      cta={{ href: "/tracking", label: "Track an order" }}
    />
  );
}
