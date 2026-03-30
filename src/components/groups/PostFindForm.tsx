'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PostFindForm({ groupId }: { groupId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [price, setPrice] = useState('')
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/groups/${groupId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, price, link }),
    })

    if (res.ok) {
      setOpen(false)
      setTitle('')
      setContent('')
      setPrice('')
      setLink('')
      router.refresh()
    }
    setLoading(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-[#131318] border border-zinc-700 hover:border-zinc-500 rounded-xl px-4 py-3 text-zinc-500 hover:text-zinc-300 text-sm text-left transition-colors"
      >
        + Publier une trouvaille...
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#131318] border border-zinc-700 rounded-xl p-5 space-y-3">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Titre de la trouvaille..."
        required
        className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm"
      />
      <div className="flex gap-3">
        <input
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Prix (ex: 199¥)"
          className="flex-1 bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm"
        />
        <input
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="Lien Weidian/Taobao..."
          className="flex-1 bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm"
        />
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Description (optionnel)..."
        rows={2}
        className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm resize-none"
      />
      <div className="flex gap-3">
        <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-[#e84142] hover:bg-[#c73535] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
          {loading ? 'Publication...' : 'Publier'}
        </button>
      </div>
    </form>
  )
}
