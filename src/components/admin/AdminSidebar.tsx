import Link from 'next/link'

interface AdminSidebarProps {
  locale: string
}

export function AdminSidebar({ locale }: AdminSidebarProps) {
  const links = [
    { href: `/${locale}/admin`, label: 'Dashboard', icon: '📊' },
    { href: `/${locale}/admin/products`, label: 'Produits', icon: '📦' },
    { href: `/${locale}/admin/users`, label: 'Utilisateurs', icon: '👥' },
    { href: `/${locale}/admin/groups`, label: 'Groupes', icon: '💬' },
    { href: `/${locale}/admin/size-charts`, label: 'Tailles', icon: '📏' },
  ]

  return (
    <aside className="w-56 bg-[#131318] border-r border-zinc-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-zinc-800">
        <p className="font-display font-bold text-white">
          Rep<span className="text-[#e84142]">Curator</span>
        </p>
        <p className="text-zinc-500 text-xs mt-1">Administration</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors text-sm"
          >
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-white transition-colors text-sm"
        >
          <span>←</span>
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  )
}
