import { toPolicy } from './account.api'
import { NUMONI_ENDPOINTS } from './endpoints'
import { accountPolicy } from './mocks/account'
import { child, fullName, list, num, obj, str, tier, type Obj } from './parse'
import { apiGet, apiRead, apiSend } from './request'
import {
  accountingMonthTrend, adminRaffles, adminRewardPrograms, autoRefunds, campaignMix, cardsByBrand,
  chartOfAccounts, customerAgeRanges, disputes, explorerCustomers, journalEntries, merchantSettlements,
  merchantVolumeTrend, platformAccounts, platformAdmins, railBatches, railGroups, returnFrequencyBuckets, salesByRail, scheduledPayouts,
  treasuryBankAccounts, treasuryLedgers, unmatchedBankLines, walletChecks, walletDrift, walletSides,
} from './mocks/admin'
import { attributionSeries, auditLog, kycQueue, partners, pricingServices, resellers, segmentData } from './mocks/platform'
import type { AccountPolicy } from './types/account'
import type {
  Account, AccountingMonth, AccountLimits, AccountStatus, AdminInvite, AdminRaffle, AdminRewardProgram, AgeRangeShare, AutoRefund, BrandCardCount,
  CampaignMixSlice, Dispute, ExplorerCustomer, JournalEntry, JourneyState, MerchantSettlement, MerchantVolumePoint, Payout, PlatformAccount,
  RailBatch, RailGroup, RailSales, ReturnFrequencyBucket, TreasuryBankAccount, TreasuryLedger, UnmatchedBankLine,
  WalletCheck, WalletDriftPoint, WalletSide,
} from './types/admin'
import type {
  AttributionPoint, AuditLogEntry, CustomerSegment, KycCase, PricingService, RailPartner, ResellerSummary,
} from './types/platform'

const E = NUMONI_ENDPOINTS.admin

// ── Overview ─────────────────────────────────────────────────────────────────

export interface AdminOverview {
  salesByRail: RailSales[]
  ageRanges: AgeRangeShare[]
  returnBuckets: ReturnFrequencyBucket[]
  campaignMix: CampaignMixSlice[]
  cardsByBrand: BrandCardCount[]
  attributionSeries: AttributionPoint[]
}

/**
 * Intelligence-hub aggregates. Figures are for the default "this week / all
 * customers" view; the page scales them for other periods and customer types.
 * @endpoint GET /admin/overview
 */
export function getAdminOverview(): Promise<AdminOverview> {
  return apiGet(E.overview, () => ({
    salesByRail,
    ageRanges: customerAgeRanges,
    returnBuckets: returnFrequencyBuckets,
    campaignMix,
    cardsByBrand,
    attributionSeries,
  }))
}

// ── Merchants ────────────────────────────────────────────────────────────────

export interface MerchantPerformance {
  volume: MerchantVolumePoint[]
  settlements: MerchantSettlement[]
}

/**
 * Monthly GMV trend (₦M) and the latest settlement runs for one merchant.
 * @endpoint GET /admin/merchants/{id}/performance
 */
export function getMerchantPerformance(id: string): Promise<MerchantPerformance> {
  return apiGet(E.merchantPerformance(id), () => ({ volume: merchantVolumeTrend, settlements: merchantSettlements }))
}

// ── Customers ────────────────────────────────────────────────────────────────

/**
 * Share of active customers per behavioural segment.
 * @endpoint GET /admin/customers/segments
 */
export function listCustomerSegments(): Promise<CustomerSegment[]> {
  return apiGet(E.customerSegments, () => segmentData)
}

/**
 * The anonymised customer universe the Data Explorer queries.
 * @endpoint GET /admin/explorer/customers
 */
export function listExplorerCustomers(): Promise<ExplorerCustomer[]> {
  return apiGet(E.explorerCustomers, () => explorerCustomers)
}

// ── Compliance ───────────────────────────────────────────────────────────────

/**
 * KYC / KYB submissions waiting for a decision.
 * @endpoint GET /admin/kyc/queue
 */
export function listKycQueue(): Promise<KycCase[]> {
  return apiGet(E.kycQueue, () => kycQueue)
}

/**
 * Immutable admin action log, newest first.
 * @endpoint GET /admin/audit-log
 */
export function listAuditLog(): Promise<AuditLogEntry[]> {
  return apiGet(E.auditLog, () => auditLog)
}

// ── Treasury & accounting ────────────────────────────────────────────────────

export interface TreasurySnapshot {
  ledgers: TreasuryLedger[]
  refunds: AutoRefund[]
  railBatches: RailBatch[]
  payouts: Payout[]
}

