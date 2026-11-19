import { useSuspenseQuery } from '@tanstack/react-query'
import {
  getAccounting, getAdminOverview, getAdminRewards, getMerchantPerformance, getRouting, getTreasury, listPlatformAccounts, listPlatformAdmins,
  type AccountFilters, listAuditLog, listCustomerSegments, listDisputes, listExplorerCustomers, listKycQueue, listPricingServices, listResellers,
} from '@/lib/api/numoni/admin.api'
import { platformQueries } from '@/lib/api/numoni/platform.queries'
import { numoniKeys } from '@/lib/api/numoni/query-keys'

/*
 * Control Tower reads. Every hook suspends until its data is cached — the
 * Suspense boundary in the dashboard shell shows the loader meanwhile — so
 * components receive `data` already defined, exactly as they used the old
 * module-level constants.
 */

const K = numoniKeys.admin

// Network-wide resources (shared cache with the other experiences)
export const useAdminMerchantsQuery = () => useSuspenseQuery(platformQueries.merchants())
export const useAdminCustomersQuery = () => useSuspenseQuery(platformQueries.customers())
export const useAdminCampaignsQuery = () => useSuspenseQuery(platformQueries.campaigns())
export const useAdminProductsQuery = () => useSuspenseQuery(platformQueries.products())
export const useAdminTransactionsQuery = () => useSuspenseQuery(platformQueries.transactions())

// Control Tower resources
export const useAdminOverviewQuery = () => useSuspenseQuery({ queryKey: K.overview(), queryFn: getAdminOverview })

export const useAdminMerchantPerformanceQuery = (id: string) =>
  useSuspenseQuery({ queryKey: K.merchantPerformance(id), queryFn: () => getMerchantPerformance(id) })

export const useAdminCustomerSegmentsQuery = () => useSuspenseQuery({ queryKey: K.customerSegments(), queryFn: listCustomerSegments })

export const useAdminExplorerCustomersQuery = () => useSuspenseQuery({ queryKey: K.explorerCustomers(), queryFn: listExplorerCustomers })

export const useAdminKycQueueQuery = () => useSuspenseQuery({ queryKey: K.kycQueue(), queryFn: listKycQueue })

export const useAdminAuditLogQuery = () => useSuspenseQuery({ queryKey: K.auditLog(), queryFn: listAuditLog })

export const useAdminTreasuryQuery = () => useSuspenseQuery({ queryKey: K.treasury(), queryFn: getTreasury })

export const useAdminAccountingQuery = () => useSuspenseQuery({ queryKey: K.accounting(), queryFn: getAccounting })

export const useAdminRewardsQuery = () => useSuspenseQuery({ queryKey: K.rewards(), queryFn: getAdminRewards })

export const useAdminPricingQuery = () => useSuspenseQuery({ queryKey: K.pricingServices(), queryFn: listPricingServices })

export const useAdminResellersQuery = () => useSuspenseQuery({ queryKey: K.resellers(), queryFn: listResellers })

export const useAdminDisputesQuery = () => useSuspenseQuery({ queryKey: K.disputes(), queryFn: listDisputes })

export const useAdminRoutingQuery = () => useSuspenseQuery({ queryKey: K.routing(), queryFn: getRouting })

// Platform accounts & admins (Gateway Auth routes)
export const usePlatformAdminsQuery = () => useSuspenseQuery({ queryKey: K.admins(), queryFn: listPlatformAdmins })

export const usePlatformAccountsQuery = (filters: AccountFilters) =>
  useSuspenseQuery({ queryKey: K.accounts(filters), queryFn: () => listPlatformAccounts(filters) })
