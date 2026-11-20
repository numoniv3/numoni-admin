/*
 * Marketplace MS — public storefront & signed-in customer shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */

/** Query parameters of `GET /marketplace/products/public/top-selling`. */
export interface MarketplaceListTopSellingProductsParams {
  /** Maximum number of products to return */
  limit?: number
  /** Sales window for top-selling (ignored on trending endpoint) */
  period?: "7d" | "30d" | "all"
}

/** Query parameters of `GET /marketplace/products/public/trending`. */
export interface MarketplaceListTrendingProductsParams {
  /** Maximum number of products to return */
  limit?: number
  /** Sales window for top-selling (ignored on trending endpoint) */
  period?: "7d" | "30d" | "all"
}

/** Query parameters of `GET /marketplace/products/public`. */
export interface MarketplaceListProductsParams {
  /** Filter by store ID */
  storeId?: string
  /** Filter by product tag */
  tag?: string
  /** Filter by store country */
  country?: string
  /** Filter by store type */
  storeType?: "PRODUCT" | "SERVICE"
  /** Filter by store industry */
  industry?: string
  /** Search products by name or description */
  search?: string
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
  /** Page number */
  page?: number
  /** Items per page */
  limit?: number
  /** Sort by field */
  sortBy?: string
  /** Sort order (asc or desc) */
  sortOrder?: string
}

/** Query parameters of `GET /marketplace/stores`. */
export interface MarketplaceListStoresParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Search stores by name or description */
  search?: string
  /** Filter by country */
  country?: string
  /** Filter by industry */
  industry?: string
}

/** Query parameters of `GET /marketplace/stores/search-by-product`. */
export interface MarketplaceSearchStoresByProductParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Product name to search for in stores */
  productName?: string
  /** Maximum number of matching products to return per store */
  productLimit?: number
  /** Maximum number of reviews to return per store */
  reviewLimit?: number
}

/** Request body of `POST /marketplace/stores/{id}/report`. */
export type MarketplaceReportStoreBody = ReportMerchantDto

/** Query parameters of `GET /marketplace/stores/random`. */
export interface MarketplaceListRandomStoresParams {
  /** Country to filter stores by */
  country?: string
  /** Number of random stores to return */
  limit?: number
}

/** Request body of `POST /marketplace/payments/initialize`. */
export type MarketplaceInitializePaymentBody = InitializePaymentDto

/** Request body of `POST /marketplace/storefront/wishlist/toggle`. */
export type MarketplaceToggleWishlistBody = ToggleWishlistDto

/** Query parameters of `GET /marketplace/storefront/wishlist`. */
export interface MarketplaceListWishlistParams {
  page?: number
  limit?: number
}

/** Query parameters of `GET /marketplace/product-taxonomy/categories`. */
export interface MarketplaceListTaxonomyCategoriesParams {
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Query parameters of `GET /marketplace/product-taxonomy/categories/with-counts`. */
export interface MarketplaceListTaxonomyCategoriesWithCountsParams {
  /** Optional industry filter (v2 taxonomy node) */
  industry?: string
  /** When true, omit categories with zero products */
  hideEmpty?: boolean
  /** Include subcategory breakdown with product counts */
  includeSubcategories?: boolean
}

/** Query parameters of `GET /marketplace/product-taxonomy/subcategories`. */
export interface MarketplaceListTaxonomySubcategoriesParams {
  category: string
  /**
   * Optional industry filter (v2 taxonomy node; spacing/& normalization). Omit—or use a non-matching label—to receive union across all industries.
   */
  industry?: string
}

/** Query parameters of `GET /marketplace/product-taxonomy/v2`. */
export interface MarketplaceGetIndustryTaxonomyParams {
  industry?: string
}

/** Query parameters of `GET /marketplace/storefront/cart`. */
export interface MarketplaceGetCartParams {
  storeId: string
}

/** Query parameters of `DELETE /marketplace/storefront/cart`. */
export interface MarketplaceClearCartParams {
  storeId: string
}

/** Request body of `POST /marketplace/storefront/cart/items`. */
export type MarketplaceAddCartItemsBody = BulkAddToCartDto

/** Request body of `PATCH /marketplace/storefront/cart/delivery-location`. */
export type MarketplaceSetDeliveryLocationBody = UpdateCartDeliveryLocationDto

/** Request body of `PATCH /marketplace/storefront/cart/items/{itemId}`. */
export type MarketplaceUpdateCartItemBody = UpdateCartItemDto

/** Query parameters of `DELETE /marketplace/storefront/cart/items/{itemId}`. */
export interface MarketplaceRemoveCartItemParams {
  storeId: string
}

/** Query parameters of `GET /marketplace/storefront/orders/me`. */
export interface MarketplaceListMyOrdersParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /**
   * Filter by fulfillment method. `true` = customer chose store pickup at checkout. `false` = customer selected a shipping location.
   */
  isStorePickup?: boolean
}

