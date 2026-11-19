// ── Enterprise & Fintech console domain types — the enterprise runs the same
// reward vocabulary as the merchant Reward OS, so it reuses those types.
import type { Coupon, GiftItem, LedgerEntry, MerchantCampaign, MerchantTxn, Raffle, RewardProgram } from './merchant'

/** Everything the enterprise console (Chicken Republic) needs on first load — `GET /enterprise/workspace`. */
export interface EnterpriseWorkspace {
  programs: RewardProgram[]
  campaigns: MerchantCampaign[]
  gifts: GiftItem[]
  raffles: Raffle[]
  coupons: Coupon[]
  txns: MerchantTxn[]
  ledger: LedgerEntry[]
}

export interface FundingRedemptionPoint {
  d: string
  funded: number
  redeemed: number
}

export interface OutletVolume {
  name: string
  volume: number
}
