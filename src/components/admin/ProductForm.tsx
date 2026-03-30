'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BATCHES = ['LJR', 'GX', 'VT', 'PK', 'OG', 'M Batch', 'HP', 'UA', 'Autre']

interface Category {
  id: string
  nameFr: string
}

interface InitialData {
  name: string
  nameEn: string
  nameCn: string
  slug: string
  description: string
  descriptionEn: string
  descriptionCn: string
  price: number
  batch: string
  seller: string
  categoryId: string
  weidianUrl: string
  taobaoUrl: string
  url1688: string
  imageUrl: string
  images: string[]
  sizes: string[]
  isActive: boolean
}

interface ProductFormProps {
  categories: Category[]
  mode: 'create' | 'edit'
  productId?: string
  locale: string
  initialData?: Partial<InitialData>
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ProductForm({ categories, mode, productId, locale, initialData }: ProductFormProps) {
  const router = useRouter()

  const [form, setForm] = useState({
    name: initialData?.name ?? '',
    nameEn: initialData?.nameEn ?? '',
    nameCn: initialData?.nameCn ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    descriptionEn: initialData?.descriptionEn ?? '',
    descriptionCn: initialData?.descriptionCn ?? '',
    price: initialData?.price?.toString() ?? '',
    batch: initialData?.batch ?? BATCHES[0],
    seller: initialData?.seller ?? '',
    categoryId: initialData?.categoryId ?? (categories[0]?.id ?? ''),
    weidianUrl: initialData?.weidianUrl ?? '',
    taobaoUrl: initialData?.taobaoUrl ?? '',
    url1688: initialData?.url1688 ?? '',
    imageUrl: initialData?.imageUrl ?? '',
    isActive: initialData?.isActive ?? true,
  })

  const [images, setImages] = useState<string[]>(initialData?.images ?? [])
  const [imageInput, setImageInput] = useState('')
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes ?? [])
  const [sizeInput, setSizeInput] = useState('')
  const [slugManual, setSlugManual] = useState(mode === 'edit')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleNameChange(value: string) {
    setForm(f => ({
      ...f,
      name: value,
      slug: slugManual ? f.slug : slugify(value),
    }))
  }

  function addImage() {
    const url = imageInput.trim()
    if (url && !images.includes(url)) {
      setImages([...images, url])
      setImageInput('')
    }
  }

  function removeImage(url: string) {
    setImages(images.filter(i => i !== url))
  }

  function addSize(raw: string) {
    const val = raw.trim()
    if (val && !sizes.includes(val)) {
      setSizes([...sizes, val])
    }
    setSizeInput('')
  }

  function removeSize(s: string) {
    setSizes(sizes.filter(x => x !== s))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      images,
      sizes,
    }

