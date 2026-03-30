import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [productCount, userCount, groupCount, qcCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.group.count(),
    prisma.qCPhoto.count(),
  ])

  const stats = [
    { label: 'Produits', value: productCount, icon: '📦', color: 'blue' },
    { label: 'Utilisateurs', value: userCount, icon: '👥', color: 'purple' },
    { label: 'Groupes', value: groupCount, icon: '💬', color: 'green' },
    { label: 'Photos QC', value: qcCount, icon: '📸', color: 'red' },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon }) => (
          <div
            key={label}
            className="bg-[#131318] border border-zinc-800 rounded-xl p-6"
          >
            <div className="text-3xl mb-3">{icon}</div>
            <p className="text-3xl font-bold text-white font-display">{value}</p>
            <p className="text-zinc-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
