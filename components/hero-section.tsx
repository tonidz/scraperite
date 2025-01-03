"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export function HeroSection() {
  return (
    <div className="relative min-h-[600px] grid grid-cols-2 gap-8">
      {/* Left Content */}
      <div className="flex flex-col justify-center space-y-8">
        <div>
          <h1 className="text-[40px] font-bold leading-tight">
            SKIN
            <br />
            PROTECTION
            <br />
            CREAM
          </h1>
          <p className="text-sm mt-4 text-gray-600 max-w-sm">
            Seedly say has suitable disposal and boy. Exercise joy man children rejoiced.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-4xl font-bold">01</span>
          <span className="text-xl text-gray-500">02 ......</span>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            className="bg-black text-white rounded-full px-6 py-2 flex items-center gap-2"
            variant="default"
          >
            <ShoppingBag className="h-4 w-4" />
            Best Signup Offers
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-16">
          <Stats />
        </div>
      </div>

      {/* Right Content - Image Circle */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#87CEEB] rounded-full transform scale-125 translate-x-1/4" />
        <img
          src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6"
          alt="Model with Hat"
          className="absolute inset-0 w-full h-full object-cover rounded-l-full"
        />
      </div>
    </div>
  )
}