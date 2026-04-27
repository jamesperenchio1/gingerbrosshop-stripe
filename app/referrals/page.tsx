import { InfoPage } from "@/components/InfoPage";

export const metadata = { title: "Refer a friend · Gingerbros" };

export default function ReferralsPage() {
  return (
    <InfoPage
      eyebrow="Refer a friend"
      title="Give ฿100, get ฿100."
      intro="Have a friend who'd like Gingerbros? Send them a referral link — they get ฿100 off their first order, you get ฿100 credit on your next one once they buy."
      sections={[
        { h: "How it works (coming soon)", body: "We're building the referral system right now. In the meantime, share your favorite drink with a friend and email us — we'll credit your account manually." },
        { h: "When it launches", body: "Aiming for next month. Subscribers will be the first to get personal links. Add yourself to the newsletter to be notified." },
      ]}
      cta={{ href: "mailto:gingerbros.brew@gmail.com?subject=Referral%20credit", label: "Email us your referral" }}
    />
  );
}
