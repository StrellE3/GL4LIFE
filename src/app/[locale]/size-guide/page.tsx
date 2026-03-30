import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default async function SizeGuidePage() {
  const categories = await prisma.category.findMany({
    include: { sizeChart: true },
    orderBy: { name: 'asc' },
  })

  const withChart = categories.filter(c => c.sizeChart)

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display text-4xl font-bold text-white mb-8">Guide des tailles</h1>

        {withChart.length === 0 ? (
          <div className="text-center py-20 bg-[#131318] border border-zinc-800 rounded-xl">
            <p className="text-zinc-500">Aucun guide de tailles disponible</p>
          </div>
        ) : (
          <div className="space-y-8">
            {withChart.map(cat => {
              const chart = cat.sizeChart!
              const rows = chart.rows as string[][]
              return (
                <div key={cat.id} className="bg-[#131318] border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-zinc-800">
                    <h2 className="font-display text-xl font-bold text-white">{cat.nameFr}</h2>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          {chart.headers.map(h => (
                            <th key={h} className="text-left py-2 pr-6 text-zinc-400 font-medium">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, i) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-zinc-900/20' : ''}>
                            {row.map((cell, j) => (
                              <td key={j} className="py-2.5 pr-6 text-zinc-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
