"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "./cart-item"
import { CartSummary } from "./cart-summary"
import { useParams } from "next/navigation"
import { getDictionary } from "@/i18n/get-dictionary"
import { useEffect, useState } from "react"

export function CartSheet() {
  const cart = useCart()
  const params = useParams()
  const [dict, setDict] = useState<any>(null)

  useEffect(() => {
    const loadDictionary = async () => {
      const dictionary = await getDictionary(params.lang as any)
      setDict(dictionary)
    }
    loadDictionary()
  }, [params.lang])

  if (!dict) return null

  return (
    <Sheet open={cart.isOpen} onOpenChange={cart.toggleCart}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{dict.cart.title}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} dict={dict.cart} />
            ))}
          </div>
          <CartSummary dict={dict.cart} />
        </div>
      </SheetContent>
    </Sheet>
  )
}