    try {
      const url = mode === 'create'
        ? '/api/admin/products'
        : `/api/admin/products/${productId}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(JSON.stringify(data.error))
      }

      router.push(`/${locale}/admin/products`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">

      {/* Noms */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Nom du produit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Nom (FR) *">
            <input
              required
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Air Jordan 1 Retro High OG"
              className={inputCls}
            />
          </Field>
          <Field label="Nom (EN) *">
            <input
              required
              value={form.nameEn}
              onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
              placeholder="Air Jordan 1 Retro High OG"
              className={inputCls}
            />
          </Field>
          <Field label="Nom (CN) *">
            <input
              required
              value={form.nameCn}
              onChange={e => setForm(f => ({ ...f, nameCn: e.target.value }))}
              placeholder="乔丹1代复刻高帮"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Slug *">
          <div className="flex gap-2">
            <input
              required
              value={form.slug}
              onChange={e => {
                setSlugManual(true)
                setForm(f => ({ ...f, slug: e.target.value }))
              }}
              placeholder="air-jordan-1-retro-high-og"
              className={inputCls}
            />
            {slugManual && (
              <button
                type="button"
                onClick={() => {
                  setSlugManual(false)
                  setForm(f => ({ ...f, slug: slugify(f.name) }))
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 whitespace-nowrap transition-colors"
              >
                ↺ Auto
              </button>
            )}
          </div>
        </Field>
      </section>

      {/* Descriptions */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Description</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Description (FR)">
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              placeholder="Description en français..."
              className={textareaCls}
            />
          </Field>
          <Field label="Description (EN)">
            <textarea
              value={form.descriptionEn}
              onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))}
              rows={4}
              placeholder="English description..."
              className={textareaCls}
            />
          </Field>
          <Field label="Description (CN)">
            <textarea
              value={form.descriptionCn}
              onChange={e => setForm(f => ({ ...f, descriptionCn: e.target.value }))}
              rows={4}
              placeholder="中文描述..."
              className={textareaCls}
            />
          </Field>
        </div>
      </section>

      {/* Infos produit */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Infos produit</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Catégorie *">
            <select
              required
              value={form.categoryId}
              onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
              className={selectCls}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nameFr}</option>
              ))}
            </select>
          </Field>

          <Field label="Batch *">
            <select
              value={BATCHES.includes(form.batch) ? form.batch : 'Autre'}
              onChange={e => {
                if (e.target.value !== 'Autre') {
                  setForm(f => ({ ...f, batch: e.target.value }))
                }
              }}
              className={selectCls}
            >
              {BATCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </Field>

          <Field label="Prix (¥) *">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              placeholder="199"
              className={inputCls}
            />
          </Field>

          <Field label="Vendeur *">
            <input
              required
              value={form.seller}
              onChange={e => setForm(f => ({ ...f, seller: e.target.value }))}
              placeholder="NikeOfficialStore"
              className={inputCls}
            />
          </Field>
        </div>

        {/* Batch libre si "Autre" sélectionné ou pas dans la liste */}
        {!BATCHES.slice(0, -1).includes(form.batch) && (
          <Field label="Batch personnalisé *">
            <input
              required
              value={form.batch}
              onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
              placeholder="ex: TB"
              className={inputCls}
            />
          </Field>
        )}

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 accent-[#e84142]"
            />
            <span className="text-zinc-300 text-sm">Produit actif (visible sur le site)</span>
          </label>
        </div>
      </section>

      {/* Tailles */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Tailles disponibles</h2>
        <div className="flex gap-2">
          <input
            value={sizeInput}
            onChange={e => setSizeInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addSize(sizeInput)
              }
            }}
            placeholder="ex: 38, 39, 40... (Entrée pour ajouter)"
            className={`${inputCls} flex-1`}
          />
          <button
            type="button"
            onClick={() => addSize(sizeInput)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
          >
            Ajouter
          </button>
        </div>
        {sizes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sizes.map(s => (
              <span
                key={s}
                className="bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm px-3 py-1 rounded-full flex items-center gap-2"
              >
                {s}
                <button
                  type="button"
                  onClick={() => removeSize(s)}
                  className="text-zinc-500 hover:text-red-400 transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Images */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Images</h2>
        <Field label="Image principale (URL)">
          <input
            value={form.imageUrl}
            onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
            className={inputCls}
          />
        </Field>

        <div>
          <label className="block text-zinc-400 text-sm mb-2">Galerie (URLs supplémentaires)</label>
          <div className="flex gap-2 mb-3">
            <input
              value={imageInput}
              onChange={e => setImageInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addImage()
                }
              }}
              placeholder="https://... (Entrée pour ajouter)"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={addImage}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              Ajouter
            </button>
          </div>
          {images.length > 0 && (
            <div className="space-y-2">
              {images.map((url, i) => (
                <div key={i} className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-10 h-10 object-cover rounded" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  <span className="text-zinc-400 text-xs flex-1 truncate">{url}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="text-zinc-600 hover:text-red-400 transition-colors text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Liens agents */}
      <section className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Liens W2C</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Weidian">
            <input
              value={form.weidianUrl}
              onChange={e => setForm(f => ({ ...f, weidianUrl: e.target.value }))}
              placeholder="https://weidian.com/item.html?itemID=..."
              className={inputCls}
            />
          </Field>
          <Field label="Taobao">
            <input
              value={form.taobaoUrl}
              onChange={e => setForm(f => ({ ...f, taobaoUrl: e.target.value }))}
              placeholder="https://item.taobao.com/item.htm?id=..."
              className={inputCls}
            />
          </Field>
          <Field label="1688">
            <input
              value={form.url1688}
              onChange={e => setForm(f => ({ ...f, url1688: e.target.value }))}
              placeholder="https://detail.1688.com/offer/..."
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      {error && (
        <p className="text-[#e84142] text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#e84142] hover:bg-[#c73535] disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          {loading
            ? (mode === 'create' ? 'Création...' : 'Sauvegarde...')
            : (mode === 'create' ? 'Créer le produit' : 'Sauvegarder les modifications')
          }
        </button>
        <button
          type="button"
          onClick={() => router.push(`/${locale}/admin/products`)}
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-zinc-400 text-xs mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] transition-colors'

const textareaCls =
  'w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] transition-colors resize-none'

const selectCls =
  'w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#e84142] transition-colors'
