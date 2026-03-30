'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/fr')
      router.refresh()
    }
  }

  async function handleOAuth(provider: 'google' | 'discord') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
  }

  return (
    <div className="bg-[#131318] border border-zinc-800 rounded-xl p-8 space-y-6">
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300 text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            className="bg-[#0a0a0c] border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#e84142] focus:ring-[#e84142]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-zinc-300 text-sm">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-[#0a0a0c] border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#e84142] focus:ring-[#e84142]"
          />
        </div>
        {error && (
          <p className="text-[#e84142] text-sm">{error}</p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e84142] hover:bg-[#c73535] text-white font-semibold"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#131318] px-2 text-zinc-500">ou</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuth('google')}
          className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Continuer avec Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuth('discord')}
          className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Continuer avec Discord
        </Button>
      </div>

      <p className="text-center text-zinc-500 text-sm">
        Pas encore de compte ?{' '}
        <Link href="/fr/register" className="text-[#e84142] hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  )
}
