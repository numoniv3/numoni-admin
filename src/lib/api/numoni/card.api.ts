import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/card'
import { apiGet, apiSend, cast } from './request'
import type { AllEnumsResponseDto, CardActivateCardBody, CardBatchResponseDto, CardChargeCardBody, CardChargeCardByIdBody, CardDto, CardGetCardLedgerResult, CardGetCardLockStatusesResult, CardGetCardSchemesResult, CardGetCardStatusesResult, CardGetChargeBlockReasonsResult, CardGetTransactionTypesResult, CardGiveCardBody, CardInitiateUnlockBody, CardIssueCardRewardBody, CardListCardsParams, CardListMyCardsResult, CardMintCardsBody, CardOptInBody, CardOptInResponseDto, CardReverseCardTransactionBody, CardSensitiveDetailsDto, CardTransactionDto, CardUpdateCardStatusBody, CardVerifyUnlockBody, InitiateUnlockResponseDto, ListCardsResponseDto, VerifyUnlockResponseDto } from './types/card'

/*
 * Card MS through the Gateway (`/card/*`). Exported from the barrel as
 * `cardApi`: `cardApi.optIn(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.card

/**
 * Opt-in User / Merchant to Card MS
 * Provisions or updates a local user/merchant record keyed by universal user ID (PRD §32 & MICROSERVICE_STANDARDS §3).
 * @endpoint POST /card/opt-in
 */
export function optIn(body: CardOptInBody): Promise<CardOptInResponseDto> {
  return apiSend('POST', E.optIn, body, cast<CardOptInResponseDto>, () => fx.cardOptInResponse)
}

/**
 * Mint Cards (Single or Batch)
 * Merchant-driven creation: Mints 1..N cards mapped to the issuing merchant in MINTED status, unmapped to any customer. Scheme can be CLOSED_LOOP (auto-freezes, usable in own ecosystem) or OPEN_LOOP (usable nationwide on nuMoni).
 * @endpoint POST /card/cards
 */
export function mintCards(body: CardMintCardsBody): Promise<CardBatchResponseDto> {
  return apiSend('POST', E.cards, body, cast<CardBatchResponseDto>, () => fx.cardBatchResponse)
}

/**
 * List Merchant Cards with Filters and Live KPI Summary
 * Lists cards owned by the calling merchant, with filters by scheme, status, lockStatus, batch, customer phone, plus aggregated KPI summary.
 * @endpoint GET /card/cards
 */
export function listCards(params: CardListCardsParams = {}): Promise<ListCardsResponseDto> {
  return apiGet<ListCardsResponseDto>(E.cards, () => fx.listCardsResponse, { ...params })
}

/**
 * List Active Cards for Authenticated Customer
 * Consumer App endpoint: Retrieves all active cards mapped to the authenticated customer across all merchants.
 * @endpoint GET /card/cards/my
 */
export function listMyCards(): Promise<CardListMyCardsResult> {
  return apiGet<CardListMyCardsResult>(E.cardsMy, () => fx.listMyCardsResult)
}

/**
 * Get Card Details by ID, Reference, PAN, or Serial
 * Inspects card details, balance, scheme, and current lock state (lazily reconciling 60-second unlock window if expired).
 * @endpoint GET /card/cards/{id}
 */
export function getCard(id: string): Promise<CardDto> {
  return apiGet<CardDto>(E.card(id), () => fx.card)
}

/**
 * Hand Card to Customer (Merchant Handover)
 * Optional merchant step: Marks a MINTED card as GIVEN_TO_CUSTOMER, optionally binding the intended customer phone number.
 * @endpoint POST /card/cards/{id}/give
 */
export function giveCard(id: string, body: CardGiveCardBody): Promise<CardDto> {
  return apiSend('POST', E.cardGive(id), body, cast<CardDto>, () => fx.card)
}

/**
 * Customer Card Activation
 * Customer activates a card using cardNumber (or serialNumber) + activationCode + customerPhone. Maps card to customer universalId, sets ACTIVE, and auto-freezes CLOSED_LOOP cards.
 * @endpoint POST /card/cards/activate
 */
export function activateCard(body: CardActivateCardBody): Promise<CardDto> {
  return apiSend('POST', E.cardsActivate, body, cast<CardDto>, () => fx.card)
}

/**
 * Issue / Load Reward Inside Card (Strict Issuer Rule & Auto-Freeze)
 * Loads reward value/points into a card. STRICT RULE: Only the issuing merchant (or System Fat JWT from reward-ms / orchestrator) can load rewards. For CLOSED_LOOP cards, this automatically freezes (locks) the card!
 * @endpoint POST /card/cards/{id}/rewards
 */
