import { EmbeddedPay } from "@/components/EmbeddedPay";

export const metadata = {
  title: "Checkout · Gingerbros",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function CheckoutPayPage() {
  return <EmbeddedPay/>;
}
