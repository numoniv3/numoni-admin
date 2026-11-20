/*
 * Card MS shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */

/** Request body of `POST /card/opt-in`. */
export type CardOptInBody = CardOptInDto

/** Request body of `POST /card/cards`. */
export type CardMintCardsBody = CreateCardDto

/** Query parameters of `GET /card/cards`. */
export interface CardListCardsParams {
  scheme?: "CLOSED_LOOP" | "OPEN_LOOP"
  status?: "MINTED" | "GIVEN_TO_CUSTOMER" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELLED"
  lockStatus?: "UNLOCKED" | "FROZEN"
  batchReference?: string
  customerUniversalId?: string
  customerPhone?: string
  page?: number
  limit?: number
}

/** Response payload of `GET /card/cards/my`. */
export type CardListMyCardsResult = CardDto[]

/** Request body of `POST /card/cards/{id}/give`. */
export type CardGiveCardBody = GiveCardDto

/** Request body of `POST /card/cards/activate`. */
export type CardActivateCardBody = ActivateCardDto

/** Request body of `POST /card/cards/{id}/rewards`. */
export type CardIssueCardRewardBody = IssueRewardDto

/** Request body of `POST /card/cards/unlock/initiate`. */
export type CardInitiateUnlockBody = InitiateUnlockDto

/** Request body of `POST /card/cards/unlock/verify`. */
export type CardVerifyUnlockBody = VerifyUnlockDto

/** Request body of `POST /card/cards/charge`. */
export type CardChargeCardBody = ChargeCardDto

/** Request body of `POST /card/cards/{id}/charge`. */
export type CardChargeCardByIdBody = ChargeCardDto

/** Request body of `POST /card/cards/transactions/{ref}/reverse`. */
export type CardReverseCardTransactionBody = ReverseTransactionDto

/** Not documented in the spec (no request body is listed) — assumed from "Suspend / Unsuspend". */
export interface CardUpdateCardStatusBody {
  status: "ACTIVE" | "SUSPENDED"
  reason?: string
}

/** Response payload of `GET /card/cards/{id}/ledger`. */
export type CardGetCardLedgerResult = CardTransactionDto[]