export function issueCardReward(id: string, body: CardIssueCardRewardBody): Promise<CardDto> {
  return apiSend('POST', E.cardRewards(id), body, cast<CardDto>, () => fx.card)
}

/**
 * Initiate Closed-Loop 60-Second Unlock Challenge
 * Step 1 of paying with a CLOSED_LOOP card at the till. The merchant enters the customer's phone number; an OTP challenge (valid 5 minutes) is created for their active closed-loop card. This is the payment lock (`lockStatus`), not suspension: the card stays `ACTIVE` throughout.
 * @endpoint POST /card/cards/unlock/initiate
 */
export function initiateUnlock(body: CardInitiateUnlockBody): Promise<InitiateUnlockResponseDto> {
  return apiSend('POST', E.cardsUnlockInitiate, body, cast<InitiateUnlockResponseDto>, () => fx.initiateUnlockResponse)
}

/**
 * Verify OTP and Open 60-Second Unlock Window
 * Step 2: the merchant submits the customer's OTP. The card's `lockStatus` becomes UNLOCKED for 60 seconds (`unlockedUntil` = now + 60s), so `POST /cards/charge` can go through. The card re-locks (FROZEN) after the charge or when the window ends.
 * @endpoint POST /card/cards/unlock/verify
 */
export function verifyUnlock(body: CardVerifyUnlockBody): Promise<VerifyUnlockResponseDto> {
  return apiSend('POST', E.cardsUnlockVerify, body, cast<VerifyUnlockResponseDto>, () => fx.verifyUnlockResponse)
}

/**
 * Charge / Redeem from Card (Immediate Re-Lock for Closed-Loop)
 * Redeems reward value from card balance. CLOSED_LOOP: Only issuing merchant, must be actively unlocked within 60s window, immediately re-locks upon charge. OPEN_LOOP: Any merchant in Nigeria, no lock required.
 * @endpoint POST /card/cards/charge
 */
export function chargeCard(body: CardChargeCardBody): Promise<CardTransactionDto> {
  return apiSend('POST', E.cardsCharge, body, cast<CardTransactionDto>, () => fx.cardTransaction)
}

/**
 * Charge / Redeem from Card by Card Reference / ID
 * Charge / Redeem from Card by Card Reference / ID. Needs a signed-in user token.
 * @endpoint POST /card/cards/{id}/charge
 */
export function chargeCardById(id: string, body: CardChargeCardByIdBody): Promise<CardTransactionDto> {
  return apiSend('POST', E.cardCharge(id), body, cast<CardTransactionDto>, () => fx.cardTransaction)
}

/**
 * Reverse a Card Charge Transaction
 * Reverses a previous card charge, restoring balance to the customer card and creating an immutable REVERSAL ledger entry.
 * @endpoint POST /card/cards/transactions/{ref}/reverse
 */
export function reverseCardTransaction(ref: string, body: CardReverseCardTransactionBody): Promise<CardTransactionDto> {
  return apiSend('POST', E.cardsTransactionReverse(ref), body, cast<CardTransactionDto>, () => fx.cardTransaction)
}

/**
 * Suspend / Unsuspend / Cancel a Card (lifecycle status)
 * Changes the card's lifecycle `status` — whether the card is switched on. It does **not** open or close the closed-loop payment lock (that is `POST /cards/unlock/*`).
 * | From | To | Who |
 * |---|---|---|
 * | ACTIVE | SUSPENDED | customer (own card), issuing merchant, admin |
 * | SUSPENDED | ACTIVE | the level that suspended it or higher (see below) |
 * | ACTIVE / SUSPENDED | CANCELLED or EXPIRED (final) | issuing merchant, admin |
 * | MINTED / GIVEN_TO_CUSTOMER | CANCELLED (final) | issuing merchant, admin |
 * **Who can unsuspend.** The card records who suspended it (`suspendedBy`). A customer suspension can be lifted by the customer, the issuing merchant or an admin; a merchant suspension only by the merchant or an admin; an admin suspension only by an admin (otherwise 403). If the merchant or an admin suspends a card the customer already suspended, the card is re-marked with the higher level. Suspensions made before this was recorded (`suspendedBy: null`) can be lifted by anyone allowed to manage the card.
 * Otherwise, sending the card's current status is a no-op. Any other move returns 400 (activation uses `POST /cards/activate`; cancelled and expired cards cannot be revived).
 * For OPEN_LOOP cards, SUSPENDED, CANCELLED and EXPIRED also freeze the card on LedgerBlock, and ACTIVE unfreezes it.
 * @endpoint PATCH /card/cards/{id}/status
 */
