import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/marketplace-admin'
import { apiGet, apiSend, cast, identity, toFormData } from './request'
import type { SendOptions } from './request'
import type { BulkProductImportResponseDto, HeroBannerResponseDto, MarketplaceAdminAddTaxonomyCategoryBody, MarketplaceAdminAddTaxonomySubcategoriesBody, MarketplaceAdminBlockStoreBody, MarketplaceAdminCreateHeroBannerBody, MarketplaceAdminCreateProductBody, MarketplaceAdminCreateStoreForMerchantBody, MarketplaceAdminGetDashboardParams, MarketplaceAdminGetFinanceAnalyticsParams, MarketplaceAdminGetIndustryTaxonomyParams, MarketplaceAdminGetRecentOrdersParams, MarketplaceAdminGetSalesParams, MarketplaceAdminGetStoreStatsParams, MarketplaceAdminGetTaxonomyParams, MarketplaceAdminImportProductsBody, MarketplaceAdminListAuditLogsParams, MarketplaceAdminListMoneyMovementsParams, MarketplaceAdminListReportsParams, MarketplaceAdminListStoreOwnersParams, MarketplaceAdminListStoresParams, MarketplaceAdminRemoveTaxonomySubcategoriesBody, MarketplaceAdminReplaceIndustryTaxonomyBody, MarketplaceAdminReplaceIndustryTaxonomyFromTriplesBody, MarketplaceAdminReplaceTaxonomyBody, MarketplaceAdminReplaceTaxonomyFromPairsBody, MarketplaceAdminSetStoreIndustriesBody, MarketplaceAdminSetStoreTagsBody, MarketplaceAdminSetSubscriptionAmountBody, MarketplaceAdminUpdateHeroBannerBody, MarketplaceAdminUpdateStoreBody, MarketplaceAdminUpdateStoreCommissionBody, MarketplaceAdminUpdateStorePaymentSettingsBody, MarketplaceAdminUpdateStoreShippingBody, MarketplaceAdminUpdateStoreStatusBody, MarketplaceAdminVerifySubscriptionPaymentBody, ProductResponseDto, StorePaymentSettingsResponseDto, StoreResponseDto, StoreShippingLocationsResponseDto, StoreSubscriptionPaymentAccountResponseDto, VerifyStoreSubscriptionPaymentResponseDto } from './types/marketplace-admin'

/*
 * Marketplace MS — platform admin through the Gateway (`/marketplace/*`). Exported from the barrel as
 * `marketplaceAdminApi`: `marketplaceAdminApi.getDashboard(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.marketplaceAdmin

/**
 * Get ecommerce dashboard aggregate data
 * Get ecommerce dashboard aggregate data. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/dashboard
 */
export function getDashboard(params: MarketplaceAdminGetDashboardParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.dashboard, () => ({}), { ...params })
}

/**
 * Get recent orders for ecommerce dashboard (paginated)
 * Get recent orders for ecommerce dashboard (paginated). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/dashboard/recent-orders
 */
export function getRecentOrders(params: MarketplaceAdminGetRecentOrdersParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.dashboardRecentOrders, () => ({}), { ...params })
}

/**
 * Get all sales across e-commerce with robust filters
 * Get all sales across e-commerce with robust filters. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/sales
 */
export function getSales(params: MarketplaceAdminGetSalesParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.sales, () => ({}), { ...params })
}

/**
 * View all stores with robust filters
 * View all stores with robust filters. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/stores
 */
export function listStores(params: MarketplaceAdminListStoresParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.stores, () => ({}), { ...params })
}

/**
 * Get store counters for management dashboard
 * Get store counters for management dashboard. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/stores/stats
 */
export function getStoreStats(params: MarketplaceAdminGetStoreStatsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storesStats, () => ({}), { ...params })
}

/**
 * List store owners (aggregated from stores) with filters
 * List store owners (aggregated from stores) with filters. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/store-owners
 */
export function listStoreOwners(params: MarketplaceAdminListStoreOwnersParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storeOwners, () => ({}), { ...params })
}

/**
 * View all merchant reports
 * View all merchant reports. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/reports
 */
export function listReports(params: MarketplaceAdminListReportsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.reports, () => ({}), { ...params })
}

/**
 * Mark merchant report as opened
 * Mark merchant report as opened. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/reports/{id}/opened
 */
export function markReportOpened(id: string): Promise<unknown> {
  return apiSend('PATCH', E.reportOpened(id), undefined, identity, () => ({}))
}

/**
 * Mark merchant report as pending review
 * Mark merchant report as pending review. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/reports/{id}/pending-review
 */
export function markReportPendingReview(id: string): Promise<unknown> {
  return apiSend('PATCH', E.reportPendingReview(id), undefined, identity, () => ({}))
}

/**
 * Mark merchant report as resolved
 * Mark merchant report as resolved. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/reports/{id}/resolved
 */
export function markReportResolved(id: string): Promise<unknown> {
  return apiSend('PATCH', E.reportResolved(id), undefined, identity, () => ({}))
}

/**
 * Paginated money movements (settlements + subscription payments)
 * Paginated money movements (settlements + subscription payments). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/finance/movements
 */
export function listMoneyMovements(params: MarketplaceAdminListMoneyMovementsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.financeMovements, () => ({}), { ...params })
}

/**
 * Aggregated money-movement analytics (period: day, week, month, all_time, custom)
 * Aggregated money-movement analytics (period: day, week, month, all_time, custom). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/finance/analytics
 */
export function getFinanceAnalytics(params: MarketplaceAdminGetFinanceAnalyticsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.financeAnalytics, () => ({}), { ...params })
}

/**
 * Get all available store tags
 * Get all available store tags. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/settings/tags
 */
export function getStoreTags(): Promise<unknown> {
  return apiGet<unknown>(E.settingsTags, () => ({}))
}

/**
 * Update/Add global store tags
 * Update/Add global store tags. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/settings/tags
 */
export function setStoreTags(body: MarketplaceAdminSetStoreTagsBody): Promise<unknown> {
  return apiSend('POST', E.settingsTags, body, identity, () => ({}))
}

/**
 * Get all available store industries
 * Get all available store industries. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/settings/industries
 */
export function getStoreIndustries(): Promise<unknown> {
  return apiGet<unknown>(E.settingsIndustries, () => ({}))
}

/**
 * Update/Add global store industries
 * Update/Add global store industries. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/settings/industries
 */
export function setStoreIndustries(body: MarketplaceAdminSetStoreIndustriesBody): Promise<unknown> {
  return apiSend('POST', E.settingsIndustries, body, identity, () => ({}))
}

/**
 * Update global store subscription amount
 * Update global store subscription amount. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/settings/subscription-amount
 */
export function setSubscriptionAmount(body: MarketplaceAdminSetSubscriptionAmountBody): Promise<unknown> {
  return apiSend('PATCH', E.settingsSubscriptionAmount, body, identity, () => ({}))
}

/**
 * Get current global store subscription amount
 * Get current global store subscription amount. Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/settings/subscription-amount
 */
export function getSubscriptionAmount(): Promise<unknown> {
  return apiGet<unknown>(E.settingsSubscriptionAmount, () => ({}))
}

/**
 * Block or unblock a store (deprecated alias of PATCH /admin/stores/:id/status)
 * Block or unblock a store (deprecated alias of PATCH /admin/stores/:id/status). Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/stores/{id}/block
 */
export function blockStore(id: string, body: MarketplaceAdminBlockStoreBody): Promise<unknown> {
  return apiSend('POST', E.storeBlock(id), body, identity, () => ({}))
}

/**
 * Update a store status with required reason for suspend/deactivate
 * Update a store status with required reason for suspend/deactivate. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/stores/{id}/status
 */
export function updateStoreStatus(id: string, body: MarketplaceAdminUpdateStoreStatusBody): Promise<unknown> {
  return apiSend('PATCH', E.storeStatus(id), body, identity, () => ({}))
}

/**
 * Update Numoni's commission for a store
 * Sets the store commission percentage (Store.discountThresholdPercent) and records the change in the commission audit trail. The new rate applies to future pricing previews and settlements; already-settled orders are not recalculated.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/stores/{storeId}/commission
 */
