'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

interface Category {
  id: string
  name: string
  nameFr: string
  slug: string
}

interface ProductFiltersProps {
  categories: Category[]
  batches: string[]
  currentSearch: string
  currentCategory: string
  currentBatch: string
  currentSort: string
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Plus récent' },
  { value: 'priceAsc', label: 'Prix croissant' },
  { value: 'priceDesc', label: 'Prix décroissant' },
  { value: 'bestRated', label: 'Meilleure note' },
]

export function ProductFilters({
  categories,
  batches,
  currentSearch,
  currentCategory,
  currentBatch,
  currentSort,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateParam('search', search)
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un produit, batch, vendeur..."
          className="flex-1 bg-[#131318] border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] transition-colors text-sm"
        />
        <button
          type="submit"
          className="bg-[#e84142] hover:bg-[#c73535] text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
        >
          Rechercher
        </button>
        {(currentSearch || currentCategory || currentBatch) && (
          <button
            type="button"
            onClick={() => {
              setSearch('')
              router.push(pathname)
            }}
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white px-4 py-3 rounded-xl text-sm transition-colors"
          >
            ✕ Reset
          </button>
        )}
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParam('category', '')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !currentCategory
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
              : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
          }`}
        >
          Tous
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => updateParam('category', currentCategory === cat.slug ? '' : cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentCategory === cat.slug
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
            }`}
          >
            {cat.nameFr}
          </button>
        ))}
      </div>

      {/* Batch + Sort row */}
      <div className="flex flex-wrap gap-3">
        <select
          value={currentBatch}
          onChange={e => updateParam('batch', e.target.value)}
          className="bg-[#131318] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#e84142] transition-colors"
        >
          <option value="">Tous les batches</option>
          {batches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={currentSort}
          onChange={e => updateParam('sort', e.target.value)}
          className="bg-[#131318] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-[#e84142] transition-colors"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