export function updateCardStatus(id: string, body: CardUpdateCardStatusBody): Promise<CardDto> {
  return apiSend('PATCH', E.cardStatus(id), body, cast<CardDto>, () => fx.card)
}

/**
 * Get Transaction Ledger History for a Card
 * Get Transaction Ledger History for a Card. Needs a signed-in user token.
 * @endpoint GET /card/cards/{id}/ledger
 */
export function getCardLedger(id: string): Promise<CardGetCardLedgerResult> {
  return apiGet<CardGetCardLedgerResult>(E.cardLedger(id), () => fx.getCardLedgerResult)
}

/**
 * Get Card Sensitive Details (PCI DSS Live Proxy)
 * Allows verified cardholders or issuing merchants to reveal full PAN, CVV, and expiry date. For Open-Loop cards, proxies live to LedgerBlock.
 * @endpoint GET /card/cards/{id}/details
 */
export function getCardDetails(id: string): Promise<CardSensitiveDetailsDto> {
  return apiGet<CardSensitiveDetailsDto>(E.cardDetails(id), () => fx.cardSensitiveDetails)
}

/**
 * Get All Card Microservice Enums
 * Retrieves dictionary of all domain enumerations used across card schemes, statuses, locks, and transactions.
 * @endpoint GET /card/enums
 */
export function getEnumCatalog(): Promise<AllEnumsResponseDto> {
  return apiGet<AllEnumsResponseDto>(E.enums, () => fx.allEnumsResponse)
}

/**
 * Card Schemes (CLOSED_LOOP, OPEN_LOOP)
 * Card Schemes (CLOSED_LOOP, OPEN_LOOP).
 * @endpoint GET /card/enums/card-schemes
 */
export function getCardSchemes(): Promise<CardGetCardSchemesResult> {
  return apiGet<CardGetCardSchemesResult>(E.enumsCardSchemes, () => fx.getCardSchemesResult)
}

/**
 * Card Statuses (lifecycle: is the card switched on?)
 * MINTED → GIVEN_TO_CUSTOMER → ACTIVE ⇄ SUSPENDED; EXPIRED and CANCELLED are final. SUSPENDED = card turned off (PATCH /cards/:id/status). Separate from lock statuses.
 * @endpoint GET /card/enums/card-statuses
 */
export function getCardStatuses(): Promise<CardGetCardStatusesResult> {
  return apiGet<CardGetCardStatusesResult>(E.enumsCardStatuses, () => fx.getCardStatusesResult)
}

/**
 * Card Lock Statuses (payment lock: open for a charge right now?)
 * FROZEN is the normal resting state of an ACTIVE closed-loop card; it opens (UNLOCKED) for 60 seconds after the customer's OTP. Open-loop cards are FROZEN only while suspended. Separate from card statuses; use canCharge / chargeBlockedReason on the card to decide what to show.
 * @endpoint GET /card/enums/card-lock-statuses
 */
export function getCardLockStatuses(): Promise<CardGetCardLockStatusesResult> {
  return apiGet<CardGetCardLockStatusesResult>(E.enumsCardLockStatuses, () => fx.getCardLockStatusesResult)
}

/**
 * Charge Block Reasons (values of chargeBlockedReason)
 * Why a card cannot be charged right now: CARD_NOT_ACTIVATED, CARD_SUSPENDED, CARD_EXPIRED, CARD_CANCELLED, UNLOCK_REQUIRED (closed-loop, needs the customer's OTP; the normal resting state), CARD_FROZEN (open-loop, frozen on the card network).
 * @endpoint GET /card/enums/charge-block-reasons
 */
export function getChargeBlockReasons(): Promise<CardGetChargeBlockReasonsResult> {
  return apiGet<CardGetChargeBlockReasonsResult>(E.enumsChargeBlockReasons, () => fx.getChargeBlockReasonsResult)
}

/**
 * Card Transaction Types
 * Card Transaction Types.
 * @endpoint GET /card/enums/transaction-types
 */
export function getTransactionTypes(): Promise<CardGetTransactionTypesResult> {
  return apiGet<CardGetTransactionTypesResult>(E.enumsTransactionTypes, () => fx.getTransactionTypesResult)
}
