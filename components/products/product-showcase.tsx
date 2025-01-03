import { getProducts } from "@/lib/stripe/products";
import { ProductCarousel } from "./product-carousel";
import { ProductShowcaseTitle } from "./product-showcase-title";

interface ProductShowcaseProps {
  dict: {
    title: string;
    shopNow: string;
  };
}

export async function ProductShowcase({ dict }: ProductShowcaseProps) {
  const products = await getProducts();

  return (
    <section className="py-16 overflow-hidden">
      <ProductCarousel products={products} dict={dict} />
    </section>
  );
}
