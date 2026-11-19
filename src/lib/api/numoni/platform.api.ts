import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import { campaigns, customers, merchants, offers, products, transactions } from './mocks/platform'
import type { Campaign, Customer, Merchant, NearbyOfferSummary, Product, Txn } from './types/platform'

const E = NUMONI_ENDPOINTS.platform

/**
 * Every merchant on the network.
 * @endpoint GET /merchants
 */
export function listMerchants(): Promise<Merchant[]> {
  return apiGet(E.merchants, () => merchants)
}

/**
 * Network customers (pseudonymised).
 * @endpoint GET /customers
 */
export function listCustomers(): Promise<Customer[]> {
  return apiGet(E.customers, () => customers)
}

/**
 * Merchant and brand campaigns across the network.
 * @endpoint GET /campaigns
 */
export function listCampaigns(): Promise<Campaign[]> {
  return apiGet(E.campaigns, () => campaigns)
}

/**
 * The shared product catalogue (storefront and consumer commerce).
 * @endpoint GET /products
 */
export function listProducts(): Promise<Product[]> {
  return apiGet(E.products, () => products)
}

/**
 * Latest platform transactions, newest first.
 * @endpoint GET /transactions
 */
export function listTransactions(): Promise<Txn[]> {
  return apiGet(E.transactions, () => transactions)
}

/**
 * Deals near the customer's saved area.
 * @endpoint GET /offers/nearby
 */
export function listNearbyOfferSummaries(): Promise<NearbyOfferSummary[]> {
  return apiGet(E.nearbyOfferSummaries, () => offers)
}
