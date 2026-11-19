import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import * as M from './mocks/merchant'
import type {
  AgeRangeCount, FrequencyBucketCount, MerchantCustomer, MerchantReview, MerchantWorkspace, MonthlyCustomerCount,
  MonthlyNewCustomers, ProductPatronage, SalesPoint, WeeklyCampaignPerformance,
} from './types/merchant'

const E = NUMONI_ENDPOINTS.merchant

/**
 * Everything the merchant dashboard edits in-session: reward programs,
 * campaigns, gifts, raffles, coupons, catalogue, banks, terminals, ledger,
 * marketing, storefronts, transactions, team, cards and the audit trail.
 * @endpoint GET /merchant/workspace
 */
export function getMerchantWorkspace(): Promise<MerchantWorkspace> {
  return apiGet(E.workspace, () => ({
    programs: M.merchantPrograms,
    campaigns: M.merchantCampaigns,
    gifts: M.merchantGifts,
    raffles: M.merchantRaffles,
    coupons: M.merchantCoupons,
    catalogs: M.merchantCatalogs,
    categories: M.merchantCategories,
    products: M.merchantProducts,
    banks: M.merchantBanks,
    terminals: M.merchantTerminals,
    ledger: M.merchantLedger,
    messages: M.merchantMessages,
    txns: M.merchantTxns,
    storefronts: M.merchantStorefronts,
    raffleEntries: M.merchantRaffleEntries,
    team: M.merchantTeam,
    cardOrders: M.merchantCardOrders,
    cards: M.merchantCards,
    audit: M.merchantAudit,
  }))
}

export interface MerchantAnalytics {
  weekSales: SalesPoint[]
  monthTrend: SalesPoint[]
  /** Traffic intensity 0–100: 24 hourly cells, 24 weekly blocks, 24 monthly blocks. */
  heat: { day: number[]; week: number[]; month: number[] }
  onboardingTrend: MonthlyCustomerCount[]
  ageRanges: AgeRangeCount[]
  returnFrequency: FrequencyBucketCount[]
  campaignPerformance: WeeklyCampaignPerformance[]
}

/**
 * Business-intelligence series behind the merchant Overview.
 * @endpoint GET /merchant/analytics
 */
export function getMerchantAnalytics(): Promise<MerchantAnalytics> {
  return apiGet(E.analytics, () => ({
    weekSales: M.merchantWeekSales,
    monthTrend: M.merchantMonthTrend,
    heat: { day: M.merchantHeatByHour, week: M.merchantHeatByWeek, month: M.merchantHeatByMonth },
    onboardingTrend: M.merchantOnboardingTrend,
    ageRanges: M.merchantAgeRanges,
    returnFrequency: M.merchantReturnFrequency,
    campaignPerformance: M.merchantCampaignPerformance,
  }))
}

export interface MerchantCustomerInsights {
  customers: MerchantCustomer[]
  reviews: MerchantReview[]
  onboardingSeries: MonthlyNewCustomers[]
  patronageByProduct: ProductPatronage[]
  frequencyBuckets: FrequencyBucketCount[]
}

/**
 * The merchant's customer list, reviews and the Analytics-tab series.
 * @endpoint GET /merchant/customers
 */
export function getMerchantCustomerInsights(): Promise<MerchantCustomerInsights> {
  return apiGet(E.customers, () => ({
    customers: M.merchantCustomers,
    reviews: M.merchantReviews,
    onboardingSeries: M.merchantCustomerOnboarding,
    patronageByProduct: M.merchantPatronageByProduct,
    frequencyBuckets: M.merchantVisitFrequency,
  }))
}

/**
 * Recipient count per marketing audience (the composer's audience picker).
 * @endpoint GET /merchant/marketing/audiences
 */
export function getMerchantAudiences(): Promise<Record<string, number>> {
  return apiGet(E.audiences, () => M.merchantAudienceSizes)
}
