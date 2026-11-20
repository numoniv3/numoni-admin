/*
 * Marketplace MS — store owner (merchant) shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */
import type { CreateProductDto, CreateStoreDto, ProductResponseDto, ProductShippingDto, ProductVariantDto, StoreResponseDto, UpdatePaymentSettingsDto, UpdateShippingLocationsDto, UpdateStoreDto, VerifyStoreSubscriptionPaymentDto } from './marketplace-admin'

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products/pricing-preview`. */
export type MarketplaceMerchantPreviewProductPricingBody = ProductPricingPreviewDto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products/v2/pricing-preview`. */
export type MarketplaceMerchantPreviewProductPricingV2Body = ProductPricingPreviewV2Dto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products`. */
export type MarketplaceMerchantCreateProductBody = CreateProductDto

/** Query parameters of `GET /marketplace/merchant/stores/{storeId}/products`. */
export interface MarketplaceMerchantListProductsParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Filter by category name */
  category?: string
  /** Filter by subcategory name */
  subcategory?: string
  /** Filter products with active discounts */
  hasDiscount?: boolean
  /** Filter products created within the last 48 hours */
  isNew?: boolean
  /** Filter products sold more than 2 times in the last 48 hours */
  isSelling?: boolean
  /** Filter by product type */
  type?: "GOODS" | "SERVICES"
  /** Minimum price */
  minPrice?: number
  /** Maximum price */
  maxPrice?: number
  /** Search by name */
  search?: string
  /** Filter by product tag */
  tag?: string
  /** Filter by store country */
  country?: string
}

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products/v2`. */
export type MarketplaceMerchantCreateProductV2Body = CreateProductV2Dto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products/bulk`. */
export interface MarketplaceMerchantImportProductsBody {
  /** CSV file (see bulk-product-template.csv in repo) */
  file: Blob
}

/** Request body of `POST /marketplace/merchant/stores/{storeId}/products/upload-images`. */
export interface MarketplaceMerchantUploadProductImagesBody {
  images?: Blob[]
}

/** Request body of `DELETE /marketplace/merchant/stores/{storeId}/products/delete-image`. */
export type MarketplaceMerchantDeleteProductImageBody = DeleteProductImageDto

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/products/{id}`. */
export type MarketplaceMerchantUpdateProductBody = UpdateProductDto

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/products/{id}/v2`. */
export type MarketplaceMerchantUpdateProductV2Body = UpdateProductV2Dto

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/products/{id}/visibility`. */
export type MarketplaceMerchantSetProductVisibilityBody = ToggleProductVisibilityDto

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/products/{id}/featured`. */
export type MarketplaceMerchantSetProductFeaturedBody = ToggleProductFeaturedDto

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/products/{id}/images`. */
export type MarketplaceMerchantUpdateProductImagesBody = UpdateProductImagesDto

/** Request body of `POST /marketplace/merchant/stores`. */
export type MarketplaceMerchantCreateStoreBody = CreateStoreDto

/** Query parameters of `GET /marketplace/merchant/stores`. */
export interface MarketplaceMerchantListStoresParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
}

/** Request body of `PATCH /marketplace/merchant/stores/{id}`. */
export type MarketplaceMerchantUpdateStoreBody = UpdateStoreDto

/** Query parameters of `GET /marketplace/merchant/stores/{id}/overview`. */
export interface MarketplaceMerchantGetStoreOverviewParams {
  period?: "this-week" | "this-month" | "this-year"
}

/** Request body of `PATCH /marketplace/merchant/stores/{id}/status`. */
export type MarketplaceMerchantSetStorePublishedBody = UpdateStoreStatusDto

/** Request body of `PATCH /marketplace/merchant/stores/{id}/settings/payment`. */
export type MarketplaceMerchantUpdateStorePaymentSettingsBody = UpdatePaymentSettingsDto

/** Request body of `PATCH /marketplace/merchant/stores/{id}/settings/shipping`. */
export type MarketplaceMerchantUpdateStoreShippingBody = UpdateShippingLocationsDto

/** Request body of `POST /marketplace/merchant/stores/{id}/subscription/verify-payment`. */
export type MarketplaceMerchantVerifySubscriptionPaymentBody = VerifyStoreSubscriptionPaymentDto

