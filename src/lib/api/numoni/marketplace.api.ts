import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/marketplace'
import { apiGet, apiSend, cast, identity, toFormData } from './request'
import type { SendOptions } from './request'
import type { CartResponseDto, CheckoutAndPayResponseDto, MarketplaceAddCartItemsBody, MarketplaceAddReviewBody, MarketplaceCancelOrderBody, MarketplaceCheckoutAndPayBody, MarketplaceCheckoutBody, MarketplaceClearCartParams, MarketplaceGetCartParams, MarketplaceGetIndustryTaxonomyParams, MarketplaceInitializePaymentBody, MarketplaceListAllReviewsParams, MarketplaceListLocationsParams, MarketplaceListMyOrdersParams, MarketplaceListMyStoreOrdersParams, MarketplaceListProductsParams, MarketplaceListRandomStoresParams, MarketplaceListStoreProductsParams, MarketplaceListStoreReviewsBySlugParams, MarketplaceListStoreReviewsParams, MarketplaceListStoresParams, MarketplaceListTaxonomyCategoriesParams, MarketplaceListTaxonomyCategoriesWithCountsParams, MarketplaceListTaxonomySubcategoriesParams, MarketplaceListTopSellingProductsParams, MarketplaceListTrendingProductsParams, MarketplaceListWishlistParams, MarketplaceRemoveCartItemParams, MarketplaceReportStoreBody, MarketplaceSearchStoresByProductParams, MarketplaceSetDeliveryLocationBody, MarketplaceToggleWishlistBody, MarketplaceUpdateCartItemBody, OrderResponseDto, PaymentInitResponseDto, WishlistToggleResponseDto } from './types/marketplace'

/*
 * Marketplace MS — public storefront & signed-in customer through the Gateway (`/marketplace/*`). Exported from the barrel as
 * `marketplaceApi`: `marketplaceApi.getSubscriptionAmount(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.marketplace

/**
 * Get current global store subscription amount
 * JWT-protected endpoint for both admin and merchant clients.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/settings/subscription-amount
 */
export function getSubscriptionAmount(): Promise<unknown> {
  return apiGet<unknown>(E.settingsSubscriptionAmount, () => ({}))
}

/**
 * List active marketplace homepage hero banners
 * List active marketplace homepage hero banners.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/hero-banners
 */
export function listHeroBanners(): Promise<unknown> {
  return apiGet<unknown>(E.heroBanners, () => ({}))
}

/**
 * Top-selling products (marketplace-wide)
 * Ranked by units sold on PAID orders. Default window: 30 days. Query `period`: 7d | 30d | all. Optional Bearer: each product includes `favourited` for the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/products/public/top-selling
 */
export function listTopSellingProducts(params: MarketplaceListTopSellingProductsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productsPublicTopSelling, () => ({}), { ...params })
}

/**
 * Trending products (marketplace-wide)
 * Products with the most PAID order lines in the last 48 hours (minimum 3 orders to qualify). Optional Bearer: each product includes `favourited` for the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/products/public/trending
 */
export function listTrendingProducts(params: MarketplaceListTrendingProductsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productsPublicTrending, () => ({}), { ...params })
}

/**
 * Get all published products across stores
 * Public (Bearer optional). Use this to list products before cart/checkout. Route: GET /api/v1/products/public (global prefix api/v1). Query string is validated as PublicProductsQueryDto: page, limit, storeId, tag, country, storeType, search, category, subcategory, hasDiscount, isNew, isSelling, sortBy, sortOrder. When a valid Bearer is present, each product includes `favourited` (true if on the customer wishlist). Missing or invalid Bearer is treated as guest (`favourited: false`); the route stays public. Envelope: { status, message, data }. `data` is paginated: { data: products[], count, currentpage, lastpage, nextpage, prevpage }.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/products/public
 */
export function listProducts(params: MarketplaceListProductsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productsPublic, () => ({}), { ...params })
}

/**
 * Get all public stores with filters (paginated)
 * Filter stores by search term, country, or industry.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/stores
 */
export function listStores(params: MarketplaceListStoresParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.stores, () => ({}), { ...params })
}

