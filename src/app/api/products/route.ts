import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const batch = searchParams.get('batch') || ''
    const sort = searchParams.get('sort') || 'newest'

    const where = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { nameEn: { contains: search, mode: 'insensitive' as const } },
          { nameCn: { contains: search, mode: 'insensitive' as const } },
          { batch: { contains: search, mode: 'insensitive' as const } },
          { seller: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(category && { category: { slug: category } }),
      ...(batch && { batch }),
    }

    const orderBy = {
      newest: { createdAt: 'desc' as const },
      priceAsc: { price: 'asc' as const },
      priceDesc: { price: 'desc' as const },
      bestRated: { rating: 'desc' as const },
    }[sort] ?? { createdAt: 'desc' as const }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: { select: { name: true, nameFr: true, nameEn: true, slug: true } },
        _count: { select: { qcPhotos: true } },
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
