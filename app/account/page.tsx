import { Chrome } from "@/components/Chrome";
import { Footer } from "@/components/Footer";
import { AccountClient } from "@/components/AccountClient";

export const metadata = {
  title: "Your account · Gingerbros",
  description: "Manage your Gingerbros subscription — pause, skip, swap flavors, or cancel.",
};

export default function AccountPage() {
  return (
    <Chrome>
      <AccountClient/>
      <Footer/>
    </Chrome>
  );
}
