"use client"

import { type StripeProduct } from "@/lib/stripe/products"
import { ProductCard } from "./product-card"
import { motion } from "framer-motion"

interface RelatedProductsProps {
  products: StripeProduct[]
  currentProductId: string
  dict: {
    title: string
    shopNow: string
  }
}

export function RelatedProducts({ products, currentProductId, dict }: RelatedProductsProps) {
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 3)

  return (
    <section className="mt-24">
      <motion.h2 
        className="text-2xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {dict.title}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            dict={dict} 
          />
        ))}
      </div>
    </section>
  )
}