/** Response payload of `GET /card/enums`. */
export interface CardGetEnumCatalogResult {
  cardSchemes?: ("CLOSED_LOOP" | "OPEN_LOOP")[]
  cardStatuses?: ("MINTED" | "GIVEN_TO_CUSTOMER" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELLED")[]
  cardLockStatuses?: ("UNLOCKED" | "FROZEN")[]
  cardTransactionTypes?: ("INITIAL_FUNDING" | "REWARD_LOAD" | "CARD_CHARGE" | "REVERSAL")[]
  userTypes?: string[]
  accountStatuses?: string[]
  kycStatuses?: string[]
}

export interface CardOptInDto {
  /** Universal user ID (defaults to JWT userID) */
  universalId?: string
  /** User type (defaults to JWT user_type) */
  userType?: "ADMIN" | "SME_MERCHANT" | "FINTECH_MERCHANT" | "BRAND_MERCHANT" | "RESELLER" | "CUSTOMER" | "SERVICE" | "SYSTEM"
  /** Optional App ID reference */
  appId?: string
}

export interface CardOptInResponseDto {
  reference: string
  universalId: string
  serviceName: string
  isNew: boolean
  optedInAt: string
}

export interface CreateCardDto {
  /**
   * Card scheme: CLOSED_LOOP (usable strictly within issuing merchant ecosystem, auto-freezes) or OPEN_LOOP (usable across any nuMoni merchant in Nigeria, no lock)
   */
  scheme: "CLOSED_LOOP" | "OPEN_LOOP"
  /** Number of cards to mint in this batch (1 to 1000) */
  quantity?: number
  /** Descriptive name or tier for the card batch */
  name?: string
  description?: string
  /** Optional initial reward amount loaded onto each minted card */
  initialRewardAmount?: number
  /** Card expiration date (ISO string) */
  expiryDate?: string
  metadata?: Record<string, unknown>
}

export interface CardBatchResponseDto {
  batchReference: string
  merchantId: string
  scheme: "CLOSED_LOOP" | "OPEN_LOOP"
  quantity: number
  cards: CardDto[]
}

export interface ListCardsResponseDto {
  items: CardDto[]
  total: number
  page: number
  limit: number
  summary: CardKpiSummaryDto
}

export interface CardDto {
  reference: string
  batchReference?: string
  merchantId: string
  customerUniversalId?: string | null
  customerPhone?: string | null
  cardNumber: string
  serialNumber: string
  activationCode?: string | null
  qrPayload?: string
  scheme: "CLOSED_LOOP" | "OPEN_LOOP"
  status: "MINTED" | "GIVEN_TO_CUSTOMER" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "CANCELLED"
  lockStatus: "UNLOCKED" | "FROZEN"
  unlockedUntil?: string | null
  balance: number
  totalLoaded: number
  totalSpent: number
  name?: string
  activatedAt?: string | null
  expiresAt?: string | null
  createdAt: string
}

export interface GiveCardDto {
  /** Intended customer phone number receiving the card */
  customerPhone?: string
  /** Intended customer universal ID (if known) */
  customerUniversalId?: string
  notes?: string
}

export interface ActivateCardDto {
  /** 16-digit card number (either cardNumber or serialNumber required) */
  cardNumber?: string
  /** Human-readable serial number printed on card */
  serialNumber?: string
  /** One-time activation code received with the card */
  activationCode: string
  /** Customer phone number to bind with the card for Till lookups */
  customerPhone: string
}

export interface IssueRewardDto {
  /** Reward amount (points/value) to load into the card */
  amount: number
  /** Source reference (e.g. evaluation ref, campaign ID, or order ref) */
  sourceReference?: string
  reason?: string
  metadata?: Record<string, unknown>
}

export interface InitiateUnlockDto {
  /** Customer phone number holding the Closed-loop card */
  customerPhone: string
  /** Optional card number if customer holds multiple cards */
  cardNumber?: string
  /** Optional codified card reference */
  cardId?: string
}

export interface InitiateUnlockResponseDto {
  challengeReference: string
  cardReference: string
  customerPhone: string
  expiresAt: string
  /** Development OTP code emitted when OTP_DEV_MODE=true */
  devOtp?: string
}

export interface VerifyUnlockDto {
  /** Customer phone number holding the Closed-loop card */
  customerPhone: string
  /** 6-digit OTP code received by the customer */
  code: string
  cardNumber?: string
  cardId?: string
}

export interface VerifyUnlockResponseDto {
  cardReference: string
  lockStatus: "UNLOCKED" | "FROZEN"
  /** Seconds the card remains unlocked for charging */
  windowSeconds: number
  unlockedUntil: string
}

export interface ChargeCardDto {
  /** 16-digit card number to charge */
  cardNumber?: string
  /** Customer phone number (alternative lookup) */
  customerPhone?: string
  /** Amount to charge/redeem from card balance */
  amount: number
  /** Order reference or external payment ID */
  sourceReference?: string
  metadata?: Record<string, unknown>
}

export interface CardTransactionDto {
  reference: string
  cardReference: string
  issuingMerchantId: string
  transactingMerchantId: string
  customerUniversalId?: string | null
  type: "INITIAL_FUNDING" | "REWARD_LOAD" | "CARD_CHARGE" | "REVERSAL"
  amount: number
  balanceBefore: number
  balanceAfter: number
  sourceReference?: string | null
  createdAt: string
}

export interface ReverseTransactionDto {
  reason?: string
}

export interface CardKpiSummaryDto {
  totalMinted: number
  totalActive: number
  totalFrozen: number
  totalUnlocked: number
  totalRewardBalance: number
}
