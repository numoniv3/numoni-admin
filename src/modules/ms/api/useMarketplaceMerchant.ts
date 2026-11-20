import * as M from '@/lib/api/numoni/marketplace-merchant.api'
import * as AD from '@/lib/api/numoni/marketplace-admin.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type {
  CreateCustomerDto, CreateManualOrderDto, CreateProductDto, CreateProductV2Dto, CreateStoreDto, DeleteProductImageDto, SendReminderDto,
  UpdateBrandingDto, UpdateCustomerDto, UpdateOrderStatusDto, UpdatePaymentSettingsDto, UpdateProductDto, UpdateProductV2Dto,
  UpdateShippingLocationsDto, UpdateStoreDto, VerifyStoreSubscriptionPaymentDto,
  MarketplaceMerchantGetStoreOverviewParams, MarketplaceMerchantListOrdersParams, MarketplaceMerchantListProductsParams,
} from '@/lib/api/numoni'
import { useMsAction, useMsQuery } from './ms-hooks'

/* Marketplace MS — the store owner's side (`/marketplace/merchant/*`). */

const K = numoniKeys.marketplaceMerchant
const KA = numoniKeys.marketplaceAdmin
const all = [K.all, KA.all]

// ── reads ────────────────────────────────────────────────────────────────────
export const useMyStores = () => useMsQuery(K.listStores({}), () => M.listStores({ limit: 50 }))
export const useStore = (id: string) => useMsQuery(K.getStore(id), () => M.getStore(id))
export const useStoreOverview = (id: string, params: MarketplaceMerchantGetStoreOverviewParams) => useMsQuery(K.getStoreOverview(id, params), () => M.getStoreOverview(id, params))
export const useStorePolicies = () => useMsQuery(K.getStorePolicies(), M.getStorePolicies)
export const useStoreProducts = (storeId: string, params: MarketplaceMerchantListProductsParams) => useMsQuery(K.listProducts(storeId, params), () => M.listProducts(storeId, params))
export const useStoreProduct = (storeId: string, id: string | null) => useMsQuery(K.getProduct(storeId, id ?? ''), () => M.getProduct(storeId, id!), { enabled: !!id })
export const useStoreOrders = (storeId: string, params: MarketplaceMerchantListOrdersParams) => useMsQuery(K.listOrders(storeId, params), () => M.listOrders(storeId, params))
export const useStoreOrder = (storeId: string, id: string | null) => useMsQuery(K.getOrder(storeId, id ?? ''), () => M.getOrder(storeId, id!), { enabled: !!id })
export const useStoreCustomers = (storeId: string, page: number, search?: string) => useMsQuery(K.listCustomers(storeId, { page, search }), () => M.listCustomers(storeId, { page, limit: 20, search }))
export const useStoreReviews = (storeId: string, page: number, productId?: string) => useMsQuery(K.listReviews(storeId, { page, productId }), () => M.listReviews(storeId, { page, limit: 20, productId }))
export const useMerchantTaxonomy = (industry?: string) => ({
  categories: useMsQuery(K.listTaxonomyCategories({ industry }), () => M.listTaxonomyCategories({ industry })),
  industries: useMsQuery(K.listTaxonomyIndustries(), M.listTaxonomyIndustries),
})
export const useMerchantSubcategories = (category: string, industry?: string) =>
  useMsQuery(K.listTaxonomySubcategories({ category, industry }), () => M.listTaxonomySubcategories({ category, industry }), { enabled: !!category })
export const useMerchantTaxonomyTrees = () => ({
  tree: useMsQuery(K.getTaxonomy({}), () => M.getTaxonomy({})),
  v2: useMsQuery(K.getIndustryTaxonomy({}), () => M.getIndustryTaxonomy({})),
})

// ── store writes. `StoreOps` lets the admin app reuse the forms "on behalf" of a merchant. ──
export interface StoreOps {
  update: (id: string, body: UpdateStoreDto, opts?: { onProgress?: (f: number) => void }) => Promise<unknown>
  payment: (id: string, body: UpdatePaymentSettingsDto) => Promise<unknown>
  shipping: (id: string, body: UpdateShippingLocationsDto) => Promise<unknown>
  subscriptionAccount: (id: string) => Promise<unknown>
  verifySubscription: (id: string, body: VerifyStoreSubscriptionPaymentDto) => Promise<unknown>
  createProduct: (storeId: string, body: CreateProductDto) => Promise<unknown>
  importProducts: (storeId: string, file: File) => Promise<unknown>
}
export const MERCHANT_OPS: StoreOps = {
  update: (id, body, opts) => M.updateStore(id, body, opts), payment: M.updateStorePaymentSettings, shipping: M.updateStoreShipping,
  subscriptionAccount: M.getSubscriptionPaymentAccount, verifySubscription: M.verifySubscriptionPayment,
  createProduct: M.createProduct, importProducts: (s, file) => M.importProducts(s, { file }),
}
export const ADMIN_OPS: StoreOps = {
  update: (id, body, opts) => AD.updateStore(id, body, opts), payment: AD.updateStorePaymentSettings, shipping: AD.updateStoreShipping,
  subscriptionAccount: AD.getSubscriptionPaymentAccount, verifySubscription: AD.verifySubscriptionPayment,
  createProduct: AD.createProduct, importProducts: (s, file) => AD.importProducts(s, { file }),
}

