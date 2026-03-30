import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/auth/permissions'
import { z } from 'zod'

const PostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(2000).optional(),
  price: z.string().max(20).optional(),
  link: z.string().url().optional().or(z.literal('')),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || !hasPermission(dbUser.role, 'canPost')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const membership = await prisma.groupMember.findUnique({
      where: { userId_groupId: { userId: dbUser.id, groupId } },
    })
    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }

    const body = await request.json()
    const data = PostSchema.parse(body)

    const post = await prisma.groupPost.create({
      data: {
        title: data.title,
        content: data.content,
        price: data.price,
        link: data.link || null,
        userId: dbUser.id,
        groupId,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
