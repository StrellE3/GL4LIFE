'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'

const LANGS = [
  { code: 'fr', label: '🇫🇷' },
  { code: 'en', label: '🇬🇧' },
  { code: 'cn', label: '🇨🇳' },
] as const

export function LangSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLang(newLocale: string) {
    // Replace locale prefix in pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1 bg-[#131318] border border-zinc-800 rounded-lg p-1">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => switchLang(code)}
          className={`text-base px-2 py-1 rounded transition-colors ${
            locale === code
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-500 hover:text-white'
          }`}
          title={code.toUpperCase()}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
