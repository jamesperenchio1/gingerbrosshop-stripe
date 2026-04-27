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
    subtitle: "Real ferment · 330ml glass",
    single: 79, sixpack: 399, singlePrice: 79,
    rating: 0, reviews: 0, heat: 4,
    tag: "Bestseller",
    filterTags: ["carbonated", "mixer"],
    blurb: "Our flagship. Two weeks of natural ferment, a proper kick, real bubbles, and zero added sugar.",
    about: "Made the slow way: fresh ginger goes into a wild ginger-bug starter, then we blend it into a strong ginger tea and ferment for two weeks. Pasteurized, sweetened with erythritol, finished with a hit of lime, kegged and bottled. Real ferment, real fizz, no sugar.",
    ingredients: "Fresh ginger, erythritol, filtered water, lime, ginger-bug culture. No added sugar.",
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
    subtitle: "0g sugar · 60ml",
    single: 89, sixpack: 449, singlePrice: 89,
    rating: 0, reviews: 0, heat: 5,
    tag: "Morning Ritual",
    filterTags: ["wellness"],
    blurb: "Cold-pressed ginger blended with coconut water and taurine. A clean morning kick in 60ml. No sugar.",
    about: "We cold-press fresh ginger, then blend it with coconut water for natural electrolytes and a measured dose of taurine for the wake-up. No sugar, no flavor extracts — just three real ingredients. The result is a sharp, hydrating hit that wakes you up without the crash.",
    ingredients: "Fresh ginger, coconut water, taurine. No added sugar.",
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
    subtitle: "Light & lime · 330ml glass",
    single: 69, sixpack: 349, singlePrice: 69,
    rating: 0, reviews: 0, heat: 2,
    tag: "Staff Pick",
    filterTags: ["carbonated", "mixer", "everyday"],
    blurb: "Crisp, light, lime-forward. The easy-drinking sibling — great with dinner, or a splash of rum.",
    about: "Same ginger-bug fermentation as the beer, but with a lighter touch — softer ginger heat, more lime, a brighter finish. Pasteurized, sweetened with erythritol, kegged and bottled.",
    ingredients: "Fresh ginger, erythritol, filtered water, lime, ginger-bug culture. No added sugar.",
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

const SHORT: Record<FlavorId, string> = { beer: "Beer", shot: "Shot", ale: "Ale" };

/** Format ["beer","beer","ale","ale","ale","shot"] -> "2x Beer * 3x Ale * 1x Shot". */
export function formatBundlePicks(picks: FlavorId[] | undefined, sep = " · "): string {
  if (!picks || picks.length === 0) return "Custom 6-Pack";
  const counts = picks.reduce((acc, f) => {
    acc[f] = (acc[f] ?? 0) + 1;
    return acc;
  }, {} as Record<FlavorId, number>);
  const order: FlavorId[] = ["beer", "ale", "shot"];
  return order
    .filter(f => (counts[f] ?? 0) > 0)
    .map(f => `${counts[f]}× ${SHORT[f]}`)
    .join(sep);
}
