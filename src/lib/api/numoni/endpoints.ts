/**
 * Every path the nuMoni frontend talks to, in one place — relative to
 * `NEXT_PUBLIC_API_URL`. `specs/numoni.json` (the Gateway's OpenAPI spec) is
 * the contract these must match.
 */
export const NUMONI_ENDPOINTS = {
  platform: {
    merchants: 'merchants',
    customers: 'customers',
    campaigns: 'campaigns',
    products: 'products',
    transactions: 'transactions',
    nearbyOfferSummaries: 'offers/nearby',
  },

  admin: {
    overview: 'admin/overview',
    merchantPerformance: (id: string) => `admin/merchants/${id}/performance`,
    customerSegments: 'admin/customers/segments',
    explorerCustomers: 'admin/explorer/customers',
    kycQueue: 'admin/kyc/queue',
    auditLog: 'admin/audit-log',
    treasury: 'admin/treasury',
    accounting: 'admin/accounting',
    rewards: 'admin/rewards',
    pricingServices: 'admin/pricing/services',
    resellers: 'admin/resellers',
    disputes: 'admin/disputes',
    routing: 'admin/routing',
    admins: 'admin/admins',
    invite: 'admin/invite',
    accounts: 'admin/users',
    account: (id: string) => `admin/users/${id}`,
    accountStatus: (id: string) => `admin/users/${id}/status`,
    accountLimits: (id: string) => `admin/users/${id}/limits`,
    policy: (id: string) => `policies/${id}`,
    journeyState: (id: string) => `journey/me/${id}`,
  },

  merchant: {
    workspace: 'merchant/workspace',
    analytics: 'merchant/analytics',
    customers: 'merchant/customers',
    audiences: 'merchant/marketing/audiences',
  },

  reseller: {
    workspace: 'reseller/workspace',
  },

  brand: {
    workspace: 'brand/workspace',
    analytics: 'brand/analytics',
  },

  enterprise: {
    workspace: 'enterprise/workspace',
    analytics: 'enterprise/analytics',
  },

  brandApp: {
    account: 'brand-app/account',
  },

  till: {
    workspace: 'till/workspace',
  },

  consumer: {
    account: 'consumer/account',
    banners: 'consumer/banners',
    offers: 'consumer/offers',
    walkInBrands: 'consumer/brands/walk-in',
    faqs: 'support/faqs',
  },

  account: {
    profiles: (id: string) => `profiles/${id}`,
    userProfile: (id: string) => `profiles/${id}/user`,
    businessProfile: (id: string) => `profiles/${id}/merchant`,
    credentials: (id: string) => `credentials/enterprise/${id}`,
    rotateCredentials: (id: string) => `credentials/enterprise/${id}/rotate`,
    subAdmin: 'journey/sub-admin',
    upload: 'media/upload',
    policySync: 'policies/sync',
    policy: 'policies/me',
  },

  wallet: {
    optIn: 'wallet/opt-in',
    wallets: 'wallet/wallets',
    wallet: (walletId: string) => `wallet/wallets/${walletId}`,
    buyPoints: (walletId: string) => `wallet/wallets/${walletId}/buy-points`,
    buyOrder: (id: string) => `wallet/buy-orders/${id}`,
    verifyBuyOrder: (id: string) => `wallet/buy-orders/${id}/verify-payment`,
    transfers: 'wallet/transfers',
    qrGenerate: 'wallet/qr/generate',
    qrConfirm: 'wallet/qr/confirm',
    redeem: (walletId: string) => `wallet/wallets/${walletId}/redeem`,
    settle: (walletId: string) => `wallet/wallets/${walletId}/settlements`,
    settlement: (id: string) => `wallet/settlements/${id}`,
    verifySettlement: (id: string) => `wallet/settlements/${id}/verify-payment`,
    nameEnquiry: 'wallet/payouts/name-enquiry',
    freeze: (walletId: string) => `wallet/wallets/${walletId}/freeze`,
    unfreeze: (walletId: string) => `wallet/wallets/${walletId}/unfreeze`,
    transactions: 'wallet/transactions',
    admin: {
      wallets: 'wallet/admin/wallets',
      ledger: 'wallet/admin/ledger',
      reconciliation: 'wallet/admin/reconciliation',
      runCutoff: 'wallet/admin/cutoff/run',
      balancesVsBooks: 'wallet/admin/balances-vs-books',
      pending: 'wallet/admin/recon/pending',
      resolvePending: (id: string) => `wallet/admin/recon/pending/${id}/resolve`,
    },
  },

  points: {
    optIn: 'points/opt-in',
    admin: {
      mint: 'points/admin/mint',
      pools: 'points/admin/pools',
      mints: 'points/admin/mints',
      reconciliation: 'points/admin/reconciliation',
      runReconciliation: 'points/admin/reconciliation/run',
      journal: 'points/admin/journal',
      freezePools: 'points/admin/freeze-pools',
      balancesVsBooks: 'points/admin/balances-vs-books',
    },
  },

  org: {
    settings: (orgId: string) => `orgs/${orgId}/settings`,
    compliance: (orgId: string) => `orgs/${orgId}/compliance`,
    rewardCards: (orgId: string) => `orgs/${orgId}/reward-cards`,
  },
} as const

