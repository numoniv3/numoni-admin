// ── Merchant Reward OS domain types (Charles Store) ─────────────────────────

export type TriggerType =
  | 'first_time'
  | 'frequency'
  | 'value'
  | 'duration'
  | 'referral'
  | 'per_purchase'

export type RewardKind = 'Gift' | 'Points' | 'Coupon' | 'Raffle Draw'

export interface RewardRule {
  id: string
  target: number
  rewardKind: RewardKind
  rewardValue: string
}

export interface RewardProgram {
  id: string
  name: string
  currency: string
  trigger: TriggerType
  rules: RewardRule[]
  status: 'Active' | 'Paused'
  created: string
}

export interface MerchantCampaign {
  id: string
  name: string
  description?: string
  start: string
  end: string
  programIds: string[]
  status: 'Active' | 'Inactive'
  created: string
}

export interface GiftItem {
  id: string
  name: string
  description: string
  hue: number
  price: number
  qtyPerCustomer: number
  created: string
}

export interface RaffleEntry {
  id: string
  raffleId: string
  customer: string
  customerId: string
  tickets: number
  winner: boolean
  joinedAt: string
}

export interface Raffle {
  id: string
  name: string
  description: string
  prize: string
  prizeGiftId?: string
  howToPlay: string
  ticketPrice: number
  ticketsAvailable: number
  qtyPerCustomer: number
  validUntil: string
  status: 'Active' | 'Ended'
  created: string
}

export interface Coupon {
  id: string
  code: string
  mode: 'Single' | 'Bulk' | 'CSV Import'
  discountType: 'Percentage' | 'Fixed'
  value: number
  maxCap?: number
  expiry: string
  usesPerCode: number
  limitPerUser: number
  total: number
  used: number
  status: 'Active' | 'Exhausted' | 'Expired'
}

export interface Catalog {
  id: string
  name: string
}

export interface Category {
  id: string
  name: string
  catalogId: string
}

export interface ProductSpec {
  k: string
  v: string
}

export interface MerchantProduct {
  id: string
  name: string
  categoryId: string
  price: number
  currency: string
  description: string
  hues: number[]
  sku: string
  discount: number
  variants: string[]
  specs: ProductSpec[]
  expiry?: string
  rewardProgramId?: string
  published: boolean
  stock: number | 'Infinite'
}

export interface BankAccount {
  id: string
  bank: string
  accountNo: string
  accountName: string
  primary: boolean
}

export interface Terminal {
  id: string
  name: string
  location: string
  bankId: string
  txns: number
  today: number
  active: boolean
}

export interface LedgerEntry {
  id: string
  date: string
  day: string
  description: string
  ref: string
  direction: 'credit' | 'debit'
  status: 'Completed' | 'Pending' | 'Reversed'
  method: string
  amount: number
  balance: number
}

export interface MarketingMessage {
  id: string
  channel: 'SMS' | 'Email' | 'In-app'
  title: string
  body: string
  audience: string
  recipients: number
  status: 'Draft' | 'Scheduled' | 'Sent'
  created: string
  sentAt?: string
  scheduledFor?: string
  delivered?: number
  opened?: number
}

export interface Storefront {
  id: string
  name: string
  slug: string
  tagline: string
  location: string
  color: string
  live: boolean
  showRatings: boolean
  showCampaignBanner: boolean
  gridDensity: 'Comfortable' | 'Compact'
  visits: number
  orders: number
  created: string
}

export interface MerchantTxn {
  id: string
  customer: string
  customerId: string
  product: string
  productHue: number
  qty: number
  amount: number
  fee: number
  reward: string
  rail: 'POS QR' | 'Storefront'
  terminal?: string
  timestamp: string
  day: string        // ISO yyyy-mm-dd — powers date-range filtering
  status: 'Success' | 'Pending' | 'Failed'
  payRef: string
  sessionRef: string
}

// ── Seed data ────────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string
  name: string
  phone: string
  role: 'Owner' | 'Manager' | 'Cashier'
  tillId?: string          // assigned POS terminal
  permissions: string[]
  status: 'Active' | 'Invited'
  added: string
}

export interface CardOrder {
  id: string
  design: string           // design label / uploaded file name
  quantity: number
  unitPrice: number
  total: number
  status: 'Pending' | 'In production' | 'Delivered'
  created: string
}

export interface IssuedCard {
  id: string
  serial: string
  holder: string
  customerId: string
  status: 'Active' | 'Frozen'
  txns: number
  totalSpent: number
  lastUsed: string
  issuedOn: string
}

export interface AuditEntry {
  id: string
  actor: string
  action: string
  target: string
  time: string
}

export const TEAM_PERMISSIONS = ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards', 'Manage team'] as const

/** Everything the merchant dashboard (Charles Store) needs on first load — `GET /merchant/workspace`. */
export interface MerchantWorkspace {
  programs: RewardProgram[]
  campaigns: MerchantCampaign[]
  gifts: GiftItem[]
  raffles: Raffle[]
  coupons: Coupon[]
  catalogs: Catalog[]
  categories: Category[]
  products: MerchantProduct[]
  banks: BankAccount[]
  terminals: Terminal[]
  ledger: LedgerEntry[]
  messages: MarketingMessage[]
  txns: MerchantTxn[]
  storefronts: Storefront[]
  raffleEntries: RaffleEntry[]
  team: TeamMember[]
  cardOrders: CardOrder[]
  cards: IssuedCard[]
  audit: AuditEntry[]
}

export interface SalesPoint {
  d: string
  sales: number
}

export interface MonthlyCustomerCount {
  m: string
  customers: number
}

export interface AgeRangeCount {
  range: string
  customers: number
}

export interface FrequencyBucketCount {
  bucket: string
  customers: number
}

export interface WeeklyCampaignPerformance {
  w: string
  reach: number
  converted: number
}

export interface MerchantCustomer {
  id: string
  name: string
  segment: string
  kyc: number
  phone: string
  visits: number
  spend: number
  pointsEarned: number
  pointsRedeemed: number
  last: string
  fav: string
  joined: string
  age: string
}

export interface MerchantReview {
  id: string
  customer: string
  stars: number
  text: string
  replied: boolean
}

export interface MonthlyNewCustomers {
  m: string
  newCustomers: number
}

export interface ProductPatronage {
  product: string
  customers: number
  hue: number
}
