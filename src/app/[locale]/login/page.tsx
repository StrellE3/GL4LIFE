import { LoginForm } from '@/components/auth/LoginForm'
import { getTranslations } from 'next-intl/server'

export default async function LoginPage() {
  const t = await getTranslations('auth')
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">RepCurator</h1>
          <p className="text-zinc-400 text-sm">Connexion à votre compte</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
