// ── SKUs & benefits ──────────────────────────────────────────────────────────

export interface BrandSku {
  id: string
  name: string
  price: number
  /** how the customer is rewarded for buying this SKU */
  benefitType: 'cash_per_unit' | 'cash_per_bundle' | 'points' | 'gift' | 'raffle'
  benefitValue: number   // ₦ or points per unit/bundle
  bundleQty: number      // for cash_per_bundle — e.g. 3 SKUs
  hue: number
}

// ── Campaigns ────────────────────────────────────────────────────────────────

export type CampaignStatus = 'In review' | 'Active' | 'Paused' | 'Completed'

export interface BrandCampaign {
  id: string
  name: string
  type: 'SKU' | 'Segment'
  status: CampaignStatus
  /** where rewarded items can be bought / spent */
  locations: string[]
  skus: BrandSku[]           // SKU campaigns
  segment?: string           // Segment campaigns
  segmentCount?: number
  grantAmount?: number       // ₦ grant per customer (Segment)
  unlockCondition?: string
  rewardProgramIds: string[]
  budget: number
  spent: number
  durationType: 'Fixed window' | 'Ongoing' | 'Day count'
  startDate?: string
  endDate?: string
  dayCount?: number
  redemptions: number
  attributedSales: number
  newCustomers: number
  created: string
  submittedAt?: string
}

// ── Rewards (same vocabulary as the merchant Reward OS) ─────────────────────

export interface BrandRewardProgram {
  id: string
  name: string
  trigger: string
  rules: { target: string; reward: string }[]
  status: 'Active' | 'Paused'
  created: string
}

export interface BrandGift {
  id: string
  name: string
  stock: number
  value: number
  hue: number
  status: 'Active' | 'Paused'
  created: string
}

export interface BrandRaffle {
  id: string
  name: string
  prize: string
  drawDate: string
  entries: number
  ticketCost: string
  status: 'Active' | 'Paused' | 'Drawn'
  created: string
}

export interface BrandCoupon {
  id: string
  name: string
  discountType: 'Percentage' | 'Fixed amount'
  value: number
  maxCap: number
  codes: number
  redeemed: number
  expiry: string
  status: 'Active' | 'Paused'
  created: string
}

// ── Reward pools (sponsored escrow) ─────────────────────────────────────────

export interface BrandPool {
  id: string
  name: string
  balance: number
  funded: number
  campaigns: string[]
  status: 'Active' | 'Paused'
  created: string
}

export interface PoolLedgerEntry {
  id: string
  poolId: string
  description: string
  direction: 'credit' | 'debit'
  amount: number
  balance: number
  date: string
  authorizedBy: string
}

// ── Wallet ───────────────────────────────────────────────────────────────────

export interface BrandWalletTxn {
  id: string
  date: string
  day: string
  description: string
  ref: string
  direction: 'credit' | 'debit'
  status: 'Completed' | 'Pending' | 'Failed'
  method: string
  amount: number
  balance: number
}

// ── Customers ────────────────────────────────────────────────────────────────

export interface BrandCustomerActivity {
  date: string
  action: string
  detail: string
  amount?: number
}

export interface BrandCustomer {
  id: string
  name: string
  phone: string
  segment: string
  location: string
  joined: string
  purchases: number
  totalSpent: number
  rewardsEarned: number
  redemptions: number
  favSku: string
  lastActive: string
  activity: BrandCustomerActivity[]
}

/** Everything the brand console (Sabo Foods) needs on first load — `GET /brand/workspace`. */
export interface BrandWorkspace {
  campaigns: BrandCampaign[]
  programs: BrandRewardProgram[]
  gifts: BrandGift[]
  raffles: BrandRaffle[]
  coupons: BrandCoupon[]
  pools: BrandPool[]
  poolLedger: PoolLedgerEntry[]
  wallet: BrandWalletTxn[]
  customers: BrandCustomer[]
}

export interface CityCustomerCount {
  city: string
  users: number
}
