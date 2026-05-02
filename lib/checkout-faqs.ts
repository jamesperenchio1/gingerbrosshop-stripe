import type { CartLine } from "./cart";

export type CheckoutFaq = {
  /** Key into ICONS in components/shared. */
  icon: "truck" | "repeat" | "shield" | "leaf" | "sparkle" | "gift";
  text: string;
  href?: string;
};

export function getCheckoutFaqs(items: CartLine[], subtotal: number): CheckoutFaq[] {
  const faqs: CheckoutFaq[] = [];

  const hasSub = items.some(i => i.sub);

  if (hasSub) {
    faqs.push({ icon: "truck", text: "Free shipping every month" });
  } else if (subtotal >= 500) {
    faqs.push({ icon: "truck", text: "Free shipping unlocked" });
  } else {
    faqs.push({ icon: "truck", text: `฿${500 - subtotal} more for free shipping` });
  }


  const hasBundle = items.some(i => i.id === "bundle");

  if (hasSub) {
    faqs.push({ icon: "repeat", text: "Pause, swap, or cancel anytime", href: "/account" });
  } else if (hasBundle) {
    faqs.push({ icon: "gift", text: "Mix-pack ships boxed and padded" });
  } else {
    faqs.push({ icon: "sparkle", text: "0g residual sugar in every bottle" });
  }

  faqs.push({ icon: "shield", text: "Bottle broke? We replace it free", href: "/contact" });

  return faqs.slice(0, 3);
}
