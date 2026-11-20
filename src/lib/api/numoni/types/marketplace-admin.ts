/*
 * Marketplace MS — platform admin shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */

/** Query parameters of `GET /marketplace/admin/dashboard`. */
export interface MarketplaceAdminGetDashboardParams {
  /** Dashboard analytics period */
  period?: "all_time" | "month" | "week" | "day" | "custom"
  /** Custom period start date (ISO) */
  startDate?: string
  /** Custom period end date (ISO) */
  endDate?: string
}

/** Query parameters of `GET /marketplace/admin/dashboard/recent-orders`. */
export interface MarketplaceAdminGetRecentOrdersParams {
  /** Recent orders period filter */
  period?: "all_time" | "month" | "week" | "day" | "custom"
  /** Custom period start date (ISO) */
  startDate?: string
  /** Custom period end date (ISO) */
  endDate?: string
  /** Filter by order status */
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED"
  /** Filter by payment status */
  paymentStatus?: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
  /** Search by order id (exact), order number (partial), or total amount (exact numeric) */
  search?: string
  page?: number
  limit?: number
}

/** Query parameters of `GET /marketplace/admin/sales`. */
export interface MarketplaceAdminGetSalesParams {
  /** Filter by exact Order ID */
  id?: string
  /** Search by order number, customer name, customer email, or store name (partial, case-insensitive) */
  search?: string
  /** Filter by start date */
  startDate?: string
  /** Filter by end date */
  endDate?: string
  /** Filter by Order Status */
  status?: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED"
  /** Filter by Country */
  country?: string
  /** Filter by Payment Status */
  paymentStatus?: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
  page?: number
  limit?: number
}

