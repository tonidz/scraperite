"use client"

import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <div className="aspect-[4/3] relative mb-4 overflow-hidden rounded-lg bg-white group">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  )
}