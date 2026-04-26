import { notFound } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { ProductDetail } from "@/components/PDP";
import { Footer } from "@/components/Footer";
import { PRODUCTS, type FlavorId } from "@/lib/products";
import { getStock } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: p.id }));
}

export default async function PDPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) notFound();
  const stock = await getStock(product.id as FlavorId);
  return (
    <Chrome>
      <ProductDetail product={product} stock={stock}/>
      <Footer/>
    </Chrome>
  );
}
