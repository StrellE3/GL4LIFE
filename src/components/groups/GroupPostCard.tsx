'use client'

import { useState } from 'react'

interface GroupPostCardProps {
  post: {
    id: string
    title: string
    content: string | null
    price: string | null
    link: string | null
    imageUrl: string | null
    createdAt: Date
    user: { username: string; role: string }
    _count: { likes: number; comments: number }
  }
  currentUserId: string | undefined
}

export function GroupPostCard({ post }: GroupPostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post._count.likes)

  async function handleLike() {
    const res = await fetch(`/api/groups/posts/${post.id}/like`, { method: 'POST' })
    if (res.ok) {
      setLiked(!liked)
      setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    }
  }

  return (
    <div className="bg-[#131318] border border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#e84142] flex items-center justify-center text-white text-xs font-bold">
            {post.user.username[0].toUpperCase()}
          </div>
          <span className="text-zinc-300 text-sm font-medium">{post.user.username}</span>
          <span className="text-zinc-600 text-xs">·</span>
          <span className="text-zinc-600 text-xs">
            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
          </span>
        </div>
        {post.price && (
          <span className="text-[#e84142] font-semibold text-sm">{post.price}</span>
        )}
      </div>

      <h3 className="text-white font-semibold mb-2">{post.title}</h3>
      {post.content && <p className="text-zinc-400 text-sm mb-3">{post.content}</p>}

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full max-h-80 object-cover rounded-lg mb-3 border border-zinc-700"
        />
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-zinc-800">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-[#e84142]' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
        <span className="flex items-center gap-1.5 text-zinc-500 text-sm">
          💬 {post._count.comments}
        </span>
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-zinc-500 hover:text-[#e84142] transition-colors"
          >
            Voir le lien →
          </a>
        )}
      </div>
    </div>
  )
}
