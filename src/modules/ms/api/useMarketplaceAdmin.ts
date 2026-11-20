import * as A from '@/lib/api/numoni/marketplace-admin.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type {
  CreateStoreDto, MarketplaceAdminGetDashboardParams, MarketplaceAdminGetFinanceAnalyticsParams, MarketplaceAdminGetSalesParams,
  MarketplaceAdminListAuditLogsParams, MarketplaceAdminListMoneyMovementsParams, MarketplaceAdminListReportsParams,
  MarketplaceAdminListStoreOwnersParams, MarketplaceAdminListStoresParams,
} from '@/lib/api/numoni'
import { useMsAction, useMsQuery } from './ms-hooks'

/* Marketplace MS platform admin (`/marketplace/admin/*`). */

const K = numoniKeys.marketplaceAdmin
const all = [K.all, numoniKeys.marketplace.all]
const useAct = <A, R>(fn: (a: A) => Promise<R>, success: string, error: string) => useMsAction(fn, { success, error, invalidate: all })

// ── reads ────────────────────────────────────────────────────────────────────
export const useMkDashboard = (p: MarketplaceAdminGetDashboardParams) => useMsQuery(K.getDashboard(p), () => A.getDashboard(p))
export const useMkRecentOrders = (p: MarketplaceAdminGetDashboardParams) => useMsQuery(K.getRecentOrders(p), () => A.getRecentOrders({ ...p, limit: 10 }))
export const useMkSales = (p: MarketplaceAdminGetSalesParams) => useMsQuery(K.getSales(p), () => A.getSales(p))
export const useMkStores = (p: MarketplaceAdminListStoresParams) => useMsQuery(K.listStores(p), () => A.listStores(p))
export const useMkStoreStats = () => useMsQuery(K.getStoreStats({}), () => A.getStoreStats({}))
export const useMkOwners = (p: MarketplaceAdminListStoreOwnersParams) => useMsQuery(K.listStoreOwners(p), () => A.listStoreOwners(p))
export const useMkReports = (p: MarketplaceAdminListReportsParams) => useMsQuery(K.listReports(p), () => A.listReports(p))
export const useMkMovements = (p: MarketplaceAdminListMoneyMovementsParams) => useMsQuery(K.listMoneyMovements(p), () => A.listMoneyMovements(p))
export const useMkFinance = (p: MarketplaceAdminGetFinanceAnalyticsParams) => useMsQuery(K.getFinanceAnalytics(p), () => A.getFinanceAnalytics(p))
export const useMkAuditLogs = (p: MarketplaceAdminListAuditLogsParams) => useMsQuery(K.listAuditLogs(p), () => A.listAuditLogs(p))
export const useMkCommissionAudits = (storeId: string) => useMsQuery(K.listCommissionAudits(storeId), () => A.listCommissionAudits(storeId))
export const useMkSettings = () => ({
  tags: useMsQuery(K.getStoreTags(), A.getStoreTags),
  industries: useMsQuery(K.getStoreIndustries(), A.getStoreIndustries),
  subscription: useMsQuery(K.getSubscriptionAmount(), A.getSubscriptionAmount),
})
export const useMkBanners = () => useMsQuery(K.listHeroBanners(), A.listHeroBanners)
export const useMkTaxonomy = () => ({
  tree: useMsQuery(K.getTaxonomy({}), () => A.getTaxonomy({})),
  v2: useMsQuery(K.getIndustryTaxonomy({}), () => A.getIndustryTaxonomy({})),
  industries: useMsQuery(K.listTaxonomyIndustries(), A.listTaxonomyIndustries),
})

// ── reports ──────────────────────────────────────────────────────────────────
export const useMarkReport = () => useAct(({ id, to }: { id: string; to: 'OPENED' | 'PENDING_REVIEW' | 'RESOLVED' }) => (to === 'OPENED' ? A.markReportOpened(id) : to === 'RESOLVED' ? A.markReportResolved(id) : A.markReportPendingReview(id)), 'Report updated', 'Couldn’t update the report')

