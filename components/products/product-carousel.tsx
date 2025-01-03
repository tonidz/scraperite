"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "./product-card";
import type { StripeProduct } from "@/lib/stripe/products";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ProductCarouselProps {
  products: StripeProduct[];
  dict: {
    shopNow: string;
  };
}

export function ProductCarousel({ products, dict }: ProductCarouselProps) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  return (
    <div className="relative w-full max-w-6xl mx-auto ">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={`pl-2 md:pl-4 ${
                isMobile
                  ? "basis-full"
                  : isTablet
                  ? "basis-1/2"
                  : "lg:basis-1/3 xl:basis-1/4"
              }`}
            >
              <ProductCard product={product} dict={dict} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="absolute -left-12 top-1/2" />
          <CarouselNext className="absolute -right-12 top-1/2" />
        </div>
      </Carousel>
    </div>
  );
}
