import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'

export default async function AdminProductsPage() {
  const locale = await getLocale()
  const products = await prisma.product.findMany({
    include: {
      category: { select: { nameFr: true } },
      _count: { select: { qcPhotos: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Produits</h1>
        <Link
          href={`/${locale}/admin/products/new`}
          className="bg-[#e84142] hover:bg-[#c73535] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          + Ajouter
        </Link>
      </div>

      <div className="bg-[#131318] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-left px-6 py-4 font-medium">Produit</th>
              <th className="text-left px-6 py-4 font-medium">Catégorie</th>
              <th className="text-left px-6 py-4 font-medium">Batch</th>
              <th className="text-left px-6 py-4 font-medium">Prix</th>
              <th className="text-left px-6 py-4 font-medium">QC</th>
              <th className="text-left px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{p.name}</p>
                  <p className="text-zinc-500 text-xs">{p.seller}</p>
                </td>
                <td className="px-6 py-4 text-zinc-400">{p.category.nameFr}</td>
                <td className="px-6 py-4">
                  <span className="bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs px-2 py-0.5 rounded-full">
                    {p.batch}
                  </span>
                </td>
                <td className="px-6 py-4 text-[#e84142] font-semibold">{p.currency}{p.price}</td>
                <td className="px-6 py-4 text-zinc-400">{p._count.qcPhotos}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/${locale}/admin/products/${p.id}/edit`}
                      className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Éditer
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-12 text-zinc-500">Aucun produit</div>
        )}
      </div>
    </div>
  )
}

function DeleteProductButton({ productId }: { productId: string }) {
  return (
    <form action={async () => {
      'use server'
      const { prisma: db } = await import('@/lib/prisma')
      await db.product.delete({ where: { id: productId } })
    }}>
      <button
        type="submit"
        className="text-xs bg-red-900/50 hover:bg-red-800/50 text-red-300 px-3 py-1.5 rounded-lg transition-colors"
        onClick={e => { if (!confirm('Supprimer ce produit ?')) e.preventDefault() }}
      >
        Supprimer
      </button>
    </form>
  )
}
