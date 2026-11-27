// ── Consumer activity (wallet ledger entries) ───────────────────────────────
export interface ActivityItem {
  id: string
  title: string
  sub: string
  pts: number
  kind: 'fund' | 'spend' | 'earn' | 'receive'
  time: string
  before: number
  after: number
  rail: 'Online' | 'Offline'
  location?: string
  fee: number
  reward?: number
  program?: string
  ref: string
}

// ── Brand wallets: points and coupons are different things ──────────────────
export interface BrandWalletCoupon {
  id: string
  code: string
  title: string
  value: string
  expiry: string
  used: boolean
}

export interface BrandSpend {
  id: string
  title: string
  pts: number
  time: string
  location: string
}

export interface BrandWallet {
  merchant: string
  balance: number // brand POINTS — distinct from coupons
  color: string
  rule: string
  coupons: BrandWalletCoupon[]
  history: BrandSpend[]
}

// ── E-commerce orders ───────────────────────────────────────────────────────
export interface OrderItem { name: string; qty: number; price: number }

export type OrderStage = 0 | 1 | 2 | 3 | 4

 // placed → preparing → rider → on the way → delivered
export interface Order {
  id: string
  merchant: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  payWith: string
  address: string
  stage: OrderStage
  placedAt: string
  eta: string
  rider: string
}

export interface Address { id: string; label: string; line: string }

export interface Notice {
  id: string
  title: string
  body: string
  time: string
  kind: 'reward' | 'order' | 'promo' | 'security'
  read: boolean
}

export interface CardExpense { id: string; merchant: string; pts: number; time: string; status: 'Approved' | 'Declined' }

export interface ProfileInfo {
  email: string
  gender: string
  ageGroup: string
  work: string
  salary: string
  preferences: string[]
}

/** Everything the consumer app (signed-in customer) needs on first load — `GET /consumer/account`. */
export interface ConsumerWorkspace {
  balance: number
  area: string
  brandWallets: BrandWallet[]
  activity: ActivityItem[]
  raffleTickets: number
  orders: Order[]
  addresses: Address[]
  notices: Notice[]
  cardExpenses: CardExpense[]
}

// ── Offer catalogue (deals from merchants, grants from FMCG/brand side) ─────
export interface NearbyOffer {
  id: string
  kind: 'deal' | 'grant'
  title: string
  brand: string
  color: string
  where: string
  area: string
  dist: string
  spendReq: string
  reward: string
  expiry: string
  model: 'V1' | 'V2' | 'V3'
  desc: string
}

export type PromoBannerTone = 'emerald' | 'amber' | 'violet'

export interface PromoBanner {
  id: string
  tag: string
  title: string
  sub: string
  tone: PromoBannerTone
}

export interface WalkInBrand {
  name: string
  area: string
  dist: string
  color: string
  rule: string
}

export interface SupportFaq {
  q: string
  a: string
}

/* ---------- Buy Points funding (`POST /consumer/funding`, `GET /consumer/funding/{id}`) ---------- */

/** Mapped buy-order status (pending and awaiting_payment both arrive as `awaiting_payment`). */
export type FundingStatus = 'awaiting_payment' | 'processing' | 'completed' | 'needs_recon' | 'cancelled'

/** A ledger credit with the balance before and after (decimal strings; before/after may be null). */
export interface PointCredit {
  points: string
  before: string | null
  after: string | null
  ref: string
}

/** One Buy Points purchase. Amounts are decimal strings (naira 2dp, points scale 6). */
export interface Funding {
  /** Buy-order id — poll `GET /consumer/funding/{id}` with it. */
  id: string
  status: FundingStatus
  /** Raw status from Wallet MS. */
  walletStatus: string
  reference: string
  /** Naira to transfer. */
  amount: string
  /** Points the purchase credits (1 point per naira), excluding the bonus. */
  pointsExpected: string
  /** Indicative only (about 5%) — Reward MS decides the real bonus after payment. */
  bonusPreview: { points: string; ratePercent: string; basis: 'estimate'; note: string }
  /** The account to transfer to; null once it no longer applies. */
  dedicatedAccount: { number: string; bank: string; name: string; expiry?: string } | null
  pointsCredited: PointCredit | null
  bonusCredited: PointCredit | null
}
