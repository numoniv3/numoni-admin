import { NUMONI_ENDPOINTS } from './endpoints'
import { allWallets, buyOrder, myWallets, pendingOperations, settlementOrder, walletBalanceChecks, walletLedger, walletRecon, walletTransactions } from './mocks/wallet'
import { child, isObj, list, num, obj, str, type Obj } from './parse'
import { apiRead, apiSend, idempotent } from './request'
import type {
  BalanceCheckPage, BalanceCheckRow, BankAccountName, BuyOrder, BuyOrderStatus, BuyPointsInput, BuyPointsResult, LedgerJournal, LedgerPosting,
  PendingOperation, PendingOperationFilters, PendingOperationPage, QrPayment, QrPaymentToken, RedeemResult, ResolveAction, SettlementInput,
  SettlementOrder, SettlementResult, SettlementStatus, TransferInput, Wallet, WalletReconSnapshot, WalletTransaction, WalletTransactionFilters,
  WalletTransfer,
} from './types/wallet'

/*
 * Wallet MS through the Gateway (`/wallet/*`). Every money movement sends an
 * `Idempotency-Key` (pass your own to make a retry safe; one is generated
 * otherwise). Responses the spec leaves untyped are read with `parse.ts`
 * helpers so a renamed field degrades to "missing" rather than a crash.
 */

const E = NUMONI_ENDPOINTS.wallet

/** A points amount as the SCALE=6 decimal string the Wallet and Point MS take. */
export function toPoints(v: string | number): string {
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n) || n < 0) throw new Error(`Invalid points amount: ${v}`)
  return typeof v === 'string' && /^\d+\.\d{6}$/.test(v) ? v : n.toFixed(6)
}

