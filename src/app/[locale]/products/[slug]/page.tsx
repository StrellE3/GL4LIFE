import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AgentButtons } from '@/components/products/AgentButtons'
import { QCSection } from '@/components/products/QCSection'
import { SizeGuideWidget } from '@/components/products/SizeGuideWidget'
import { ImageGallery } from '@/components/shared/ImageGallery'
import { getCurrentUser } from '@/lib/auth/getUser'
import { getLocale } from 'next-intl/server'

interface ProductPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const user = await getCurrentUser()

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        include: { sizeChart: true },
      },
      qcPhotos: {
        include: { user: { select: { username: true, role: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
      },
      sizeOverrides: true,
    },
  })

  if (!product || !product.isActive) notFound()

  const sourceUrl = product.weidianUrl || product.taobaoUrl || product.url1688

  const nameByLocale =
    locale === 'en' ? product.nameEn :
    locale === 'cn' ? product.nameCn :
    product.name

  const descByLocale =
    locale === 'en' ? (product.descriptionEn ?? product.description) :
    locale === 'cn' ? (product.descriptionCn ?? product.description) :
    product.description

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: images */}
          <div>
            <ImageGallery
              mainImage={product.imageUrl}
              images={product.images}
              alt={product.name}
            />
          </div>

          {/* Right: info */}
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-full">
                  {product.category.nameFr}
                </span>
                <span className="bg-violet-500/20 text-violet-300 border border-violet-500/40 text-xs px-2.5 py-1 rounded-full">
                  {product.batch}
                </span>
              </div>
              <h1 className="font-display text-3xl font-bold text-white leading-tight">
                {nameByLocale}
              </h1>
              {product.seller && (
                <p className="text-zinc-500 text-sm mt-1">par {product.seller}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[#e84142] font-bold text-3xl font-display">
                {product.currency}{product.price}
              </span>
              {product.rating > 0 && (
                <span className="text-zinc-400 text-sm">⭐ {product.rating.toFixed(1)}</span>
              )}
            </div>

            {descByLocale && (
              <p className="text-zinc-400 text-sm leading-relaxed">{descByLocale}</p>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-zinc-400 text-xs uppercase tracking-wider mb-2">Tailles disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <span
                      key={size}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-3 py-1 rounded-lg"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Agent buttons */}
            {sourceUrl && <AgentButtons sourceUrl={sourceUrl} />}
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-12">
          <QCSection
            productId={product.id}
            qcPhotos={product.qcPhotos}
            user={user}
          />
        </div>

        <div className="mt-8">
          <SizeGuideWidget
            sizeChart={product.category.sizeChart}
            sizeOverrides={product.sizeOverrides}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
