import Link from 'next/link'

interface GroupCardProps {
  group: {
    id: string
    name: string
    description: string | null
    type: 'PUBLIC' | 'PRIVATE'
    avatarUrl: string | null
    creator: { username: string }
    _count: { members: number; posts: number }
  }
  locale: string
}

export function GroupCard({ group, locale }: GroupCardProps) {
  return (
    <Link
      href={`/${locale}/groups/${group.id}`}
      className="group bg-[#131318] border border-zinc-800 rounded-xl p-5 hover:border-zinc-600 transition-all hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl">
          {group.avatarUrl ? (
            <img src={group.avatarUrl} alt={group.name} className="w-12 h-12 rounded-xl object-cover" />
          ) : '💬'}
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
          group.type === 'PUBLIC'
            ? 'bg-green-500/10 text-green-400 border-green-500/30'
            : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
        }`}>
          {group.type === 'PUBLIC' ? 'Public' : 'Privé'}
        </span>
      </div>

      <h3 className="font-display text-white font-semibold text-lg mb-1 group-hover:text-[#e84142] transition-colors">
        {group.name}
      </h3>
      {group.description && (
        <p className="text-zinc-500 text-sm line-clamp-2 mb-3">{group.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <span>👥 {group._count.members} membres</span>
        <span>🔍 {group._count.posts} trouvailles</span>
        <span className="ml-auto">par {group.creator.username}</span>
      </div>
    </Link>
  )
}
