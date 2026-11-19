import type {
  BalanceCheckRow, BuyOrder, LedgerJournal, PendingOperation, SettlementOrder, Wallet, WalletReconSnapshot, WalletTransaction,
} from '../types/wallet'

/** What the Wallet MS endpoints answer offline. */

export const myWallets: Wallet[] = [
  { id: '7d1f3c2a-4b8e-4c55-9a10-2f6d1e0b9a01', universalUserId: 'usr_demo', currency: 'NGN', balance: '12450.000000', status: 'active', createdAt: '2026-09-14T10:02:00Z' },
]

export const buyOrder: BuyOrder = {
  id: '0b6c9a4e-1d2f-4e3a-8b7c-5a9d0e1f2a33',
  walletId: myWallets[0].id,
  points: '5000.000000',
  fiatAmount: '5000.00',
  reference: 'WALLET_BUY_01JDEMO0000000000000000001',
  status: 'completed',
}

export const settlementOrder: SettlementOrder = {
  id: '9e8d7c6b-5a4f-4e3d-2c1b-0a9f8e7d6c55',
  walletId: myWallets[0].id,
  universalUserId: 'usr_demo',
  points: '2000.000000',
  fiatAmount: '2000.00',
  reference: 'WALLET_SETTLE_01JDEMO000000000000000001',
  status: 'completed',
  beneficiaryAccountNumber: '0123456789',
  beneficiaryAccountName: 'CHARLES STORE LTD',
  beneficiaryBankCode: '058',
  completedAt: '2026-11-16T15:20:00Z',
}

export const walletTransactions: WalletTransaction[] = [
  { id: 'tx_1', reference: 'WALLET_BUY_01JDEMO0000000000000000001', walletId: myWallets[0].id, type: 'buy', direction: 'credit', points: '5000.000000', status: 'completed', balanceAfter: '12450.000000', createdAt: '2026-11-17T09:12:00Z' },
  { id: 'tx_2', reference: 'WALLET_QR_01JDEMO00000000000000000004', walletId: myWallets[0].id, type: 'qr_payment', direction: 'debit', points: '350.000000', status: 'completed', balanceAfter: '7450.000000', memo: 'Mama Put Wuse', createdAt: '2026-11-16T18:40:00Z' },
  { id: 'tx_3', reference: 'WALLET_XFER_01JDEMO0000000000000000002', walletId: myWallets[0].id, type: 'transfer', direction: 'credit', points: '1200.000000', status: 'completed', balanceAfter: '7800.000000', memo: 'From Tunde', createdAt: '2026-11-15T12:05:00Z' },
  { id: 'tx_4', reference: 'WALLET_REDEEM_01JDEMO000000000000000003', walletId: myWallets[0].id, type: 'redeem', direction: 'debit', points: '400.000000', status: 'completed', balanceAfter: '6600.000000', createdAt: '2026-11-14T08:30:00Z' },
]

export const allWallets: Wallet[] = [
  ...myWallets,
  { id: '3a2b1c0d-9e8f-4a7b-8c6d-5e4f3a2b1c02', universalUserId: 'usr_merchant_charles', currency: 'NGN', balance: '88210.500000', status: 'active', createdAt: '2026-08-02T11:00:00Z' },
  { id: '5c4d3e2f-1a0b-4c9d-8e7f-6a5b4c3d2e03', universalUserId: 'usr_cust_amaka', currency: 'NGN', balance: '0.000000', status: 'frozen', createdAt: '2026-10-21T16:45:00Z' },
]

export const walletLedger: LedgerJournal[] = [
  {
    id: 'je_w1', reference: 'WALLET_BUY_01JDEMO0000000000000000001', description: 'Buy points', createdAt: '2026-11-17T09:12:00Z',
    postings: [
      { account: 'CLEARING', direction: 'debit', amount: '5000.000000' },
      { account: `WALLET:${myWallets[0].id}`, direction: 'credit', amount: '5000.000000' },
    ],
  },
  {
    id: 'je_w2', reference: 'WALLET_QR_01JDEMO00000000000000000004', description: 'QR payment', createdAt: '2026-11-16T18:40:00Z',
    postings: [
      { account: `WALLET:${myWallets[0].id}`, direction: 'debit', amount: '350.000000' },
      { account: 'WALLET:3a2b1c0d-9e8f-4a7b-8c6d-5e4f3a2b1c02', direction: 'credit', amount: '350.000000' },
    ],
  },
]

export const walletRecon: WalletReconSnapshot = {
  reference: 'WALLET_CUTOFF_01JDEMO00000000000000001',
  runAt: '2026-11-18T00:00:00Z',
  balanced: true,
  ledgerHash: 'sha256:4f1c…9a0e',
  walletsTotal: '100660.500000',
  walletCount: 3,
}

export const walletBalanceChecks: BalanceCheckRow[] = allWallets.map((w) => ({
  account: `WALLET:${w.id}`, balance: w.balance, books: w.balance, difference: '0.000000', matches: true,
}))

export const pendingOperations: PendingOperation[] = [
  { id: 'op_1', opType: 'redeem_point_failed', status: 'needs_recon', reference: 'WALLET_REDEEM_01JDEMO000000000000000009', walletId: allWallets[1].id, points: '1500.000000', error: 'Point MS timeout on receive-to-sell-pool', createdAt: '2026-11-17T22:14:00Z' },
]