/**
 * Search for stores that have a specific product (paginated)
 * Search for stores that have a specific product (paginated).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/stores/search-by-product
 */
export function searchStoresByProduct(params: MarketplaceSearchStoresByProductParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storesSearchByProduct, () => ({}), { ...params })
}

/**
 * Report a merchant/store (up to 3 screenshots)
 * Report a merchant/store (up to 3 screenshots).
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/stores/{id}/report
 */
export function reportStore(id: string, body: MarketplaceReportStoreBody, opts: SendOptions = {}): Promise<unknown> {
  return apiSend('POST', E.storeReport(id), toFormData(body), identity, () => ({}), { multipart: true, ...opts })
}

/**
 * Get random stores by country
 * Optional filter by country.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/stores/random
 */
export function listRandomStores(params: MarketplaceListRandomStoresParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storesRandom, () => ({}), { ...params })
}

/**
 * Check if a store slug is available
 * Check if a store slug is available.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/stores/check-slug/{slug}
 */
export function checkStoreSlug(slug: string): Promise<unknown> {
  return apiGet<unknown>(E.storesCheckSlug(slug), () => ({}))
}

/**
 * Initialize a payment
 * Use **Authorize** (Bearer token); the same header is forwarded to the payment service.
 * @endpoint POST /marketplace/payments/initialize
 */
export function initializePayment(body: MarketplaceInitializePaymentBody): Promise<PaymentInitResponseDto> {
  return apiSend('POST', E.paymentsInitialize, body, cast<PaymentInitResponseDto>, () => fx.paymentInitResponse)
}

/**
 * Toggle product on wishlist
 * Adds the product if it is not on the wishlist; removes it if it already is. Always send `{ "productId": "<uuid>" }`. Response includes `favourited` (true = added, false = removed).
 * @endpoint POST /marketplace/storefront/wishlist/toggle
 */
export function toggleWishlist(body: MarketplaceToggleWishlistBody): Promise<WishlistToggleResponseDto> {
  return apiSend('POST', E.storefrontWishlistToggle, body, cast<WishlistToggleResponseDto>, () => fx.wishlistToggleResponse)
}

/**
 * List wishlist items for the signed-in customer
 * List wishlist items for the signed-in customer. For the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/wishlist
 */
export function listWishlist(params: MarketplaceListWishlistParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontWishlist, () => ({}), { ...params })
}

/**
 * List suggested product categories (public)
 * List suggested product categories (public).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/product-taxonomy/categories
 */
export function listTaxonomyCategories(params: MarketplaceListTaxonomyCategoriesParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyCategories, () => ({}), { ...params })
}

/**
 * List taxonomy categories with live product counts
 * Merges suggested taxonomy labels with counts from published products across active stores. For label-only lists use GET product-taxonomy/categories.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/product-taxonomy/categories/with-counts
 */
export function listTaxonomyCategoriesWithCounts(params: MarketplaceListTaxonomyCategoriesWithCountsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyCategoriesWithCounts, () => ({}), { ...params })
}

/**
 * List suggested subcategories for a category (public)
 * List suggested subcategories for a category (public).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/product-taxonomy/subcategories
 */
export function listTaxonomySubcategories(params: MarketplaceListTaxonomySubcategoriesParams): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomySubcategories, () => ({}), { ...params })
}

/**
 * List industries (public)
 * List industries (public).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/product-taxonomy/industries
 */
export function listTaxonomyIndustries(): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyIndustries, () => ({}))
}

/**
 * Get full industry taxonomy (public)
 * Returns Industry→Category→Subcategory tree. Optional `industry` matches a v2 node name (normalized); if it matches nothing, returns the full tree (union).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/product-taxonomy/v2
 */
export function getIndustryTaxonomy(params: MarketplaceGetIndustryTaxonomyParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.productTaxonomyV2, () => ({}), { ...params })
}

/**
 * Get all customer carts across stores
 * Requires Bearer JWT. Retrieves all carts for the signed-in customer grouped by store, including shipping locations and charges.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/cart/all
 */
export function listCarts(): Promise<unknown> {
  return apiGet<unknown>(E.storefrontCartAll, () => ({}))
}

