import type { CardDto } from '@/lib/api/numoni/types/card'

export type CardStatus = CardDto['status']

export const STATUS_TONE: Record<CardStatus, 'green' | 'sky' | 'neutral' | 'orange' | 'purple' | 'red'> = {
  MINTED: 'neutral', GIVEN_TO_CUSTOMER: 'sky', ACTIVE: 'green', SUSPENDED: 'orange', EXPIRED: 'purple', CANCELLED: 'red',
}

export const titleCase = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, ' ')

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** `5399 •••• •••• 9012` */
export const maskPan = (pan: string) => (pan.length >= 8 ? `${pan.slice(0, 4)} •••• •••• ${pan.slice(-4)}` : pan)

/** A CLOSED_LOOP card is unlocked only until `unlockedUntil`. */
export const isUnlocked = (c: Pick<CardDto, 'lockStatus' | 'unlockedUntil'>) =>
  c.lockStatus === 'UNLOCKED' && (!c.unlockedUntil || new Date(c.unlockedUntil) > new Date())

/** Typed amount (with separators) → number, or `undefined` when blank. */
export const amount = (v: string) => {
  const s = v.replace(/[,\s₦]/g, '')
  return s === '' || !Number.isFinite(Number(s)) ? undefined : Number(s)
}
export const moneyInput = (v: string) => v.replace(/[^\d.,]/g, '')
