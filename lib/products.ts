// Single source of truth for product catalog.
// Stripe Price IDs are populated from the test-mode account (acct_1TC1Ee4xTvnGlHCD).
// Amounts in THB (฿); display values are whole baht.

export type FlavorId = "beer" | "shot" | "ale";

export type Product = {
  id: FlavorId;
  flavor: FlavorId;
  title: string;
  subtitle: string;
  single: number;
  sixpack: number;
  singlePrice: number;
  rating: number;
  reviews: number;
  heat: number;
  tag: string;
  tagColor?: string;
  lowStock?: boolean;
  filterTags: string[];
  blurb: string;
  about: string;
  ingredients: string;
  prices: {
    single: string;
    sixpack: string;
    sub: string;
  };
  stripeProductId: string;
  /** Primary, transparent-background image used on cards / PDP hero. */
  heroImage?: string;
  /** Additional photos shown on the PDP gallery. */
  gallery?: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: "beer", flavor: "beer", title: "Ginger Beer",
    subtitle: "Bold · Bubbly · 330ml",
    single: 79, sixpack: 399, singlePrice: 79,
    rating: 0, reviews: 0, heat: 4,
    tag: "Bestseller",
    filterTags: ["fiery", "mixer"],
    blurb: "Our flagship. Fourteen days of natural ferment, a proper kick, and a fizz that actually bubbles. The ginger beer people send us unsolicited DMs about.",
    about: "Naturally fermented over 14 days with fresh Chiang Rai ginger, organic cane sugar, and our heritage yeast culture. Fiery, complex, bubbly.",
    ingredients: "Fresh Thai ginger, organic cane sugar, filtered water, lemon, natural yeast. Fermented in Bangkok.",
    stripeProductId: "prod_UPLRWgaSJebePn",
    prices: {
      single:  "price_1TQWl04xTvnGlHCDwPbXEEto",
      sixpack: "price_1TQWl04xTvnGlHCDDlql93Ha",
      sub:     "price_1TQWl44xTvnGlHCD7XsubBUU",
    },
    heroImage: "/products/ginger-beer-bg.png",
    gallery: [
      "/products/ginger-beer-bg.png",
      "/products/ginger-beer-1.jpg",
      "/products/ginger-beer-2.jpg",
      "/products/ginger-beer-3.jpg",
    ],
  },
  {
    id: "shot", flavor: "shot", title: "Ginger Shot",
    subtitle: "Pure · 60ml",
    single: 89, sixpack: 449, singlePrice: 89,
    rating: 0, reviews: 0, heat: 5,
    tag: "Morning Ritual",
    filterTags: ["fiery", "shot"],
    blurb: "Cold-pressed Thai ginger, blended with coconut water and taurine for a clean morning kick. 60ml, no sugar.",
    about: "We cold-press fresh ginger root within 24 hours of harvest, then blend it with electrolyte-rich coconut water and a clean dose of taurine. No sugar — sweetened only by the coconut water itself. The result: a sharp, hydrating hit that wakes you up without the crash.",
    ingredients: "Fresh Thai ginger root, coconut water, taurine. No sugar.",
    stripeProductId: "prod_UPLRTYuEae3E0D",
    prices: {
      single:  "price_1TQWl14xTvnGlHCD127g2bEq",
      sixpack: "price_1TQWl14xTvnGlHCDMwBlPHRp",
      sub:     "price_1TQWl44xTvnGlHCDsMhf7ama",
    },
    heroImage: "/products/ginger-shot-bg.png",
    gallery: [
      "/products/ginger-shot-bg.png",
      "/products/ginger-shot-1.jpg",
      "/products/ginger-shot-2.jpg",
      "/products/ginger-shot-3.jpg",
      "/products/ginger-shot-4.jpg",
      "/products/ginger-shot-5.jpg",
      "/products/ginger-shot-6.jpg",
    ],
  },
  {
    id: "ale", flavor: "ale", title: "Ginger Ale",
    subtitle: "Crisp · 330ml",
    single: 69, sixpack: 349, singlePrice: 69,
    rating: 0, reviews: 0, heat: 2,
    tag: "Staff Pick",
    filterTags: ["mild", "mixer"],
    blurb: "Crisp, light, refreshing. The easy-drinking cousin in the family — perfect with dinner or a splash of rum.",
    about: "Brewed with a lighter touch — less fire, more fizz, a little citrus. Great on its own, fantastic with a dark spirit.",
    ingredients: "Fresh Thai ginger, organic cane sugar, lime, filtered water, carbonation.",
    stripeProductId: "prod_UPLRxZTxSV1wSb",
    prices: {
      single:  "price_1TQWl24xTvnGlHCD81fnXsF4",
      sixpack: "price_1TQWl24xTvnGlHCDKOe9r89R",
      sub:     "price_1TQWl44xTvnGlHCDvUZaTOZq",
    },
  },
];

export const PRICE_TO_PRODUCT: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" }> = (() => {
  const out: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" }> = {};
  for (const p of PRODUCTS) {
    out[p.prices.single]  = { id: p.id, variant: "Single" };
    out[p.prices.sixpack] = { id: p.id, variant: "6-Pack" };
    out[p.prices.sub]     = { id: p.id, variant: "Subscription" };
  }
  return out;
})();

export function getProduct(id: FlavorId): Product {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) throw new Error(`Unknown product: ${id}`);
  return p;
}
