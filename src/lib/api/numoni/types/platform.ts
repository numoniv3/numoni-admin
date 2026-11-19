// ── Platform-wide domain types: merchants, customers, campaigns, catalogue ──

export type MerchantType = 'Retail' | 'Brand' | 'FMCG' | 'Importer' | 'Fintech' | 'Online Seller'

export type MerchantStatus = 'Active' | 'Pending KYC' | 'Suspended' | 'Onboarding'

export interface Merchant {
  id: string
  name: string
  type: MerchantType
  services: string[]
  location: string
  joined: string
  transactions: number
  impressions: number
  customers: number
  bestSeller: string
  status: MerchantStatus
  gmv: number
  rewardLiability: number
  tier: 1 | 2 | 3
  owner: string
  phone: string
  model: 'V1' | 'V2' | 'V3'
}

export interface Customer {
  id: string
  alias: string
  segment: string
  kyc: 1 | 2 | 3
  balance: number
  brandWallets: number
  lifetime: number
  lastActive: string
  location: string
  status: 'Active' | 'Dormant' | 'New'
}

export interface Campaign {
  id: string
  name: string
  owner: string
  ownerType: 'Merchant' | 'Brand'
  merchantType: string
  goal: string
  trigger: string
  budget: number
  spent: number
  sales: number
  status: 'Live' | 'Paused' | 'Draft' | 'Ended' | 'Pending Approval'
  window: string
  model: 'V1' | 'V2' | 'V3'
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  merchant: string
  discount?: number
  stock: number | 'Infinite'
  tag?: string
  rating: number
  sold: number
}

export interface Txn {
  id: string
  customer: string
  merchant: string
  type: 'Funding' | 'Redemption' | 'Transfer' | 'Settlement' | 'Reward' | 'Refund'
  amount: number
  points: number
  rail: string
  time: string
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed'
}

export interface KycCase {
  id: string
  name: string
  kind: string
  doc: string
  submitted: string
  provider: string
  score: number
}

export interface AuditLogEntry {
  id: string
  actor: string
  action: string
  target: string
  time: string
  diff: {
    before: string
    after: string
  }
}

export interface ResellerSummary {
  id: string
  name: string
  contact: string
  region: string
  merchants: number
  active: number
  volume: number
  commission: number
  status: string
}

export interface PricingService {
  service: string
  mode: string
  value: string
  cap: string
  country: string
}

export interface CustomerSegment {
  name: string
  value: number
  color: string
}

export interface AttributionPoint {
  d: string
  spend: number
  sales: number
}

export interface RailPartner {
  name: string
  role: string
  mode: string
  health: number
  latency: string
}

export interface NearbyOfferSummary {
  id: number
  title: string
  merchant: string
  dist: string
  model: string
}
