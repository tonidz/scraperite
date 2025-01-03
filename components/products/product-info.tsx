interface ProductInfoProps {
  name: string
  description: string
}

export function ProductInfo({ name, description }: ProductInfoProps) {
  return (
    <div className="mb-4 group cursor-pointer">
      <h3 className="text-xl font-bold transition-colors group-hover:text-gray-600">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}