import { createClient } from "@/lib/supabase/server";
import type { ValidLocale } from "@/i18n/config";

export interface ProductMetadata {
  id: string;
  product_id: string;
  lang: ValidLocale;
  title: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
}

export async function getProductMetadata(
  productId: string,
  lang: ValidLocale
): Promise<ProductMetadata | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_metadata")
    .select("*")
    .eq("product_id", productId)
    .eq("lang", lang)
    .single();

  if (error) {
    console.error("Error fetching product metadata:", error);
    return null;
  }

  return data;
}

export async function getProductsMetadata(
  productIds: string[],
  lang: ValidLocale
): Promise<Record<string, ProductMetadata>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("product_metadata")
    .select("*")
    .in("product_id", productIds)
    .eq("lang", lang);

  if (error) {
    console.error("Error fetching products metadata:", error);
    return {};
  }

  return data.reduce((acc, meta) => {
    acc[meta.product_id] = meta;
    return acc;
  }, {} as Record<string, ProductMetadata>);
}
