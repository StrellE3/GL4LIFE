'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CreateGroupModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, type }),
    })

    if (res.ok) {
      setOpen(false)
      setName('')
      setDescription('')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Erreur lors de la création')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#e84142] hover:bg-[#c73535] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
      >
        + Créer un groupe
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-[#131318] border border-zinc-800 rounded-2xl p-6 w-full max-w-md z-10">
            <h2 className="font-display text-xl font-bold text-white mb-5">Créer un groupe</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Nom du groupe</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mon groupe rep..."
                  required
                  className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Description (optionnel)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Décrivez votre groupe..."
                  rows={3}
                  className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                {(['PUBLIC', 'PRIVATE'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      type === t
                        ? 'bg-[#e84142]/15 border-[#e84142]/40 text-[#e84142]'
                        : 'bg-transparent border-zinc-700 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {t === 'PUBLIC' ? '🌐 Public' : '🔒 Privé'}
                  </button>
                ))}
              </div>
              {error && <p className="text-[#e84142] text-sm">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:text-white py-2.5 rounded-xl text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#e84142] hover:bg-[#c73535] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  {loading ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
