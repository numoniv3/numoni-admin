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
