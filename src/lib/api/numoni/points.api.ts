import { NUMONI_ENDPOINTS } from './endpoints'
import { mintHistory, pointBalanceChecks, pointJournal, pointReconReport, poolsSnapshot } from './mocks/points'
import { child, list, obj, str, type Obj } from './parse'
import { apiRead, apiSend, idempotent } from './request'
import type {
  JournalFilters, MintInput, MintRecord, MintResult, PageFilters, PointReconReport, PointsOptInResult, PoolsSnapshot,
} from './types/points'
import type { BalanceCheckPage, LedgerJournal } from './types/wallet'
import { dec, toBalancePage, toJournals } from './wallet.api'

/*
 * Point MS through the Gateway (`/points/*`). Everything but opt-in is
 * Platform Admin only.
 */

const E = NUMONI_ENDPOINTS.points
const demoRef = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 20).toUpperCase()}`

function toPools(raw: unknown): PoolsSnapshot {
  const o = obj(raw)
  const p = child(o, 'pools') ?? {}
  return {
    pools: {
      BUY_POOL: dec(p, '0', 'BUY_POOL', 'buyPool'),
      SELL_POOL: dec(p, '0', 'SELL_POOL', 'sellPool'),
      CLEARING: dec(p, '0', 'CLEARING', 'clearing'),
      MINT_SUSPENSE: dec(p, '0', 'MINT_SUSPENSE', 'mintSuspense'),
    },
    totalMinted: dec(o, '0', 'totalMinted'),
    poolsFrozen: o.poolsFrozen === true,
    asOf: str(o, 'asOf'),
  }
}

function toMintResult(raw: unknown): MintResult {
  const o = obj(raw)
  return {
    reference: dec(o, '', 'reference'),
    pointsMinted: dec(o, '0', 'pointsMinted'),
    fiatAmount: dec(o, '0', 'fiatAmount'),
    currency: dec(o, 'NGN', 'currency'),
    rate: dec(o, '1.000000', 'rate'),
    journalEntryId: dec(o, '', 'journalEntryId'),
    totalMinted: dec(o, '0', 'totalMinted'),
    buyPoolBalance: dec(o, '0', 'buyPoolBalance'),
  }
}

function toMintRecord(raw: unknown): MintRecord | null {
  const o: Obj = obj(raw)
  const reference = str(o, 'reference', 'id')
  if (!reference) return null
  return {
    reference,
    pointsMinted: dec(o, '0', 'pointsMinted', 'points', 'amount'),
    fiatAmount: dec(o, '0', 'fiatAmount'),
    currency: dec(o, 'NGN', 'currency'),
    rate: dec(o, '1.000000', 'rate'),
    fundingSource: str(o, 'fundingSource'),
    createdAt: str(o, 'createdAt', 'created_at'),
  }
}

function toRecon(raw: unknown): PointReconReport {
  const o = child(obj(raw), 'report') ?? obj(raw)
  return {
    reference: dec(o, '', 'reference'),
    balanced: o.balanced === true,
    totalMinted: dec(o, '0', 'totalMinted'),
    buyPool: dec(o, '0', 'buyPool'),
    sellPool: dec(o, '0', 'sellPool'),
    externalWalletsTotal: dec(o, '0', 'externalWalletsTotal'),
    ledgerHash: dec(o, '', 'ledgerHash'),
  }
}

/**
 * Creates or refreshes the Point MS user for an account. Idempotent.
 * `serviceName` identifies the caller; the spec's example is `wallet-ms`.
 * @endpoint POST /points/opt-in
 */
export function pointsOptIn(universalId: string, serviceName = 'numoni-frontend', metadata?: Record<string, unknown>): Promise<PointsOptInResult> {
  return apiSend(
    'POST',
    E.optIn,
    { universalId, serviceName, metadata },
    (raw) => {
      const o = obj(raw)
      return { universalUserId: str(o, 'universalUserId') ?? universalId, created: o.created === true, status: str(o, 'status') ?? 'active' }
    },
    () => ({ universalUserId: universalId, created: false, status: 'active' }),
  )
}

/**
 * Mints points into the buy pool. `fiatAmount`, `pointsToMint` and `rate` must
 * reconcile. Pass the same `idempotencyKey` when retrying one mint.
 * @endpoint POST /points/admin/mint
 */
export function mintPoints(input: MintInput, idempotencyKey?: string): Promise<MintResult> {
  return apiSend(
    'POST',
    E.admin.mint,
    input,
    toMintResult,
    () => {
      const total = (Number(poolsSnapshot.totalMinted) + Number(input.pointsToMint)).toFixed(6)
      return {
        ...input, reference: input.reference ?? demoRef('POINT_MINT'), pointsMinted: input.pointsToMint, journalEntryId: crypto.randomUUID(),
        totalMinted: total, buyPoolBalance: (Number(poolsSnapshot.pools.BUY_POOL) + Number(input.pointsToMint)).toFixed(6),
      }
    },
    idempotent(idempotencyKey),
  )
}

/**
 * Pool balances and total minted.
 * @endpoint GET /points/admin/pools
 */
export function getPointPools(): Promise<PoolsSnapshot> {
  return apiRead(E.admin.pools, toPools, () => poolsSnapshot)
}

/**
 * Mint history, newest first.
 * @endpoint GET /points/admin/mints
 */
export function listMints(page: PageFilters = {}): Promise<MintRecord[]> {
  return apiRead(
    E.admin.mints,
    (raw) => list(raw, 'mints', 'rows').map(toMintRecord).filter((m): m is MintRecord => !!m),
    () => mintHistory.slice(page.offset ?? 0, (page.offset ?? 0) + (page.limit ?? 50)),
    { ...page },
  )
}

/**
 * The latest conservation report.
 * @endpoint GET /points/admin/reconciliation
 */
export function getPointReconciliation(): Promise<PointReconReport> {
  return apiRead(E.admin.reconciliation, toRecon, () => pointReconReport)
}

/**
 * Checks `totalMinted = buyPool + sellPool + externalWalletsTotal`. Pass
 * `externalWalletsTotal` only when the Gateway can't read it from Wallet MS.
 * @endpoint POST /points/admin/reconciliation/run
 */
export function runPointReconciliation(externalWalletsTotal?: string): Promise<PointReconReport> {
  return apiSend(
    'POST',
    E.admin.runReconciliation,
    externalWalletsTotal ? { externalWalletsTotal } : {},
    toRecon,
    () => ({ ...pointReconReport, reference: demoRef('POINT_RECON') }),
  )
}

/**
 * Point MS journal entries with postings.
 * @endpoint GET /points/admin/journal
 */
export function listPointJournal(filters: JournalFilters = {}): Promise<LedgerJournal[]> {
  return apiRead(
    E.admin.journal,
    toJournals,
    () => pointJournal.filter((j) => !filters.referencePrefix || j.reference.startsWith(filters.referencePrefix)),
    { ...filters },
  )
}

/**
 * Emergency stop: while frozen, mint/transfer/settle return 503. Resolves to
 * the new frozen state.
 * @endpoint POST /points/admin/freeze-pools
 */
export function setPoolsFrozen(frozen: boolean): Promise<boolean> {
  return apiSend('POST', E.admin.freezePools, { frozen }, (raw) => obj(raw).poolsFrozen === true, () => ({ poolsFrozen: frozen }))
}

/**
 * Cached ledger balances against the sum of postings, per pool account.
 * @endpoint GET /points/admin/balances-vs-books
 */
export function getPointBalancesVsBooks(): Promise<BalanceCheckPage> {
  return apiRead(E.admin.balancesVsBooks, toBalancePage, () => ({ rows: pointBalanceChecks }))
}
