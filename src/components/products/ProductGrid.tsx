import { ProductCard } from './ProductCard'

interface Product {
  id: string
  name: string
  nameEn: string
  slug: string
  price: number
  currency: string
  batch: string
  seller: string
  rating: number
  imageUrl: string | null
  category: {
    name: string
    nameFr: string
    slug: string
  }
  _count: {
    qcPhotos: number
  }
}

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-500 text-lg">Aucun produit trouvé</p>
        <p className="text-zinc-600 text-sm mt-2">Essayez de modifier vos filtres</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
