'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="bg-[#131318] border border-zinc-800 rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <span className="text-green-400 text-2xl">✓</span>
        </div>
        <h2 className="text-white font-semibold text-lg">Vérifiez vos emails</h2>
        <p className="text-zinc-400 text-sm">
          Un lien de confirmation a été envoyé à <strong className="text-white">{email}</strong>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-[#131318] border border-zinc-800 rounded-xl p-8 space-y-6">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-zinc-300 text-sm">Nom d&apos;utilisateur</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="monpseudo"
            required
            minLength={3}
            className="bg-[#0a0a0c] border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#e84142]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-zinc-300 text-sm">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            required
            className="bg-[#0a0a0c] border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#e84142]"
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
            minLength={8}
            className="bg-[#0a0a0c] border-zinc-700 text-white placeholder:text-zinc-600 focus:border-[#e84142]"
          />
        </div>
        {error && <p className="text-[#e84142] text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e84142] hover:bg-[#c73535] text-white font-semibold"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </Button>
      </form>

      <p className="text-center text-zinc-500 text-sm">
        Déjà un compte ?{' '}
        <Link href="/fr/login" className="text-[#e84142] hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