/** A decimal-string field (numbers are stringified), `fallback` when absent. */
export const dec = (o: Obj, fallback: string, ...keys: string[]) => str(o, ...keys) ?? fallback
const demoRef = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 20).toUpperCase()}`

// ── parsers ──────────────────────────────────────────────────────────────────

function toWallet(raw: unknown): Wallet {
  const o = child(obj(raw), 'wallet') ?? obj(raw)
  return {
    id: str(o, 'id', 'walletId', '_id') ?? '',
    universalUserId: str(o, 'universalUserId', 'universalId', 'userId'),
    currency: str(o, 'currency') ?? 'NGN',
    balance: dec(o, '0.000000', 'balance', 'points'),
    status: str(o, 'status')?.toLowerCase() === 'frozen' ? 'frozen' : 'active',
    createdAt: str(o, 'createdAt', 'created_at'),
  }
}

const toWallets = (raw: unknown) => list(raw, 'wallets').filter(isObj).map(toWallet).filter((w) => w.id)

function toBuyOrder(raw: unknown): BuyOrder {
  const o = child(obj(raw), 'order', 'buyOrder') ?? obj(raw)
  return {
    id: str(o, 'id', 'orderId') ?? '',
    walletId: str(o, 'walletId') ?? '',
    points: dec(o, '0.000000', 'points'),
    fiatAmount: str(o, 'fiatAmount', 'amount'),
    reference: str(o, 'reference') ?? '',
    status: (str(o, 'status')?.toLowerCase() ?? 'pending') as BuyOrderStatus,
    onusReference: str(o, 'onusReference'),
    paymentAccountNumber: str(o, 'paymentAccountNumber'),
    paymentBankName: str(o, 'paymentBankName'),
  }
}

function toSettlement(raw: unknown): SettlementOrder {
  const o = child(obj(raw), 'settlement', 'order') ?? obj(raw)
  return {
    id: str(o, 'id', 'settlementId') ?? '',
    walletId: str(o, 'walletId') ?? '',
    universalUserId: str(o, 'universalUserId'),
    points: dec(o, '0.000000', 'points'),
    fiatAmount: str(o, 'fiatAmount', 'amount'),
    reference: str(o, 'reference') ?? '',
    status: (str(o, 'status')?.toLowerCase() ?? 'pending') as SettlementStatus,
    onusReference: str(o, 'onusReference'),
    pointSettleRef: str(o, 'pointSettleRef'),
    beneficiaryAccountNumber: str(o, 'beneficiaryAccountNumber', 'accountNumber'),
    beneficiaryAccountName: str(o, 'beneficiaryAccountName', 'accountName'),
    beneficiaryBankCode: str(o, 'beneficiaryBankCode', 'bankCode'),
    reason: str(o, 'reason'),
    completedAt: str(o, 'completedAt') ?? null,
  }
}

function toTransaction(raw: unknown): WalletTransaction | null {
  const o = obj(raw)
  const reference = str(o, 'reference', 'ref')
  const id = str(o, 'id', '_id') ?? reference
  if (!id) return null
  const signed = num(o, 'amount', 'points', 'delta')
  const dir = str(o, 'direction', 'side', 'entryType')?.toLowerCase()
  return {
    id,
    reference: reference ?? id,
    walletId: str(o, 'walletId'),
    type: str(o, 'type', 'kind', 'txType') ?? 'transfer',
    direction: dir === 'credit' || dir === 'cr' ? 'credit' : dir === 'debit' || dir === 'dr' ? 'debit' : (signed ?? 0) < 0 ? 'debit' : 'credit',
    points: dec(o, '0.000000', 'points', 'amount').replace(/^-/, ''),
    status: str(o, 'status'),
    balanceAfter: str(o, 'balanceAfter', 'balance_after'),
    memo: str(o, 'memo', 'narration', 'description'),
    createdAt: str(o, 'createdAt', 'created_at', 'timestamp'),
  }
}

function toPosting(raw: unknown): LedgerPosting | null {
  const o = obj(raw)
  const account = str(o, 'account', 'accountCode', 'ledgerAccount', 'accountId')
  if (!account) return null
  const debit = str(o, 'debit')
  const credit = str(o, 'credit')
  const side = str(o, 'direction', 'side', 'entryType')?.toLowerCase()
  const isDebit = side ? side.startsWith('d') : !!debit && Number(debit) !== 0
  return { account, direction: isDebit ? 'debit' : 'credit', amount: (isDebit ? debit : credit) ?? dec(o, '0', 'amount') }
}

/** A double-entry journal with postings — shared by Wallet and Point MS. */
export function toJournal(raw: unknown): LedgerJournal | null {
  const o = obj(raw)
  const reference = str(o, 'reference', 'ref')
  const id = str(o, 'id', 'journalEntryId', '_id') ?? reference
  if (!id) return null
  return {
    id,
    reference: reference ?? id,
    description: str(o, 'description', 'memo', 'narration', 'type'),
    createdAt: str(o, 'createdAt', 'created_at', 'postedAt'),
    postings: list(o.postings ?? o.lines ?? o.entries).map(toPosting).filter((p): p is LedgerPosting => !!p),
  }
}

export const toJournals = (raw: unknown) => list(raw, 'entries', 'journals', 'journal').map(toJournal).filter((j): j is LedgerJournal => !!j)

/** A balances-vs-books row — shared by Wallet and Point MS. */
export function toBalanceRow(raw: unknown): BalanceCheckRow | null {
  const o = obj(raw)
  const account = str(o, 'account', 'accountCode', 'walletId', 'accountId', 'name')
  if (!account) return null
  const balance = dec(o, '0', 'balance', 'cachedBalance', 'accountBalance')
  const books = dec(o, balance, 'books', 'bookBalance', 'postingsSum', 'computed', 'ledgerBalance')
  const difference = dec(o, String(Number(balance) - Number(books)), 'difference', 'diff', 'delta')
  const matches = typeof o.matches === 'boolean' ? o.matches : typeof o.ok === 'boolean' ? o.ok : Number(difference) === 0
  return { account, balance, books, difference, matches }
}

export const toBalancePage = (raw: unknown): BalanceCheckPage => ({
  rows: list(raw, 'rows', 'accounts', 'proof').map(toBalanceRow).filter((r): r is BalanceCheckRow => !!r),
  nextCursor: str(obj(raw), 'nextCursor', 'cursor'),
})

function toPending(raw: unknown): PendingOperation | null {
  const o = obj(raw)
  const id = str(o, 'id', '_id')
  if (!id) return null
  return {
    id,
    opType: str(o, 'opType', 'type', 'operation') ?? 'unknown',
    status: str(o, 'status') ?? 'needs_recon',
    reference: str(o, 'reference'),
    walletId: str(o, 'walletId'),
    points: str(o, 'points', 'amount'),
    error: str(o, 'error', 'lastError', 'reason'),
    createdAt: str(o, 'createdAt', 'created_at'),
  }
}

function toRecon(raw: unknown): WalletReconSnapshot {
  const o = child(obj(raw), 'snapshot', 'cutoff', 'report') ?? obj(raw)
  return {
    reference: str(o, 'reference', 'id'),
    runAt: str(o, 'runAt', 'createdAt', 'cutoffAt', 'asOf'),
    balanced: typeof o.balanced === 'boolean' ? o.balanced : undefined,
    ledgerHash: str(o, 'ledgerHash', 'hash'),
    walletsTotal: str(o, 'walletsTotal', 'totalBalance', 'externalWalletsTotal'),
    walletCount: num(o, 'walletCount', 'wallets'),
  }
}

// ── user ─────────────────────────────────────────────────────────────────────

/**
 * Creates or refreshes the Wallet MS user for the signed-in account. Safe to
 * call on every sign-in.
 * @endpoint POST /wallet/opt-in
 */
export function walletOptIn(): Promise<void> {
  return apiSend('POST', E.optIn, {}, () => undefined, () => ({}))
}

/**
 * Opens a wallet for the signed-in account.
 * @endpoint POST /wallet/wallets
 */
export function createWallet(currency = 'NGN'): Promise<Wallet> {
  return apiSend('POST', E.wallets, { currency }, toWallet, () => ({ ...myWallets[0], id: crypto.randomUUID(), balance: '0.000000', currency }))
}

/**
 * The signed-in account's wallets.
 * @endpoint GET /wallet/wallets
 */
export function listMyWallets(): Promise<Wallet[]> {
  return apiRead(E.wallets, toWallets, () => myWallets)
}

/**
 * One wallet.
 * @endpoint GET /wallet/wallets/{walletId}
 */
export function getWallet(walletId: string): Promise<Wallet> {
  return apiRead(E.wallet(walletId), toWallet, () => allWallets.find((w) => w.id === walletId) ?? myWallets[0])
}

/**
 * Starts a points purchase. In payment-mock mode the order completes at once;
 * otherwise it's `awaiting_payment` with a PayOnUs virtual account in
 * `payment` — poll `verifyBuyOrder` after the customer pays.
 * @endpoint POST /wallet/wallets/{walletId}/buy-points
 */
export function buyPoints(walletId: string, input: BuyPointsInput, idempotencyKey?: string): Promise<BuyPointsResult> {
  return apiSend(
    'POST',
    E.buyPoints(walletId),
    { ...input, points: toPoints(input.points) },
    (raw): BuyPointsResult => {
      const o = obj(raw)
      const p = child(o, 'payment')
      return {
        order: toBuyOrder(child(o, 'order') ?? o),
        payment: p ? { provider: str(p, 'provider') ?? 'payonus', accountNumber: str(p, 'accountNumber'), bankName: str(p, 'bankName'), onusReference: str(p, 'onusReference'), instructions: str(p, 'instructions') } : undefined,
      }
    },
    (b) => ({ ...buyOrder, id: crypto.randomUUID(), walletId, points: (b as { points: string }).points, fiatAmount: Number((b as { points: string }).points).toFixed(2), reference: demoRef('WALLET_BUY') }),
    idempotent(idempotencyKey),
  )
}

/**
 * A buy order.
 * @endpoint GET /wallet/buy-orders/{id}
 */
export function getBuyOrder(id: string): Promise<BuyOrder> {
  return apiRead(E.buyOrder(id), toBuyOrder, () => ({ ...buyOrder, id }))
}

/**
 * Asks PayOnUs whether the order was paid and credits the wallet if so.
 * @endpoint POST /wallet/buy-orders/{id}/verify-payment
 */
export function verifyBuyOrder(id: string): Promise<BuyOrder> {
  return apiSend('POST', E.verifyBuyOrder(id), {}, toBuyOrder, () => ({ ...buyOrder, id, status: 'completed' }))
}

/**
 * Moves points between two wallets.
 * @endpoint POST /wallet/transfers
 */
export function transferPoints(input: TransferInput, idempotencyKey?: string): Promise<WalletTransfer> {
  const body = { ...input, points: toPoints(input.points) }
  return apiSend(
    'POST',
    E.transfers,
    body,
    (raw) => {
      const o = child(obj(raw), 'transfer') ?? obj(raw)
      return {
        reference: str(o, 'reference', 'id') ?? '',
        status: str(o, 'status') ?? 'completed',
        fromWalletId: str(o, 'fromWalletId') ?? body.fromWalletId,
        toWalletId: str(o, 'toWalletId') ?? body.toWalletId,
        points: dec(o, body.points, 'points', 'amount'),
        memo: str(o, 'memo') ?? body.memo,
        createdAt: str(o, 'createdAt'),
      }
    },
    (b) => ({ ...(b as object), reference: demoRef('WALLET_XFER'), status: 'completed', createdAt: new Date().toISOString() }),
    idempotent(idempotencyKey),
  )
}

/**
 * Issues a QR payment token for the receiving wallet (merchant till, brand app).
 * @endpoint POST /wallet/qr/generate
 */
export function generateQrPayment(walletId: string, points: string | number): Promise<QrPaymentToken> {
  const body = { walletId, points: toPoints(points) }
  return apiSend(
    'POST',
    E.qrGenerate,
    body,
    (raw) => {
      const o = child(obj(raw), 'qr', 'token') ?? obj(raw)
      const reference = str(o, 'reference', 'token', 'ref') ?? ''
      return {
        reference,
        walletId: str(o, 'walletId') ?? walletId,
        points: dec(o, body.points, 'points', 'amount'),
        payload: str(o, 'payload', 'qrPayload', 'qrData', 'qr', 'qrString') ?? reference,
        expiresAt: str(o, 'expiresAt', 'expiry'),
      }
    },
    () => ({ reference: demoRef('WALLET_QR'), walletId, points: body.points, expiresAt: new Date(Date.now() + 5 * 60_000).toISOString() }),
  )
}

/**
 * Pays a scanned QR token from the payer's wallet, atomically.
 * @endpoint POST /wallet/qr/confirm
 */
export function confirmQrPayment(reference: string, fromWalletId: string, idempotencyKey?: string): Promise<QrPayment> {
  return apiSend(
    'POST',
    E.qrConfirm,
    { reference, fromWalletId },
    (raw) => {
      const o = child(obj(raw), 'payment', 'transfer') ?? obj(raw)
      return { reference: str(o, 'reference') ?? reference, status: str(o, 'status') ?? 'completed', fromWalletId: str(o, 'fromWalletId') ?? fromWalletId, toWalletId: str(o, 'toWalletId'), points: str(o, 'points', 'amount') }
    },
    () => ({ reference, status: 'completed', fromWalletId, toWalletId: allWallets[1].id, points: '350.000000' }),
    idempotent(idempotencyKey),
  )
}

/**
 * Redeems points into the Sell Pool. `needsRecon` means the wallet was debited
 * but the Point MS step failed — an operator resolves it from the recon queue.
 * @endpoint POST /wallet/wallets/{walletId}/redeem
 */
export function redeemPoints(walletId: string, points: string | number, idempotencyKey?: string): Promise<RedeemResult> {
  const amount = toPoints(points)
  return apiSend(
    'POST',
    E.redeem(walletId),
    { points: amount },
    (raw) => {
      const o = child(obj(raw), 'redemption', 'redeem') ?? obj(raw)
      const status = str(o, 'status') ?? 'completed'
      return { reference: str(o, 'reference') ?? '', status, points: dec(o, amount, 'points'), needsRecon: /recon/i.test(status) }
    },
    () => ({ reference: demoRef('WALLET_REDEEM'), status: 'completed', points: amount }),
    idempotent(idempotencyKey),
  )
}

/**
 * Settles Sell Pool points to the merchant's bank account through PayOnUs.
 * @endpoint POST /wallet/wallets/{walletId}/settlements
 */
export function settleToBank(walletId: string, input: SettlementInput, idempotencyKey?: string): Promise<SettlementResult> {
  const body = { ...input, points: toPoints(input.points) }
  return apiSend(
    'POST',
    E.settle(walletId),
    body,
    (raw): SettlementResult => {
      const o = obj(raw)
      const p = child(o, 'payout')
      return {
        settlement: toSettlement(child(o, 'settlement') ?? o),
        payout: p ? { provider: str(p, 'provider'), paymentStatus: str(p, 'paymentStatus', 'status'), onusReference: str(p, 'onusReference'), fee: num(p, 'fee') } : undefined,
      }
    },
    () => ({
      ...settlementOrder, id: crypto.randomUUID(), walletId, points: body.points, fiatAmount: Number(body.points).toFixed(2), reference: demoRef('WALLET_SETTLE'),
      beneficiaryAccountNumber: body.accountNumber, beneficiaryAccountName: body.accountName ?? settlementOrder.beneficiaryAccountName, beneficiaryBankCode: body.bankCode,
    }),
    idempotent(idempotencyKey),
  )
}

/**
 * A settlement order.
 * @endpoint GET /wallet/settlements/{id}
 */
export function getSettlement(id: string): Promise<SettlementOrder> {
  return apiRead(E.settlement(id), toSettlement, () => ({ ...settlementOrder, id }))
}

/**
 * Asks PayOnUs for the payout's status and updates the settlement.
 * @endpoint POST /wallet/settlements/{id}/verify-payment
 */
export function verifySettlement(id: string): Promise<SettlementOrder> {
  return apiSend('POST', E.verifySettlement(id), {}, toSettlement, () => ({ ...settlementOrder, id }))
}

/**
 * Looks up the name on a bank account before a payout.
 * @endpoint POST /wallet/payouts/name-enquiry
 */
export function lookupBankAccount(accountNumber: string, bankCode: string): Promise<BankAccountName> {
  return apiSend(
    'POST',
    E.nameEnquiry,
    { accountNumber, bankCode },
    (raw) => {
      const o = child(obj(raw), 'account', 'result') ?? obj(raw)
      return { accountNumber, bankCode, accountName: str(o, 'accountName', 'account_name', 'name', 'beneficiaryName') ?? '', bankName: str(o, 'bankName', 'bank') }
    },
    () => ({ accountName: 'CHARLES STORE LTD', bankName: 'GTBank' }),
  )
}

/**
 * Blocks all movement out of a wallet.
 * @endpoint POST /wallet/wallets/{walletId}/freeze
 */
export function freezeWallet(walletId: string): Promise<Wallet> {
  return apiSend('POST', E.freeze(walletId), {}, (raw) => ({ ...toWallet(raw), id: walletId, status: 'frozen' as const }), () => ({ ...allWallets.find((w) => w.id === walletId), status: 'frozen' }))
}

/**
 * Lifts a freeze.
 * @endpoint POST /wallet/wallets/{walletId}/unfreeze
 */
export function unfreezeWallet(walletId: string): Promise<Wallet> {
  return apiSend('POST', E.unfreeze(walletId), {}, (raw) => ({ ...toWallet(raw), id: walletId, status: 'active' as const }), () => ({ ...allWallets.find((w) => w.id === walletId), status: 'active' }))
}

/**
 * The signed-in account's wallet transactions, newest first.
 * @endpoint GET /wallet/transactions
 */
export function listWalletTransactions(filters: WalletTransactionFilters = {}): Promise<WalletTransaction[]> {
  return apiRead(
    E.transactions,
    (raw) => list(raw, 'transactions').map(toTransaction).filter((t): t is WalletTransaction => !!t),
    () => walletTransactions.filter((t) => !filters.walletId || t.walletId === filters.walletId).slice(0, filters.limit ?? 50),
    { ...filters },
  )
}

// ── admin ────────────────────────────────────────────────────────────────────

/**
 * Every wallet on the platform.
 * @endpoint GET /wallet/admin/wallets
 */
export function listAllWallets(limit = 100): Promise<Wallet[]> {
  return apiRead(E.admin.wallets, toWallets, () => allWallets.slice(0, limit), { limit })
}

/**
 * Wallet MS journal entries with their postings.
 * @endpoint GET /wallet/admin/ledger
 */
export function listWalletLedger(limit = 100): Promise<LedgerJournal[]> {
  return apiRead(E.admin.ledger, toJournals, () => walletLedger.slice(0, limit), { limit })
}

/**
 * The latest cutoff / reconciliation snapshot.
 * @endpoint GET /wallet/admin/reconciliation
 */
export function getWalletReconciliation(): Promise<WalletReconSnapshot> {
  return apiRead(E.admin.reconciliation, toRecon, () => walletRecon)
}

/**
 * Runs a cutoff: briefly freezes activity and hashes the ledger.
 * @endpoint POST /wallet/admin/cutoff/run
 */
export function runWalletCutoff(): Promise<WalletReconSnapshot> {
  return apiSend('POST', E.admin.runCutoff, {}, toRecon, () => ({ ...walletRecon, reference: demoRef('WALLET_CUTOFF'), runAt: new Date().toISOString() }))
}

/**
 * Cached wallet balances against the sum of their postings, per account.
 * @endpoint GET /wallet/admin/balances-vs-books
 */
export function getWalletBalancesVsBooks(page: { cursor?: string; limit?: number } = {}): Promise<BalanceCheckPage> {
  return apiRead(E.admin.balancesVsBooks, toBalancePage, () => ({ rows: walletBalanceChecks }), { ...page })
}

/**
 * Saga steps waiting for an operator (`needs_recon` by default).
 * @endpoint POST /wallet/admin/recon/pending
 */
export function listPendingOperations(filters: PendingOperationFilters = {}): Promise<PendingOperationPage> {
  return apiSend(
    'POST',
    E.admin.pending,
    filters,
    (raw) => ({ items: list(raw, 'operations', 'pending').map(toPending).filter((p): p is PendingOperation => !!p), nextCursor: str(obj(raw), 'nextCursor', 'cursor') }),
    () => ({ items: pendingOperations.filter((p) => !filters.status || p.status === filters.status) }),
  )
}

/**
 * Finishes (`retry`) or undoes (`compensate`) a pending operation.
 * @endpoint POST /wallet/admin/recon/pending/{id}/resolve
 */
export function resolvePendingOperation(id: string, action: ResolveAction = 'retry'): Promise<PendingOperation> {
  return apiSend(
    'POST',
    E.admin.resolvePending(id),
    { action },
    (raw) => toPending(child(obj(raw), 'operation') ?? raw) ?? { id, opType: 'unknown', status: 'resolved' },
    () => ({ ...pendingOperations.find((p) => p.id === id), id, status: action === 'retry' ? 'resolved' : 'compensated' }),
  )
}
