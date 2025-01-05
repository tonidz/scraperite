export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  featured?: boolean
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string;
  image: string;
  quantity: number;
}