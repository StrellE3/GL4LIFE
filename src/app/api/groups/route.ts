import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/auth/permissions'
import { z } from 'zod'

const CreateGroupSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  type: z.enum(['PUBLIC', 'PRIVATE']),
})

export async function GET() {
  try {
    const groups = await prisma.group.findMany({
      include: {
        creator: { select: { username: true } },
        _count: { select: { members: true, posts: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(groups)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || !hasPermission(dbUser.role, 'canCreateGroup')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = CreateGroupSchema.parse(body)

    const group = await prisma.group.create({
      data: {
        ...data,
        creatorId: dbUser.id,
        members: {
          create: { userId: dbUser.id, role: 'OWNER' },
        },
      },
    })

    return NextResponse.json(group)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
