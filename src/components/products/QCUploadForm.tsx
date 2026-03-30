'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface QCUploadFormProps {
  productId: string
  onSuccess: () => void
}

export function QCUploadForm({ productId, onSuccess }: QCUploadFormProps) {
  const [verdict, setVerdict] = useState<'GL' | 'RL'>('GL')
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (files.length === 0) {
      setError('Ajoutez au moins une image')
      return
    }
    setLoading(true)
    setError(null)

    try {
      // Upload images to Supabase Storage
      const imageUrls: string[] = []
      for (const file of files) {
        const path = `qc/${productId}/${Date.now()}-${file.name}`
        const { error: uploadError } = await supabase.storage
          .from('qc-photos')
          .upload(path, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('qc-photos').getPublicUrl(path)
        imageUrls.push(data.publicUrl)
      }

      // Save to DB via API
      const res = await fetch('/api/qc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, verdict, comment, images: imageUrls }),
      })

      if (!res.ok) throw new Error('Erreur lors de la soumission')

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#131318] border border-zinc-800 rounded-xl p-6 space-y-4"
    >
      <h3 className="font-display text-lg font-semibold text-white">Soumettre des QC</h3>

      {/* Verdict */}
      <div className="flex gap-3">
        {(['GL', 'RL'] as const).map(v => (
          <button
            key={v}
            type="button"
            onClick={() => setVerdict(v)}
            className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
              verdict === v
                ? v === 'GL'
                  ? 'bg-green-500/20 border-green-500/50 text-green-300'
                  : 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-transparent border-zinc-700 text-zinc-400 hover:text-white'
            }`}
          >
            {v === 'GL' ? '✅ Green Light' : '❌ Red Light'}
          </button>
        ))}
      </div>

      {/* Images */}
      <div>
        <label className="block text-zinc-400 text-sm mb-2">
          Images (max 6)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => {
            const selected = Array.from(e.target.files ?? []).slice(0, 6)
            setFiles(selected)
          }}
          className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-white file:text-xs"
        />
        {files.length > 0 && (
          <p className="text-zinc-500 text-xs mt-1">{files.length} fichier(s) sélectionné(s)</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="block text-zinc-400 text-sm mb-2">Commentaire (optionnel)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Vos observations sur la qualité..."
          rows={3}
          className="w-full bg-[#0a0a0c] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#e84142] transition-colors resize-none"
        />
      </div>

      {error && <p className="text-[#e84142] text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#e84142] hover:bg-[#c73535] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Upload en cours...' : 'Soumettre'}
      </button>
    </form>
  )
}