// ── stores ───────────────────────────────────────────────────────────────────
export const useMkStoreStatus = () => useAct(({ id, status, reason }: { id: string; status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'; reason?: string }) => A.updateStoreStatus(id, { status, reason }), 'Store status updated', 'Couldn’t change the store status')
export const useMkBlockStore = () => useAct(({ id, block, reason }: { id: string; block: boolean; reason?: string }) => A.blockStore(id, { block, reason }), 'Store updated', 'Couldn’t block / unblock the store')
export const useMkCommission = () => useAct(({ id, commissionPercent, reason }: { id: string; commissionPercent: number; reason?: string }) => A.updateStoreCommission(id, { commissionPercent, reason }), 'Commission updated', 'Couldn’t update the commission')
export const useMkCreateStoreFor = () => useAct(({ ownerId, body }: { ownerId: string; body: CreateStoreDto }) => A.createStoreForMerchant(ownerId, body), 'Store created for the merchant', 'Couldn’t create the store')

// ── settings ─────────────────────────────────────────────────────────────────
export const useMkSetTags = () => useAct((tags: string[]) => A.setStoreTags({ tags }), 'Tags saved', 'Couldn’t save the tags')
export const useMkSetIndustries = () => useAct((industries: string[]) => A.setStoreIndustries({ industries }), 'Industries saved', 'Couldn’t save the industries')
export const useMkSetSubscription = () => useAct((amount: number) => A.setSubscriptionAmount({ amount }), 'Subscription amount saved', 'Couldn’t save the amount')
export const useMkSyncSearch = () => useAct(() => A.syncProductsToSearch(), 'Products synced to search', 'Search sync failed')

// ── hero banners ─────────────────────────────────────────────────────────────
export const useMkCreateBanner = () => useAct((body: Parameters<typeof A.createHeroBanner>[0]) => A.createHeroBanner(body), 'Banner created', 'Couldn’t create the banner')
export const useMkUpdateBanner = () => useAct(({ id, body }: { id: string; body: Parameters<typeof A.updateHeroBanner>[1] }) => A.updateHeroBanner(id, body), 'Banner updated', 'Couldn’t update the banner')
export const useMkDeleteBanner = () => useAct((id: string) => A.deleteHeroBanner(id), 'Banner deleted', 'Couldn’t delete the banner')

// ── taxonomy ─────────────────────────────────────────────────────────────────
type Cat = { name: string; subcategories: string[] }
export const useMkReplaceTaxonomy = () => useAct((taxonomy: Cat[]) => A.replaceTaxonomy({ taxonomy }), 'Taxonomy replaced', 'Couldn’t replace the taxonomy')
export const useMkReplaceIndustryTaxonomy = () => useAct((taxonomy: unknown[]) => A.replaceIndustryTaxonomy({ taxonomy } as never), 'Industry taxonomy replaced', 'Couldn’t replace the taxonomy')
export const useMkTaxonomyFromPairs = () => useAct((pairs: { category: string; subcategory: string }[]) => A.replaceTaxonomyFromPairs({ pairs }), 'Taxonomy replaced from pairs', 'Couldn’t import the pairs')
export const useMkTaxonomyFromTriples = () => useAct((triples: { industry: string; category: string; subcategory: string }[]) => A.replaceIndustryTaxonomyFromTriples({ triples }), 'Industry taxonomy replaced', 'Couldn’t import the rows')
export const useMkAddCategory = () => useAct((c: Cat) => A.addTaxonomyCategory(c), 'Category added', 'Couldn’t add the category')
export const useMkRemoveCategory = () => useAct((name: string) => A.removeTaxonomyCategory(name), 'Category removed', 'Couldn’t remove the category')
export const useMkAddSubcategories = () => useAct(({ name, subcategories }: Cat) => A.addTaxonomySubcategories(name, { subcategories }), 'Subcategories added', 'Couldn’t add the subcategories')
export const useMkRemoveSubcategories = () => useAct(({ name, subcategories }: Cat) => A.removeTaxonomySubcategories(name, { subcategories }), 'Subcategories removed', 'Couldn’t remove the subcategories')
