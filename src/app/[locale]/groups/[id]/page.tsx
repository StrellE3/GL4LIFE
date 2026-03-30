import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getCurrentUser } from '@/lib/auth/getUser'
import { hasPermission } from '@/lib/auth/permissions'
import { PostFindForm } from '@/components/groups/PostFindForm'
import { GroupPostCard } from '@/components/groups/GroupPostCard'

interface GroupPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      creator: { select: { username: true, id: true } },
      members: { include: { user: { select: { username: true, id: true } } } },
      posts: {
        include: {
          user: { select: { username: true, role: true } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { members: true } },
    },
  })

  if (!group) notFound()

  const isMember = user ? group.members.some(m => m.userId === user.id) : false
  const isPrivate = group.type === 'PRIVATE'
  const canPost = user && isMember && hasPermission(user.role, 'canPost')
  const canSeeContent = !isPrivate || isMember

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="bg-[#131318] border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-white">{group.name}</h1>
                <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                  group.type === 'PUBLIC'
                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                    : 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                }`}>
                  {group.type === 'PUBLIC' ? 'Public' : 'Privé'}
                </span>
              </div>
              {group.description && (
                <p className="text-zinc-400 text-sm">{group.description}</p>
              )}
              <p className="text-zinc-600 text-xs mt-2">
                Créé par {group.creator.username} · {group._count.members} membres · {group.posts.length} trouvailles
              </p>
            </div>
          </div>
        </div>

        {canSeeContent ? (
          <>
            {canPost && (
              <div className="mb-8">
                <PostFindForm groupId={group.id} />
              </div>
            )}
            {group.posts.length === 0 ? (
              <div className="text-center py-16 bg-[#131318] border border-zinc-800 rounded-xl">
                <p className="text-zinc-500">Aucune trouvaille pour l&apos;instant</p>
              </div>
            ) : (
              <div className="space-y-4">
                {group.posts.map(post => (
                  <GroupPostCard
                    key={post.id}
                    post={post}
                    currentUserId={user?.id}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-[#131318] border border-zinc-800 rounded-xl">
            <p className="text-zinc-500 text-lg">Groupe privé</p>
            <p className="text-zinc-600 text-sm mt-1">Rejoignez ce groupe pour voir le contenu</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
