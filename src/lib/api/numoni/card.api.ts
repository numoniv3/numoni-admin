import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/card'
import { apiGet, apiSend, cast } from './request'
import type { CardActivateCardBody, CardBatchResponseDto, CardChargeCardBody, CardChargeCardByIdBody, CardDto, CardGetCardLedgerResult, CardGetEnumCatalogResult, CardGiveCardBody, CardInitiateUnlockBody, CardIssueCardRewardBody, CardListCardsParams, CardListMyCardsResult, CardMintCardsBody, CardOptInBody, CardOptInResponseDto, CardReverseCardTransactionBody, CardTransactionDto, CardUpdateCardStatusBody, CardVerifyUnlockBody, InitiateUnlockResponseDto, ListCardsResponseDto, VerifyUnlockResponseDto } from './types/card'

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
 * Merchant enters customer phone number to verify their active closed-loop card and triggers a verification OTP challenge.
 * @endpoint POST /card/cards/unlock/initiate
 */
export function initiateUnlock(body: CardInitiateUnlockBody): Promise<InitiateUnlockResponseDto> {
  return apiSend('POST', E.cardsUnlockInitiate, body, cast<InitiateUnlockResponseDto>, () => fx.initiateUnlockResponse)
}

/**
 * Verify OTP and Open 60-Second Unlock Window
 * Merchant verifies customer phone + OTP. Unlocks the card for exactly 60 seconds (unlockedUntil = now + 60s) allowing it to be charged.
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
 * Update Card Status (Suspend / Unsuspend)
 * Update Card Status (Suspend / Unsuspend). Needs a signed-in user token.
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
 * Get All Card Microservice Enums
 * Get All Card Microservice Enums.
 * @endpoint GET /card/enums
 */
export function getEnumCatalog(): Promise<CardGetEnumCatalogResult> {
  return apiGet<CardGetEnumCatalogResult>(E.enums, () => fx.getEnumCatalogResult)
}

/**
 * Card Schemes (CLOSED_LOOP, OPEN_LOOP)
 * Card Schemes (CLOSED_LOOP, OPEN_LOOP).
 * The spec leaves the response untyped.
 * @endpoint GET /card/enums/card-schemes
 */
export function getCardSchemes(): Promise<unknown> {
  return apiGet<unknown>(E.enumsCardSchemes, () => ({}))
}

/**
 * Card Statuses
 * Card Statuses.
 * The spec leaves the response untyped.
 * @endpoint GET /card/enums/card-statuses
 */
export function getCardStatuses(): Promise<unknown> {
  return apiGet<unknown>(E.enumsCardStatuses, () => ({}))
}

/**
 * Card Lock Statuses (UNLOCKED, FROZEN)
 * Card Lock Statuses (UNLOCKED, FROZEN).
 * The spec leaves the response untyped.
 * @endpoint GET /card/enums/card-lock-statuses
 */
export function getCardLockStatuses(): Promise<unknown> {
  return apiGet<unknown>(E.enumsCardLockStatuses, () => ({}))
}

/**
 * Card Transaction Types
 * Card Transaction Types.
 * The spec leaves the response untyped.
 * @endpoint GET /card/enums/transaction-types
 */
export function getTransactionTypes(): Promise<unknown> {
  return apiGet<unknown>(E.enumsTransactionTypes, () => ({}))
}