/**
 * Get customer cart for a specific store
 * Requires Bearer JWT. Identity is taken from the token (no customerEmail query).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/cart
 */
export function getCart(params: MarketplaceGetCartParams): Promise<unknown> {
  return apiGet<unknown>(E.storefrontCart, () => ({}), { ...params })
}

/**
 * Clear cart
 * Clear cart. For the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint DELETE /marketplace/storefront/cart
 */
export function clearCart(params: MarketplaceClearCartParams): Promise<unknown> {
  return apiSend('DELETE', E.storefrontCart, undefined, identity, () => ({}), { params: { ...params } })
}

/**
 * Add items to cart (supports bulk)
 * Requires Bearer JWT. Cart lookup uses the token email. Optional `customerUserId` in the body is the platform 8-digit customer id (not the JWT userId).
 * @endpoint POST /marketplace/storefront/cart/items
 */
export function addCartItems(body: MarketplaceAddCartItemsBody): Promise<CartResponseDto> {
  return apiSend('POST', E.storefrontCartItems, body, cast<CartResponseDto>, () => fx.cartResponse)
}

/**
 * Set the customer's delivery location across all carts
 * Requires Bearer JWT. Updates `deliveryAddress` (required) and optional `latitude`/`longitude` on every cart owned by the signed-in customer so it persists across stores when fetching carts.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/storefront/cart/delivery-location
 */
export function setDeliveryLocation(body: MarketplaceSetDeliveryLocationBody): Promise<unknown> {
  return apiSend('PATCH', E.storefrontCartDeliveryLocation, body, identity, () => ({}))
}

/**
 * Update cart item quantity
 * Update cart item quantity. For the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/storefront/cart/items/{itemId}
 */
export function updateCartItem(itemId: string, body: MarketplaceUpdateCartItemBody): Promise<unknown> {
  return apiSend('PATCH', E.storefrontCartItem(itemId), body, identity, () => ({}))
}

/**
 * Remove item from cart
 * Remove item from cart. For the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint DELETE /marketplace/storefront/cart/items/{itemId}
 */
export function removeCartItem(itemId: string, params: MarketplaceRemoveCartItemParams): Promise<unknown> {
  return apiSend('DELETE', E.storefrontCartItem(itemId), undefined, identity, () => ({}), { params: { ...params } })
}

/**
 * Get all orders for the signed-in customer across all stores
 * Requires Bearer JWT. Replaces the former `GET .../orders/customer/:email` route. Optional query `isStorePickup=true|false` filters by store pickup vs shipped orders.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/orders/me
 */
export function listMyOrders(params: MarketplaceListMyOrdersParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontOrdersMe, () => ({}), { ...params })
}

/**
 * Get all orders for the signed-in customer in this store
 * Requires Bearer JWT. Replaces the former `GET .../:storeId/orders/customer/:email` route. Optional query `isStorePickup=true|false` filters by store pickup vs shipped orders.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/{storeId}/orders/me
 */
export function listMyStoreOrders(storeId: string, params: MarketplaceListMyStoreOrdersParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontOrdersMeByStoreId(storeId), () => ({}), { ...params })
}

/**
 * Create order from cart (checkout)
 * Requires Bearer JWT. Cart lookup uses the token email. Optional `customerUserId` is the platform 8-digit customer id (not the JWT userId).
 * @endpoint POST /marketplace/storefront/{storeId}/orders
 */
export function checkout(storeId: string, body: MarketplaceCheckoutBody): Promise<OrderResponseDto> {
  return apiSend('POST', E.storefrontOrders(storeId), body, cast<OrderResponseDto>, () => fx.orderResponse)
}

/**
 * Create order from cart and pay in a single request
 * Requires Bearer JWT. Creates a pending order from the cart, debits the customer wallet via the payment service, and only clears the cart after the wallet debit succeeds. Cart lookup uses the token email. Optional `customerUserId` is the platform 8-digit customer id (not the JWT userId). Body `customerEmail` is free-form (the receipt recipient) and does not need to match the signed-in account.
 * @endpoint POST /marketplace/storefront/{storeId}/orders/checkout-and-pay
 */
