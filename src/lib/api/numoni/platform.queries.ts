import { queryOptions } from '@tanstack/react-query'
import { numoniKeys } from './query-keys'
import {
  listCampaigns, listCustomers, listMerchants, listNearbyOfferSummaries, listProducts, listTransactions,
} from './platform.api'

/**
 * Network-wide resources read by more than one experience (admin, landing,
 * consumer). Defined once here so every module shares the same cache entry.
 */
export const platformQueries = {
  merchants: () => queryOptions({ queryKey: numoniKeys.platform.merchants(), queryFn: listMerchants }),
  customers: () => queryOptions({ queryKey: numoniKeys.platform.customers(), queryFn: listCustomers }),
  campaigns: () => queryOptions({ queryKey: numoniKeys.platform.campaigns(), queryFn: listCampaigns }),
  products: () => queryOptions({ queryKey: numoniKeys.platform.products(), queryFn: listProducts }),
  transactions: () => queryOptions({ queryKey: numoniKeys.platform.transactions(), queryFn: listTransactions }),
  nearbyOfferSummaries: () => queryOptions({ queryKey: numoniKeys.platform.nearbyOfferSummaries(), queryFn: listNearbyOfferSummaries }),
}
