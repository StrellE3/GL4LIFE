'use client'

import { useState } from 'react'

interface SizeChart {
  id: string
  headers: string[]
  rows: unknown
  categoryId: string
}

interface Category {
  id: string
  name: string
  nameFr: string
  sizeChart: SizeChart | null
}

export function SizeChartEditor({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<string>(categories[0]?.id ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const category = categories.find(c => c.id === selected)
  const chart = category?.sizeChart

  const defaultHeaders = ['EU', 'US', 'UK', 'CM']
  const [headers, setHeaders] = useState<string[]>(chart?.headers ?? defaultHeaders)
  const [rows, setRows] = useState<string[][]>((chart?.rows as string[][]) ?? [])

  function handleSelectCategory(id: string) {
    const cat = categories.find(c => c.id === id)
    setSelected(id)
    setHeaders(cat?.sizeChart?.headers ?? defaultHeaders)
    setRows((cat?.sizeChart?.rows as string[][]) ?? [])
  }

  function addRow() {
    setRows([...rows, Array(headers.length).fill('')])
  }

  function removeRow(i: number) {
    setRows(rows.filter((_, idx) => idx !== i))
  }

  function updateCell(rowIdx: number, colIdx: number, value: string) {
    const updated = rows.map((row, i) =>
      i === rowIdx ? row.map((cell, j) => (j === colIdx ? value : cell)) : row
    )
    setRows(updated)
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/admin/size-charts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId: selected, headers, rows }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div>
        <label className="block text-zinc-400 text-sm mb-2">Catégorie</label>
        <select
          value={selected}
          onChange={e => handleSelectCategory(e.target.value)}
          className="bg-[#131318] border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#e84142]"
        >
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.nameFr}</option>
          ))}
        </select>
      </div>

      {/* Table editor */}
      <div className="bg-[#131318] border border-zinc-800 rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700">
              {headers.map((h, i) => (
                <th key={i} className="pb-3 pr-4">
                  <input
                    value={h}
                    onChange={e => setHeaders(headers.map((hdr, idx) => idx === i ? e.target.value : hdr))}
                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-zinc-300 text-xs w-20 focus:outline-none"
                  />
                </th>
              ))}
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-zinc-900/20' : ''}>
                {row.map((cell, j) => (
                  <td key={j} className="py-1.5 pr-4">
                    <input
                      value={cell}
                      onChange={e => updateCell(i, j, e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white text-xs w-20 focus:outline-none focus:border-[#e84142]"
                    />
                  </td>
                ))}
                <td className="py-1.5">
                  <button
                    onClick={() => removeRow(i)}
                    className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addRow}
          className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          + Ajouter une ligne
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`bg-[#e84142] hover:bg-[#c73535] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm ${
          saved ? 'bg-green-600 hover:bg-green-600' : ''
        }`}
      >
        {saving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé' : 'Sauvegarder'}
      </button>
    </div>
  )
}
