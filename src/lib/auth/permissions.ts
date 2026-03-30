import { UserRole } from '@prisma/client'

export const PERMISSIONS = {
  canViewProducts: [UserRole.READER, UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canUploadQC: [UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canPost: [UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canComment: [UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canLike: [UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canCreateGroup: [UserRole.WRITER, UserRole.MODERATOR, UserRole.ADMIN],
  canModerate: [UserRole.MODERATOR, UserRole.ADMIN],
  canAccessAdmin: [UserRole.ADMIN],
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly UserRole[]).includes(role)
}

export function requirePermission(role: UserRole | null | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error(`Permission denied: requires ${permission}`)
  }
}