export const useStoreAction = <A, R>(fn: (a: A) => Promise<R>, success: string, error: string) => useMsAction(fn, { success, error, invalidate: all })

export const useCreateStore = () => useStoreAction(({ body, onProgress }: { body: CreateStoreDto; onProgress?: (f: number) => void }) => M.createStore(body, { onProgress }), 'Store created', 'Couldn’t create the store')
export const useSetStoreStatus = () => useStoreAction(({ id, status }: { id: string; status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' }) => M.setStorePublished(id, { status }), 'Store status updated', 'Couldn’t change the store status')
export const useUpdateBranding = () => useStoreAction(({ id, body, onProgress }: { id: string; body: UpdateBrandingDto; onProgress?: (f: number) => void }) => M.updateStoreBranding(id, body, { onProgress }), 'Branding saved', 'Couldn’t save the branding')

// ── products ─────────────────────────────────────────────────────────────────
export const useCreateProductV2 = () => useStoreAction(({ storeId, body }: { storeId: string; body: CreateProductV2Dto }) => M.createProductV2(storeId, body), 'Product created', 'Couldn’t create the product')
export const useUpdateProduct = () => useStoreAction(({ storeId, id, body, v1 }: { storeId: string; id: string; body: UpdateProductV2Dto; v1?: boolean }) => (v1 ? M.updateProduct(storeId, id, body as UpdateProductDto) : M.updateProductV2(storeId, id, body)), 'Product updated', 'Couldn’t update the product')
export const useDeleteProduct = () => useStoreAction(({ storeId, id }: { storeId: string; id: string }) => M.deleteProduct(storeId, id), 'Product deleted', 'Couldn’t delete the product')
export const useProductVisibility = () => useStoreAction(({ storeId, id, isVisible }: { storeId: string; id: string; isVisible: boolean }) => M.setProductVisibility(storeId, id, { isVisible }), 'Visibility updated', 'Couldn’t change visibility')
export const useProductFeatured = () => useStoreAction(({ storeId, id, isFeatured }: { storeId: string; id: string; isFeatured: boolean }) => M.setProductFeatured(storeId, id, { isFeatured }), 'Featured updated', 'Couldn’t change featured')
export const useUploadProductImages = () => useMsAction(({ storeId, files }: { storeId: string; files: File[] }) => M.uploadProductImages(storeId, { images: files }), { error: 'Couldn’t upload the images' })
export const useSetProductImages = () => useStoreAction(({ storeId, id, images }: { storeId: string; id: string; images: string[] }) => M.updateProductImages(storeId, id, { images }), 'Images saved', 'Couldn’t save the images')
export const useDeleteProductImage = () => useStoreAction(({ storeId, body }: { storeId: string; body: DeleteProductImageDto }) => M.deleteProductImage(storeId, body), 'Image deleted', 'Couldn’t delete the image')
export const usePricingPreview = () => useMsAction(({ storeId, price, discountPercent, v1 }: { storeId: string; price: number; discountPercent: number; v1?: boolean }) => (v1 ? M.previewProductPricing(storeId, { price, discountPercent }) : M.previewProductPricingV2(storeId, { price, discountPercent })), { error: 'Couldn’t preview the pricing' })

// ── orders, customers ────────────────────────────────────────────────────────
export const useCreateManualOrder = () => useStoreAction(({ storeId, body }: { storeId: string; body: CreateManualOrderDto }) => M.createManualOrder(storeId, body), 'Order created', 'Couldn’t create the order')
export const useUpdateOrderStatus = () => useStoreAction(({ storeId, id, body }: { storeId: string; id: string; body: UpdateOrderStatusDto }) => M.updateOrderStatus(storeId, id, body), 'Order updated', 'Couldn’t update the order')
export const useRejectOrder = () => useStoreAction(({ storeId, id, reason }: { storeId: string; id: string; reason?: string }) => M.rejectOrder(storeId, id, { reason }), 'Order rejected — the customer is refunded', 'Couldn’t reject the order')
export const useSendReminder = () => useStoreAction(({ storeId, body }: { storeId: string; body: SendReminderDto }) => M.sendOrderReminder(storeId, body), 'Reminder sent', 'Couldn’t send the reminder')
export const useCreateCustomer = () => useStoreAction(({ storeId, body }: { storeId: string; body: CreateCustomerDto }) => M.createCustomer(storeId, body), 'Customer added', 'Couldn’t add the customer')
export const useUpdateCustomer = () => useStoreAction(({ storeId, id, body }: { storeId: string; id: string; body: UpdateCustomerDto }) => M.updateCustomer(storeId, id, body), 'Customer updated', 'Couldn’t update the customer')
