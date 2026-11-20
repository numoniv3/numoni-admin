/* Fixtures for Marketplace MS — platform admin, built from the spec's examples. */
import type { BulkProductImportResponseDto, HeroBannerResponseDto, ProductResponseDto, StorePaymentSettingsResponseDto, StoreResponseDto, StoreShippingLocationsResponseDto, StoreSubscriptionPaymentAccountResponseDto, VerifyStoreSubscriptionPaymentResponseDto } from '../types/marketplace-admin'

export const storeResponse: StoreResponseDto = {
  id: 'demo-id',
  name: 'demo-name',
  slug: 'demo-slug',
  storeUrl: 'demo-storeUrl',
  storeType: 'demo-storeType',
  walkIn: false,
  industry: 'demo-industry',
  industries: [
    'demo-industry',
  ],
  merchantId: {},
  ownerId: 'demo-ownerId',
  merchantEmail: 'demo-merchantEmail',
  logoUrl: 'demo-logoUrl',
  description: 'demo-description',
  address: 'demo-address',
  phoneNumber: [
    'demo-phoneNumber',
  ],
  email: [
    'demo-email',
  ],
  website: 'demo-website',
  socialLinks: {},
  refundPolicy: 'demo-refundPolicy',
  shippingPolicy: 'demo-shippingPolicy',
  dataProcessingPolicy: 'demo-dataProcessingPolicy',
  country: 'demo-country',
  currencies: [
    'demo-currency',
  ],
  staffCountRange: 'demo-staffCountRange',
  locationCountRange: 'demo-locationCountRange',
  lowStockAlert: 0,
  reviewCount: 0,
  averageRating: 0,
  chargesPayer: 'MERCHANT',
  isPaid: false,
  status: 'DRAFT',
  shippingLocations: [
    {
      name: 'Lagos',
      amount: 3000,
      currency: 'NGN',
    },
  ],
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-01T09:00:00.000Z',
}

export const storePaymentSettingsResponse: StorePaymentSettingsResponseDto = {
  id: 'demo-id',
  chargesPayer: 'MERCHANT',
  charges: [
    {},
  ],
}

export const storeShippingLocationsResponse: StoreShippingLocationsResponseDto = {
  id: 'demo-id',
  shippingLocations: [
    {},
  ],
}

export const storeSubscriptionPaymentAccountResponse: StoreSubscriptionPaymentAccountResponseDto = {
  merchantReference: 'demo-merchantReference',
  onusReference: 'demo-onusReference',
  accountNumber: 'demo-accountNumber',
  bankName: 'demo-bankName',
  bankCode: 'demo-bankCode',
  accountName: 'demo-accountName',
  amount: 0,
  completionUrl: 'demo-completionUrl',
  message: 'demo-message',
}

export const verifyStoreSubscriptionPaymentResponse: VerifyStoreSubscriptionPaymentResponseDto = {
  paid: false,
  message: 'demo-message',
  onusReference: 'demo-onusReference',
  merchantReference: 'demo-merchantReference',
  paymentStatus: 'demo-paymentStatus',
}

export const productResponse: ProductResponseDto = {
  id: 'demo-id',
  name: 'demo-name',
  description: 'demo-description',
  type: 'GOODS',
  videoUrl: 'demo-videoUrl',
  tags: [
    'demo-tag',
  ],
  images: [
    'demo-image',
  ],
  isVisible: false,
  isFeatured: false,
  status: 'DRAFT',
  category: 'demo-category',
  subcategory: 'demo-subcategory',
  industry: {},
  merchantId: {},
  storeId: 'demo-storeId',
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-01T09:00:00.000Z',
  price: 'demo-price',
  discountPercent: 'demo-discountPercent',
  quantity: 0,
  variants: [
    {
      id: 'demo-id',
      productId: 'demo-productId',
      attributes: {},
      price: 'demo-price',
      quantity: 0,
      createdAt: '2026-11-01T09:00:00.000Z',
      updatedAt: '2026-11-01T09:00:00.000Z',
    },
  ],
  shipping: [
    {},
  ],
}

export const bulkProductImportResponse: BulkProductImportResponseDto = {
  totalRows: 0,
  createdCount: 0,
  failedCount: 0,
  createdIds: [
    'demo-createdId',
  ],
  failures: [
    {
      row: 3,
      message: 'Product Name is required',
    },
  ],
}

export const heroBannerResponse: HeroBannerResponseDto = {
  id: 'demo-id',
  title: 'demo-title',
  subtitle: {},
  imageUrl: 'demo-imageUrl',
  buttonText: {},
  buttonUrl: {},
  category: {},
  subcategory: {},
  sortOrder: 0,
  isActive: false,
}
