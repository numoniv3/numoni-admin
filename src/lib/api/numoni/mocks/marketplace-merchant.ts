/* Fixtures for Marketplace MS — store owner (merchant), built from the spec's examples. */
import type { CustomerListResponseDto, CustomerResponseDto, MerchantStorePoliciesResponseDto, ProductFeaturedResponseDto, ProductImageDeleteResponseDto, ProductImagesUpdateResponseDto, ProductImagesUploadResponseDto, ProductListResponseDto, ProductPricingPreviewResponseDto, ProductPricingPreviewV2ResponseDto, ProductVisibilityResponseDto, StoreBrandingResponseDto, StoreListResponseDto, StoreOverviewDto, StoreStatusResponseDto } from '../types/marketplace-merchant'
import type { BulkProductImportResponseDto, ProductResponseDto, StorePaymentSettingsResponseDto, StoreResponseDto, StoreShippingLocationsResponseDto, StoreSubscriptionPaymentAccountResponseDto, VerifyStoreSubscriptionPaymentResponseDto } from '../types/marketplace-admin'

export const productPricingPreviewResponse: ProductPricingPreviewResponseDto = {
  basePrice: 'demo-basePrice',
  merchantDiscountPercent: 0,
  storeThresholdPercent: 0,
  customerDiscountPercent: 0,
  customerPays: 'demo-customerPays',
  numoniCommissionPercent: 0,
  numoniCommission: 'demo-numoniCommission',
  merchantNets: 'demo-merchantNets',
  notes: [
    'demo-note',
  ],
}

export const productPricingPreviewV2Response: ProductPricingPreviewV2ResponseDto = {
  basePrice: 'demo-basePrice',
  customerDiscountPercent: 0,
  storeThresholdPercent: 0,
  customerPays: 'demo-customerPays',
  numoniCommissionPercent: 0,
  numoniCommission: 'demo-numoniCommission',
  merchantNets: 'demo-merchantNets',
  notes: [
    'demo-note',
  ],
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

export const productListResponse: ProductListResponseDto = {
  products: [
    {
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
    },
  ],
  count: 0,
  page: 0,
  limit: 0,
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

export const productImagesUploadResponse: ProductImagesUploadResponseDto = {
  images: [
    'demo-image',
  ],
}

export const productImageDeleteResponse: ProductImageDeleteResponseDto = {
  success: false,
}

export const productVisibilityResponse: ProductVisibilityResponseDto = {
  id: 'demo-id',
  isVisible: false,
}

export const productFeaturedResponse: ProductFeaturedResponseDto = {
  id: 'demo-id',
  isFeatured: false,
}

export const productImagesUpdateResponse: ProductImagesUpdateResponseDto = {
  id: 'demo-id',
  images: [
    'demo-image',
  ],
}

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

export const storeListResponse: StoreListResponseDto = {
  stores: [
    {
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
    },
  ],
  count: 0,
  page: 0,
  limit: 0,
}

export const merchantStorePoliciesResponse: MerchantStorePoliciesResponseDto = {
  refundPolicy: 'demo-refundPolicy',
  shippingPolicy: 'demo-shippingPolicy',
}

export const storeOverview: StoreOverviewDto = {
  salesAnalytics: {
    totalOrders: 0,
    totalSales: 0,
    totalCustomers: 0,
    pageVisitors: 0,
    savedProducts: 0,
  },
  productAnalytics: {
    totalCategories: 0,
    totalProducts: 0,
    totalSubcategories: 0,
    totalSavedProducts: 0,
  },
  financeAnalytics: {
    paid: 0,
    unpaid: 0,
    manualSales: 0,
    onlineSales: 0,
  },
  reviewAnalytics: {
    averageRating: 3.4,
    totalReviews: 201,
  },
}

export const storeStatusResponse: StoreStatusResponseDto = {
  id: 'demo-id',
  status: 'DRAFT',
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

export const storeBrandingResponse: StoreBrandingResponseDto = {
  id: 'demo-id',
  branding: {},
}

export const customerResponse: CustomerResponseDto = {
  id: '898f3b45-924a-49ef-b0c5-a29af601f009',
  name: 'Test Customer',
  email: 'customer@example.com',
  phone: '+2348012345678',
  country: 'Nigeria',
  source: 'MANUAL',
  storeId: '831e236a-4015-42ca-ab7c-032899d48764',
  createdAt: '2026-02-09T19:51:52.135Z',
  updatedAt: '2026-02-09T19:51:52.135Z',
}

export const customerListResponse: CustomerListResponseDto = {
  data: [
    {
      id: '898f3b45-924a-49ef-b0c5-a29af601f009',
      name: 'Test Customer',
      email: 'customer@example.com',
      phone: '+2348012345678',
      country: 'Nigeria',
      source: 'MANUAL',
      storeId: '831e236a-4015-42ca-ab7c-032899d48764',
      createdAt: '2026-02-09T19:51:52.135Z',
      updatedAt: '2026-02-09T19:51:52.135Z',
    },
  ],
  count: 1,
  currentpage: 1,
  nextpage: 2,
  prevpage: null,
  lastpage: 1,
}
