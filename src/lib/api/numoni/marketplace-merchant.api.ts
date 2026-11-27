import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/marketplace-merchant'
import { apiGet, apiSend, cast, identity, toFormData } from './request'
import type { SendOptions } from './request'
import type { CustomerListResponseDto, CustomerResponseDto, MarketplaceMerchantCreateCustomerBody, MarketplaceMerchantCreateManualOrderBody, MarketplaceMerchantCreateProductBody, MarketplaceMerchantCreateProductV2Body, MarketplaceMerchantCreateStoreBody, MarketplaceMerchantDeleteProductImageBody, MarketplaceMerchantGetIndustryTaxonomyParams, MarketplaceMerchantGetStoreOverviewParams, MarketplaceMerchantGetTaxonomyParams, MarketplaceMerchantImportProductsBody, MarketplaceMerchantListCustomersParams, MarketplaceMerchantListOrdersParams, MarketplaceMerchantListProductsParams, MarketplaceMerchantListReviewsParams, MarketplaceMerchantListStoresParams, MarketplaceMerchantListTaxonomyCategoriesParams, MarketplaceMerchantListTaxonomySubcategoriesParams, MarketplaceMerchantPreviewProductPricingBody, MarketplaceMerchantPreviewProductPricingV2Body, MarketplaceMerchantRejectOrderBody, MarketplaceMerchantSendOrderReminderBody, MarketplaceMerchantSetProductFeaturedBody, MarketplaceMerchantSetProductVisibilityBody, MarketplaceMerchantSetStorePublishedBody, MarketplaceMerchantUpdateCustomerBody, MarketplaceMerchantUpdateOrderStatusBody, MarketplaceMerchantUpdateProductBody, MarketplaceMerchantUpdateProductImagesBody, MarketplaceMerchantUpdateProductV2Body, MarketplaceMerchantUpdateStoreBody, MarketplaceMerchantUpdateStoreBrandingBody, MarketplaceMerchantUpdateStorePaymentSettingsBody, MarketplaceMerchantUpdateStoreShippingBody, MarketplaceMerchantUploadProductImagesBody, MarketplaceMerchantVerifySubscriptionPaymentBody, MerchantStorePoliciesResponseDto, ProductFeaturedResponseDto, ProductImageDeleteResponseDto, ProductImagesUpdateResponseDto, ProductImagesUploadResponseDto, ProductListResponseDto, ProductPricingPreviewResponseDto, ProductPricingPreviewV2ResponseDto, ProductVisibilityResponseDto, StoreBrandingResponseDto, StoreListResponseDto, StoreOverviewDto, StoreStatusResponseDto } from './types/marketplace-merchant'
import type { BulkProductImportResponseDto, ProductResponseDto, StorePaymentSettingsResponseDto, StoreResponseDto, StoreShippingLocationsResponseDto, StoreSubscriptionPaymentAccountResponseDto, VerifyStoreSubscriptionPaymentResponseDto } from './types/marketplace-admin'

/*
 * Marketplace MS — store owner (merchant) through the Gateway (`/marketplace/*`). Exported from the barrel as
 * `marketplaceMerchantApi`: `marketplaceMerchantApi.previewProductPricing(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.marketplaceMerchant

/**
 * Preview pricing breakdown before creating a product
 * Returns a transparent breakdown of customer-facing discount (d - x), customer payment after discount, Numoni commission (x% of customer payment), and merchant net. Uses store.discountThresholdPercent as x.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products/pricing-preview
 */
export function previewProductPricing(storeId: string, body: MarketplaceMerchantPreviewProductPricingBody): Promise<ProductPricingPreviewResponseDto> {
  return apiSend('POST', E.storeProductsPricingPreview(storeId), body, cast<ProductPricingPreviewResponseDto>, () => fx.productPricingPreviewResponse)
}

/**
 * Preview pricing breakdown before creating a product (v2)
 * v2: `discountPercent` is the customer-facing discount only; Numoni commission is read separately from `store.discountThresholdPercent` and applied to whatever the customer pays after the discount. No threshold-floor validation is performed.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products/v2/pricing-preview
 */