/**
 * Ledger balances, today's rail batches, scheduled payouts and auto-refunds.
 * @endpoint GET /admin/treasury
 */
export function getTreasury(): Promise<TreasurySnapshot> {
  return apiGet(E.treasury, () => ({ ledgers: treasuryLedgers, refunds: autoRefunds, railBatches, payouts: scheduledPayouts }))
}

export interface AccountingBook {
  chartOfAccounts: Account[]
  journalEntries: JournalEntry[]
  monthTrend: AccountingMonth[]
  bankAccounts: TreasuryBankAccount[]
  unmatched: UnmatchedBankLine[]
  walletSides: WalletSide[]
  walletDrift: WalletDriftPoint[]
  walletChecks: WalletCheck[]
}

/**
 * Double-entry books: chart of accounts, journal, bank and wallet reconciliation.
 * @endpoint GET /admin/accounting
 */
export function getAccounting(): Promise<AccountingBook> {
  return apiGet(E.accounting, () => ({
    chartOfAccounts,
    journalEntries,
    monthTrend: accountingMonthTrend,
    bankAccounts: treasuryBankAccounts,
    unmatched: unmatchedBankLines,
    walletSides,
    walletDrift,
    walletChecks,
  }))
}

// ── Commercial ───────────────────────────────────────────────────────────────

export interface AdminRewardsCatalogue {
  programs: AdminRewardProgram[]
  raffles: AdminRaffle[]
}

/**
 * Every reward program and raffle running on the network.
 * @endpoint GET /admin/rewards
 */
export function getAdminRewards(): Promise<AdminRewardsCatalogue> {
  return apiGet(E.rewards, () => ({ programs: adminRewardPrograms, raffles: adminRaffles }))
}

/**
 * Platform fee and reward-rate table.
 * @endpoint GET /admin/pricing/services
 */
export function listPricingServices(): Promise<PricingService[]> {
  return apiGet(E.pricingServices, () => pricingServices)
}

/**
 * Reseller partners and the merchant networks they manage.
 * @endpoint GET /admin/resellers
 */
export function listResellers(): Promise<ResellerSummary[]> {
  return apiGet(E.resellers, () => resellers)
}

/**
 * Open customer ↔ merchant disputes.
 * @endpoint GET /admin/disputes
 */
export function listDisputes(): Promise<Dispute[]> {
  return apiGet(E.disputes, () => disputes)
}

// ── Platform operations ──────────────────────────────────────────────────────

export interface RoutingTable {
  partners: RailPartner[]
  railGroups: RailGroup[]
}

/**
 * Rail partners and the groups whose traffic is split across them.
 * @endpoint GET /admin/routing
 */
export function getRouting(): Promise<RoutingTable> {
  return apiGet(E.routing, () => ({ partners, railGroups }))
}

// ── Platform accounts & admins ───────────────────────────────────────────────

const ACCOUNT_STATUSES: AccountStatus[] = ['ACTIVE', 'PENDING', 'SUSPENDED', 'CLOSED']

function toLimits(o: Obj): AccountLimits | undefined {
  const l = child(o, 'limits', 'accountLimit', 'accountLimits') ?? o
  const payin = num(l, 'payin', 'payinLimit')
  const payout = num(l, 'payout', 'payoutLimit')
  return payin === undefined && payout === undefined ? undefined : { payin: payin ?? 0, payout: payout ?? 0 }
}

/** One account from the Auth routes — fields read by the DTO names, with common alternatives. */
function toAccount(raw: unknown): PlatformAccount | null {
  const o = obj(raw)
  const universalId = str(o, 'universalId', 'userID', 'userId', '_id', 'id')
  if (!universalId) return null
  const business = child(o, 'merchantProfile', 'merchant', 'business')
  const status = str(o, 'accountStatus', 'status')?.toUpperCase() as AccountStatus | undefined
  return {
    universalId,
    userType: (str(o, 'userType', 'user_type') ?? 'CUSTOMER') as PlatformAccount['userType'],
    name: str(business ?? {}, 'businessName') ?? str(o, 'businessName') ?? fullName(o) ?? str(o, 'email', 'phone') ?? universalId,
    email: str(o, 'email'),
    phone: str(o, 'phone'),
    role: str(o, 'role', 'user_role', 'adminRole'),
    accountStatus: status && ACCOUNT_STATUSES.includes(status) ? status : 'ACTIVE',
    kycTier: tier(o.kycStatus ?? o.kycTier ?? o.kyc_tier),
    limits: toLimits(o),
    createdAt: str(o, 'createdAt', 'created_at'),
  }
}

