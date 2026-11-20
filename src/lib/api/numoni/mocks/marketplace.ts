/* Fixtures for Marketplace MS — public storefront & signed-in customer, built from the spec's examples. */
import type { CartResponseDto, CheckoutAndPayResponseDto, OrderResponseDto, PaymentInitResponseDto, WishlistToggleResponseDto } from '../types/marketplace'

export const paymentInitResponse: PaymentInitResponseDto = {
  success: false,
  message: 'demo-message',
  transactionReference: 'demo-transactionReference',
  deliveryConfirmationCode: {},
}

export const wishlistToggleResponse: WishlistToggleResponseDto = {
  favourited: false,
  productId: 'demo-productId',
}

export const cartResponse: CartResponseDto = {
  id: 'demo-id',
  customerId: 'demo-customerId',
  customerUserId: {},
  storeId: 'demo-storeId',
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-01T09:00:00.000Z',
  currency: 'NGN',
  deliveryAddress: '12 Marina Road, Lagos Island, Lagos, Nigeria',
  deliveryLatitude: '6.4541000',
  deliveryLongitude: '3.3947000',
  items: [
    {
      id: 'demo-id',
      quantity: 0,
      cartId: 'demo-cartId',
      productId: 'demo-productId',
      price: '215.00',
      basePrice: '200.00',
      discountPercent: '7.5',
      createdAt: '2026-11-01T09:00:00.000Z',
      updatedAt: '2026-11-01T09:00:00.000Z',
      product: {},
    },
  ],
}

export const orderResponse: OrderResponseDto = {
  id: 'demo-id',
  customerId: {},
  merchantId: {},
  deliveryConfirmationCode: {},
  orderNumber: 'demo-orderNumber',
  customerName: 'demo-customerName',
  customerEmail: 'demo-customerEmail',
  customerPhone: 'demo-customerPhone',
  customerAddress: 'demo-customerAddress',
  shippingAddr: {},
  isStorePickup: false,
  appliedCharges: [
    {},
  ],
  itemsListSubtotal: 'demo-itemsListSubtotal',
  itemsDiscountTotal: 'demo-itemsDiscountTotal',
  shippingAmount: 'demo-shippingAmount',
  chargesTotal: 'demo-chargesTotal',
  totalAmount: 'demo-totalAmount',
  amountPaid: 'demo-amountPaid',
  currency: 'demo-currency',
  status: 'PENDING',
  paymentStatus: 'PENDING',
  storeId: 'demo-storeId',
  createdAt: '2026-11-01T09:00:00.000Z',
  updatedAt: '2026-11-01T09:00:00.000Z',
  items: [
    {
      id: 'demo-id',
      quantity: 0,
      price: 'demo-price',
      currency: 'demo-currency',
      productName: 'demo-productName',
      orderId: 'demo-orderId',
      productId: 'demo-productId',
    },
  ],
}

export const checkoutAndPayResponse: CheckoutAndPayResponseDto = {
  order: {
    id: 'demo-id',
    customerId: {},
    merchantId: {},
    deliveryConfirmationCode: {},
    orderNumber: 'demo-orderNumber',
    customerName: 'demo-customerName',
    customerEmail: 'demo-customerEmail',
    customerPhone: 'demo-customerPhone',
    customerAddress: 'demo-customerAddress',
    shippingAddr: {},
    isStorePickup: false,
    appliedCharges: [
      {},
    ],
    itemsListSubtotal: 'demo-itemsListSubtotal',
    itemsDiscountTotal: 'demo-itemsDiscountTotal',
    shippingAmount: 'demo-shippingAmount',
    chargesTotal: 'demo-chargesTotal',
    totalAmount: 'demo-totalAmount',
    amountPaid: 'demo-amountPaid',
    currency: 'demo-currency',
    status: 'PENDING',
    paymentStatus: 'PENDING',
    storeId: 'demo-storeId',
    createdAt: '2026-11-01T09:00:00.000Z',
    updatedAt: '2026-11-01T09:00:00.000Z',
    items: [
      {
        id: 'demo-id',
        quantity: 0,
        price: 'demo-price',
        currency: 'demo-currency',
        productName: 'demo-productName',
        orderId: 'demo-orderId',
        productId: 'demo-productId',
      },
    ],
  },
  payment: {
    success: false,
    message: 'demo-message',
    transactionReference: 'demo-transactionReference',
    deliveryConfirmationCode: {},
  },
}
