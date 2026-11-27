import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet, apiSend, idempotent } from './request'
import * as C from './mocks/consumer'
import type { ConsumerWorkspace, Funding, NearbyOffer, PromoBanner, SupportFaq, WalkInBrand } from './types/consumer'

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

/**
 * Starts a Buy Points purchase for `amount` naira (1 point per naira): makes sure
 * the customer has an NGN wallet, creates the buy order and returns the bank
 * account to transfer to. Poll `getFunding` until it's `completed`.
 * @endpoint POST /consumer/funding
 */
export function startFunding(amount: string, idempotencyKey: string): Promise<Funding> {
  return apiSend('POST', E.funding, { amount }, (raw) => raw as Funding, (b) => C.fundingFixture((b as { amount: string }).amount), idempotent(idempotencyKey))
}

/**
 * A Buy Points purchase. While it's awaiting payment, the Gateway re-checks the
 * payment with the provider on every read.
 * @endpoint GET /consumer/funding/{id}
 */
export function getFunding(id: string): Promise<Funding> {
  return apiGet<Funding>(E.fundingById(id), () => ({ ...C.fundingFixture('10000.00'), id, status: 'completed' }))
}
