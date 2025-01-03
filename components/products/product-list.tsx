import { PRODUCTS } from '@/lib/constants'
import { ProductCard } from './product-card'

interface ProductListProps {
  dict: {
    shopNow: string
  }
}

export function ProductList({ dict }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {PRODUCTS.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          featured={index === 1}
          dict={dict}
        />
      ))}
    </div>
  )
}