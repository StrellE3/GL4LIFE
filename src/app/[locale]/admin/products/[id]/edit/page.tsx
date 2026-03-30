import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/getUser'
import { redirect, notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/')

  const locale = await getLocale()
  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      select: { id: true, nameFr: true },
      orderBy: { name: 'asc' },
    }),
  ])

  if (!product) notFound()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/${locale}/admin/products`}
          className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          ← Produits
        </Link>
        <span className="text-zinc-700">/</span>
        <h1 className="font-display text-3xl font-bold text-white truncate max-w-xl">
          Éditer — {product.name}
        </h1>
      </div>

      <ProductForm
        categories={categories}
        mode="edit"
        productId={product.id}
        locale={locale}
        initialData={{
          name: product.name,
          nameEn: product.nameEn,
          nameCn: product.nameCn,
          slug: product.slug,
          description: product.description ?? '',
          descriptionEn: product.descriptionEn ?? '',
          descriptionCn: product.descriptionCn ?? '',
          price: product.price,
          batch: product.batch,
          seller: product.seller,
          categoryId: product.categoryId,
          weidianUrl: product.weidianUrl ?? '',
          taobaoUrl: product.taobaoUrl ?? '',
          url1688: product.url1688 ?? '',
          imageUrl: product.imageUrl ?? '',
          images: product.images,
          sizes: product.sizes,
          isActive: product.isActive,
        }}
      />
    </div>
  )
}