export function previewProductPricingV2(storeId: string, body: MarketplaceMerchantPreviewProductPricingV2Body): Promise<ProductPricingPreviewV2ResponseDto> {
  return apiSend('POST', E.storeProductsV2PricingPreview(storeId), body, cast<ProductPricingPreviewV2ResponseDto>, () => fx.productPricingPreviewV2Response)
}

/**
 * Create a new product
 * Optional `enhanceImage` (default true): when true, each eligible Spaces image is AI-enhanced asynchronously after create. Set false if images are already polished.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products
 */
export function createProduct(storeId: string, body: MarketplaceMerchantCreateProductBody): Promise<ProductResponseDto> {
  return apiSend('POST', E.storeProducts(storeId), body, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * List all products for a store
 * List all products for a store. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores/{storeId}/products
 */
export function listProducts(storeId: string, params: MarketplaceMerchantListProductsParams = {}): Promise<ProductListResponseDto> {
  return apiGet<ProductListResponseDto>(E.storeProducts(storeId), () => fx.productListResponse, { ...params })
}

/**
 * Create a new product (v2)
 * v2: `discountPercent` is the customer-facing discount only (what the buyer sees on the storefront). Numoni platform commission is read separately from the store config and is NOT combined with this value. Optional `enhanceImage` (default true) controls AI image enhancement for all uploaded Spaces images.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products/v2
 */
export function createProductV2(storeId: string, body: MarketplaceMerchantCreateProductV2Body): Promise<ProductResponseDto> {
  return apiSend('POST', E.storeProductsV2(storeId), body, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * Bulk import products from CSV
 * Same business rules as single-product create (ACTIVE paid store; discountPercent >= store threshold). Image columns must be full URLs. Per-row failures are returned in failures; valid rows are still created.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products/bulk
 */
export function importProducts(storeId: string, body: MarketplaceMerchantImportProductsBody, opts: SendOptions = {}): Promise<BulkProductImportResponseDto> {
  return apiSend('POST', E.storeProductsBulk(storeId), toFormData(body), cast<BulkProductImportResponseDto>, () => fx.bulkProductImportResponse, { multipart: true, ...opts })
}

/**
 * Upload product images
 * Upload product images. For the signed-in merchant (store owner).
 * @endpoint POST /marketplace/merchant/stores/{storeId}/products/upload-images
 */
export function uploadProductImages(storeId: string, body: MarketplaceMerchantUploadProductImagesBody, opts: SendOptions = {}): Promise<ProductImagesUploadResponseDto> {
  return apiSend('POST', E.storeProductsUploadImages(storeId), toFormData(body), cast<ProductImagesUploadResponseDto>, () => fx.productImagesUploadResponse, { multipart: true, ...opts })
}

/**
 * Delete product image from storage
 * Delete product image from storage. For the signed-in merchant (store owner).
 * @endpoint DELETE /marketplace/merchant/stores/{storeId}/products/delete-image
 */
export function deleteProductImage(storeId: string, body: MarketplaceMerchantDeleteProductImageBody): Promise<ProductImageDeleteResponseDto> {
  return apiSend('DELETE', E.storeProductsDeleteImage(storeId), body, cast<ProductImageDeleteResponseDto>, () => fx.productImageDeleteResponse)
}

/**
 * Get product details
 * Get product details. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores/{storeId}/products/{id}
 */
export function getProduct(storeId: string, id: string): Promise<ProductResponseDto> {
  return apiGet<ProductResponseDto>(E.storeProduct(storeId, id), () => fx.productResponse)
}

/**
 * Update a product
 * Update a product. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/products/{id}
 */
export function updateProduct(storeId: string, id: string, body: MarketplaceMerchantUpdateProductBody): Promise<ProductResponseDto> {
  return apiSend('PATCH', E.storeProduct(storeId, id), body, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * Delete a product
 * Delete a product. For the signed-in merchant (store owner).
 * @endpoint DELETE /marketplace/merchant/stores/{storeId}/products/{id}
 */
export function deleteProduct(storeId: string, id: string): Promise<ProductResponseDto> {
  return apiSend('DELETE', E.storeProduct(storeId, id), undefined, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * Update a product (v2)
 * v2: when provided, `discountPercent` is the customer-facing discount only. Numoni platform commission is read separately from the store config and is NOT combined with this value.
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/products/{id}/v2
 */
export function updateProductV2(storeId: string, id: string, body: MarketplaceMerchantUpdateProductV2Body): Promise<ProductResponseDto> {
  return apiSend('PATCH', E.storeProductV2(storeId, id), body, cast<ProductResponseDto>, () => fx.productResponse)
}

/**
 * Toggle product visibility
 * Toggle product visibility. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/products/{id}/visibility
 */
export function setProductVisibility(storeId: string, id: string, body: MarketplaceMerchantSetProductVisibilityBody): Promise<ProductVisibilityResponseDto> {
  return apiSend('PATCH', E.storeProductVisibility(storeId, id), body, cast<ProductVisibilityResponseDto>, () => fx.productVisibilityResponse)
}

/**
 * Toggle product featured status
 * Toggle product featured status. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/products/{id}/featured
 */
export function setProductFeatured(storeId: string, id: string, body: MarketplaceMerchantSetProductFeaturedBody): Promise<ProductFeaturedResponseDto> {
  return apiSend('PATCH', E.storeProductFeatured(storeId, id), body, cast<ProductFeaturedResponseDto>, () => fx.productFeaturedResponse)
}

/**
 * Update product images
 * Optional `enhanceImage` (default true): when true, each eligible Spaces image is AI-enhanced asynchronously.
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/products/{id}/images
 */
export function updateProductImages(storeId: string, id: string, body: MarketplaceMerchantUpdateProductImagesBody): Promise<ProductImagesUpdateResponseDto> {
  return apiSend('PATCH', E.storeProductImages(storeId, id), body, cast<ProductImagesUpdateResponseDto>, () => fx.productImagesUpdateResponse)
}

/**
 * Create a new store
 * multipart/form-data. **At least one industry is required:** send `industries` (repeated field, JSON string or comma-separated) or the legacy `industry`. Pick values from `GET /industries`. `logo` is an optional image file.
 * @endpoint POST /marketplace/merchant/stores
 */
export function createStore(body: MarketplaceMerchantCreateStoreBody, opts: SendOptions = {}): Promise<StoreResponseDto> {
  return apiSend('POST', E.stores, toFormData(body), cast<StoreResponseDto>, () => fx.storeResponse, { multipart: true, ...opts })
}

/**
 * List all stores owned by merchant
 * List all stores owned by merchant. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores
 */
export function listStores(params: MarketplaceMerchantListStoresParams = {}): Promise<StoreListResponseDto> {
  return apiGet<StoreListResponseDto>(E.stores, () => fx.storeListResponse, { ...params })
}

/**
 * Get standard refund and shipping policy text
 * Returns platform-standard policy copy merchants can show or align their own policies with.
 * @endpoint GET /marketplace/merchant/stores/policies
 */
export function getStorePolicies(): Promise<MerchantStorePoliciesResponseDto> {
  return apiGet<MerchantStorePoliciesResponseDto>(E.storesPolicies, () => fx.merchantStorePoliciesResponse)
}

/**
 * Get store details
 * Get store details. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores/{id}
 */
export function getStore(id: string): Promise<StoreResponseDto> {
  return apiGet<StoreResponseDto>(E.store(id), () => fx.storeResponse)
}

/**
 * Update store details
 * Update store details. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{id}
 */
export function updateStore(id: string, body: MarketplaceMerchantUpdateStoreBody, opts: SendOptions = {}): Promise<StoreResponseDto> {
  return apiSend('PATCH', E.store(id), toFormData(body), cast<StoreResponseDto>, () => fx.storeResponse, { multipart: true, ...opts })
}

/**
 * Get store overview stats
 * Get store overview stats. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores/{id}/overview
 */
export function getStoreOverview(id: string, params: MarketplaceMerchantGetStoreOverviewParams = {}): Promise<StoreOverviewDto> {
  return apiGet<StoreOverviewDto>(E.storeOverview(id), () => fx.storeOverview, { ...params })
}

/**
 * Publish or unpublish store
 * Publish or unpublish store. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{id}/status
 */
export function setStorePublished(id: string, body: MarketplaceMerchantSetStorePublishedBody): Promise<StoreStatusResponseDto> {
  return apiSend('PATCH', E.storeStatus(id), body, cast<StoreStatusResponseDto>, () => fx.storeStatusResponse)
}

/**
 * Update store payment settings
 * Update store payment settings. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{id}/settings/payment
 */
export function updateStorePaymentSettings(id: string, body: MarketplaceMerchantUpdateStorePaymentSettingsBody): Promise<StorePaymentSettingsResponseDto> {
  return apiSend('PATCH', E.storeSettingsPayment(id), body, cast<StorePaymentSettingsResponseDto>, () => fx.storePaymentSettingsResponse)
}

/**
 * Update store shipping locations
 * Update store shipping locations. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{id}/settings/shipping
 */
export function updateStoreShipping(id: string, body: MarketplaceMerchantUpdateStoreShippingBody): Promise<StoreShippingLocationsResponseDto> {
  return apiSend('PATCH', E.storeSettingsShipping(id), body, cast<StoreShippingLocationsResponseDto>, () => fx.storeShippingLocationsResponse)
}

/**
 * Get dynamic account for store subscription payment
 * Allocates a virtual account for the subscription transfer. Each request sends a new unique payment reference to Payonus (stored on the store as `subscriptionPaymentReference` after success). The response **data.onusReference** is what you use for verification — it is persisted as `txnReference`; call verify-payment with that Onus ref (not the subscription payment reference). Bearer JWT is forwarded to the payment service.
 * @endpoint POST /marketplace/merchant/stores/{id}/subscription/payment-account
 */
export function getSubscriptionPaymentAccount(id: string): Promise<StoreSubscriptionPaymentAccountResponseDto> {
  return apiSend('POST', E.storeSubscriptionPaymentAccount(id), undefined, cast<StoreSubscriptionPaymentAccountResponseDto>, () => fx.storeSubscriptionPaymentAccountResponse)
}

/**
 * Verify store subscription payment
 * Calls customer service using the **onusReference** from the payment-account step. Body may include `onusReference`. Bearer JWT is forwarded.
 * @endpoint POST /marketplace/merchant/stores/{id}/subscription/verify-payment
 */
export function verifySubscriptionPayment(id: string, body: MarketplaceMerchantVerifySubscriptionPaymentBody): Promise<VerifyStoreSubscriptionPaymentResponseDto> {
  return apiSend('POST', E.storeSubscriptionVerifyPayment(id), body, cast<VerifyStoreSubscriptionPaymentResponseDto>, () => fx.verifyStoreSubscriptionPaymentResponse)
}

/**
 * Update store branding
 * Update store branding. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{id}/branding
 */
export function updateStoreBranding(id: string, body: MarketplaceMerchantUpdateStoreBrandingBody, opts: SendOptions = {}): Promise<StoreBrandingResponseDto> {
  return apiSend('PATCH', E.storeBranding(id), toFormData(body), cast<StoreBrandingResponseDto>, () => fx.storeBrandingResponse, { multipart: true, ...opts })
}

/**
 * Send an order reminder to a customer
 * Send an order reminder to a customer. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/notifications/remind
 */
export function sendOrderReminder(storeId: string, body: MarketplaceMerchantSendOrderReminderBody): Promise<unknown> {
  return apiSend('POST', E.storeNotificationsRemind(storeId), body, identity, () => ({}))
}

/**
 * List suggested product categories
 * List suggested product categories. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/product-taxonomy/categories
 */
export function listTaxonomyCategories(params: MarketplaceMerchantListTaxonomyCategoriesParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyCategories, () => ({}), { ...params })
}

/**
 * List suggested subcategories for a category (empty array if category is custom/unknown)
 * List suggested subcategories for a category (empty array if category is custom/unknown). For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/product-taxonomy/subcategories
 */
export function listTaxonomySubcategories(params: MarketplaceMerchantListTaxonomySubcategoriesParams): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomySubcategories, () => ({}), { ...params })
}

/**
 * Get full taxonomy tree
 * Get full taxonomy tree. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/product-taxonomy
 */
export function getTaxonomy(params: MarketplaceMerchantGetTaxonomyParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomy, () => ({}), { ...params })
}

/**
 * List industries (merchant)
 * List industries (merchant). For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/product-taxonomy/industries
 */
export function listTaxonomyIndustries(): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyIndustries, () => ({}))
}

/**
 * Get full industry taxonomy (merchant)
 * Returns Industry→Category→Subcategory tree. Optional `industry` matches a v2 node name (normalized); if it matches nothing, returns the full tree (union).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/product-taxonomy/v2
 */
export function getIndustryTaxonomy(params: MarketplaceMerchantGetIndustryTaxonomyParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyV2, () => ({}), { ...params })
}

/**
 * Create a manual order (offline/physical)
 * Create a manual order (offline/physical). For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/orders/manual
 */
export function createManualOrder(storeId: string, body: MarketplaceMerchantCreateManualOrderBody): Promise<unknown> {
  return apiSend('POST', E.storeOrdersManual(storeId), body, identity, () => ({}))
}

/**
 * List all orders for a store
 * Optional query `isStorePickup=true|false` filters store-pickup orders vs shipped/delivery orders.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/stores/{storeId}/orders
 */
export function listOrders(storeId: string, params: MarketplaceMerchantListOrdersParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storeOrders(storeId), () => ({}), { ...params })
}