/** Request body of `PATCH /marketplace/merchant/stores/{id}/branding`. */
export type MarketplaceMerchantUpdateStoreBrandingBody = UpdateBrandingDto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/notifications/remind`. */
export type MarketplaceMerchantSendOrderReminderBody = SendReminderDto

/** Query parameters of `GET /marketplace/merchant/product-taxonomy/categories`. */
export interface MarketplaceMerchantListTaxonomyCategoriesParams {
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Query parameters of `GET /marketplace/merchant/product-taxonomy/subcategories`. */
export interface MarketplaceMerchantListTaxonomySubcategoriesParams {
  category: string
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Query parameters of `GET /marketplace/merchant/product-taxonomy`. */
export interface MarketplaceMerchantGetTaxonomyParams {
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Query parameters of `GET /marketplace/merchant/product-taxonomy/v2`. */
export interface MarketplaceMerchantGetIndustryTaxonomyParams {
  industry?: string
}

/** Request body of `POST /marketplace/merchant/stores/{storeId}/orders/manual`. */
export type MarketplaceMerchantCreateManualOrderBody = CreateManualOrderDto

/** Query parameters of `GET /marketplace/merchant/stores/{storeId}/orders`. */
export interface MarketplaceMerchantListOrdersParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /**
   * Filter by fulfillment method. `true` = customer chose store pickup at checkout. `false` = customer selected a shipping location.
   */
  isStorePickup?: boolean
}

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/orders/{id}/status`. */
export type MarketplaceMerchantUpdateOrderStatusBody = UpdateOrderStatusDto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/orders/{id}/reject`. */
export type MarketplaceMerchantRejectOrderBody = RejectOrderDto

/** Request body of `POST /marketplace/merchant/stores/{storeId}/customers`. */
export type MarketplaceMerchantCreateCustomerBody = CreateCustomerDto

/** Query parameters of `GET /marketplace/merchant/stores/{storeId}/customers`. */
export interface MarketplaceMerchantListCustomersParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Search by name or email */
  search?: string
}

/** Request body of `PATCH /marketplace/merchant/stores/{storeId}/customers/{id}`. */
export type MarketplaceMerchantUpdateCustomerBody = UpdateCustomerDto

/** Query parameters of `GET /marketplace/merchant/stores/{storeId}/reviews`. */
export interface MarketplaceMerchantListReviewsParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Filter reviews by product ID */
  productId?: string
}

export interface ProductPricingPreviewDto {
  /** Base/list price in NGN before any discounts. */
  price: number
  /** Merchant-entered discount percent (d). Must be >= store threshold (x). */
  discountPercent: number
}

export interface ProductPricingPreviewResponseDto {
  /** Base/list price in NGN (Decimal as string). */
  basePrice: string
  /** Merchant-entered discount percent (d). */
  merchantDiscountPercent: number
  /** Store threshold/platform percent (x) applied to this store. */
  storeThresholdPercent: number
  /** Customer-facing discount percent (d - x). */
  customerDiscountPercent: number
  /** Amount customer pays after customer-facing discount (NGN). */
  customerPays: string
  /** Numoni commission percent applied on customerPays (x). */
  numoniCommissionPercent: number
  /** Numoni commission amount (x% of customerPays) in NGN. */
  numoniCommission: string
  /** Merchant net amount after Numoni commission in NGN. */
  merchantNets: string
  /** Human-readable notes about how figures were computed for transparency. */
  notes: string[]
}

export interface ProductPricingPreviewV2Dto {
  /** Base/list price in NGN before any discounts. */
  price: number
  /**
   * Customer-facing discount percent shown to the buyer. Numoni platform commission is read separately from the store config and is NOT combined with this value.
   */
  discountPercent: number
}

export interface ProductPricingPreviewV2ResponseDto {
  /** Base/list price in NGN (Decimal as string). */
  basePrice: string
  /** Customer-facing discount percent the buyer sees on the storefront. */
  customerDiscountPercent: number
  /** Store threshold/platform percent (x) applied to this store. */
  storeThresholdPercent: number
  /** Amount customer pays after customer-facing discount (NGN). */
  customerPays: string
  /** Numoni commission percent applied on customerPays (x). */
  numoniCommissionPercent: number
  /** Numoni commission amount (x% of customerPays) in NGN. */
  numoniCommission: string
  /** Merchant net amount after Numoni commission in NGN. */
  merchantNets: string
  /** Human-readable notes about how figures were computed for transparency. */
  notes: string[]
}

export interface ProductListResponseDto {
  products: ProductResponseDto[]
  count: number
  page: number
  limit: number
}

export interface CreateProductV2Dto {
  name: string
  description?: string
  type: "GOODS" | "SERVICES"
  videoUrl?: string
  tags?: string[]
  images?: string[]
  /** Base price in NGN */
  price: number
  /**
   * Customer-facing discount percent shown to the buyer on the storefront. Numoni platform commission is read separately from the store config and is NOT combined with this value.
   */
  discountPercent: number
  /** Base product stock quantity */
  quantity: number
  /** Optional per-product low stock threshold. If not set, fallback to store threshold. */
  lowStockAlertThreshold?: number
  variants?: ProductVariantDto[]
  shipping?: ProductShippingDto[]
  isVisible?: boolean
  isFeatured?: boolean
  /**
   * When true (default), each eligible Spaces product image is AI-enhanced asynchronously after create. Set false if the merchant already polished the images.
   */
  enhanceImage?: boolean
  /** Product status (DRAFT or PUBLISHED) */
  status?: "DRAFT" | "PUBLISHED"
  /** Product industry from the request payload. May differ from the store; never copied from the store. */
  industry?: string
  /** Product category from the request payload. Independent of the store. */
  category: string
  /** Product subcategory from the request payload */
  subcategory?: string | null
}

export interface ProductImagesUploadResponseDto {
  images: string[]
}

export interface DeleteProductImageDto {
  imageUrl: string
}

export interface ProductImageDeleteResponseDto {
  success: boolean
}

export interface UpdateProductDto {
  name?: string
  description?: string
  type?: "GOODS" | "SERVICES"
  videoUrl?: string
  tags?: string[]
  images?: string[]
  /** Base price in NGN */
  price?: number
  /** Merchant-provided discount percent (d). Must be >= store/admin threshold (x). */
  discountPercent?: number
  /** Base product stock quantity */
  quantity?: number
  /** Optional per-product low stock threshold. If not set, fallback to store threshold. */
  lowStockAlertThreshold?: number
  variants?: ProductVariantDto[]
  shipping?: ProductShippingDto[]
  isVisible?: boolean
  isFeatured?: boolean
  /**
   * When true (default), each eligible Spaces product image is AI-enhanced asynchronously after create. Set false if the merchant already polished the images.
   */
  enhanceImage?: boolean
  /** Product status (DRAFT or PUBLISHED) */
  status?: "DRAFT" | "PUBLISHED"
  /** Product industry from the request payload. May differ from the store; never copied from the store. */
  industry?: string
  /** Product category from the request payload. Independent of the store. */
  category?: string
  /** Product subcategory from the request payload */
  subcategory?: string | null
}

export interface UpdateProductV2Dto {
  name?: string
  description?: string
  type?: "GOODS" | "SERVICES"
  videoUrl?: string
  tags?: string[]
  images?: string[]
  /** Base price in NGN */
  price?: number
  /**
   * Customer-facing discount percent shown to the buyer on the storefront. Numoni platform commission is read separately from the store config and is NOT combined with this value.
   */
  discountPercent?: number
  /** Base product stock quantity */
  quantity?: number
  /** Optional per-product low stock threshold. If not set, fallback to store threshold. */
  lowStockAlertThreshold?: number
  variants?: ProductVariantDto[]
  shipping?: ProductShippingDto[]
  isVisible?: boolean
  isFeatured?: boolean
  /**
   * When true (default), each eligible Spaces product image is AI-enhanced asynchronously after create. Set false if the merchant already polished the images.
   */
  enhanceImage?: boolean
  /** Product status (DRAFT or PUBLISHED) */
  status?: "DRAFT" | "PUBLISHED"
  /** Product industry from the request payload. May differ from the store; never copied from the store. */
  industry?: string
  /** Product category from the request payload. Independent of the store. */
  category?: string
  /** Product subcategory from the request payload */
  subcategory?: string | null
}

export interface ToggleProductVisibilityDto {
  isVisible: boolean
}

export interface ProductVisibilityResponseDto {
  id: string
  isVisible: boolean
}

export interface ToggleProductFeaturedDto {
  isFeatured: boolean
}

export interface ProductFeaturedResponseDto {
  id: string
  isFeatured: boolean
}

export interface UpdateProductImagesDto {
  images: string[]
  /**
   * When true (default), each eligible Spaces image is AI-enhanced asynchronously. Set false to keep images as uploaded.
   */
  enhanceImage?: boolean
}

export interface ProductImagesUpdateResponseDto {
  id: string
  images: string[]
}

export interface StoreListResponseDto {
  stores: StoreResponseDto[]
  count: number
  page: number
  limit: number
}

export interface MerchantStorePoliciesResponseDto {
  /** Standard refund policy text for merchant-facing display. */
  refundPolicy: string
  /** Standard shipping policy text for merchant-facing display. */
  shippingPolicy: string
}

export interface StoreOverviewDto {
  salesAnalytics: SalesAnalyticsDto
  productAnalytics: ProductAnalyticsDto
  financeAnalytics: FinanceAnalyticsDto
  reviewAnalytics: ReviewAnalyticsDto
}

export interface UpdateStoreStatusDto {
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
}

export interface StoreStatusResponseDto {
  id: string
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
}

export interface UpdateBrandingDto {
  bodyBackgroundColor?: string
  bodyTextColor?: string
  elementColor?: string
  headerBackgroundColor?: string
  headerTextColor?: string
  /** Hero banner image file */
  heroBanner?: Blob
}

export interface StoreBrandingResponseDto {
  id: string
  branding: Record<string, unknown> | null
}

export interface SendReminderDto {
  /** Email of the customer to remind */
  email: string
  /** Custom message from the merchant */
  message: string
  /** ID of the unpaid order */
  orderId: string
}

export interface CreateManualOrderDto {
  items: ManualOrderItem[]
  /** Payment status */
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
  /** Amount paid (required if status is PARTIAL) */
  amountPaid?: number
  /** Customer email (optional for manual orders) */
  customerEmail?: string
  /** Customer Country */
  country: string
  /** Customer Name (optional) */
  customerName?: string
  /** Customer phone number (optional) */
  customerPhone?: string
  /** Instructions or notes for the merchant */
  customerNote?: string
  /** Customer delivery address */
  customerAddress?: string
}

export interface UpdateOrderStatusDto {
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED"
  paymentStatus?: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
  /**
   * Required when setting status to DELIVERED. 4-digit numeric code the customer reads from their order emails.
   */
  deliveryCode?: string
}

export interface RejectOrderDto {
  /** Optional reason shown to the customer and in merchant records */
  reason?: string
}

export interface CreateCustomerDto {
  /** Customer Name */
  name: string
  /** Customer Email */
  email: string
  /** Customer Phone */
  phone?: string
  /** Customer Country */
  country?: string
}

export interface CustomerResponseDto {
  id: string
  name: string
  email: string
  phone?: string
  country?: string
  source: "MANUAL" | "ONLINE"
  storeId: string
  createdAt: string
  updatedAt: string
}

export interface CustomerListResponseDto {
  data: CustomerResponseDto[]
  count: number
  currentpage: number
  nextpage?: number | null
  prevpage?: string | null
  lastpage: number
}

export interface UpdateCustomerDto {
  /** Customer Name */
  name?: string
  /** Customer Email */
  email?: string
  /** Customer Phone */
  phone?: string
  /** Customer Country */
  country?: string
}

export interface SalesAnalyticsDto {
  totalOrders: number
  totalSales: number
  totalCustomers: number
  pageVisitors: number
  savedProducts: number
}

export interface ProductAnalyticsDto {
  totalCategories: number
  totalProducts: number
  totalSubcategories: number
  totalSavedProducts: number
}

export interface FinanceAnalyticsDto {
  paid: number
  unpaid: number
  manualSales: number
  onlineSales: number
}

export interface ReviewAnalyticsDto {
  averageRating: number
  totalReviews: number
}

export interface ManualOrderItem {
  /** Product ID */
  productId: string
  /** Quantity sold */
  quantity: number
  /** Product Variant ID */
  variantId?: string
}
