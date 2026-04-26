import { Chrome } from "@/components/Chrome";
import { TrackLookup } from "@/components/TrackLookup";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function TrackingPage() {
  return (
    <Chrome>
      <TrackLookup/>
      <Footer/>
    </Chrome>
  );
}
