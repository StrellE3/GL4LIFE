import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  nameCn: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionCn: z.string().optional(),
  price: z.number().positive(),
  batch: z.string().min(1),
  seller: z.string().min(1),
  categoryId: z.string().uuid(),
  weidianUrl: z.string().url().optional().or(z.literal('')),
  taobaoUrl: z.string().url().optional().or(z.literal('')),
  url1688: z.string().url().optional().or(z.literal('')),
  sizes: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
})

async function getAdminUser(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  if (!dbUser || dbUser.role !== 'ADMIN') return null
  return dbUser
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request)
    if (!adminUser) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const data = ProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...data,
        weidianUrl: data.weidianUrl || null,
        taobaoUrl: data.taobaoUrl || null,
        url1688: data.url1688 || null,
        imageUrl: data.imageUrl || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
