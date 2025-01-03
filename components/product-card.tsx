"use client"

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { type Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const cart = useCart()

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
      </div>
      <div className="aspect-[4/3] relative mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-3xl font-bold">${product.price}</span>
        <Button 
          onClick={() => cart.addItem(product)}
          variant="outline"
          className="rounded-full px-6"
        >
          Shop Now
        </Button>
      </div>
    </div>
  )
}