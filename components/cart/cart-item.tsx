"use client"

import Image from "next/image"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { type CartItem as CartItemType } from "@/types/product"

interface CartItemProps {
  item: CartItemType
  dict: {
    remove: string
    quantity: string
  }
}

export function CartItem({ item, dict }: CartItemProps) {
  const cart = useCart()

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-24 h-24">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => cart.removeItem(item.id)}
            title={dict.remove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">{item.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-gray-500">{dict.quantity}:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}