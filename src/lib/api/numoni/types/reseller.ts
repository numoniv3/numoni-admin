// ── Businesses ───────────────────────────────────────────────────────────────

export interface ResellerBusiness {
  id: string
  name: string
  owner: string
  phone: string
  email: string
  type: 'Retail' | 'Food & Beverage' | 'Online Seller' | 'Services'
  location: string
  joined: string
  status: 'Active' | 'Pending activation' | 'Suspended'
  volume: number
  txns: number
  customers: number
  pointsIssued: number
  lastActive: string
  password: string
  /** what the reseller earns when this business activates */
  bounty: number
  /** what the reseller earns on every transaction, % of volume */
  commissionPct: number
}

// ── Wallet ───────────────────────────────────────────────────────────────────

export interface ResellerWalletTxn {
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
  batchId?: string
}

// ── Settlement batches ───────────────────────────────────────────────────────

export interface BatchTxn {
  id: string
  businessId: string
  business: string
  ref: string
  volume: number
  commissionPct: number
  commission: number
  time: string
}

export interface SettlementBatch {
  id: string
  date: string
  day: string
  merchants: number
  txnCount: number
  gross: number
  fee: number
  net: number
  status: 'Settled' | 'Processing'
  txns: BatchTxn[]
}

/** Everything the reseller portal (Lagos West Partners) needs on first load — `GET /reseller/workspace`. */
export interface ResellerWorkspace {
  businesses: ResellerBusiness[]
  wallet: ResellerWalletTxn[]
  batches: SettlementBatch[]
}
