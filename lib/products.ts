// Single source of truth for product catalog.
// Stripe Price IDs are populated from the test-mode account (acct_1TC1Ee4xTvnGlHCD).
// Amounts in THB (฿); display values are whole baht.

export type FlavorId = "beer" | "shot" | "ale" | "unpast";

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
};

export const PRODUCTS: Product[] = [
  {
    id: "beer", flavor: "beer", title: "Ginger Beer",
    subtitle: "Bold · Bubbly · 330ml",
    single: 79, sixpack: 399, singlePrice: 79,
    rating: 5, reviews: 284, heat: 4,
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
  },
  {
    id: "shot", flavor: "shot", title: "Ginger Shot",
    subtitle: "Pure · 60ml",
    single: 89, sixpack: 449, singlePrice: 89,
    rating: 5, reviews: 312, heat: 5,
    tag: "Morning Ritual",
    filterTags: ["fiery", "shot"],
    blurb: "A concentrated hit of raw ginger, cold-pressed with lemon and a pinch of cayenne. Morning fuel in 60ml.",
    about: "Cold-pressed within 24 hours of harvest, then bottled with a squeeze of lemon and a whisper of cayenne for kick. No sugar, no filler, no compromise.",
    ingredients: "Fresh Thai ginger root, cold-pressed lemon, cayenne, filtered water.",
    stripeProductId: "prod_UPLRTYuEae3E0D",
    prices: {
      single:  "price_1TQWl14xTvnGlHCD127g2bEq",
      sixpack: "price_1TQWl14xTvnGlHCDMwBlPHRp",
      sub:     "price_1TQWl44xTvnGlHCDsMhf7ama",
    },
  },
  {
    id: "ale", flavor: "ale", title: "Ginger Ale",
    subtitle: "Crisp · 330ml",
    single: 69, sixpack: 349, singlePrice: 69,
    rating: 5, reviews: 198, heat: 2,
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
  {
    id: "unpast", flavor: "unpast", title: "Unpasteurized Beer",
    subtitle: "Wild ferment · 330ml",
    single: 149, sixpack: 799, singlePrice: 149,
    rating: 5, reviews: 42, heat: 5,
    tag: "NEW",
    tagColor: "#4A7C3F",
    lowStock: true,
    filterTags: ["new", "fiery"],
    blurb: "Live cultures, wild ferment, full depth. For the drinker who wants their ginger beer to taste like a proper brewery.",
    about: "A wilder sibling. Unpasteurized means the ferment is alive — keep it cold, pop it gently, and drink within 14 days.",
    ingredients: "Fresh Thai ginger, cane sugar, filtered water, live culture. No pasteurization.",
    stripeProductId: "prod_UPLRuk9ssmFNNO",
    prices: {
      single:  "price_1TQWl34xTvnGlHCDQM6YIqs0",
      sixpack: "price_1TQWl34xTvnGlHCDd0E8Tpzd",
      sub:     "price_1TQWl54xTvnGlHCD12gBAq43",
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
