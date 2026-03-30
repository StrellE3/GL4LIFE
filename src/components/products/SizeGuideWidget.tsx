interface SizeChart {
  headers: string[]
  rows: unknown
}

interface SizeOverride {
  id: string
  sizeLabel: string
  values: unknown
}

interface SizeGuideWidgetProps {
  sizeChart: SizeChart | null
  sizeOverrides: SizeOverride[]
}

export function SizeGuideWidget({ sizeChart, sizeOverrides }: SizeGuideWidgetProps) {
  if (!sizeChart && sizeOverrides.length === 0) return null

  if (sizeOverrides.length > 0) {
    return (
      <div className="bg-[#131318] border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="font-display text-xl font-bold text-white">Guide des tailles</h2>
          <span className="bg-[#e84142]/15 text-[#e84142] border border-[#e84142]/30 text-xs px-2 py-0.5 rounded-full">
            Guide spécifique à cet article
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="text-left py-2 pr-4 text-zinc-400 font-medium">Taille</th>
                <th className="text-left py-2 text-zinc-400 font-medium">Valeurs</th>
              </tr>
            </thead>
            <tbody>
              {sizeOverrides.map((override, i) => (
                <tr key={override.id} className={i % 2 === 0 ? 'bg-zinc-900/30' : ''}>
                  <td className="py-2 pr-4 text-white font-medium">{override.sizeLabel}</td>
                  <td className="py-2 text-zinc-400 text-xs">
                    {JSON.stringify(override.values)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!sizeChart) return null

  const rows = sizeChart.rows as string[][]

  return (
    <div className="bg-[#131318] border border-zinc-800 rounded-xl p-6">
      <h2 className="font-display text-xl font-bold text-white mb-4">Guide des tailles</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700">
              {sizeChart.headers.map(h => (
                <th key={h} className="text-left py-2 pr-4 text-zinc-400 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-zinc-900/30' : ''}>
                {row.map((cell, j) => (
                  <td key={j} className="py-2 pr-4 text-zinc-300">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
