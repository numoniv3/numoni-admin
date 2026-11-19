import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import * as C from './mocks/consumer'
import type { ConsumerWorkspace, NearbyOffer, PromoBanner, SupportFaq, WalkInBrand } from './types/consumer'

const E = NUMONI_ENDPOINTS.consumer

/**
 * The signed-in customer's wallet: balance, area, brand wallets, activity,
 * raffle tickets, orders, saved addresses, notifications and card spend.
 * @endpoint GET /consumer/account
 */
export function getConsumerAccount(): Promise<ConsumerWorkspace> {
  return apiGet(E.account, () => ({
    balance: C.consumerBalance,
    area: C.consumerArea,
    brandWallets: C.consumerBrandWallets,
    activity: C.consumerActivity,
    raffleTickets: C.consumerRaffleTickets,
    orders: C.consumerOrders,
    addresses: C.consumerAddresses,
    notices: C.consumerNotices,
    cardExpenses: C.consumerCardExpenses,
  }))
}

/**
 * Home-screen promo banners.
 * @endpoint GET /consumer/banners
 */
export function listPromoBanners(): Promise<PromoBanner[]> {
  return apiGet(E.banners, () => C.consumerPromoBanners)
}

/**
 * Deals (merchant-funded) and grants (brand-funded) the customer can browse.
 * @endpoint GET /consumer/offers
 */
export function listOfferCatalogue(): Promise<NearbyOffer[]> {
  return apiGet(E.offers, () => C.consumerOfferCatalogue)
}

/**
 * Physical brands the customer can walk into and pay with points.
 * @endpoint GET /consumer/brands/walk-in
 */
export function listWalkInBrands(): Promise<WalkInBrand[]> {
  return apiGet(E.walkInBrands, () => C.consumerWalkInBrands)
}

/**
 * Help-centre FAQs.
 * @endpoint GET /support/faqs
 */
export function listSupportFaqs(): Promise<SupportFaq[]> {
  return apiGet(E.faqs, () => C.supportFaqs)
}
