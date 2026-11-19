import type { UserType } from '@/lib/auth/types'

// ── nuMoni Control Tower domain types (head-office admin) ──────────────────

// ── Chart of accounts ────────────────────────────────────────────────────────
export type AccountClass = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'COGS' | 'Expense'

export interface Account { code: string; name: string; cls: AccountClass; balance: number; normal: 'Debit' | 'Credit' }

// ── Journal entries (double-entry) ───────────────────────────────────────────
export interface JournalEntry { id: string; date: string; memo: string; debit: string; credit: string; amount: number; status: 'Posted' | 'Pending'; by: string }

// ── Bank accounts & reconciliation ───────────────────────────────────────────
export interface TreasuryBankAccount { bank: string; account: string; purpose: string; book: number; statement: number; lastRecon: string }

// ── Platform accounts & admins (Gateway Auth routes) ─────────────────────────
export type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'CLOSED'

/** Pay-in / pay-out limits in ₦ (`AccountLimitDto`). */
export interface AccountLimits { payin: number; payout: number }

/** Any signed-up account — customers, merchants, resellers, admins. */
export interface PlatformAccount {
  universalId: string
  userType: UserType
  name: string
  email?: string
  phone?: string
  /** `owner` · `super_admin` · `admin` · `sub_admin` … as the Gateway names it. */
  role?: string
  accountStatus: AccountStatus
  kycTier: 1 | 2 | 3
  limits?: AccountLimits
  createdAt?: string
}

/** `InvitePlatformAdminDto`. */
export interface AdminInvite { firstName: string; lastName: string; email: string; phone: string; role: 'admin' | 'super_admin' }

export type AdminRewardType = 'Points' | 'Coupon' | 'Gift' | 'Raffle'

export interface AdminRewardProgram {
  id: string
  name: string
  owner: string
  ownerKind: 'Merchant' | 'Brand' | 'Fintech'
  type: AdminRewardType
  issued: number
  redeemed: number
  cost: number
  revenue: number
  active: boolean
}

// ── Traffic Routing ──────────────────────────────────────────────────────────
// Partners are grouped by rail; each group routes 100% of its traffic across members.
export interface RailGroup { id: string; label: string; note: string; members: string[] }

// ── granular settlement layer ────────────────────────────────────────────────
export type BatchStatus = 'Queued' | 'Processing' | 'Paid' | 'Held' | 'Failed'

export interface RailBatch { id: string; rail: string; window: string; txns: number; gross: number; fees: number; net: number; status: BatchStatus }

export type PayoutStatus = 'Scheduled' | 'Held' | 'Sent'

export interface Payout { id: string; merchant: string; bank: string; account: string; amount: number; status: PayoutStatus }

export type TreasuryLedgerId = 'nerw' | 'pool-minted' | 'pool-burned' | 'bank-treasury'

export interface TreasuryLedger { id: TreasuryLedgerId; name: string; balance: number; note: string }

export interface ExplorerCustomer {
  id: string
  alias: string
  age: string
  gender: string
  location: string
  source: (typeof EXPLORER_SOURCES)[number]
  industry: string
  segment: string
  kyc: 1 | 2 | 3
  lifetime: number
  visits: number
  cards: number
  lastActive: string
  status: 'Active' | 'Dormant' | 'New'
}

// ── explorable customer universe (deterministic, 56 profiles) ───────────────
export const EXPLORER_AGE_BANDS = ['18–24', '25–34', '35–44', '45–54', '55+']

export const EXPLORER_LOCATIONS = ['Lekki, Lagos', 'Ikeja, Lagos', 'Surulere, Lagos', 'Yaba, Lagos', 'Ajah, Lagos', 'Wuse, Abuja', 'GRA, Port Harcourt', 'Kano', 'Enugu', 'Ibadan']

export const EXPLORER_SOURCES = ['Merchant', 'FMCG', 'Brand', 'Fintech'] as const

export const EXPLORER_INDUSTRIES = ['QSR & Food', 'Grocery Retail', 'Pharmacy & Health', 'Electronics', 'Fashion & Lifestyle', 'Drinks & Beverage', 'Telco & Fintech', 'Home & Living']

export const EXPLORER_SEGMENTS = ['Power Spender', 'Weekly Regular', 'Deal Hunter', 'Weekend Buyer', 'Dormant 30d+', 'New This Week']

export interface AccountingMonth {
  m: string
  revenue: number
  costs: number
  profit: number
}

export interface UnmatchedBankLine {
  id: string
  desc: string
  amount: number
  side: string
  age: string
}

export interface WalletSide {
  name: string
  balance: number
  ledger: string
  count: string
}

export interface WalletDriftPoint {
  d: string
  v: number
}

export interface WalletCheck {
  name: string
  result: string
  detail: string
  ok: boolean
}

export interface AdminRaffle {
  id: string
  name: string
  owner: string
  tickets: number
  prize: string
  draw: string
  active: boolean
}

export interface Dispute {
  id: string
  customer: string
  merchant: string
  issue: string
  amount: number
  age: string
  status: string
}

export interface AutoRefund {
  id: string
  txn: string
  amount: number
  reason: string
  time: string
}

export interface RailSales {
  rail: string
  value: number
  color: string
}

export interface AgeRangeShare {
  range: string
  pct: number
}

export interface ReturnFrequencyBucket {
  bucket: string
  pct: number
  color: string
}

export interface CampaignMixSlice {
  name: string
  value: number
  color: string
}

export interface BrandCardCount {
  brand: string
  cards: number
}

export interface MerchantVolumePoint {
  d: string
  v: number
}

export interface MerchantSettlement {
  id: string
  date: string
  amount: number
  status: string
}

/** Where an account is in onboarding — `GET /journey/me/{universalId}` (admin view). */
export interface JourneyState {
  universalId: string
  userType?: UserType
  name?: string
  phone?: string
  email?: string
  accountStatus?: string
  kycTier: 1 | 2 | 3
  /** `OTP` · `LOGIN_OTP` · `NAME` · `PIN` · `PROFILE` · `DASHBOARD`. */
  nextStep?: string
  pinSet?: boolean
}