/** Query parameters of `GET /marketplace/admin/stores`. */
export interface MarketplaceAdminListStoresParams {
  /** Search by store name, slug, merchant email, or merchant ID */
  search?: string
  /** Filter by Country */
  country?: string
  /** Filter by Store Status */
  status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
  /** Filter by Store Type */
  type?: "PRODUCT" | "SERVICE"
  /** Filter by Owner ID */
  ownerId?: string
  /** Filter by Merchant ID (alias of ownerId) */
  merchantId?: string
  /** Filter stores created from this date (ISO) */
  createdFrom?: string
  /** Filter stores created up to this date (ISO) */
  createdTo?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

/** Query parameters of `GET /marketplace/admin/stores/stats`. */
export interface MarketplaceAdminGetStoreStatsParams {
  /** Filter by Country */
  country?: string
  /** Filter by Owner ID */
  ownerId?: string
  /** Filter by Merchant ID (alias of ownerId) */
  merchantId?: string
  /** Filter stats from this store created date (ISO) */
  createdFrom?: string
  /** Filter stats up to this store created date (ISO) */
  createdTo?: string
}

/** Query parameters of `GET /marketplace/admin/store-owners`. */
export interface MarketplaceAdminListStoreOwnersParams {
  /** Search ownerId, merchant email, or phone (partial match on phone list) */
  search?: string
  /** Only include owners that have at least one store with this status */
  status?: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
  /** Filter by earliest store createdAt (owner join) from (ISO) */
  dateJoinedFrom?: string
  /** Filter by earliest store createdAt (owner join) to (ISO) */
  dateJoinedTo?: string
  /** Sort field for the owner list */
  sortBy?: "dateJoined" | "totalStores" | "revenue"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

/** Query parameters of `GET /marketplace/admin/reports`. */
export interface MarketplaceAdminListReportsParams {
  page?: number
  limit?: number
  /** Search subject, message, reporter email, customer name, store name, store email */
  search?: string
  /** Filter by report priority */
  priority?: "LOW" | "HIGH" | "CRITICAL"
  /** Filter by report status */
  status?: "PENDING_REVIEW" | "OPENED" | "RESOLVED"
  /** Report created from (ISO) */
  createdFrom?: string
  /** Report created to (ISO) */
  createdTo?: string
}

/** Query parameters of `GET /marketplace/admin/finance/movements`. */
export interface MarketplaceAdminListMoneyMovementsParams {
  type?: "ORDER_SETTLEMENT" | "STORE_SUBSCRIPTION"
  storeId?: string
  orderId?: string
  /** Filter occurredAt >= startDate (ISO) */
  startDate?: string
  /** Filter occurredAt <= endDate (ISO) */
  endDate?: string
  page?: number
  limit?: number
}

/** Query parameters of `GET /marketplace/admin/finance/analytics`. */
export interface MarketplaceAdminGetFinanceAnalyticsParams {
  period?: "all_time" | "month" | "week" | "day" | "custom"
  startDate?: string
  endDate?: string
  type?: "ORDER_SETTLEMENT" | "STORE_SUBSCRIPTION"
}

/** Request body of `POST /marketplace/admin/settings/tags`. */
export type MarketplaceAdminSetStoreTagsBody = AddTagsDto

/** Request body of `POST /marketplace/admin/settings/industries`. */
export type MarketplaceAdminSetStoreIndustriesBody = AddIndustriesDto

/** Request body of `PATCH /marketplace/admin/settings/subscription-amount`. */
export type MarketplaceAdminSetSubscriptionAmountBody = UpdateSubscriptionDto

/** Request body of `POST /marketplace/admin/stores/{id}/block`. */
export type MarketplaceAdminBlockStoreBody = BlockStoreDto

/** Request body of `PATCH /marketplace/admin/stores/{id}/status`. */
export type MarketplaceAdminUpdateStoreStatusBody = UpdateStoreStatusAdminDto

/** Request body of `PATCH /marketplace/admin/stores/{storeId}/commission`. */
export type MarketplaceAdminUpdateStoreCommissionBody = UpdateStoreCommissionDto

/** Query parameters of `GET /marketplace/admin/audit-logs`. */
export interface MarketplaceAdminListAuditLogsParams {
  page?: number
  limit?: number
  /** Filter by action, e.g. PRODUCT_CREATED, ORDER_CANCELLED */
  action?: string
  /** Filter by entity type, e.g. STORE, PRODUCT, ORDER */
  entityType?: string
  /** Filter by entity ID */
  entityId?: string
  /** Filter by actor type: ADMIN, MERCHANT, CUSTOMER, SYSTEM */
  actorType?: string
  /** Filter by actor user ID */
  actorUserId?: string
  /** Filter by actor email (contains, case-insensitive) */
  actorEmail?: string
}

/** Request body of `POST /marketplace/admin/merchants/{ownerId}/stores`. */
export type MarketplaceAdminCreateStoreForMerchantBody = CreateStoreDto

/** Request body of `PATCH /marketplace/admin/stores/{storeId}`. */
export type MarketplaceAdminUpdateStoreBody = UpdateStoreDto

/** Request body of `PATCH /marketplace/admin/stores/{storeId}/settings/payment`. */
export type MarketplaceAdminUpdateStorePaymentSettingsBody = UpdatePaymentSettingsDto

/** Request body of `PATCH /marketplace/admin/stores/{storeId}/settings/shipping`. */
export type MarketplaceAdminUpdateStoreShippingBody = UpdateShippingLocationsDto

/** Request body of `POST /marketplace/admin/stores/{storeId}/subscription/verify-payment`. */
export type MarketplaceAdminVerifySubscriptionPaymentBody = VerifyStoreSubscriptionPaymentDto

/** Request body of `POST /marketplace/admin/stores/{storeId}/products`. */
export type MarketplaceAdminCreateProductBody = CreateProductDto

/** Request body of `POST /marketplace/admin/stores/{storeId}/products/bulk`. */
export interface MarketplaceAdminImportProductsBody {
  /** CSV file (see bulk-product-template.csv in repo) */
  file: Blob
}

/** Request body of `POST /marketplace/admin/hero-banners`. */
export type MarketplaceAdminCreateHeroBannerBody = CreateHeroBannerDto

/** Request body of `PATCH /marketplace/admin/hero-banners/{id}`. */
export type MarketplaceAdminUpdateHeroBannerBody = UpdateHeroBannerDto

/** Query parameters of `GET /marketplace/admin/product-taxonomy`. */
export interface MarketplaceAdminGetTaxonomyParams {
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Request body of `POST /marketplace/admin/product-taxonomy`. */
export type MarketplaceAdminReplaceTaxonomyBody = ReplaceTaxonomyDto

/** Query parameters of `GET /marketplace/admin/product-taxonomy/v2`. */
export interface MarketplaceAdminGetIndustryTaxonomyParams {
  industry?: string
}

/** Request body of `POST /marketplace/admin/product-taxonomy/v2`. */
export type MarketplaceAdminReplaceIndustryTaxonomyBody = ReplaceIndustryTaxonomyDto

/** Request body of `POST /marketplace/admin/product-taxonomy/from-pairs`. */
export type MarketplaceAdminReplaceTaxonomyFromPairsBody = ReplaceTaxonomyFromPairsDto

/** Request body of `POST /marketplace/admin/product-taxonomy/v2/from-triples`. */
export type MarketplaceAdminReplaceIndustryTaxonomyFromTriplesBody = ReplaceIndustryTaxonomyFromTriplesDto

/** Request body of `POST /marketplace/admin/product-taxonomy/categories`. */
export type MarketplaceAdminAddTaxonomyCategoryBody = AddCategoryDto

/** Request body of `POST /marketplace/admin/product-taxonomy/categories/{name}/subcategories`. */
export type MarketplaceAdminAddTaxonomySubcategoriesBody = ModifySubcategoriesDto

/** Request body of `DELETE /marketplace/admin/product-taxonomy/categories/{name}/subcategories`. */
export type MarketplaceAdminRemoveTaxonomySubcategoriesBody = ModifySubcategoriesDto

export interface AddTagsDto {
  tags: string[]
}

export interface AddIndustriesDto {
  industries: string[]
}

export interface UpdateSubscriptionDto {
  /** Subscription amount in USD */
  amount: number
}

export interface BlockStoreDto {
  block: boolean
  /** Reason for action (required when block=true) */
  reason?: string
}

export interface UpdateStoreStatusAdminDto {
  /** Target store status */
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
  /** Required when status is SUSPENDED or INACTIVE. Reason for audit trail. */
  reason?: string
}

export interface UpdateStoreCommissionDto {
  /**
   * Numoni's commission for this store as a whole-number percentage (stored as Store.discountThresholdPercent). Applies to future pricing previews and settlements; already-settled orders are not recalculated.
   */
  commissionPercent: number
  /** Why the commission was changed — kept in the audit trail. */
  reason?: string
}

export interface CreateStoreDto {
  name: string
  /** Merchant contact email */
  merchantEmail: string
  /** One or more public storefront phone numbers customers can call/WhatsApp */
  phoneNumber?: string[]
  /** Store address — also used as the pickup location for store-pickup orders. */
  address?: string
  /** Unique URL slug */
  slug: string
  /** Type of store (Product or Service provider) */
  storeType: "PRODUCT" | "SERVICE"
  /** Whether this is a walk-in (offline) store */
  walkIn?: boolean
  /** External merchant id from the client platform. Not the same as ownerId (JWT userId). */
  merchantId?: string
  /**
   * Business industries. Preferred over legacy `industry`. At least one of industry or industries is required on create.
   */
  industries?: string[]
  /**
   * Legacy single industry label. Use industries[] instead. If only this is sent, it is stored as industries[0].
   */
  industry?: string
  /** Business Logo */
  logo: Blob
  country: string
  /** Store website (optional) */
  website?: string
  /** Staff count range */
  staffCountRange?: string
  /** Physical locations count */
  locationCountRange?: string
}

export interface StoreResponseDto {
  id: string
  name: string
  slug: string
  storeUrl: string | null
  storeType: string | null
  walkIn: boolean
  /**
   * First industry label (legacy alias of industries[0])
   * @deprecated
   */
  industry: string | null
  /** Business industries */
  industries: string[]
  /** External merchant id from client platform */
  merchantId: Record<string, unknown> | null
  ownerId: string
  merchantEmail: string
  logoUrl: string | null
  description: string | null
  /** Store address — also used as the pickup location for store-pickup orders. */
  address: string | null
  phoneNumber: string[]
  email: string[]
  website: string | null
  socialLinks: Record<string, unknown> | null
  refundPolicy: string | null
  shippingPolicy: string | null
  dataProcessingPolicy: string | null
  country: string
  currencies: string[]
  staffCountRange: string | null
  locationCountRange: string | null
  lowStockAlert: number | null
  reviewCount: number
  averageRating: number
  chargesPayer: "MERCHANT" | "CUSTOMER"
  isPaid: boolean
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "SUSPENDED"
  shippingLocations: ShippingLocationDto[]
  createdAt: string
  updatedAt: string
}

export interface UpdateStoreDto {
  name?: string
  /** Merchant contact email */
  merchantEmail?: string
  /** One or more public storefront phone numbers customers can call/WhatsApp */
  phoneNumber?: string[]
  /** Store address — also used as the pickup location for store-pickup orders. */
  address?: string
  /** Unique URL slug */
  slug?: string
  /** Type of store (Product or Service provider) */
  storeType?: "PRODUCT" | "SERVICE"
  /** Whether this is a walk-in (offline) store */
  walkIn?: boolean
  /** External merchant id from the client platform. Not the same as ownerId (JWT userId). */
  merchantId?: string
  /**
   * Business industries. Preferred over legacy `industry`. At least one of industry or industries is required on create.
   */
  industries?: string[]
  /**
   * Legacy single industry label. Use industries[] instead. If only this is sent, it is stored as industries[0].
   */
  industry?: string
  /** Business Logo */
  logo?: Blob
  country?: string
  /** Store website (optional) */
  website?: string
  /** Staff count range */
  staffCountRange?: string
  /** Physical locations count */
  locationCountRange?: string
  description?: string
  email?: string[]
  /** Social links (can be sent as JSON string or multiple fields in multipart requests) */
  socialLinks?: SocialLinkDto[]
  /** Low stock alert threshold */
  lowStockAlert?: number
  refundPolicy?: string
  /**
   * Free-text shipping policy displayed on the storefront. Shipping fees per region are configured separately via `/settings/shipping`.
   */
  shippingPolicy?: string
  dataProcessingPolicy?: string
}

export interface UpdatePaymentSettingsDto {
  chargesPayer: "MERCHANT" | "CUSTOMER"
  charges: ChargeDto[]
}

export interface StorePaymentSettingsResponseDto {
  id: string
  chargesPayer: "MERCHANT" | "CUSTOMER"
  charges: Record<string, unknown>[]
}

export interface UpdateShippingLocationsDto {
  shippingLocations: ShippingLocationDto[]
}

export interface StoreShippingLocationsResponseDto {
  id: string
  shippingLocations: Record<string, unknown>[]
}

export interface StoreSubscriptionPaymentAccountResponseDto {
  merchantReference?: string
  onusReference?: string
  /** Virtual / dynamic account number to pay into */
  accountNumber?: string
  bankName?: string
  bankCode?: string
  accountName?: string
  amount?: number
  completionUrl?: string
  message?: string
}

export interface VerifyStoreSubscriptionPaymentDto {
  /**
   * Onus reference returned in `data.onusReference` from the subscription payment-account step. If omitted, the value stored on the store after that step is used.
   */
  onusReference?: string
  /**
   * Deprecated alias for `onusReference` only. Do not send merchantReference here — verify uses the Onus ref from the payment-account step.
   */
  transactionReference?: string
}

export interface VerifyStoreSubscriptionPaymentResponseDto {
  paid?: boolean
  message?: string
  onusReference?: string
  merchantReference?: string
  paymentStatus?: string
}

export interface CreateProductDto {
  name: string
  description?: string
  type: "GOODS" | "SERVICES"
  videoUrl?: string
  tags?: string[]
  images?: string[]
  /** Base price in NGN */
  price: number
  /** Merchant-provided discount percent (d). Must be >= store/admin threshold (x). */
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

export interface ProductResponseDto {
  id: string
  name: string
  description?: string | null
  type: "GOODS" | "SERVICES"
  videoUrl?: string | null
  tags: string[]
  images: string[]
  isVisible: boolean
  isFeatured: boolean
  status: "DRAFT" | "PUBLISHED"
  /** Product category label */
  category: string
  /** Product subcategory label */
  subcategory?: string | null
  /** Product industry (from request payload) */
  industry?: Record<string, unknown> | null
  /** Snapshot of store merchantId at product create/update */
  merchantId?: Record<string, unknown> | null
  storeId: string
  createdAt: string
  updatedAt: string
  /** Base product price in NGN (Decimal as string) */
  price: string
  /** Customer-facing discount percent (d - x) in integer percent */
  discountPercent: string
  quantity: number
  variants?: ProductVariantResponseDto[] | null
  shipping?: Record<string, unknown>[] | null
}

export interface BulkProductImportResponseDto {
  /** Number of data rows in the file (excluding header) */
  totalRows: number
  /** Number of products successfully created */
  createdCount: number
  /** Number of rows that failed (parse or create) */
  failedCount: number
  /** IDs of created products (same order as successful rows) */
  createdIds?: string[]
  failures: BulkProductImportFailureDto[]
}

export interface CreateHeroBannerDto {
  title: string
  subtitle?: string
  buttonText?: string
  /** Internal path or full https URL */
  buttonUrl?: string
  category?: string
  subcategory?: string
  sortOrder?: number
  isActive?: boolean
  /** Hero banner image (required). Form field name: image */
  image: Blob
}

export interface HeroBannerResponseDto {
  id: string
  title: string
  subtitle?: Record<string, unknown>
  imageUrl: string
  buttonText?: Record<string, unknown>
  buttonUrl?: Record<string, unknown>
  category?: Record<string, unknown>
  subcategory?: Record<string, unknown>
  sortOrder: number
  isActive: boolean
}

export interface UpdateHeroBannerDto {
  title?: string
  subtitle?: string
  buttonText?: string
  buttonUrl?: string
  category?: string
  subcategory?: string
  sortOrder?: number
  isActive?: boolean
  /** Replace hero banner image. Form field name: image */
  image?: Blob
}

export interface ReplaceTaxonomyDto {
  taxonomy: TaxonomyCategoryDto[]
}

export interface ReplaceIndustryTaxonomyDto {
  /** Full Industry→Category→Subcategory taxonomy tree. Replaces the entire stored v2 taxonomy. */
  taxonomy: IndustryTaxonomyNodeDto[]
}

export interface ReplaceTaxonomyFromPairsDto {
  /**
   * Flat list of category/subcategory rows (like a two-column sheet). Replaces the entire stored taxonomy, same as POST /admin/product-taxonomy with a tree.
   */
  pairs: CategorySubcategoryPairDto[]
}

export interface ReplaceIndustryTaxonomyFromTriplesDto {
  /**
   * Flat list of industry/category/subcategory rows (like a 3-column sheet). Replaces the entire stored v2 taxonomy.
   */
  triples: IndustryCategorySubcategoryTripleDto[]
}

export interface AddCategoryDto {
  name: string
  subcategories?: string[]
}

export interface ModifySubcategoriesDto {
  subcategories: string[]
}

export interface ShippingLocationDto {
  name: string
  amount: number
  currency?: string
}

export interface SocialLinkDto {
  url: string
  title: string
}

export interface ChargeDto {
  id?: string
  name: string
  type: "PERCENTAGE" | "FLAT"
  value: number
  enabled?: boolean
}

export interface ProductVariantDto {
  id?: string
  /** Dynamic attributes for the variant */
  attributes: Record<string, unknown>
  /** Optional price override for this specific variant */
  price?: number
  quantity: number
}

export interface ProductShippingDto {
  id?: string
  locationName: string
  fee: number
  description?: string
}

export interface ProductVariantResponseDto {
  id: string
  productId: string
  attributes: Record<string, unknown>
  price: string | null
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface BulkProductImportFailureDto {
  /** 1-based data row number (excluding header) */
  row: number
  message: string
}

export interface TaxonomyCategoryDto {
  name: string
  subcategories: string[]
}

export interface IndustryTaxonomyNodeDto {
  name: string
  categories: IndustryTaxonomyCategoryDto[]
}

export interface CategorySubcategoryPairDto {
  /** Product category. Same name may appear on many rows—each row adds one subcategory under it. */
  category: string
  /** Item subcategory mapped under the category in this row. */
  subcategory: string
}

export interface IndustryCategorySubcategoryTripleDto {
  industry: string
  category: string
  subcategory: string
}

export interface IndustryTaxonomyCategoryDto {
  name: string
  subcategories: string[]
}
