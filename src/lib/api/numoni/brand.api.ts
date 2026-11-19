import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import * as B from './mocks/brand'
import { attributionSeries } from './mocks/platform'
import type { BrandWorkspace, CityCustomerCount } from './types/brand'
import type { AttributionPoint } from './types/platform'

const E = NUMONI_ENDPOINTS.brand

/**
 * Campaigns, reward catalogue, pools, wallet and customers for the brand console.
 * @endpoint GET /brand/workspace
 */
export function getBrandWorkspace(): Promise<BrandWorkspace> {
  return apiGet(E.workspace, () => ({
    campaigns: B.brandCampaigns,
    programs: B.brandRewardPrograms,
    gifts: B.brandGifts,
    raffles: B.brandRaffles,
    coupons: B.brandCoupons,
    pools: B.brandPools,
    poolLedger: B.brandPoolLedger,
    wallet: B.brandWalletTxns,
    customers: B.brandCustomers,
  }))
}

export interface BrandAnalytics {
  /** Weekly campaign spend vs attributed sales (₦M), before range scaling. */
  attributionSeries: AttributionPoint[]
  customersByCity: CityCustomerCount[]
}

/**
 * Attribution and geography series behind the brand dashboard.
 * @endpoint GET /brand/analytics
 */
export function getBrandAnalytics(): Promise<BrandAnalytics> {
  return apiGet(E.analytics, () => ({ attributionSeries, customersByCity: B.brandCustomersByCity }))
}