export function checkoutAndPay(storeId: string, body: MarketplaceCheckoutAndPayBody): Promise<CheckoutAndPayResponseDto> {
  return apiSend('POST', E.storefrontOrdersCheckoutAndPay(storeId), body, cast<CheckoutAndPayResponseDto>, () => fx.checkoutAndPayResponse)
}

/**
 * Get order by order number
 * Requires Bearer JWT. Only returns the order if it belongs to the signed-in customer.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/{storeId}/orders/{orderNumber}
 */
export function getOrder(storeId: string, orderNumber: string): Promise<unknown> {
  return apiGet<unknown>(E.storefrontOrder(storeId, orderNumber), () => ({}))
}

/**
 * Cancel a paid order within the cancellation window
 * Requires Bearer JWT. Only the customer who placed the order can cancel it. Cancellation is only allowed before the configurable window elapses and before the merchant is settled.
 * The spec leaves the response untyped.
 * @endpoint PATCH /marketplace/storefront/{storeId}/orders/{orderNumber}/cancel
 */
export function cancelOrder(storeId: string, orderNumber: string, body: MarketplaceCancelOrderBody): Promise<unknown> {
  return apiSend('PATCH', E.storefrontOrderCancel(storeId, orderNumber), body, identity, () => ({}))
}

/**
 * Add a review
 * Requires Bearer JWT. Reviewer identity is taken from the token (do not send customerEmail).
 * The spec leaves the response untyped.
 * @endpoint POST /marketplace/storefront/{storeId}/reviews
 */
export function addReview(storeId: string, body: MarketplaceAddReviewBody): Promise<unknown> {
  return apiSend('POST', E.storefrontReviews(storeId), body, identity, () => ({}))
}

/**
 * List reviews for store
 * List reviews for store.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/{storeId}/reviews
 */
export function listStoreReviews(storeId: string, params: MarketplaceListStoreReviewsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontReviews(storeId), () => ({}), { ...params })
}

/**
 * List all reviews
 * Public endpoint to list reviews across all stores
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/reviews/all
 */
export function listAllReviews(params: MarketplaceListAllReviewsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontReviewsAll, () => ({}), { ...params })
}

/**
 * Get store details by slug
 * Get store details by slug.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}
 */
export function getStoreBySlug(slug: string): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlug(slug), () => ({}))
}

/**
 * List store reviews
 * List store reviews.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}/reviews
 */
export function listStoreReviewsBySlug(slug: string, params: MarketplaceListStoreReviewsBySlugParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlugReviews(slug), () => ({}), { ...params })
}

/**
 * List store products
 * List store products.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}/products
 */
export function listStoreProducts(slug: string, params: MarketplaceListStoreProductsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlugProducts(slug), () => ({}), { ...params })
}

/**
 * Get product details
 * Get product details.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}/products/{productId}
 */
export function getStoreProduct(slug: string, productId: string): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlugProduct(slug, productId), () => ({}))
}

/**
 * List store categories
 * Each category includes `subcategories` (string[]) and `subcategoryDetails` ({ name, productCount }[]) with per-subcategory counts.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}/categories
 */
export function listStoreCategories(slug: string): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlugCategories(slug), () => ({}))
}

/**
 * List featured products for store
 * List featured products for store.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/storefront/slug/{slug}/featured-products
 */
export function listFeaturedProducts(slug: string): Promise<unknown> {
  return apiGet<unknown>(E.storefrontSlugFeaturedProducts(slug), () => ({}))
}

/**
 * Get all available tags
 * Get all available tags.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/tags
 */
export function listTags(): Promise<unknown> {
  return apiGet<unknown>(E.tags, () => ({}))
}

/**
 * Get all available industries
 * Get all available industries.
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/industries
 */
export function listIndustries(): Promise<unknown> {
  return apiGet<unknown>(E.industries, () => ({}))
}

/**
 * List Nigerian regions/states/LGAs (filterable)
 * Backed by state.csv. Supports filtering by region and/or state (case-insensitive partial match).
 * The spec leaves the response untyped.
 * @endpoint GET /marketplace/locations
 */
export function listLocations(params: MarketplaceListLocationsParams = {}): Promise<unknown> {
  return apiGet<unknown>(E.locations, () => ({}), { ...params })
}