const toAccounts = (raw: unknown) => list(raw, 'users', 'admins', 'accounts').map(toAccount).filter((a): a is PlatformAccount => !!a)

/**
 * Platform admins — owners, staff and their sub-admins.
 * @endpoint GET /admin/admins
 */
export function listPlatformAdmins(): Promise<PlatformAccount[]> {
  return apiRead(E.admins, toAccounts, () => platformAdmins)
}

/**
 * Invites a Platform Admin; they finish signing in with a phone OTP.
 * @endpoint POST /admin/invite
 */
export function inviteAdmin(invite: AdminInvite): Promise<void> {
  return apiSend('POST', E.invite, invite, () => undefined, () => ({}))
}

export interface AccountFilters {
  userType?: PlatformAccount['userType']
  accountStatus?: AccountStatus
  limit?: number
}

/**
 * Every signed-up account, filtered by type and status.
 * @endpoint GET /admin/users
 */
export function listPlatformAccounts(filters: AccountFilters = {}): Promise<PlatformAccount[]> {
  return apiRead(
    E.accounts,
    toAccounts,
    () => platformAccounts.filter((a) => (!filters.userType || a.userType === filters.userType) && (!filters.accountStatus || a.accountStatus === filters.accountStatus)).slice(0, filters.limit ?? 50),
    { ...filters },
  )
}

/**
 * One account by universalId.
 * @endpoint GET /admin/users/{universalId}
 */
export function getPlatformAccount(universalId: string): Promise<PlatformAccount> {
  return apiRead(
    E.account(universalId),
    (raw) => {
      const account = toAccount(child(obj(raw), 'user', 'account') ?? raw)
      if (!account) throw new Error('The Gateway returned no account')
      return account
    },
    () => platformAccounts.find((a) => a.universalId === universalId),
  )
}

/**
 * Activates, suspends or closes an account.
 * @endpoint PATCH /admin/users/{universalId}/status
 */
export function setAccountStatus(universalId: string, accountStatus: AccountStatus): Promise<void> {
  return apiSend('PATCH', E.accountStatus(universalId), { accountStatus }, () => undefined, () => ({}))
}

/**
 * Sets an account's pay-in / pay-out limits (₦).
 * @endpoint PATCH /admin/users/{universalId}/limits
 */
export function setAccountLimits(universalId: string, limits: AccountLimits): Promise<void> {
  return apiSend('PATCH', E.accountLimits(universalId), { payinLimit: limits.payin, payoutLimit: limits.payout }, () => undefined, () => ({}))
}

/**
 * The policy (limits, permissions, KYC tier) every service enforces for an account.
 * @endpoint GET /policies/{universalId}
 */
export function getAccountPolicy(universalId: string): Promise<AccountPolicy> {
  return apiRead(E.policy(universalId), (raw) => toPolicy(raw, universalId), () => {
    const a = platformAccounts.find((x) => x.universalId === universalId)
    return { ...accountPolicy, universalId, user_type: a?.userType, kycStatus: a?.kycTier, account_limit: a?.limits ?? accountPolicy.limits }
  })
}

/**
 * Where an account is in onboarding (next step, PIN set, KYC tier).
 * @endpoint GET /journey/me/{universalId}
 */
export function getJourneyState(universalId: string): Promise<JourneyState> {
  return apiRead(
    E.journeyState(universalId),
    (raw): JourneyState => {
      const top = obj(raw)
      const o = { ...top, ...(child(top, 'user', 'profile') ?? {}), ...(child(top, 'journey') ?? {}) }
      return {
        universalId: str(o, 'universalId', 'userID', 'userId') ?? universalId,
        userType: str(o, 'userType', 'user_type') as JourneyState['userType'],
        name: fullName(o),
        phone: str(o, 'phone'),
        email: str(o, 'email'),
        accountStatus: str(o, 'accountStatus', 'status'),
        kycTier: tier(o.kycStatus ?? o.kycTier),
        nextStep: str(o, 'nextStep', 'step'),
        pinSet: typeof o.pinSet === 'boolean' ? o.pinSet : typeof o.hasPin === 'boolean' ? o.hasPin : undefined,
      }
    },
    () => {
      const a = platformAccounts.find((x) => x.universalId === universalId)
      return { universalId, userType: a?.userType, name: a?.name, phone: a?.phone, email: a?.email, accountStatus: a?.accountStatus, kycStatus: a?.kycTier ?? 1, nextStep: 'DASHBOARD', pinSet: true }
    },
  )
}
