import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/get-dictionary";
import { ProductDetails } from "@/components/products/product-details";
import { RelatedProducts } from "@/components/products/related-products";
import { getProduct, getProducts } from "@/lib/stripe/products";
import type { ValidLocale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { getProductMetadata } from "@/lib/supabase/products";

interface ProductPageProps {
  params: {
    lang: ValidLocale;
    id: string;
  };
}

export async function generateStaticParams() {
  const products = await getProducts();

  return locales.flatMap((lang) =>
    products.map((product) => ({
      lang,
      id: product.id,
    }))
  );
}

export default async function ProductPage({
  params: { lang, id },
}: ProductPageProps) {
  const dict = await getDictionary(lang);
  const product = await getProduct(id);
  const allProducts = await getProducts();
  const [metadata] = await Promise.all([
    getProductMetadata(id, lang),
    getProduct(id),
  ]);

  if (!product || !metadata) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <ProductDetails
          product={product}
          metadata={metadata}
          dict={dict.products}
        />
        <RelatedProducts
          products={allProducts}
          currentProductId={product.id}
          dict={{
            title: dict.products.relatedTitle,
            shopNow: dict.products.shopNow,
          }}
        />
      </div>
    </div>
  );
}
