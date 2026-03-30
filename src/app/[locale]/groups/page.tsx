import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth/getUser'
import { hasPermission } from '@/lib/auth/permissions'
import { GroupCard } from '@/components/groups/GroupCard'
import { CreateGroupModal } from '@/components/groups/CreateGroupModal'
import { getLocale } from 'next-intl/server'

export default async function GroupsPage() {
  const [user, groups] = await Promise.all([
    getCurrentUser(),
    prisma.group.findMany({
      include: {
        creator: { select: { username: true } },
        _count: { select: { members: true, posts: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  const locale = await getLocale()
  const canCreate = user && hasPermission(user.role, 'canCreateGroup')

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl font-bold text-white">Groupes</h1>
          {canCreate && <CreateGroupModal />}
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Aucun groupe pour l&apos;instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <GroupCard key={group.id} group={group} locale={locale} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
