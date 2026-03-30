import { prisma } from '@/lib/prisma'
import { UserRoleEditor } from '@/components/admin/UserRoleEditor'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { posts: true, qcPhotos: true } },
    },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Utilisateurs</h1>
      <div className="bg-[#131318] border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-400">
              <th className="text-left px-6 py-4 font-medium">Utilisateur</th>
              <th className="text-left px-6 py-4 font-medium">Rôle</th>
              <th className="text-left px-6 py-4 font-medium">Statut</th>
              <th className="text-left px-6 py-4 font-medium">Activité</th>
              <th className="text-left px-6 py-4 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-zinc-500 text-xs">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <UserRoleEditor userId={user.id} currentRole={user.role} />
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${
                    user.status === 'ACTIVE'
                      ? 'bg-green-500/10 text-green-400 border-green-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs">
                  {user._count.posts} posts · {user._count.qcPhotos} QC
                </td>
                <td className="px-6 py-4 text-zinc-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
