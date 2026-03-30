import { prisma } from '@/lib/prisma'

export default async function AdminGroupsPage() {
  const groups = await prisma.group.findMany({
    include: {
      creator: { select: { username: true } },
      _count: { select: { members: true, posts: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Groupes</h1>
      <div className="bg-[#131318] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-left px-6 py-4 font-medium">Groupe</th>
              <th className="text-left px-6 py-4 font-medium">Type</th>
              <th className="text-left px-6 py-4 font-medium">Membres</th>
              <th className="text-left px-6 py-4 font-medium">Trouvailles</th>
              <th className="text-left px-6 py-4 font-medium">Créateur</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{g.name}</p>
                  {g.description && (
                    <p className="text-zinc-500 text-xs line-clamp-1">{g.description}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    g.type === 'PUBLIC'
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  }`}>
                    {g.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-400">{g._count.members}</td>
                <td className="px-6 py-4 text-zinc-400">{g._count.posts}</td>
                <td className="px-6 py-4 text-zinc-500">{g.creator.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && (
          <div className="text-center py-12 text-zinc-500">Aucun groupe</div>
        )}
      </div>
    </div>
  )
}
