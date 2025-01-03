"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { ProductCard } from '@/components/product-card'
import { PRODUCTS } from '@/lib/constants'

export function ProductCarousel() {
  return (
    <div className="mt-16">
      <h2 className="text-4xl font-bold mb-8">Trendy Collection</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {PRODUCTS.map((product) => (
            <CarouselItem key={product.id} className="pl-4 basis-1/3">
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="bg-white rounded-full" />
        <CarouselNext className="bg-white rounded-full" />
      </Carousel>
    </div>
  )
}