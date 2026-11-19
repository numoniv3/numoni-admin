import type { AccountStatus, PlatformAccount } from '@/lib/api/numoni/types/admin'
import { USER_TYPE_LABEL } from '@/lib/auth/personas'

export const STATUS_TONE: Record<AccountStatus, 'green' | 'sky' | 'red' | 'neutral'> = {
  ACTIVE: 'green',
  PENDING: 'sky',
  SUSPENDED: 'red',
  CLOSED: 'neutral',
}

export const statusLabel = (s: AccountStatus) => s.charAt(0) + s.slice(1).toLowerCase()

const ROLE_LABEL: Record<string, string> = { owner: 'Owner', super_admin: 'Super admin', admin: 'Admin', sub_admin: 'Sub-admin' }

export const roleLabel = (role?: string) => (role ? (ROLE_LABEL[role] ?? role.replace(/_/g, ' ')) : 'Admin')

export const typeLabel = (a: PlatformAccount) => USER_TYPE_LABEL[a.userType] ?? a.userType

export const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
