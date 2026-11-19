import type { MintRecord, PointReconReport, PoolsSnapshot } from '../types/points'
import type { BalanceCheckRow, LedgerJournal } from '../types/wallet'

/** What the Point MS admin endpoints answer offline. Conserved: 250k = 150k + 4k + 96k. */

export const poolsSnapshot: PoolsSnapshot = {
  pools: { BUY_POOL: '150000.000000', SELL_POOL: '4000.000000', CLEARING: '0.000000', MINT_SUSPENSE: '250000.000000' },
  totalMinted: '250000.000000',
  poolsFrozen: false,
  asOf: '2026-11-18T08:00:00Z',
}

export const mintHistory: MintRecord[] = [
  { reference: 'POINT_MINT_01JDEMO0000000000000000002', pointsMinted: '150000.000000', fiatAmount: '150000.00', currency: 'NGN', rate: '1.000000', fundingSource: 'company_bank_transfer', createdAt: '2026-11-10T10:00:00Z' },
  { reference: 'POINT_MINT_01JDEMO0000000000000000001', pointsMinted: '100000.000000', fiatAmount: '100000.00', currency: 'NGN', rate: '1.000000', fundingSource: 'company_bank_transfer', createdAt: '2026-10-01T10:00:00Z' },
]

export const pointReconReport: PointReconReport = {
  reference: 'POINT_RECON_01JDEMO000000000000000001',
  balanced: true,
  totalMinted: '250000.000000',
  buyPool: '150000.000000',
  sellPool: '4000.000000',
  externalWalletsTotal: '96000.000000',
  ledgerHash: 'sha256:9b2e…11fd',
}

export const pointJournal: LedgerJournal[] = [
  {
    id: 'je_p1', reference: 'POINT_MINT_01JDEMO0000000000000000002', description: 'Mint into buy pool', createdAt: '2026-11-10T10:00:00Z',
    postings: [
      { account: 'MINT_SUSPENSE', direction: 'debit', amount: '150000.000000' },
      { account: 'BUY_POOL', direction: 'credit', amount: '150000.000000' },
    ],
  },
  {
    id: 'je_p2', reference: 'WALLET_BUY_01JDEMO0000000000000000001', description: 'Transfer from buy pool', createdAt: '2026-11-17T09:12:00Z',
    postings: [
      { account: 'BUY_POOL', direction: 'debit', amount: '5000.000000' },
      { account: 'CLEARING', direction: 'credit', amount: '5000.000000' },
    ],
  },
]

export const pointBalanceChecks: BalanceCheckRow[] = Object.entries(poolsSnapshot.pools).map(([account, balance]) => ({
  account, balance, books: balance, difference: '0.000000', matches: true,
}))
