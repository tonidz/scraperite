"use client"

import Link from 'next/link'
import { ShoppingBag, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'

export default function Navbar() {
  const cart = useCart()
  
  return (
    <div className="border-b bg-[#FFE566]">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-x-2">
          <ShoppingBag className="h-8 w-8" />
          <span className="font-bold text-xl">amazon</span>
        </Link>
        <nav className="mx-6 flex items-center space-x-8 flex-1 justify-center">
          <Link href="/collections" className="text-sm font-medium">
            Collections
          </Link>
          <Link href="/brands" className="text-sm font-medium">
            Brands
          </Link>
          <Link href="/new" className="text-sm font-medium">
            New
          </Link>
          <Link href="/sales" className="text-sm font-medium">
            Sales
          </Link>
          <span className="text-sm font-medium">
            ENG ▼
          </span>
        </nav>
        <div className="flex items-center gap-x-4">
          <Button variant="ghost" size="icon" className="bg-white rounded-full w-10 h-10">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => cart.toggleCart()} className="bg-white rounded-full w-10 h-10">
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}