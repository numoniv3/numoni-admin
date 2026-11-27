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

/** Why a card can't be charged right now (`chargeBlockedReason`), in words. */
const BLOCKED: Record<NonNullable<CardDto['chargeBlockedReason']>, string> = {
  CARD_NOT_ACTIVATED: 'Not activated yet',
  CARD_SUSPENDED: 'Suspended',
  CARD_EXPIRED: 'Expired',
  CARD_CANCELLED: 'Cancelled',
  // The normal resting state of an active closed-loop card — not a fault.
  UNLOCK_REQUIRED: 'Ready — needs the customer’s code',
  CARD_FROZEN: 'Frozen on the card network',
}

/**
 * Can it be charged now? Uses the service's own `canCharge` / `chargeBlockedReason`;
 * a closed-loop card's FROZEN lock is its normal state, so it isn't shown as a problem.
 */
export const chargeState = (c: Pick<CardDto, 'canCharge' | 'chargeBlockedReason' | 'lockStatus' | 'unlockedUntil'>) =>
  c.canCharge ? (isUnlocked(c) ? 'Unlocked — can be charged now' : 'Can be charged') : c.chargeBlockedReason ? BLOCKED[c.chargeBlockedReason] : 'Can’t be charged'

/** Who may lift a suspension: that level or higher (CUSTOMER < MERCHANT < ADMIN). */
const RANK = { CUSTOMER: 0, MERCHANT: 1, ADMIN: 2 } as const
export const canReinstate = (c: Pick<CardDto, 'status' | 'suspendedBy'>, me: keyof typeof RANK) =>
  c.status === 'SUSPENDED' && (c.suspendedBy == null || RANK[me] >= RANK[c.suspendedBy])
