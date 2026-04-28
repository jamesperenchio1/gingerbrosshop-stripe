// Single source of truth for product catalog.
// Stripe Price IDs are populated from the test-mode account (acct_1TC1Ee4xTvnGlHCD).
// Amounts in THB (฿); display values are whole baht.

export type FlavorId = "beer" | "shot" | "ale";

export type Product = {
  id: FlavorId;
  flavor: FlavorId;
  title: string;
  subtitle: string;
  size: string;
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
  /** Compare-table data. */
  process: string;
  ingredientsShort: string[];
  abv: string;
  serve: string;
  pairsWith: string;
  carbonation: string;
  sugarLabel: string;
  /** Visual block tone used behind the bottle on cards. */
  cardTone: { bg: string; bgHover: string };
  prices: {
    single: string;
    sixpack: string;
    sub: string;
    /** Per-bottle recurring monthly price. Used by mix-pack subscriptions: a sub line of qty=N pulls N bottles of this flavor each month. */
    subBottle: string;
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
    subtitle: "330ml",
    size: "330ml",
    single: 79, sixpack: 399, singlePrice: 79,
    rating: 0, reviews: 0, heat: 4,
    tag: "Bestseller",
    filterTags: ["carbonated", "mixer"],
    blurb: "Our flagship. Real ginger, a proper kick, fully carbonated, and zero residual sugar.",
    about: "We start a wild ginger-bug culture from fresh ginger, then blend it into a strong ginger tea with sugar and let it ferment until the sugar is gone. After fermentation we pasteurize, sweeten back up with erythritol, finish with fresh lime, force-carbonate, and bottle. Sugar-free in the bottle, ginger-forward, properly fizzy.",
    ingredients: "Fresh ginger, erythritol, filtered water, lime, ginger-bug culture. Sugar added during fermentation, fully fermented out — 0g residual sugar in the bottle.",
    process: "Wild ferment · 10–14 days",
    ingredientsShort: ["Fresh ginger", "Ginger-bug culture", "Erythritol", "Lime", "Water"],
    abv: "<0.5%",
    serve: "Cold, with food",
    pairsWith: "Grilled, spicy, fatty",
    carbonation: "Force-carbonated",
    sugarLabel: "0g residual",
    cardTone: { bg: "#F5E6D3", bgHover: "#EDD9C0" },
    stripeProductId: "prod_UPLRWgaSJebePn",
    prices: {
      single:    "price_1TQWl04xTvnGlHCDwPbXEEto",
      sixpack:   "price_1TQWl04xTvnGlHCDDlql93Ha",
      sub:       "price_1TQWl44xTvnGlHCD7XsubBUU",
      subBottle: "price_1TQuIi4xTvnGlHCDiL4q07Dg",
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
    subtitle: "60ml",
    size: "60ml",
    single: 89, sixpack: 449, singlePrice: 89,
    rating: 0, reviews: 0, heat: 5,
    tag: "Morning Ritual",
    filterTags: ["wellness"],
    blurb: "Cold-pressed ginger blended with coconut water and taurine. A clean morning kick in 60ml. No sugar.",
    about: "We cold-press fresh ginger, then blend it with coconut water for natural electrolytes and a measured dose of taurine for the wake-up. No sugar, no flavor extracts — just three real ingredients. The result is a sharp, hydrating hit that wakes you up without the crash.",
    ingredients: "Fresh ginger, coconut water, taurine. No added sugar.",
    process: "Cold-pressed",
    ingredientsShort: ["Fresh ginger", "Coconut water", "Taurine"],
    abv: "0%",
    serve: "Mornings, neat",
    pairsWith: "Coffee, post-workout",
    carbonation: "Still",
    sugarLabel: "None",
    cardTone: { bg: "#E5EBDC", bgHover: "#D7DFC9" },
    stripeProductId: "prod_UPLRTYuEae3E0D",
    prices: {
      single:    "price_1TQWl14xTvnGlHCD127g2bEq",
      sixpack:   "price_1TQWl14xTvnGlHCDMwBlPHRp",
      sub:       "price_1TQWl44xTvnGlHCDsMhf7ama",
      subBottle: "price_1TQuIy4xTvnGlHCDaDhrf1Bs",
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
    subtitle: "330ml",
    size: "330ml",
    single: 69, sixpack: 349, singlePrice: 69,
    rating: 0, reviews: 0, heat: 2,
    tag: "Staff Pick",
    filterTags: ["carbonated", "mixer", "everyday"],
    blurb: "Crisp, light, lime-forward. The easy-drinking sibling — great with dinner, or a splash of rum.",
    about: "We cook fresh ginger and lime down into a concentrated syrup, sweeten with erythritol, then blend it with cold soda water to bottle. No fermentation, no shortcuts from a flavor lab — just real ginger syrup and bubbles. Lighter heat than the beer, brighter on the lime, easy to drink alone or with rum.",
    ingredients: "Fresh ginger, erythritol, filtered water, lime, soda water. No added sugar in the bottle.",
    process: "Ginger syrup + soda water",
    ingredientsShort: ["Fresh ginger", "Erythritol", "Lime", "Soda water"],
    abv: "0%",
    serve: "Over ice with lime",
    pairsWith: "Gin, rum, lime",
    carbonation: "Soda water",
    sugarLabel: "0g residual",
    cardTone: { bg: "#FAEBC9", bgHover: "#F2DDB0" },
    stripeProductId: "prod_UPLRxZTxSV1wSb",
    prices: {
      single:    "price_1TQWl24xTvnGlHCD81fnXsF4",
      sixpack:   "price_1TQWl24xTvnGlHCDKOe9r89R",
      sub:       "price_1TQWl44xTvnGlHCDvUZaTOZq",
      subBottle: "price_1TQuIq4xTvnGlHCDxHwwSRdy",
    },
  },
];

/** Per-bottle subscription unit price (display, baht). Mirrors the recurring Price unit_amount in Stripe. */
export const SUB_BOTTLE_PRICE: Record<FlavorId, number> = {
  beer: 60,
  ale: 52,
  shot: 67,
};

export const PRICE_TO_PRODUCT: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" | "Sub Bottle" }> = (() => {
  const out: Record<string, { id: FlavorId; variant: "Single" | "6-Pack" | "Subscription" | "Sub Bottle" }> = {};
  for (const p of PRODUCTS) {
    out[p.prices.single]     = { id: p.id, variant: "Single" };
    out[p.prices.sixpack]    = { id: p.id, variant: "6-Pack" };
    out[p.prices.sub]        = { id: p.id, variant: "Subscription" };
    out[p.prices.subBottle]  = { id: p.id, variant: "Sub Bottle" };
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