export function updateStoreCommission(storeId: string, body: MarketplaceAdminUpdateStoreCommissionBody): Promise<unknown> {
  return apiSend('PATCH', E.storeCommission(storeId), body, identity, () => ({}))
}

/**
 * View the commission change history for a store
 * Audit trail of admin commission changes (previous/new rate, reason, actor, timestamp), newest first.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/stores/{storeId}/commission/audits
 */
export function listCommissionAudits(storeId: string): Promise<unknown> {
  return apiGet<unknown>(E.storeCommissionAudits(storeId), () => ({}))
}

/**
 * Browse the unified audit trail (paginated)
 * All recorded user/merchant/admin actions. Filter by action, entityType, entityId, actorType, actorUserId, or actorEmail.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/audit-logs
 */
export function listAuditLogs(params: MarketplaceAdminListAuditLogsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.auditLogs, () => ({}), { ...params })
}

/**
 * Sync all products to Meilisearch
 * Sync all products to Meilisearch. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/products/sync
 */
export function syncProductsToSearch(): Promise<unknown> {
  return apiSend('POST', E.productsSync, undefined, identity, () => ({}))
}

/**
 * Create a store on behalf of a merchant
 * Admin-on-behalf equivalent of `POST /merchant/stores`. The target merchant user id is taken from the path and used as the store owner.
 * @endpoint POST /marketplace/admin/merchants/{ownerId}/stores
 */
export function createStoreForMerchant(ownerId: string, body: MarketplaceAdminCreateStoreForMerchantBody, opts: SendOptions = {}): Promise<StoreResponseDto> {
  return apiSend('POST', E.merchantStores(ownerId), toFormData(body), cast<StoreResponseDto>, () => fx.storeResponse, { multipart: true, ...opts })
}

/**
 * Update store details on behalf of a merchant
 * Admin-on-behalf equivalent of `PATCH /merchant/stores/:id`. Accepts the same multipart payload (including `refundPolicy`, `shippingPolicy`, `dataProcessingPolicy`).
 * @endpoint PATCH /marketplace/admin/stores/{storeId}
 */
export function updateStore(storeId: string, body: MarketplaceAdminUpdateStoreBody, opts: SendOptions = {}): Promise<StoreResponseDto> {
  return apiSend('PATCH', E.store(storeId), toFormData(body), cast<StoreResponseDto>, () => fx.storeResponse, { multipart: true, ...opts })
}

/**
 * Update store payment settings on behalf of a merchant
 * Update store payment settings on behalf of a merchant. Admin only.
 * @endpoint PATCH /marketplace/admin/stores/{storeId}/settings/payment
 */
export function updateStorePaymentSettings(storeId: string, body: MarketplaceAdminUpdateStorePaymentSettingsBody): Promise<StorePaymentSettingsResponseDto> {
  return apiSend('PATCH', E.storeSettingsPayment(storeId), body, cast<StorePaymentSettingsResponseDto>, () => fx.storePaymentSettingsResponse)
}

/**
 * Update store shipping locations on behalf of a merchant
 * Update store shipping locations on behalf of a merchant. Admin only.
 * @endpoint PATCH /marketplace/admin/stores/{storeId}/settings/shipping
 */
export function updateStoreShipping(storeId: string, body: MarketplaceAdminUpdateStoreShippingBody): Promise<StoreShippingLocationsResponseDto> {
  return apiSend('PATCH', E.storeSettingsShipping(storeId), body, cast<StoreShippingLocationsResponseDto>, () => fx.storeShippingLocationsResponse)
}

/**
 * Get subscription payment account for a store (admin-on-behalf)
 * Admin-on-behalf equivalent of the merchant subscription payment-account endpoint. **Requires the merchant `Authorization: Bearer <merchant_token>` header** because the underlying payment/CS calls are scoped to the merchant. Payonus references are stored against the store as usual.
 * @endpoint POST /marketplace/admin/stores/{storeId}/subscription/payment-account
 */
