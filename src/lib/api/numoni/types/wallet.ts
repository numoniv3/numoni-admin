/**
 * Wallet MS shapes, proxied by the Gateway under `/wallet/*` (`specs/numoni.json`,
 * "Wallet - …" tags). Points are SCALE=6 decimal strings (`"100.000000"`) and
 * stay strings so no precision is lost; format them for display only.
 *
 * Types marked *(inferred)* have no response schema in the spec — their fields
 * are read by the most likely names and may need adjusting once the Gateway
 * documents them.
 */

export type WalletStatus = 'active' | 'frozen'

/** `Wallet`. */
export interface Wallet {
  id: string
  universalUserId?: string
  currency: string
  /** Points, SCALE=6 decimal string. */
  balance: string
  status: WalletStatus
  createdAt?: string
}

export type BuyOrderStatus = 'pending' | 'awaiting_payment' | 'processing' | 'completed' | 'needs_recon' | 'cancelled'

/** `BuyOrder`. */
export interface BuyOrder {
  id: string
  walletId: string
  points: string
  fiatAmount?: string
  reference: string
  status: BuyOrderStatus
  onusReference?: string
  paymentAccountNumber?: string
  paymentBankName?: string
}

/** `BuyPointsRequest`. `name` is required when the Gateway isn't in payment-mock mode. */
export interface BuyPointsInput {
  points: string | number
  name?: string
  email?: string
  phone?: string
}

/** The PayOnUs virtual account to pay into, when the order isn't fulfilled at once. */
export interface PaymentInstructions {
  provider: string
  accountNumber?: string
  bankName?: string
  onusReference?: string
  instructions?: string
}

/** `POST …/buy-points`: the order, plus where to pay when it's `awaiting_payment`. */
export interface BuyPointsResult {
  order: BuyOrder
  payment?: PaymentInstructions
}

export type SettlementStatus = 'pending' | 'reserved' | 'payout_pending' | 'completed' | 'failed' | 'needs_recon'

/** `SettlementOrder`. */
export interface SettlementOrder {
  id: string
  walletId: string
  universalUserId?: string
  points: string
  fiatAmount?: string
  reference: string
  status: SettlementStatus
  onusReference?: string
  pointSettleRef?: string
  beneficiaryAccountNumber?: string
  beneficiaryAccountName?: string
  beneficiaryBankCode?: string
  reason?: string
  completedAt?: string | null
}

/** `SettlementRequest`. */
export interface SettlementInput {
  points: string | number
  accountNumber: string
  bankCode: string
  email: string
  accountName?: string
  bankName?: string
  skipNameEnquiry?: boolean
}

export interface PayoutInfo {
  provider?: string
  paymentStatus?: string
  onusReference?: string
  fee?: number
}

/** `POST …/settlements`. */
export interface SettlementResult {
  settlement: SettlementOrder
  payout?: PayoutInfo
}

/** `TransferRequest`. */
export interface TransferInput {
  fromWalletId: string
  toWalletId: string
  points: string | number
  memo?: string
}

/** `POST /wallet/transfers` *(inferred)*. */
export interface WalletTransfer {
  reference: string
  status: string
  fromWalletId: string
  toWalletId: string
  points: string
  memo?: string
  createdAt?: string
}

/** `POST /wallet/qr/generate` *(inferred)* — `reference` is what the payer's app scans. */
export interface QrPaymentToken {
  reference: string
  walletId: string
  points: string
  /** The string to encode in the QR, when the Gateway supplies one; else `reference`. */
  payload: string
  expiresAt?: string
}

/** `POST /wallet/qr/confirm` *(inferred)*. */
export interface QrPayment {
  reference: string
  status: string
  fromWalletId: string
  toWalletId?: string
  points?: string
}

/** `POST …/redeem` *(inferred)*. `needsRecon` is the spec's `202 NEEDS_RECON` outcome. */
export interface RedeemResult {
  reference: string
  status: string
  points: string
  needsRecon: boolean
}

/** `POST /wallet/payouts/name-enquiry` *(inferred)*. */
export interface BankAccountName {
  accountNumber: string
  bankCode: string
  accountName: string
  bankName?: string
}

/** One row of `GET /wallet/transactions` *(inferred)*. */
export interface WalletTransaction {
  id: string
  reference: string
  walletId?: string
  /** e.g. `transfer`, `buy`, `redeem`, `qr_payment`. */
  type: string
  direction: 'credit' | 'debit'
  points: string
  status?: string
  balanceAfter?: string
  memo?: string
  createdAt?: string
}

export interface WalletTransactionFilters {
  walletId?: string
  limit?: number
}

// ── Admin ────────────────────────────────────────────────────────────────────

/** One leg of a double-entry journal *(inferred)* — shared with Point MS. */
export interface LedgerPosting {
  account: string
  direction: 'debit' | 'credit'
  amount: string
}

/** A journal entry with its postings *(inferred)* — `GET /wallet/admin/ledger`, `GET /points/admin/journal`. */
export interface LedgerJournal {
  id: string
  reference: string
  description?: string
  createdAt?: string
  postings: LedgerPosting[]
}

/** `GET /wallet/admin/reconciliation`, `POST /wallet/admin/cutoff/run` *(inferred)*. */
export interface WalletReconSnapshot {
  reference?: string
  runAt?: string
  balanced?: boolean
  ledgerHash?: string
  walletsTotal?: string
  walletCount?: number
}

/** One ledger account in a balances-vs-books proof *(inferred)* — Wallet and Point MS. */
export interface BalanceCheckRow {
  account: string
  balance: string
  books: string
  difference: string
  matches: boolean
}

export interface BalanceCheckPage {
  rows: BalanceCheckRow[]
  nextCursor?: string
}

/** A saga step that needs an operator *(inferred)*: `buy_credit_failed`, `redeem_point_failed`, `settle_reverse_failed`. */
export interface PendingOperation {
  id: string
  opType: string
  status: string
  reference?: string
  walletId?: string
  points?: string
  error?: string
  createdAt?: string
}

export interface PendingOperationFilters {
  status?: string
  cursor?: string
  limit?: number
}

export interface PendingOperationPage {
  items: PendingOperation[]
  nextCursor?: string
}

/** `retry` finishes the forward path; `compensate` undoes it. */
export type ResolveAction = 'retry' | 'compensate'
