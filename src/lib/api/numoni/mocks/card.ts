/* Fixtures for Card MS, built from the spec's examples. */
import type { CardBatchResponseDto, CardDto, CardGetCardLedgerResult, CardGetEnumCatalogResult, CardListMyCardsResult, CardOptInResponseDto, CardTransactionDto, InitiateUnlockResponseDto, ListCardsResponseDto, VerifyUnlockResponseDto } from '../types/card'

export const cardOptInResponse: CardOptInResponseDto = {
  reference: 'COI_18a2f012_ab34',
  universalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  serviceName: 'card-ms',
  isNew: true,
  optedInAt: '2026-10-27T12:00:00.000Z',
}

export const cardBatchResponse: CardBatchResponseDto = {
  batchReference: 'CBT_18a2f012_ab34',
  merchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  scheme: 'CLOSED_LOOP',
  quantity: 10,
  cards: [
    {
      reference: 'CRD_18a2f012_ab34',
      batchReference: 'CBT_18a2f012_ab34',
      merchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
      customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
      customerPhone: '08012345678',
      cardNumber: '5399123456789012',
      serialNumber: 'NUM-CRD-8F3A91B2',
      activationCode: 'A8K2F9',
      qrPayload: 'numoni://card/activate?serial=NUM-CRD-8F3A91B2',
      scheme: 'CLOSED_LOOP',
      status: 'ACTIVE',
      lockStatus: 'FROZEN',
      unlockedUntil: '2026-10-27T12:01:00.000Z',
      balance: 500,
      totalLoaded: 500,
      totalSpent: 0,
      name: 'Gold Customer Loyalty Card',
      activatedAt: '2026-10-27T12:00:00.000Z',
      expiresAt: '2027-12-31T23:59:59.000Z',
      createdAt: '2026-10-27T12:00:00.000Z',
    },
  ],
}

export const listCardsResponse: ListCardsResponseDto = {
  items: [
    {
      reference: 'CRD_18a2f012_ab34',
      batchReference: 'CBT_18a2f012_ab34',
      merchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
      customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
      customerPhone: '08012345678',
      cardNumber: '5399123456789012',
      serialNumber: 'NUM-CRD-8F3A91B2',
      activationCode: 'A8K2F9',
      qrPayload: 'numoni://card/activate?serial=NUM-CRD-8F3A91B2',
      scheme: 'CLOSED_LOOP',
      status: 'ACTIVE',
      lockStatus: 'FROZEN',
      unlockedUntil: '2026-10-27T12:01:00.000Z',
      balance: 500,
      totalLoaded: 500,
      totalSpent: 0,
      name: 'Gold Customer Loyalty Card',
      activatedAt: '2026-10-27T12:00:00.000Z',
      expiresAt: '2027-12-31T23:59:59.000Z',
      createdAt: '2026-10-27T12:00:00.000Z',
    },
  ],
  total: 50,
  page: 1,
  limit: 20,
  summary: {
    totalMinted: 50,
    totalActive: 35,
    totalFrozen: 30,
    totalUnlocked: 5,
    totalRewardBalance: 125000,
  },
}

export const listMyCardsResult: CardListMyCardsResult = [
  {
    reference: 'CRD_18a2f012_ab34',
    batchReference: 'CBT_18a2f012_ab34',
    merchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
    customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
    customerPhone: '08012345678',
    cardNumber: '5399123456789012',
    serialNumber: 'NUM-CRD-8F3A91B2',
    activationCode: 'A8K2F9',
    qrPayload: 'numoni://card/activate?serial=NUM-CRD-8F3A91B2',
    scheme: 'CLOSED_LOOP',
    status: 'ACTIVE',
    lockStatus: 'FROZEN',
    unlockedUntil: '2026-10-27T12:01:00.000Z',
    balance: 500,
    totalLoaded: 500,
    totalSpent: 0,
    name: 'Gold Customer Loyalty Card',
    activatedAt: '2026-10-27T12:00:00.000Z',
    expiresAt: '2027-12-31T23:59:59.000Z',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
]

export const card: CardDto = {
  reference: 'CRD_18a2f012_ab34',
  batchReference: 'CBT_18a2f012_ab34',
  merchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  customerPhone: '08012345678',
  cardNumber: '5399123456789012',
  serialNumber: 'NUM-CRD-8F3A91B2',
  activationCode: 'A8K2F9',
  qrPayload: 'numoni://card/activate?serial=NUM-CRD-8F3A91B2',
  scheme: 'CLOSED_LOOP',
  status: 'ACTIVE',
  lockStatus: 'FROZEN',
  unlockedUntil: '2026-10-27T12:01:00.000Z',
  balance: 500,
  totalLoaded: 500,
  totalSpent: 0,
  name: 'Gold Customer Loyalty Card',
  activatedAt: '2026-10-27T12:00:00.000Z',
  expiresAt: '2027-12-31T23:59:59.000Z',
  createdAt: '2026-10-27T12:00:00.000Z',
}

export const initiateUnlockResponse: InitiateUnlockResponseDto = {
  challengeReference: 'CRL_18a2f012_ab34',
  cardReference: 'CRD_18a2f012_ab34',
  customerPhone: '08012345678',
  expiresAt: '2026-10-27T12:05:00.000Z',
  devOtp: '123456',
}

export const verifyUnlockResponse: VerifyUnlockResponseDto = {
  cardReference: 'CRD_18a2f012_ab34',
  lockStatus: 'UNLOCKED',
  windowSeconds: 60,
  unlockedUntil: '2026-10-27T12:01:00.000Z',
}

export const cardTransaction: CardTransactionDto = {
  reference: 'CTX_18a2f012_ab34',
  cardReference: 'CRD_18a2f012_ab34',
  issuingMerchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  transactingMerchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
  type: 'CARD_CHARGE',
  amount: 250,
  balanceBefore: 500,
  balanceAfter: 250,
  sourceReference: 'ORD_18a2f012_ab34',
  createdAt: '2026-10-27T12:00:00.000Z',
}

export const getCardLedgerResult: CardGetCardLedgerResult = [
  {
    reference: 'CTX_18a2f012_ab34',
    cardReference: 'CRD_18a2f012_ab34',
    issuingMerchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
    transactingMerchantId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
    customerUniversalId: '704f10fb-a60a-4a26-be25-ff6423bdfc57',
    type: 'CARD_CHARGE',
    amount: 250,
    balanceBefore: 500,
    balanceAfter: 250,
    sourceReference: 'ORD_18a2f012_ab34',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
]

export const getEnumCatalogResult: CardGetEnumCatalogResult = {
  cardSchemes: [
    'CLOSED_LOOP',
  ],
  cardStatuses: [
    'MINTED',
  ],
  cardLockStatuses: [
    'UNLOCKED',
  ],
  cardTransactionTypes: [
    'INITIAL_FUNDING',
  ],
  userTypes: [
    'demo-userType',
  ],
  accountStatuses: [
    'demo-accountStatuse',
  ],
  kycStatuses: [
    'demo-kycStatuse',
  ],
}
