import * as S from '@/lib/api/numoni/marketplace.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type {
  CheckoutAndPayDto, CreateOrderDto, CreateReviewDto, MarketplaceListProductsParams, MarketplaceListStoreProductsParams,
  MarketplaceListStoresParams, ReportMerchantDto,
} from '@/lib/api/numoni'
import { useMsAction, useMsQuery } from './ms-hooks'

/* Marketplace MS — public storefront and the signed-in customer (consumer, brand app). */

const K = numoniKeys.marketplace
const carts = [K.listCarts(), K.all]

// ── discover ─────────────────────────────────────────────────────────────────
export const useHeroBanners = () => useMsQuery(K.listHeroBanners(), S.listHeroBanners)
export const useTopSelling = (period: '7d' | '30d' | 'all') => useMsQuery(K.listTopSellingProducts({ period }), () => S.listTopSellingProducts({ period, limit: 12 }))
export const useTrending = () => useMsQuery(K.listTrendingProducts({}), () => S.listTrendingProducts({ limit: 12 }))
export const usePublicProducts = (params: MarketplaceListProductsParams) => useMsQuery(K.listProducts(params), () => S.listProducts(params))
export const usePublicStores = (params: MarketplaceListStoresParams) => useMsQuery(K.listStores(params), () => S.listStores(params))
export const useRandomStores = (country?: string) => useMsQuery(K.listRandomStores({ country }), () => S.listRandomStores({ country, limit: 6 }))
export const useStoresByProduct = (productName: string) => useMsQuery(K.searchStoresByProduct({ productName }), () => S.searchStoresByProduct({ productName, limit: 10 }), { enabled: productName.length > 1 })
export const useBrowseTaxonomy = (industry?: string) => ({
  categories: useMsQuery(K.listTaxonomyCategoriesWithCounts({ industry }), () => S.listTaxonomyCategoriesWithCounts({ industry, hideEmpty: true })),
  industries: useMsQuery(K.listIndustries(), S.listIndustries),
  tags: useMsQuery(K.listTags(), S.listTags),
})
export const useTaxonomyReference = () => ({
  categories: useMsQuery(K.listTaxonomyCategories({}), () => S.listTaxonomyCategories({})),
  industries: useMsQuery(K.listTaxonomyIndustries(), S.listTaxonomyIndustries),
  tree: useMsQuery(K.getIndustryTaxonomy({}), () => S.getIndustryTaxonomy({})),
})
export const useSubcategories = (category: string) => useMsQuery(K.listTaxonomySubcategories({ category }), () => S.listTaxonomySubcategories({ category }), { enabled: !!category })
export const useLocations = (state?: string) => useMsQuery(K.listLocations({ state }), () => S.listLocations({ state }))
export const useAllReviews = () => useMsQuery(K.listAllReviews({}), () => S.listAllReviews({ limit: 20 }))

// ── one store (by slug) ──────────────────────────────────────────────────────
export const useStoreBySlug = (slug: string) => useMsQuery(K.getStoreBySlug(slug), () => S.getStoreBySlug(slug), { enabled: !!slug })
export const useSlugProducts = (slug: string, params: MarketplaceListStoreProductsParams) => useMsQuery(K.listStoreProducts(slug, params), () => S.listStoreProducts(slug, params), { enabled: !!slug })
export const useSlugProduct = (slug: string, productId: string | null) => useMsQuery(K.getStoreProduct(slug, productId ?? ''), () => S.getStoreProduct(slug, productId!), { enabled: !!slug && !!productId })
export const useSlugCategories = (slug: string) => useMsQuery(K.listStoreCategories(slug), () => S.listStoreCategories(slug), { enabled: !!slug })
export const useSlugFeatured = (slug: string) => useMsQuery(K.listFeaturedProducts(slug), () => S.listFeaturedProducts(slug), { enabled: !!slug })
export const useSlugReviews = (slug: string) => useMsQuery(K.listStoreReviewsBySlug(slug, {}), () => S.listStoreReviewsBySlug(slug, { limit: 20 }), { enabled: !!slug })
export const useStoreReviewsById = (storeId: string) => useMsQuery(K.listStoreReviews(storeId, {}), () => S.listStoreReviews(storeId, { limit: 20 }), { enabled: !!storeId })

