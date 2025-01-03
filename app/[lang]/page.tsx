import { HeroSection } from "@/components/hero/hero-section";
import { ProductShowcase } from "@/components/products/product-showcase";
import { GuideSection } from "@/components/guide/guide-section";
import { getDictionary } from "@/i18n/get-dictionary";
import type { ValidLocale } from "@/i18n/config";
import { locales } from "@/i18n/config";
import { TestimonialsSection } from "@/components/testimonials/testimonials-section";
import { FeaturedPosts } from "@/components/posts/featured-posts";

interface HomePageProps {
  params: {
    lang: ValidLocale;
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function HomePage({ params: { lang } }: HomePageProps) {
  const dict = await getDictionary(lang);
  const videoIds = ["29btpnq90OU", "eBUP5CdGnS0", "1U5N3rzKA0M", "0ieltFCu66E"];

  return (
    <>
      <HeroSection dict={dict.hero} />
      <ProductShowcase dict={dict.products} />
      <GuideSection dict={dict.guide} videos={videoIds} />
      <TestimonialsSection dict={dict.testimonials} />
      <ProductShowcase dict={dict.products} />
      <FeaturedPosts />
    </>
  );
}
