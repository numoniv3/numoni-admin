/**
 * Point MS shapes, proxied by the Gateway under `/points/*` (`specs/numoni.json`,
 * "Point - …" tags). Points and fiat are decimal strings (points SCALE=6,
 * fiat 2dp) so no precision is lost.
 */

/** `OptInResultDto`. */
export interface PointsOptInResult {
  universalUserId: string
  created: boolean
  status: string
}

/** `PoolBalancesDto`. */
export interface PoolBalances {
  BUY_POOL: string
  SELL_POOL: string
  CLEARING: string
  MINT_SUSPENSE: string
}

/** `PoolsSnapshotDto`. */
export interface PoolsSnapshot {
  pools: PoolBalances
  totalMinted: string
  poolsFrozen: boolean
  asOf?: string
}

/** `MintDto`. `fiatAmount` must equal `pointsToMint` ÷ `rate`. */
export interface MintInput {
  fiatAmount: string
  currency: string
  pointsToMint: string
  rate: string
  fundingSource?: string
  reference?: string
  /**
   * The completed PayOnUs payment backing this mint (buy-order or PayOnUs reference).
   * Wallet MS checks it completed and that `fiatAmount` fits what is left of it.
   */
  paymentReference?: string
}

/** `MintResultDto`. */
export interface MintResult {
  reference: string
  pointsMinted: string
  fiatAmount: string
  currency: string
  rate: string
  journalEntryId: string
  totalMinted: string
  buyPoolBalance: string
  /** Wallet MS fiat funding journal backing this mint (null only when fiat funding isn’t required). */
  fiatFundingReference: string | null
}

/** One row of `GET /points/admin/mints` (untyped in the spec — read as `MintResultDto` + timestamp). */
export interface MintRecord {
  reference: string
  pointsMinted: string
  fiatAmount: string
  currency: string
  rate: string
  fundingSource?: string
  createdAt?: string
}

export interface PageFilters {
  limit?: number
  offset?: number
}

export interface JournalFilters extends PageFilters {
  /** e.g. `POINT_MINT_`, `WALLET_BUY_`. */
  referencePrefix?: string
  /** ISO date or date-time, inclusive. */
  from?: string
  /** ISO date (whole day included) or date-time, exclusive. */
  to?: string
}

/** `ReconciliationReportDto`. Balanced when `totalMinted = buyPool + sellPool + externalWalletsTotal`. */
export interface PointReconReport {
  reference: string
  balanced: boolean
  totalMinted: string
  buyPool: string
  sellPool: string
  externalWalletsTotal: string
  ledgerHash: string
}