/** Query parameters of `GET /marketplace/storefront/{storeId}/orders/me`. */
export interface MarketplaceListMyStoreOrdersParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /**
   * Filter by fulfillment method. `true` = customer chose store pickup at checkout. `false` = customer selected a shipping location.
   */
  isStorePickup?: boolean
}

/** Request body of `POST /marketplace/storefront/{storeId}/orders`. */
export type MarketplaceCheckoutBody = CreateOrderDto

/** Request body of `POST /marketplace/storefront/{storeId}/orders/checkout-and-pay`. */
export type MarketplaceCheckoutAndPayBody = CheckoutAndPayDto

/** Request body of `PATCH /marketplace/storefront/{storeId}/orders/{orderNumber}/cancel`. */
export type MarketplaceCancelOrderBody = CancelOrderDto

/** Request body of `POST /marketplace/storefront/{storeId}/reviews`. */
export type MarketplaceAddReviewBody = CreateReviewDto

/** Query parameters of `GET /marketplace/storefront/{storeId}/reviews`. */
export interface MarketplaceListStoreReviewsParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Filter reviews by product ID */
  productId?: string
}

/** Query parameters of `GET /marketplace/storefront/reviews/all`. */
export interface MarketplaceListAllReviewsParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
}

/** Query parameters of `GET /marketplace/storefront/slug/{slug}/reviews`. */
export interface MarketplaceListStoreReviewsBySlugParams {
  /** Page number */
  page?: number
  /** Number of items per page (max 100) */
  limit?: number
  /** Filter reviews by product ID */
  productId?: string
}

