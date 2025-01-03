"use client"

import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { useToast } from '@/hooks/use-toast'
import { type StripeProduct } from '@/lib/stripe/products'
import { formatCurrency } from '@/lib/stripe/config'
import { ShoppingCart } from 'lucide-react'
import { useMediaQuery } from '@/hooks/use-media-query'

interface ProductActionsProps {
  product: StripeProduct
  dict: {
    shopNow: string
  }
}

export function ProductActions({ product, dict }: ProductActionsProps) {
  const cart = useCart()
  const { toast } = useToast()
  const isMobileOrTablet = useMediaQuery("(max-width: 1024px)")

  const handleAddToCart = () => {
    if (!product.defaultPrice) return

    cart.addItem({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.defaultPrice.unitAmount / 100,
      priceId: product.defaultPrice.id,
      image: product.images[0],
      quantity: 1,
    })

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  if (!product.defaultPrice) return null

  return (
    <div className="flex items-center justify-between">
      <span className="text-3xl font-bold">
        {formatCurrency(product.defaultPrice.unitAmount / 100)}
      </span>
      <Button 
        onClick={handleAddToCart}
        variant="outline"
        className="rounded-full"
        size={isMobileOrTablet ? "icon" : "default"}
      >
        {isMobileOrTablet ? (
          <ShoppingCart className="h-4 w-4" />
        ) : (
          <span className="px-4">{dict.shopNow}</span>
        )}
      </Button>
    </div>
  )
}