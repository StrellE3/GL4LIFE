import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/fr'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Sync user to Prisma DB
      const supabaseUser = data.user
      const username =
        supabaseUser.user_metadata?.username ||
        supabaseUser.user_metadata?.full_name?.replace(/\s+/g, '_').toLowerCase() ||
        supabaseUser.email?.split('@')[0] ||
        `user_${supabaseUser.id.slice(0, 8)}`

      await prisma.user.upsert({
        where: { id: supabaseUser.id },
        update: {
          email: supabaseUser.email!,
          avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        },
        create: {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          username,
          avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
        },
      })
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/fr/login?error=auth_failed`)
}
