import { notFound } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { ProductDetail } from "@/components/PDP";
import { Footer } from "@/components/Footer";
import { PRODUCTS, type FlavorId } from "@/lib/products";
import { getStock } from "@/lib/inventory";
import { getSummary, listReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.id }));
}

export default async function PDPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) notFound();
  const [stock, summary, reviews] = await Promise.all([
    getStock(product.id as FlavorId),
    getSummary(product.id as FlavorId),
    listReviews(product.id as FlavorId),
  ]);
  return (
    <Chrome>
      <ProductDetail product={product} stock={stock} summary={summary} initialReviews={reviews}/>
      <Footer/>
    </Chrome>
  );
}