/** Query parameters of `GET /marketplace/storefront/slug/{slug}/products`. */
export interface MarketplaceListStoreProductsParams {
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

/** Query parameters of `GET /marketplace/locations`. */
export interface MarketplaceListLocationsParams {
  /** Filter by region (case-insensitive, partial match). */
  region?: string
  /** Filter by state (case-insensitive, partial match). */
  state?: string
}

export interface ReportMerchantDto {
  /** Short subject/title for the report (optional) */
  subject?: string
  /** Reporter display name (optional) */
  customerName?: string
  /** Report priority */
  priority?: "LOW" | "HIGH" | "CRITICAL"
  /** Reason for reporting the merchant */
  message: string
  /** Up to 3 screenshots (max 5MB each) */
  images?: Blob[]
}

export interface InitializePaymentDto {
  /** Order ID */
  orderId: string
  /** Customer transaction PIN */
  pin: string
}

export interface PaymentInitResponseDto {
  success: boolean
  message: string
  transactionReference: string
  /**
   * Customer-only delivery confirmation code for the paid order. Share this with the merchant only when your order is delivered so they can mark it as DELIVERED.
   */
  deliveryConfirmationCode: Record<string, unknown> | null
}

export interface ToggleWishlistDto {
  /** Product ID to add or remove from wishlist */
  productId: string
}

export interface WishlistToggleResponseDto {
  /** Whether the product is now on the wishlist */
  favourited: boolean
  productId: string
}

export interface BulkAddToCartDto {
  /**
   * Platform customer id from the frontend (typically an 8-digit string). Not the JWT userId. Stored on the cart when provided.
   */
  customerUserId?: string
  items: AddToCartDto[]
}

export interface CartResponseDto {
  id: string
  /** Customer email (cart lookup key; legacy field name customerId) */
  customerId: string
  /** Platform customer id from the frontend (typically an 8-digit string). Not the JWT userId. */
  customerUserId?: Record<string, unknown> | null
  storeId: string
  createdAt: string
  updatedAt: string
  currency: string | null
  /** Customer's saved delivery address (mirrored across carts). */
  deliveryAddress: string | null
  deliveryLatitude: string | null
  deliveryLongitude: string | null
  items: CartItemResponseDto[]
}

export interface UpdateCartDeliveryLocationDto {
  /** Full delivery address; mirrored to every cart belonging to the signed-in customer. */
  address: string
  /** Geo latitude */
  latitude?: number
  /** Geo longitude */
  longitude?: number
}

export interface UpdateCartItemDto {
  storeId: string
  quantity: number
}

export interface CreateOrderDto {
  /**
   * Platform customer id from the frontend (typically an 8-digit string). Not the JWT userId. Optional for legacy clients.
   */
  customerUserId?: string
  /** Customer country */
  country: string
  /** Customer full name */
  customerName: string
  /** Customer WhatsApp phone number */
  customerPhone: string
  /**
   * Optional. If sent, must match the JWT user email. Order email defaults to the signed-in user when omitted.
   */
  customerEmail?: string
  /**
   * ID of the selected store shipping location. Omit (or leave unset) when the customer will pick up the order at the merchant store.
   */
  shippingLocationId?: string
  /** Customer has accepted data privacy & consent terms */
  dataConsentAccepted: boolean
  /** Instructions or notes for the merchant */
  customerNote?: string
  /** Customer delivery address */
  customerAddress?: string
}

export interface OrderResponseDto {
  id: string
  /**
   * Platform customer id from checkout (typically an 8-digit string). Stored as Order.customerId. Not the JWT userId.
   */
  customerId: Record<string, unknown> | null
  /** Snapshot of store merchantId at checkout */
  merchantId: Record<string, unknown> | null
  /** Delivery confirmation code — give this to the courier/merchant only when your order is delivered. */
  deliveryConfirmationCode: Record<string, unknown> | null
  orderNumber: string
  customerName: string | null
  customerEmail: string
  customerPhone: string | null
  customerAddress: string | null
  /** Shipping snapshot: { locationName, shippingFee, pickupAddress?, pickupPhoneNumbers?, storeName? } */
  shippingAddr: Record<string, unknown> | null
  /**
   * True when the customer chose store pickup at checkout (omitted shippingLocationId). False when a shipping location was selected.
   */
  isStorePickup: boolean
  /** Array of applied store charges: { id, name, type, value, amount } */
  appliedCharges: Record<string, unknown>[]
  /** Sum of line items at list price before discounts */
  itemsListSubtotal: string | null
  /** Total discount applied to items */
  itemsDiscountTotal: string | null
  /** Shipping fee amount */
  shippingAmount: string | null
  /** Total of applied charges (when customer pays) */
  chargesTotal: string | null
  /** Grand total for the order */
  totalAmount: string
  /** Amount already paid */
  amountPaid: string
  currency: string
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED"
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED"
  storeId: string
  createdAt: string
  updatedAt: string
  items: OrderItemResponseDto[]
}

export interface CheckoutAndPayDto {
  /**
   * Platform customer id from the frontend (typically an 8-digit string). Not the JWT userId. Optional for legacy clients.
   */
  customerUserId?: string
  /** Customer country */
  country: string
  /** Customer full name */
  customerName: string
  /** Customer WhatsApp phone number */
  customerPhone: string
  /**
   * Optional. If sent, must match the JWT user email. Order email defaults to the signed-in user when omitted.
   */
  customerEmail?: string
  /**
   * ID of the selected store shipping location. Omit (or leave unset) when the customer will pick up the order at the merchant store.
   */
  shippingLocationId?: string
  /** Customer has accepted data privacy & consent terms */
  dataConsentAccepted: boolean
  /** Instructions or notes for the merchant */
  customerNote?: string
  /** Customer delivery address */
  customerAddress?: string
  /** Customer transaction PIN */
  pin: string
}

export interface CheckoutAndPayResponseDto {
  order: OrderResponseDto
  payment: PaymentInitResponseDto
}

export interface CancelOrderDto {
  /** Optional reason for cancellation */
  reason?: string
}

export interface CreateReviewDto {
  /** Rating from 1 to 5 */
  rating: number
  comment?: string
  reviewerName?: string
  /** Product ID being reviewed (optional if reviewing store) */
  productId?: string
}

export interface AddToCartDto {
  storeId: string
  /** Product ID to add to cart */
  productId: string
  quantity: number
  /** Optional variant ID */
  variantId?: string
}

export interface CartItemResponseDto {
  id: string
  quantity: number
  cartId: string
  productId: string
  price: string
  basePrice?: string
  discountPercent?: string
  createdAt: string
  updatedAt: string
  product: Record<string, unknown>
}

export interface OrderItemResponseDto {
  id: string
  quantity: number
  price: string
  currency: string
  productName: string
  orderId: string
  productId: string
}
