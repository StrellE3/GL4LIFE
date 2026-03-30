import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const existing = await prisma.postLike.findUnique({
      where: { userId_postId: { userId: dbUser.id, postId } },
    })

    if (existing) {
      await prisma.postLike.delete({ where: { id: existing.id } })
      return NextResponse.json({ liked: false })
    } else {
      await prisma.postLike.create({ data: { userId: dbUser.id, postId } })
      return NextResponse.json({ liked: true })
    }
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