/**
 * Get order details
 * Get order details. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/stores/{storeId}/orders/{id}
 */
export function getOrder(storeId: string, id: string): Promise<unknown> {
  return apiGet<unknown>(E.storeOrder(storeId, id), () => ({}))
}

/**
 * Update order status
 * When setting status to **DELIVERED**, the request must include `deliveryCode` (4-digit numeric). The customer shares this code (from their order emails). It is not shown in merchant order APIs.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/orders/{id}/status
 */
export function updateOrderStatus(storeId: string, id: string, body: MarketplaceMerchantUpdateOrderStatusBody): Promise<unknown> {
  return apiSend('PATCH', E.storeOrderStatus(storeId, id), body, identity, () => ({}))
}

/**
 * Reject a paid order (before settlement)
 * Refunds the customer wallet, restores inventory, cancels the order, and notifies customer and merchant. Only allowed when the order is paid and the merchant has not been settled for it.
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/merchant/stores/{storeId}/orders/{id}/reject
 */
export function rejectOrder(storeId: string, id: string, body: MarketplaceMerchantRejectOrderBody): Promise<unknown> {
  return apiSend('POST', E.storeOrderReject(storeId, id), body, identity, () => ({}))
}

/**
 * Create a customer manually
 * Create a customer manually. For the signed-in merchant (store owner).
 * @endpoint POST /marketplace/merchant/stores/{storeId}/customers
 */
