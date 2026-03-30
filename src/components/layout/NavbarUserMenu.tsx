'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@prisma/client'
import Link from 'next/link'

interface NavbarUserMenuProps {
  user: User | null
  locale: string
}

export function NavbarUserMenu({ user, locale }: NavbarUserMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(`/${locale}/login`)
    router.refresh()
  }

  if (!user) {
    return (
      <Link
        href={`/${locale}/login`}
        className="bg-[#e84142] hover:bg-[#c73535] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Connexion
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-[#131318] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 hover:text-white hover:border-zinc-600 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-[#e84142] flex items-center justify-center text-white text-xs font-bold">
          {user.username[0].toUpperCase()}
        </div>
        <span className="hidden sm:inline max-w-24 truncate">{user.username}</span>
        <span className="text-zinc-600 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-[#131318] border border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-800">
              <p className="text-white text-sm font-medium truncate">{user.username}</p>
              <p className="text-zinc-500 text-xs truncate">{user.email}</p>
            </div>
            <div className="py-1">
              {user.role === 'ADMIN' && (
                <Link
                  href={`/${locale}/admin`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-[#e84142] hover:bg-zinc-800/50 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
