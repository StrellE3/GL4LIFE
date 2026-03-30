import { prisma } from '@/lib/prisma'
import { SizeChartEditor } from '@/components/admin/SizeChartEditor'

export default async function AdminSizeChartsPage() {
  const categories = await prisma.category.findMany({
    include: { sizeChart: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Guides de tailles</h1>
      <SizeChartEditor categories={categories} />
    </div>
  )
}
