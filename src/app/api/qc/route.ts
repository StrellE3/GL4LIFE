import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/auth/permissions'
import { z } from 'zod'

const QCSchema = z.object({
  productId: z.string().uuid(),
  verdict: z.enum(['GL', 'RL']),
  comment: z.string().max(500).optional(),
  images: z.array(z.string().url()).min(1).max(6),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || !hasPermission(dbUser.role, 'canUploadQC')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = QCSchema.parse(body)

    const qcPhoto = await prisma.qCPhoto.create({
      data: {
        productId: data.productId,
        verdict: data.verdict,
        comment: data.comment,
        images: data.images,
        userId: dbUser.id,
      },
    })

    return NextResponse.json(qcPhoto)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
