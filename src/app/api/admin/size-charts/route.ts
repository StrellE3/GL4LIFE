import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SizeChartSchema = z.object({
  categoryId: z.string().uuid(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser || dbUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const data = SizeChartSchema.parse(body)

    const chart = await prisma.sizeChart.upsert({
      where: { categoryId: data.categoryId },
      update: { headers: data.headers, rows: data.rows },
      create: { categoryId: data.categoryId, headers: data.headers, rows: data.rows },
    })

    return NextResponse.json(chart)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
