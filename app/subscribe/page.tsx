import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { SubscribeClient } from "@/components/SubscribeClient";

export const metadata = {
  title: "Subscribe · Gingerbros",
  description: "A monthly 6-pack of real ginger drinks. 10% off forever, free shipping, pause or cancel anytime.",
};

export default function SubscribePage() {
  return (
    <Chrome>
      <SubscribeClient/>
      <Footer/>
    </Chrome>
  );
}
