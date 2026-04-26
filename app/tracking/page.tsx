import { Chrome } from "@/components/Chrome";
import { OrderTracking } from "@/components/OrderTracking";
import { Footer } from "@/components/Footer";

export default function TrackingDemoPage() {
  return (
    <Chrome>
      <OrderTracking
        orderId="DEMO-2026"
        status="shipped"
        eta="today between 3–6pm"
      />
      <Footer/>
    </Chrome>
  );
}
