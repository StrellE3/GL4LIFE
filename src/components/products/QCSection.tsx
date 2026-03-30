'use client'

import { useState } from 'react'
import type { User } from '@prisma/client'
import { hasPermission } from '@/lib/auth/permissions'
import { QCUploadForm } from './QCUploadForm'

interface QCPhoto {
  id: string
  images: string[]
  verdict: 'GL' | 'RL'
  comment: string | null
  createdAt: Date
  user: {
    username: string
    role: string
    avatarUrl: string | null
  }
}

interface QCSectionProps {
  productId: string
  qcPhotos: QCPhoto[]
  user: User | null
}

export function QCSection({ productId, qcPhotos, user }: QCSectionProps) {
  const [showUpload, setShowUpload] = useState(false)
  const canUpload = user && hasPermission(user.role as any, 'canUploadQC')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-white">
          Photos QC <span className="text-zinc-500 text-lg font-normal">({qcPhotos.length})</span>
        </h2>
        {canUpload && (
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-[#e84142] hover:bg-[#c73535] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {showUpload ? 'Annuler' : '+ Uploader des QC'}
          </button>
        )}
      </div>

      {showUpload && canUpload && (
        <div className="mb-8">
          <QCUploadForm productId={productId} onSuccess={() => setShowUpload(false)} />
        </div>
      )}

      {qcPhotos.length === 0 ? (
        <div className="text-center py-12 bg-[#131318] border border-zinc-800 rounded-xl">
          <p className="text-zinc-500">Aucune photo QC pour ce produit</p>
          {!user && (
            <p className="text-zinc-600 text-sm mt-1">Connectez-vous pour en soumettre</p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {qcPhotos.map(qc => (
            <QCCard key={qc.id} qc={qc} />
          ))}
        </div>
      )}
    </div>
  )
}

function QCCard({ qc }: { qc: QCPhoto }) {
  const isGL = qc.verdict === 'GL'

  return (
    <div className="bg-[#131318] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#e84142] flex items-center justify-center text-white text-xs font-bold">
            {qc.user.username[0].toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">{qc.user.username}</span>
              <span className="bg-zinc-700 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                {qc.user.role}
              </span>
            </div>
            <p className="text-zinc-600 text-xs">
              {new Date(qc.createdAt).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-bold px-3 py-1 rounded-full border ${
            isGL
              ? 'bg-green-500/15 text-green-400 border-green-500/30'
              : 'bg-red-500/15 text-red-400 border-red-500/30'
          }`}
        >
          {isGL ? '✅ GL' : '❌ RL'}
        </span>
      </div>

      {qc.images.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-3">
          {qc.images.map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img
                src={img}
                alt={`QC ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700 hover:border-zinc-500 transition-colors"
              />
            </a>
          ))}
        </div>
      )}

      {qc.comment && (
        <p className="text-zinc-400 text-sm">{qc.comment}</p>
      )}
    </div>
  )
}
