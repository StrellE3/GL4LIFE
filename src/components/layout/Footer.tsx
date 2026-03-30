import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#0a0a0c] py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg font-bold">
            Rep<span className="text-[#e84142]">Curator</span>
          </p>
          <p className="text-zinc-600 text-sm">
            © {new Date().getFullYear()} RepCurator. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
