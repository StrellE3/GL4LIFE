import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    currency: string
    batch: string
    rating: number
    imageUrl: string | null
    category: {
      nameFr: string
      slug: string
    }
    _count: {
      qcPhotos: number
    }
  }
}

// This is a server component - can't use useLocale hook
// Use a link with a generic path pattern
export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/fr/products/${product.slug}`}
      className="group bg-[#131318] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Image */}
      <div className="aspect-square bg-zinc-900 relative overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 text-4xl">
            📦
          </div>
        )}
        {/* Batch badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs font-medium px-2 py-0.5 rounded-full">
            {product.batch}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="text-white text-sm font-medium leading-tight line-clamp-2">
          {product.name}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full">
            {product.category.nameFr}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#e84142] font-semibold text-base">
            {product.currency}{product.price}
          </span>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {product.rating > 0 && (
              <span>⭐ {product.rating.toFixed(1)}</span>
            )}
            {product._count.qcPhotos > 0 && (
              <span>📸 {product._count.qcPhotos}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
