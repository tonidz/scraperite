"use client";

import { type StripeProduct } from '@/lib/stripe/products';
import { ProductImage } from './product-image';
import { ProductInfo } from './product-info';
import { ProductActions } from './product-actions';
import { useRouter, useParams } from 'next/navigation';

interface ProductCardProps {
  product: StripeProduct;
  dict: {
    shopNow: string;
  };
}

export function ProductCard({ product, dict }: ProductCardProps) {
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;

  if (!product.defaultPrice) return null;

  const handleNavigate = () => {
    router.push(`/${lang}/products/${product.id}`);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg">
      <div onClick={handleNavigate} className="cursor-pointer">
        <ProductInfo
          name={product.name}
          description={product.description || ''}
        />
        <ProductImage
          src={product.images[0]}
          alt={product.name}
        />
      </div>
      <ProductActions
        product={product}
        dict={dict}
      />
    </div>
  );
}