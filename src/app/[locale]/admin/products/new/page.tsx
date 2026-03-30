import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth/getUser'
import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import Link from 'next/link'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function NewProductPage() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') redirect('/')

  const locale = await getLocale()

  const categories = await prisma.category.findMany({
    select: { id: true, nameFr: true },
    orderBy: { name: 'asc' },
  })

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
        <h1 className="font-display text-3xl font-bold text-white">Nouveau produit</h1>
      </div>

      <ProductForm
        categories={categories}
        mode="create"
        locale={locale}
      />
    </div>
  )
}