export function getSubscriptionPaymentAccount(storeId: string): Promise<StoreSubscriptionPaymentAccountResponseDto> {
  return apiSend('POST', E.storeSubscriptionPaymentAccount(storeId), undefined, cast<StoreSubscriptionPaymentAccountResponseDto>, () => fx.storeSubscriptionPaymentAccountResponse)
}

/**
 * Verify subscription payment for a store (admin-on-behalf)
 * Admin-on-behalf equivalent of the merchant verify-payment endpoint. **Requires the merchant `Authorization: Bearer <merchant_token>` header** so the verification call to the payment service succeeds.
 * @endpoint POST /marketplace/admin/stores/{storeId}/subscription/verify-payment
 */
export function verifySubscriptionPayment(storeId: string, body: MarketplaceAdminVerifySubscriptionPaymentBody): Promise<VerifyStoreSubscriptionPaymentResponseDto> {
  return apiSend('POST', E.storeSubscriptionVerifyPayment(storeId), body, cast<VerifyStoreSubscriptionPaymentResponseDto>, () => fx.verifyStoreSubscriptionPaymentResponse)
}

/**
 * Create a single product for a store on behalf of a merchant
 * Admin-on-behalf equivalent of `POST /merchant/stores/:storeId/products`. The store owner is resolved server-side and passed to the product service. Store must be ACTIVE and paid.
 * @endpoint POST /marketplace/admin/stores/{storeId}/products
 */
export function createProduct(storeId: string, body: MarketplaceAdminCreateProductBody): Promise<ProductResponseDto> {
  return apiSend('POST', E.storeProducts(storeId), body, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * Bulk import products for a store (CSV)
 * Creates products for the given store using the store owner id internally (same validation as merchant create). Store must be ACTIVE and paid; discountPercent per row must be >= the store threshold. Image URL columns are stored as-is. Rows that fail parsing or create are reported in failures; other rows still run.
 * @endpoint POST /marketplace/admin/stores/{storeId}/products/bulk
 */
export function importProducts(storeId: string, body: MarketplaceAdminImportProductsBody, opts: SendOptions = {}): Promise<BulkProductImportResponseDto> {
  return apiSend('POST', E.storeProductsBulk(storeId), toFormData(body), cast<BulkProductImportResponseDto>, () => fx.bulkProductImportResponse, { multipart: true, ...opts })
}

/**
 * List all marketplace hero banners (admin)
 * List all marketplace hero banners (admin). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/hero-banners
 */
export function listHeroBanners(): Promise<unknown> {
  return apiGet<unknown>(E.heroBanners, () => ({}))
}

/**
 * Create a marketplace hero banner
 * multipart/form-data. Required file field `image` plus title and optional fields.
 * @endpoint POST /marketplace/admin/hero-banners
 */
export function createHeroBanner(body: MarketplaceAdminCreateHeroBannerBody, opts: SendOptions = {}): Promise<HeroBannerResponseDto> {
  return apiSend('POST', E.heroBanners, toFormData(body), cast<HeroBannerResponseDto>, () => fx.heroBannerResponse, { multipart: true, ...opts })
}

/**
 * Update a marketplace hero banner
 * Update a marketplace hero banner. Admin only.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/admin/hero-banners/{id}
 */
export function updateHeroBanner(id: string, body: MarketplaceAdminUpdateHeroBannerBody, opts: SendOptions = {}): Promise<unknown> {
  return apiSend('PATCH', E.heroBanner(id), toFormData(body), identity, () => ({}), { multipart: true, ...opts })
}

/**
 * Delete a marketplace hero banner
 * Delete a marketplace hero banner. Admin only.
 * The spec leaves the response untyped.
 * @endpoint DELETE /marketplace/admin/hero-banners/{id}
 */
export function deleteHeroBanner(id: string): Promise<unknown> {
  return apiSend('DELETE', E.heroBanner(id), undefined, identity, () => ({}))
}

/**
 * Get full taxonomy tree (admin)
 * Get full taxonomy tree (admin). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/product-taxonomy
 */
export function getTaxonomy(params: MarketplaceAdminGetTaxonomyParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomy, () => ({}), { ...params })
}

/**
 * Replace the entire product taxonomy (grouped tree)
 * Body: `{ "taxonomy": [ { "name": "Category A", "subcategories": ["Sub1", "Sub2"] } ] }`. One array entry per **distinct** category, with all its subcategories listed. To send data in **spreadsheet form** (category repeated on each row), use `POST /admin/product-taxonomy/from-pairs` instead.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy
 */
export function replaceTaxonomy(body: MarketplaceAdminReplaceTaxonomyBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomy, body, identity, () => ({}))
}

