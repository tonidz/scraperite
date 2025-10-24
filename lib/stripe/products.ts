import { stripe } from './server'
import { cache } from 'react'
import type Stripe from 'stripe'

export interface StripeProduct {
  id: string
  name: string
  description: string | null
  images: string[]
  defaultPrice: {
    id: string
    unitAmount: number
    currency: string
  } | null
  metadata: {
    [key: string]: string
  }
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  metadata?: {
    [key: string]: string;
  };
}

export const getProducts = cache(async (): Promise<StripeProduct[]> => {
  const { data: products } = await stripe.products.list({
    expand: ['data.default_price'],
    active: true,
  })

  return products.map((product) => {
    const defaultPrice = product.default_price as Stripe.Price | null

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      defaultPrice: defaultPrice
        ? {
            id: defaultPrice.id,
            unitAmount: defaultPrice.unit_amount || 0,
            currency: defaultPrice.currency,
          }
        : null,
      metadata: product.metadata,
    }
  })
})

export const getProduct = cache(async (id: string): Promise<StripeProduct> => {
  const product = await stripe.products.retrieve(id, {
    expand: ['default_price'],
  })

  const defaultPrice = product.default_price as Stripe.Price | null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    defaultPrice: defaultPrice
      ? {
          id: defaultPrice.id,
          unitAmount: defaultPrice.unit_amount || 0,
          currency: defaultPrice.currency,
        }
      : null,
    metadata: product.metadata,
  }
})