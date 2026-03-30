import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/getUser'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getLocale } from 'next-intl/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  const locale = await getLocale()

  if (!user || user.role !== 'ADMIN') {
    redirect(`/${locale}/login`)
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0c]">
      <AdminSidebar locale={locale} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
