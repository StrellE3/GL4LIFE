import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/getUser'
import { LangSwitcher } from './LangSwitcher'
import { NavbarUserMenu } from './NavbarUserMenu'
import { getLocale, getTranslations } from 'next-intl/server'

export async function Navbar() {
  const user = await getCurrentUser()
  const locale = await getLocale()
  const t = await getTranslations('nav')

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-[#0a0a0c]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="font-display text-xl font-bold text-white hover:text-[#e84142] transition-colors"
          >
            Rep<span className="text-[#e84142]">Curator</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/products`}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              {t('products')}
            </Link>
            <Link
              href={`/${locale}/groups`}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              {t('groups')}
            </Link>
            <Link
              href={`/${locale}/size-guide`}
              className="text-zinc-400 hover:text-white text-sm font-medium transition-colors"
            >
              {t('sizeGuide')}
            </Link>
            {user?.role === 'ADMIN' && (
              <Link
                href={`/${locale}/admin`}
                className="text-[#e84142] hover:text-[#c73535] text-sm font-medium transition-colors"
              >
                {t('admin')}
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <NavbarUserMenu user={user} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  )
}
