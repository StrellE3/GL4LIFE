'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  mainImage: string | null
  images: string[]
  alt: string
}

export function ImageGallery({ mainImage, images, alt }: ImageGalleryProps) {
  const allImages = [mainImage, ...images].filter(Boolean) as string[]
  const [active, setActive] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-700 text-6xl">
        📦
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square bg-zinc-900 rounded-2xl overflow-hidden relative">
        <Image
          src={allImages[active]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden relative border-2 transition-colors ${
                active === i ? 'border-[#e84142]' : 'border-zinc-700 hover:border-zinc-500'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
