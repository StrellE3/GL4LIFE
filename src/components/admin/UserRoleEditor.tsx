'use client'

import { useState } from 'react'

const ROLES = ['READER', 'WRITER', 'MODERATOR', 'ADMIN'] as const
type UserRole = typeof ROLES[number]

const ROLE_COLORS: Record<UserRole, string> = {
  READER: 'text-zinc-400',
  WRITER: 'text-blue-400',
  MODERATOR: 'text-purple-400',
  ADMIN: 'text-[#e84142]',
}

export function UserRoleEditor({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  const [role, setRole] = useState<UserRole>(currentRole)
  const [saving, setSaving] = useState(false)

  async function handleChange(newRole: UserRole) {
    setSaving(true)
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    if (res.ok) setRole(newRole)
    setSaving(false)
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value as UserRole)}
      disabled={saving}
      className={`bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-[#e84142] disabled:opacity-50 ${ROLE_COLORS[role]}`}
    >
      {ROLES.map(r => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>
  )
}
