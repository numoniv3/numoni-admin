/**
 * Query keys for every nuMoni read, one factory per API domain. Hooks in
 * `src/modules/<feature>/api/` build their `queryOptions` from these, so two
 * screens reading the same resource share one cache entry and one request.
 */
export const numoniKeys = {
  platform: {
    all: ['platform'] as const,
    merchants: () => [...numoniKeys.platform.all, 'merchants'] as const,
    customers: () => [...numoniKeys.platform.all, 'customers'] as const,
    campaigns: () => [...numoniKeys.platform.all, 'campaigns'] as const,
    products: () => [...numoniKeys.platform.all, 'products'] as const,
    transactions: () => [...numoniKeys.platform.all, 'transactions'] as const,
    nearbyOfferSummaries: () => [...numoniKeys.platform.all, 'offers', 'nearby'] as const,
  },
  admin: {
    all: ['admin'] as const,
    overview: () => [...numoniKeys.admin.all, 'overview'] as const,
    merchantPerformance: (id: string) => [...numoniKeys.admin.all, 'merchants', id, 'performance'] as const,
    customerSegments: () => [...numoniKeys.admin.all, 'customers', 'segments'] as const,
    explorerCustomers: () => [...numoniKeys.admin.all, 'explorer', 'customers'] as const,
    kycQueue: () => [...numoniKeys.admin.all, 'kyc', 'queue'] as const,
    auditLog: () => [...numoniKeys.admin.all, 'audit-log'] as const,
    treasury: () => [...numoniKeys.admin.all, 'treasury'] as const,
    accounting: () => [...numoniKeys.admin.all, 'accounting'] as const,
    rewards: () => [...numoniKeys.admin.all, 'rewards'] as const,
    pricingServices: () => [...numoniKeys.admin.all, 'pricing', 'services'] as const,
    resellers: () => [...numoniKeys.admin.all, 'resellers'] as const,
    disputes: () => [...numoniKeys.admin.all, 'disputes'] as const,
    routing: () => [...numoniKeys.admin.all, 'routing'] as const,
    admins: () => [...numoniKeys.admin.all, 'admins'] as const,
    accounts: (filters: object = {}) => [...numoniKeys.admin.all, 'accounts', filters] as const,
    policy: (universalId: string) => [...numoniKeys.admin.all, 'accounts', universalId, 'policy'] as const,
    journey: (universalId: string) => [...numoniKeys.admin.all, 'accounts', universalId, 'journey'] as const,
  },
  account: {
    all: ['account'] as const,
    profiles: (universalId: string) => [...numoniKeys.account.all, universalId, 'profiles'] as const,
    credentials: (universalId: string) => [...numoniKeys.account.all, universalId, 'credentials'] as const,
    policy: (universalId: string) => [...numoniKeys.account.all, universalId, 'policy'] as const,
  },
  wallet: {
    all: ['wallet'] as const,
    mine: () => [...numoniKeys.wallet.all, 'mine'] as const,
    detail: (walletId: string) => [...numoniKeys.wallet.all, 'detail', walletId] as const,
    transactions: (filters: object = {}) => [...numoniKeys.wallet.all, 'transactions', filters] as const,
    buyOrder: (id: string) => [...numoniKeys.wallet.all, 'buy-orders', id] as const,
    settlement: (id: string) => [...numoniKeys.wallet.all, 'settlements', id] as const,
    admin: {
      all: ['wallet', 'admin'] as const,
      wallets: (limit: number) => [...numoniKeys.wallet.admin.all, 'wallets', limit] as const,
      ledger: (limit: number) => [...numoniKeys.wallet.admin.all, 'ledger', limit] as const,
      reconciliation: () => [...numoniKeys.wallet.admin.all, 'reconciliation'] as const,
      balancesVsBooks: (page: object = {}) => [...numoniKeys.wallet.admin.all, 'balances-vs-books', page] as const,
      pending: (filters: object = {}) => [...numoniKeys.wallet.admin.all, 'pending', filters] as const,
    },
  },
  points: {
    all: ['points'] as const,
    pools: () => [...numoniKeys.points.all, 'pools'] as const,
    mints: (page: object = {}) => [...numoniKeys.points.all, 'mints', page] as const,
    reconciliation: () => [...numoniKeys.points.all, 'reconciliation'] as const,
    journal: (filters: object = {}) => [...numoniKeys.points.all, 'journal', filters] as const,
    balancesVsBooks: () => [...numoniKeys.points.all, 'balances-vs-books'] as const,
  },
  merchant: {
    all: ['merchant'] as const,
    workspace: () => [...numoniKeys.merchant.all, 'workspace'] as const,
    analytics: () => [...numoniKeys.merchant.all, 'analytics'] as const,
    customers: () => [...numoniKeys.merchant.all, 'customers'] as const,
    audiences: () => [...numoniKeys.merchant.all, 'marketing', 'audiences'] as const,
  },
  reseller: {
    all: ['reseller'] as const,
    workspace: () => [...numoniKeys.reseller.all, 'workspace'] as const,
  },
  brand: {
    all: ['brand'] as const,
    workspace: () => [...numoniKeys.brand.all, 'workspace'] as const,
    analytics: () => [...numoniKeys.brand.all, 'analytics'] as const,
  },
  enterprise: {
    all: ['enterprise'] as const,
    workspace: () => [...numoniKeys.enterprise.all, 'workspace'] as const,
    analytics: () => [...numoniKeys.enterprise.all, 'analytics'] as const,
  },
  brandApp: {
    all: ['brand-app'] as const,
    account: () => [...numoniKeys.brandApp.all, 'account'] as const,
  },
  till: {
    all: ['till'] as const,
    workspace: () => [...numoniKeys.till.all, 'workspace'] as const,
  },
  consumer: {
    all: ['consumer'] as const,
    account: () => [...numoniKeys.consumer.all, 'account'] as const,
    banners: () => [...numoniKeys.consumer.all, 'banners'] as const,
    offers: () => [...numoniKeys.consumer.all, 'offers'] as const,
    walkInBrands: () => [...numoniKeys.consumer.all, 'brands', 'walk-in'] as const,
    faqs: () => [...numoniKeys.consumer.all, 'support', 'faqs'] as const,
  },
  org: {
    all: ['org'] as const,
    settings: (orgId: string) => [...numoniKeys.org.all, orgId, 'settings'] as const,
    compliance: (orgId: string) => [...numoniKeys.org.all, orgId, 'compliance'] as const,
    rewardCards: (orgId: string) => [...numoniKeys.org.all, orgId, 'reward-cards'] as const,
  },
}
