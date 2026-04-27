import { AdminOrders } from "@/components/AdminOrders";

export const metadata = {
  title: "Orders · Gingerbros admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return <AdminOrders/>;
}