/**
 * The paths the nuMoni Gateway already serves (`specs/numoni.json`), with
 * `{id}` standing for a path parameter. With `API_MODE` `partial` (`src/lib/config.ts`)
 * these call the Gateway and every other path keeps answering from its
 * fixture. Add a path here once the Gateway ships it.
 */
export const GATEWAY_ENDPOINTS = [
  'admin/overview',
  'merchant/workspace',
  'merchant/analytics',
  'reseller/workspace',
  'brand/workspace',
  'enterprise/workspace',
  'brand-app/account',
  'till/workspace',
  'consumer/account',
  'admin/admins',
  'admin/invite',
  'admin/users',
  'admin/users/{id}',
  'admin/users/{id}/status',
  'admin/users/{id}/limits',
  'profiles/{id}',
  'profiles/{id}/user',
  'profiles/{id}/merchant',
  'credentials/enterprise/{id}',
  'credentials/enterprise/{id}/rotate',
  'journey/sub-admin',
  'media/upload',
  'policies/sync',
  'policies/me',
  'policies/{id}',
  'journey/me/{id}',
  // Wallet MS, proxied by the Gateway (v0.8.0)
  'wallet/opt-in',
  'wallet/wallets',
  'wallet/wallets/{id}',
  'wallet/wallets/{id}/buy-points',
  'wallet/buy-orders/{id}',
  'wallet/buy-orders/{id}/verify-payment',
  'wallet/transfers',
  'wallet/qr/generate',
  'wallet/qr/confirm',
  'wallet/wallets/{id}/redeem',
  'wallet/wallets/{id}/settlements',
  'wallet/settlements/{id}',
  'wallet/settlements/{id}/verify-payment',
  'wallet/payouts/name-enquiry',
  'wallet/wallets/{id}/freeze',
  'wallet/wallets/{id}/unfreeze',
  'wallet/transactions',
  'wallet/admin/wallets',
  'wallet/admin/ledger',
  'wallet/admin/reconciliation',
  'wallet/admin/cutoff/run',
  'wallet/admin/balances-vs-books',
  'wallet/admin/recon/pending',
  'wallet/admin/recon/pending/{id}/resolve',
  // Point MS, proxied by the Gateway (v0.8.0)
  'points/opt-in',
  'points/admin/mint',
  'points/admin/pools',
  'points/admin/mints',
  'points/admin/reconciliation',
  'points/admin/reconciliation/run',
  'points/admin/journal',
  'points/admin/freeze-pools',
  'points/admin/balances-vs-books',
] as const

const LIVE = GATEWAY_ENDPOINTS.map((t) => new RegExp(`^${t.replace(/\{id\}/g, '[^/]+')}$`))

/** Whether the Gateway serves `path` (a concrete path, e.g. `profiles/usr_1`). */
export const isGatewayPath = (path: string) => LIVE.some((re) => re.test(path))