export function createCustomer(storeId: string, body: MarketplaceMerchantCreateCustomerBody): Promise<CustomerResponseDto> {
  return apiSend('POST', E.storeCustomers(storeId), body, cast<CustomerResponseDto>, () => fx.customerResponse)
}

/**
 * List all customers for a store
 * List all customers for a store. For the signed-in merchant (store owner).
 * @endpoint GET /marketplace/merchant/stores/{storeId}/customers
 */
export function listCustomers(storeId: string, params: MarketplaceMerchantListCustomersParams = {}): Promise<CustomerListResponseDto> {
  return apiGet<CustomerListResponseDto>(E.storeCustomers(storeId), () => fx.customerListResponse, { ...params })
}

/**
 * Update customer details
 * Update customer details. For the signed-in merchant (store owner).
 * @endpoint PATCH /marketplace/merchant/stores/{storeId}/customers/{id}
 */
export function updateCustomer(storeId: string, id: string, body: MarketplaceMerchantUpdateCustomerBody): Promise<CustomerResponseDto> {
  return apiSend('PATCH', E.storeCustomer(storeId, id), body, cast<CustomerResponseDto>, () => fx.customerResponse)
}

/**
 * List reviews for the merchant’s store
 * List reviews for the merchant’s store. For the signed-in merchant (store owner).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/merchant/stores/{storeId}/reviews
 */
export function listReviews(storeId: string, params: MarketplaceMerchantListReviewsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storeReviews(storeId), () => ({}), { ...params })
}
