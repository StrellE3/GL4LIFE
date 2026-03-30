import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getLocale } from 'next-intl/server'

export default async function HomePage() {
  const locale = await getLocale()

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight">
            Rep<span className="text-[#e84142]">Curator</span>
          </h1>
          <p className="text-zinc-400 text-xl sm:text-2xl mb-10 max-w-2xl mx-auto">
            La meilleure curation de produits rep — QC photos, guides de tailles, communauté
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href={`/${locale}/products`}
              className="bg-[#e84142] hover:bg-[#c73535] text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg"
            >
              Voir les produits
            </Link>
            <Link
              href={`/${locale}/groups`}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg"
            >
              Rejoindre la communauté
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '📸', title: 'Photos QC', desc: 'Green Light / Red Light par la communauté' },
              { icon: '📏', title: 'Guide des tailles', desc: 'Conversions EU/US/UK/CM pour chaque catégorie' },
              { icon: '🛒', title: 'Multi-agents', desc: 'CNFans, Hipobuy, Sugargoo, Pandabuy' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#131318] border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