/**
 * List industries (admin)
 * List industries (admin). Admin only.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/product-taxonomy/industries
 */
export function listTaxonomyIndustries(): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyIndustries, () => ({}))
}

/**
 * Get full industry taxonomy (admin)
 * Returns Industry→Category→Subcategory tree. Optional `industry` matches a v2 node name (normalized); if it matches nothing, returns the full tree (union).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/admin/product-taxonomy/v2
 */
export function getIndustryTaxonomy(params: MarketplaceAdminGetIndustryTaxonomyParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyV2, () => ({}), { ...params })
}

/**
 * Replace the entire industry taxonomy (v2 tree)
 * Body: `{ "taxonomy": [ { "name": "INDUSTRY", "categories": [ { "name": "Category", "subcategories": ["Sub"] } ] } ] }`.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy/v2
 */
export function replaceIndustryTaxonomy(body: MarketplaceAdminReplaceIndustryTaxonomyBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomyV2, body, identity, () => ({}))
}

/**
 * Replace taxonomy from category/subcategory row pairs (sheet-style)
 * Body: `{ "pairs": [ { "category": "…", "subcategory": "…" }, … ] }`. Use the same layout as a two-column export: the **category may repeat**; each row adds that **subcategory** under that category. Replaces the full taxonomy, same as `POST /admin/product-taxonomy`, but without grouping rows first.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy/from-pairs
 */
export function replaceTaxonomyFromPairs(body: MarketplaceAdminReplaceTaxonomyFromPairsBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomyFromPairs, body, identity, () => ({}))
}

/**
 * Replace industry taxonomy from triples (v2 sheet-style)
 * Body: `{ "triples": [ { "industry": "…", "category": "…", "subcategory": "…" }, … ] }`.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy/v2/from-triples
 */
export function replaceIndustryTaxonomyFromTriples(body: MarketplaceAdminReplaceIndustryTaxonomyFromTriplesBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomyV2FromTriples, body, identity, () => ({}))
}

/**
 * Add a new category (with optional subcategories)
 * Add a new category (with optional subcategories). Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy/categories
 */
export function addTaxonomyCategory(body: MarketplaceAdminAddTaxonomyCategoryBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomyCategories, body, identity, () => ({}))
}

/**
 * Remove a category and all its subcategories
 * Remove a category and all its subcategories. Admin only.
 * The spec leaves the response untyped.
 * @endpoint DELETE /marketplace/admin/product-taxonomy/categories/{name}
 */
export function removeTaxonomyCategory(name: string): Promise<unknown> {
  return apiSend('DELETE', E.productTaxonomyCategory(name), undefined, identity, () => ({}))
}

/**
 * Add subcategories to an existing category
 * Add subcategories to an existing category. Admin only.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/admin/product-taxonomy/categories/{name}/subcategories
 */
export function addTaxonomySubcategories(name: string, body: MarketplaceAdminAddTaxonomySubcategoriesBody): Promise<unknown> {
  return apiSend('POST', E.productTaxonomyCategorySubcategories(name), body, identity, () => ({}))
}

/**
 * Remove subcategories from a category
 * Remove subcategories from a category. Admin only.
 * The spec leaves the response untyped.
 * @endpoint DELETE /marketplace/admin/product-taxonomy/categories/{name}/subcategories
 */
export function removeTaxonomySubcategories(name: string, body: MarketplaceAdminRemoveTaxonomySubcategoriesBody): Promise<unknown> {
  return apiSend('DELETE', E.productTaxonomyCategorySubcategories(name), body, identity, () => ({}))
}
