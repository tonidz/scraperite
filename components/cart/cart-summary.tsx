"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useCheckout } from "@/hooks/use-checkout"
import { formatCurrency } from "@/lib/stripe/config"

interface CartSummaryProps {
  dict: {
    total: string
    checkout: string
    empty?: string
  }
}

export function CartSummary({ dict }: CartSummaryProps) {
  const cart = useCart()
  const { checkout, isLoading } = useCheckout()
  
  const total = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  return (
    <div className="border-t py-4">
      <div className="flex justify-between mb-4">
        <span>{dict.total}</span>
        <span className="font-bold">{formatCurrency(total)}</span>
      </div>
      <Button 
        className="w-full"
        onClick={checkout}
        disabled={cart.items.length === 0 || isLoading}
      >
        {isLoading ? "Processing..." : dict.checkout}
      </Button>
      {cart.items.length === 0 && (
        <p className="text-center text-gray-500 mt-4">{dict.empty}</p>
      )}
    </div>
  )
}