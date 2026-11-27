/* Fixtures for Card MS, built from the spec's examples. */
import type { AllEnumsResponseDto, CardBatchResponseDto, CardDto, CardGetCardLedgerResult, CardGetCardLockStatusesResult, CardGetCardSchemesResult, CardGetCardStatusesResult, CardGetChargeBlockReasonsResult, CardGetTransactionTypesResult, CardListMyCardsResult, CardOptInResponseDto, CardSensitiveDetailsDto, CardTransactionDto, InitiateUnlockResponseDto, ListCardsResponseDto, VerifyUnlockResponseDto } from '../types/card'

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
      canCharge: false,
      chargeBlockedReason: 'UNLOCK_REQUIRED',
      suspendedBy: 'MERCHANT',
      suspendedAt: '2026-11-23T09:15:00.000Z',
      balance: 500,
      totalLoaded: 500,
      totalSpent: 0,
      name: 'Gold Customer Loyalty Card',
      activatedAt: '2026-10-27T12:00:00.000Z',
      expiresAt: '2027-12-31T23:59:59.000Z',
      ledgerBlockWalletId: 'CARD:LBWUSD5BB86D90992C41038E1748FFBC9EC576006Z1',
      maskedPan: '5399 **** **** 1234',
      cardExpiry: '12/28',
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
      canCharge: false,
      chargeBlockedReason: 'UNLOCK_REQUIRED',
      suspendedBy: 'MERCHANT',
      suspendedAt: '2026-11-23T09:15:00.000Z',
      balance: 500,
      totalLoaded: 500,
      totalSpent: 0,
      name: 'Gold Customer Loyalty Card',
      activatedAt: '2026-10-27T12:00:00.000Z',
      expiresAt: '2027-12-31T23:59:59.000Z',
      ledgerBlockWalletId: 'CARD:LBWUSD5BB86D90992C41038E1748FFBC9EC576006Z1',
      maskedPan: '5399 **** **** 1234',
      cardExpiry: '12/28',
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
    canCharge: false,
    chargeBlockedReason: 'UNLOCK_REQUIRED',
    suspendedBy: 'MERCHANT',
    suspendedAt: '2026-11-23T09:15:00.000Z',
    balance: 500,
    totalLoaded: 500,
    totalSpent: 0,
    name: 'Gold Customer Loyalty Card',
    activatedAt: '2026-10-27T12:00:00.000Z',
    expiresAt: '2027-12-31T23:59:59.000Z',
    ledgerBlockWalletId: 'CARD:LBWUSD5BB86D90992C41038E1748FFBC9EC576006Z1',
    maskedPan: '5399 **** **** 1234',
    cardExpiry: '12/28',
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
  canCharge: false,
  chargeBlockedReason: 'UNLOCK_REQUIRED',
  suspendedBy: 'MERCHANT',
  suspendedAt: '2026-11-23T09:15:00.000Z',
  balance: 500,
  totalLoaded: 500,
  totalSpent: 0,
  name: 'Gold Customer Loyalty Card',
  activatedAt: '2026-10-27T12:00:00.000Z',
  expiresAt: '2027-12-31T23:59:59.000Z',
  ledgerBlockWalletId: 'CARD:LBWUSD5BB86D90992C41038E1748FFBC9EC576006Z1',
  maskedPan: '5399 **** **** 1234',
  cardExpiry: '12/28',
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

export const cardSensitiveDetails: CardSensitiveDetailsDto = {
  cardReference: 'CRD_18a2f012_ab34',
  cardNumber: '5399123456789012',
  expiry: '12/28',
  cvv: '123',
  cardHolderName: 'Daud Olarewaju',
  status: 'ACTIVE',
  currency: 'NGN',
}

export const allEnumsResponse: AllEnumsResponseDto = {
  cardSchemes: [
    'CLOSED_LOOP',
    'OPEN_LOOP',
  ],
  cardStatuses: [
    'MINTED',
    'GIVEN_TO_CUSTOMER',
    'ACTIVE',
    'SUSPENDED',
    'EXPIRED',
    'CANCELLED',
  ],
  cardLockStatuses: [
    'UNLOCKED',
    'FROZEN',
  ],
  cardChargeBlockReasons: [
    'CARD_NOT_ACTIVATED',
    'CARD_SUSPENDED',
    'CARD_EXPIRED',
    'CARD_CANCELLED',
    'UNLOCK_REQUIRED',
    'CARD_FROZEN',
  ],
  cardTransactionTypes: [
    'INITIAL_FUNDING',
    'REWARD_LOAD',
    'CARD_CHARGE',
    'REVERSAL',
  ],
  userTypes: [
    'ADMIN',
    'SME_MERCHANT',
    'FINTECH_MERCHANT',
    'BRAND_MERCHANT',
    'RESELLER',
    'CUSTOMER',
    'SERVICE',
    'SYSTEM',
  ],
  accountStatuses: [
    'ACTIVE',
    'SUSPENDED',
    'CLOSED',
  ],
  kycStatuses: [
    'T0',
    'T1',
    'T2',
    'T3',
  ],
}

export const getCardSchemesResult: CardGetCardSchemesResult = [
  'ITEM_1',
  'ITEM_2',
]

export const getCardStatusesResult: CardGetCardStatusesResult = [
  'ITEM_1',
  'ITEM_2',
]

export const getCardLockStatusesResult: CardGetCardLockStatusesResult = [
  'ITEM_1',
  'ITEM_2',
]

export const getChargeBlockReasonsResult: CardGetChargeBlockReasonsResult = [
  'ITEM_1',
  'ITEM_2',
]

export const getTransactionTypesResult: CardGetTransactionTypesResult = [
  'ITEM_1',
  'ITEM_2',
]
