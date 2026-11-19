import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import * as X from './mocks/enterprise'
import type { EnterpriseWorkspace, FundingRedemptionPoint, OutletVolume } from './types/enterprise'

const E = NUMONI_ENDPOINTS.enterprise

/**
 * Reward programs, campaigns, gifts, raffles, coupons, transactions and wallet ledger.
 * @endpoint GET /enterprise/workspace
 */
export function getEnterpriseWorkspace(): Promise<EnterpriseWorkspace> {
  return apiGet(E.workspace, () => ({
    programs: X.enterprisePrograms,
    campaigns: X.enterpriseCampaigns,
    gifts: X.enterpriseGifts,
    raffles: X.enterpriseRaffles,
    coupons: X.enterpriseCoupons,
    txns: X.enterpriseTxns,
    ledger: X.enterpriseLedger,
  }))
}

export interface EnterpriseAnalytics {
  weeklySeries: FundingRedemptionPoint[]
  outletVolumes: OutletVolume[]
}

/**
 * Funding vs redemption by day and volume per outlet, for the Overview.
 * @endpoint GET /enterprise/analytics
 */
export function getEnterpriseAnalytics(): Promise<EnterpriseAnalytics> {
  return apiGet(E.analytics, () => ({ weeklySeries: X.enterpriseWeeklySeries, outletVolumes: X.enterpriseOutletVolumes }))
}
