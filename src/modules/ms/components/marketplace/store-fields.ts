import type { Field } from '@/modules/ms/components/shared/ActionForm'

/* Field specs for the Marketplace MS DTOs (`specs/numoni.json`). */

const RANGES = ['1-5', '6-20', '21-50', '51-200', '200+'].map((v) => ({ value: v, label: v }))

/** `CreateStoreDto` (multipart — `logo` is a file). */
export const STORE_CREATE: Field[] = [
  { key: 'name', label: 'Store name', required: true },
  { key: 'slug', label: 'Store link (slug)', required: true, placeholder: 'charles-store', hint: 'Your store lives at /store/<slug>.' },
  { key: 'merchantEmail', label: 'Store email', required: true },
  { key: 'storeType', label: 'Sells', kind: 'select', options: ['PRODUCT', 'SERVICE'], required: true },
  { key: 'country', label: 'Country', required: true, placeholder: 'Nigeria' },
  { key: 'logo', label: 'Logo', kind: 'file', accept: 'image/*', required: true },
  { key: 'industry', label: 'Industry', required: true, hint: 'Required — e.g. Fashion, Retail.' },
  { key: 'industries', label: 'Other industries', kind: 'list' },
  { key: 'phoneNumber', label: 'Phone numbers', kind: 'phones', hint: 'Comma separated, with country codes — e.g. +234 803 555 0142.' },
  { key: 'address', label: 'Address', wide: true },
  { key: 'website', label: 'Website' },
  { key: 'walkIn', label: 'Walk-in customers', kind: 'switch' },
  { key: 'staffCountRange', label: 'Staff', kind: 'select', options: RANGES },
  { key: 'locationCountRange', label: 'Locations', kind: 'select', options: RANGES },
]

/** `UpdateStoreDto`. */
export const STORE_UPDATE: Field[] = [
  ...STORE_CREATE.map((f) => ({ ...f, required: false })),
  { key: 'description', label: 'About the store', kind: 'textarea' },
  { key: 'email', label: 'Contact emails', kind: 'list' },
  { key: 'lowStockAlert', label: 'Low-stock alert at', kind: 'number' },
  { key: 'socialLinks', label: 'Social links', kind: 'json', placeholder: '[{ "title": "Instagram", "url": "https://instagram.com/…" }]' },
  { key: 'refundPolicy', label: 'Refund policy', kind: 'textarea' },
  { key: 'shippingPolicy', label: 'Shipping policy', kind: 'textarea' },
  { key: 'dataProcessingPolicy', label: 'Data processing policy', kind: 'textarea' },
]

/** `UpdateBrandingDto` (multipart — `heroBanner` is a file). */
export const BRANDING: Field[] = [
  { key: 'headerBackgroundColor', label: 'Header background', placeholder: '#0B0B0B' },
  { key: 'headerTextColor', label: 'Header text', placeholder: '#FFFFFF' },
  { key: 'bodyBackgroundColor', label: 'Page background', placeholder: '#FFFFFF' },
  { key: 'bodyTextColor', label: 'Page text', placeholder: '#111111' },
  { key: 'elementColor', label: 'Buttons & accents', placeholder: '#00C853' },
  { key: 'heroBanner', label: 'Hero banner', kind: 'file', accept: 'image/*' },
]

/** `CreateProductV2Dto` / `UpdateProductV2Dto` (v1 takes the same fields). */
export const productFields = (categories: string[], create: boolean): Field[] => [
  { key: 'name', label: 'Product name', required: create },
  { key: 'type', label: 'Type', kind: 'select', options: ['GOODS', 'SERVICES'], required: create },
  categories.length
    ? { key: 'category', label: 'Category', kind: 'select', options: categories.map((c) => ({ value: c, label: c })), required: create }
    : { key: 'category', label: 'Category', required: create },
  { key: 'subcategory', label: 'Subcategory' },
  { key: 'price', label: 'Price (₦)', kind: 'number', required: create },
  { key: 'discountPercent', label: 'Customer discount (%)', kind: 'number', required: create, hint: 'At least your store’s minimum.' },
  { key: 'quantity', label: 'Stock quantity', kind: 'number', required: create },
  { key: 'lowStockAlertThreshold', label: 'Low-stock alert at', kind: 'number' },
  { key: 'industry', label: 'Industry' },
  { key: 'status', label: 'Status', kind: 'select', options: ['DRAFT', 'PUBLISHED'] },
  { key: 'description', label: 'Description', kind: 'textarea' },
  { key: 'tags', label: 'Tags', kind: 'list' },
  { key: 'images', label: 'Image links', kind: 'list', wide: true, hint: 'Upload images below to get links, or paste them.' },
  { key: 'videoUrl', label: 'Video link' },
  { key: 'isVisible', label: 'Visible in store', kind: 'switch' },
  { key: 'isFeatured', label: 'Featured', kind: 'switch' },
  { key: 'enhanceImage', label: 'AI-enhance images', kind: 'switch' },
  { key: 'variants', label: 'Variants', kind: 'json', placeholder: '[{ "attributes": { "size": "L" }, "quantity": 10, "price": 5000 }]' },
  { key: 'shipping', label: 'Shipping fees', kind: 'json', placeholder: '[{ "locationName": "Lagos", "fee": 1500 }]' },
]

/** `CreateManualOrderDto`. */
export const MANUAL_ORDER: Field[] = [
  { key: 'customerName', label: 'Customer name' },
  { key: 'customerPhone', label: 'Customer phone', kind: 'phone' },
  { key: 'customerEmail', label: 'Customer email' },
  { key: 'country', label: 'Country', required: true, placeholder: 'Nigeria' },
  { key: 'customerAddress', label: 'Address', wide: true },
  { key: 'paymentStatus', label: 'Payment', kind: 'select', options: ['PENDING', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED'], required: true },
  { key: 'amountPaid', label: 'Amount paid (₦)', kind: 'number' },
  { key: 'items', label: 'Items', kind: 'json', required: true, placeholder: '[{ "productId": "…", "quantity": 1 }]' },
  { key: 'customerNote', label: 'Note', kind: 'textarea' },
]

export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED']
export const PAYMENT_STATUSES = ['PENDING', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED']