export const useAddReview = () => useMsAction(({ storeId, body }: { storeId: string; body: CreateReviewDto }) => S.addReview(storeId, body), { success: 'Thanks for your review', error: 'Couldn’t post the review', invalidate: [K.all] })
export const useReportStore = () => useMsAction(({ storeId, body }: { storeId: string; body: ReportMerchantDto }) => S.reportStore(storeId, body), { success: 'Report sent to nuMoni', error: 'Couldn’t send the report' })

// ── cart & checkout ──────────────────────────────────────────────────────────
export const useCarts = () => useMsQuery(K.listCarts(), S.listCarts)
export const useCart = (storeId: string) => useMsQuery(K.getCart({ storeId }), () => S.getCart({ storeId }), { enabled: !!storeId })
export const useAddToCart = () => useMsAction(({ storeId, productId, quantity = 1, variantId }: { storeId: string; productId: string; quantity?: number; variantId?: string }) => S.addCartItems({ items: [{ storeId, productId, quantity, variantId }] }), { success: 'Added to cart', error: 'Couldn’t add to cart', invalidate: carts })
export const useUpdateCartItem = () => useMsAction(({ itemId, storeId, quantity }: { itemId: string; storeId: string; quantity: number }) => S.updateCartItem(itemId, { storeId, quantity }), { error: 'Couldn’t update the cart', invalidate: carts })
export const useRemoveCartItem = () => useMsAction(({ itemId, storeId }: { itemId: string; storeId: string }) => S.removeCartItem(itemId, { storeId }), { error: 'Couldn’t remove the item', invalidate: carts })
export const useClearCart = () => useMsAction((storeId: string) => S.clearCart({ storeId }), { success: 'Cart cleared', error: 'Couldn’t clear the cart', invalidate: carts })
export const useSetDeliveryLocation = () => useMsAction((address: string) => S.setDeliveryLocation({ address }), { success: 'Delivery address saved', error: 'Couldn’t save the address', invalidate: carts })
export const useCheckout = () => useMsAction(({ storeId, body }: { storeId: string; body: CreateOrderDto }) => S.checkout(storeId, body), { success: (o) => `Order ${o.orderNumber ?? ''} placed — pay to confirm`, error: 'Couldn’t place the order', invalidate: carts })
export const useCheckoutAndPay = () => useMsAction(({ storeId, body }: { storeId: string; body: CheckoutAndPayDto }) => S.checkoutAndPay(storeId, body), { success: 'Order placed and paid', error: 'Checkout failed', invalidate: carts })
export const usePayOrder = () => useMsAction(({ orderId, pin }: { orderId: string; pin: string }) => S.initializePayment({ orderId, pin }), { success: (r) => r.message || 'Payment started', error: 'Payment failed', invalidate: [K.all] })

// ── orders & wishlist ────────────────────────────────────────────────────────
export const useMyOrders = (page: number) => useMsQuery(K.listMyOrders({ page }), () => S.listMyOrders({ page, limit: 20 }))
export const useMyStoreOrders = (storeId: string) => useMsQuery(K.listMyStoreOrders(storeId, {}), () => S.listMyStoreOrders(storeId, { limit: 20 }), { enabled: !!storeId })
export const useMyOrder = (storeId: string, orderNumber: string | null) => useMsQuery(K.getOrder(storeId, orderNumber ?? ''), () => S.getOrder(storeId, orderNumber!), { enabled: !!storeId && !!orderNumber })
export const useCancelOrder = () => useMsAction(({ storeId, orderNumber, reason }: { storeId: string; orderNumber: string; reason?: string }) => S.cancelOrder(storeId, orderNumber, { reason }), { success: 'Order cancelled', error: 'Couldn’t cancel the order', invalidate: [K.all] })
export const useWishlist = () => useMsQuery(K.listWishlist({}), () => S.listWishlist({ limit: 50 }))
export const useToggleWishlist = () => useMsAction((productId: string) => S.toggleWishlist({ productId }), { success: 'Wishlist updated', error: 'Couldn’t update your wishlist', invalidate: [K.listWishlist({})] })
