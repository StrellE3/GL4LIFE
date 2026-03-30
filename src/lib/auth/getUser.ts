import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    })

    return dbUser
  } catch {
    return null
  }
}
