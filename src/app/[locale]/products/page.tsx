import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import { getTranslations } from 'next-intl/server'

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    batch?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const t = await getTranslations('products')

  const categories = await prisma.category.findMany({
    select: { id: true, name: true, nameFr: true, slug: true },
    orderBy: { name: 'asc' },
  })

  const where = {
    isActive: true,
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: 'insensitive' as const } },
        { nameEn: { contains: params.search, mode: 'insensitive' as const } },
        { batch: { contains: params.search, mode: 'insensitive' as const } },
        { seller: { contains: params.search, mode: 'insensitive' as const } },
      ],
    }),
    ...(params.category && { category: { slug: params.category } }),
    ...(params.batch && { batch: params.batch }),
  }

  const orderBy = {
    newest: { createdAt: 'desc' as const },
    priceAsc: { price: 'asc' as const },
    priceDesc: { price: 'desc' as const },
    bestRated: { rating: 'desc' as const },
  }[params.sort ?? 'newest'] ?? { createdAt: 'desc' as const }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: { select: { name: true, nameFr: true, slug: true } },
      _count: { select: { qcPhotos: true } },
    },
  })

  const BATCHES = ['LJR', 'GX', 'VT', 'PK', 'OG', 'M Batch', 'HP']

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-4xl font-bold text-white mb-8">{t('title')}</h1>
        <ProductFilters
          categories={categories}
          batches={BATCHES}
          currentSearch={params.search ?? ''}
          currentCategory={params.category ?? ''}
          currentBatch={params.batch ?? ''}
          currentSort={params.sort ?? 'newest'}
        />
        <ProductGrid products={products} />
      </main>
      <Footer />
    </>
  )
}
