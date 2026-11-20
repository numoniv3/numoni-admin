/* Fixtures for Reward MS, built from the spec's examples. */
import type { AllCampaignsViewDataDto, AllEnumsCatalogDto, CampaignBudgetResponseDto, CampaignEvaluationResponseDto, CampaignGuardrailResponseDto, CampaignLedgerResponseDto, CampaignResponseDto, CouponSweepResultDto, EngagementSweepResultDto, EscrowAuditResultDto, OptInResponseDto, ProgressArchivalResultDto, QueueStatusResponseDto, QueueSweepResultDto, RaffleDrawResultDto, RewardApiResponseDto, RewardGetCampaignChannelsResult, RewardGetCampaignStatusesResult, RewardGetEventKindsResult, RewardGetFundingSourcesResult, RewardGetGamificationTriggersResult, RewardGetGiftCategoriesResult, RewardGetKycTiersResult, RewardGetPrizeTypesResult, RewardGetRewardDirectionsResult, RewardGetRewardRuleTypesResult, RewardGetWizardStepsResult, RewardListCampaignRewardsResult, RewardResponseDto, RewardReversalResponseDto } from '../types/rewards'

export const allEnumsCatalog: AllEnumsCatalogDto = {
  rewardDirections: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  rewardRuleTypes: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
      applicableFields: [
        'frequencyCount',
        'frequencyWindowDays',
      ],
    },
  ],
  prizeTypes: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  eventKinds: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  gamificationTriggers: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  giftCategories: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  campaignChannels: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  campaignStatuses: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  wizardSteps: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
      stepNumber: 1,
      nextStep: 'AUDIENCE_CHANNELS_SET',
    },
  ],
  fundingSources: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
  kycTiers: [
    {
      value: 'POINTS',
      label: 'Points',
      description: 'Award loyalty points into customer wallet',
    },
  ],
}

export const getRewardDirectionsResult: RewardGetRewardDirectionsResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getRewardRuleTypesResult: RewardGetRewardRuleTypesResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
    applicableFields: [
      'frequencyCount',
      'frequencyWindowDays',
    ],
  },
]

export const getPrizeTypesResult: RewardGetPrizeTypesResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getEventKindsResult: RewardGetEventKindsResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getGamificationTriggersResult: RewardGetGamificationTriggersResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getGiftCategoriesResult: RewardGetGiftCategoriesResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getCampaignChannelsResult: RewardGetCampaignChannelsResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getCampaignStatusesResult: RewardGetCampaignStatusesResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getWizardStepsResult: RewardGetWizardStepsResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
    stepNumber: 1,
    nextStep: 'AUDIENCE_CHANNELS_SET',
  },
]

export const getFundingSourcesResult: RewardGetFundingSourcesResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const getKycTiersResult: RewardGetKycTiersResult = [
  {
    value: 'POINTS',
    label: 'Points',
    description: 'Award loyalty points into customer wallet',
  },
]

export const campaignResponse: CampaignResponseDto = {
  id: 'cmp_123',
  reference: 'CMP_KM4D82_A8B3C4D5',
  merchantId: 'MERCH_001',
  name: 'Weekend Shopping Surge',
  description: 'Special weekend incentives for repeat shoppers',
  channel: 'ALL',
  startDate: '2026-11-01T00:00:00.000Z',
  endDate: '2026-11-30T23:59:59.000Z',
  wizardStep: 'SETUP_DETAILS',
  status: 'DRAFT',
  startedAt: '2026-11-01T00:00:00.000Z',
  pausedAt: null,
  completedAt: null,
  adminApproved: false,
  targetAudience: 'ALL',
  targetGeography: [
    'Lagos',
  ],
  includedSkus: [
    'SKU-COCA-COLA-500ML',
  ],
  excludedSkus: [],
  totalBudget: 100000,
  allocatedBudget: 100000,
  spentBudget: 0,
  dailySpentBudget: 0,
  remainingBudget: 100000,
  dailyBudgetCap: 10000,
  maxRedemptionsQuota: 1000,
  redemptionsCount: 0,
  fundingSource: 'MERCHANT_WALLET',
  escrowLocked: true,
  version: 1,
  rewards: [
    {
      id: 'rwd_123',
      reference: 'RWD_KM4D82_A8B3C4D5',
      campaignId: 'cmp_123',
      name: '3rd Visit Milestone: 500 Points',
      rewardDirection: 'BACKWARD_REWARD',
      ruleType: 'BY_FREQUENCY',
      ruleConfig: {
        frequencyCount: 3,
        frequencyWindowDays: 30,
        valueThreshold: 10000,
        durationDays: 60,
        eventKind: 'BIRTHDAY',
        eventDate: '2026-12-25T00:00:00.000Z',
        gamificationTrigger: 'REVIEW',
        inactivityDays: 45,
        inactivityDaysMin: 7,
        inactivityDaysMax: 14,
        deadTimeDaysOfWeek: [
          'TUESDAY',
          'WEDNESDAY',
        ],
        deadTimeStartHourUtc: 14,
        deadTimeEndHourUtc: 17,
        minSpend: 2000,
      },
      prizeType: 'POINTS',
      prizeValue: 500,
      giftDetails: {
        isPhysical: true,
        name: 'Branded T-Shirt',
        description: 'Size L, 100% cotton',
        deliveryInstructions: 'Collect at store counter with receipt',
      },
      couponDetails: {
        couponCode: 'SAVE20',
        expiryDays: 14,
        discountPercent: 20,
      },
      raffleDetails: {
        ticketCount: 1,
        prizeDescription: 'Win a brand new generator in our end-of-year draw',
      },
      maxRewardPerUser: 5,
      maxRewardPerTxn: 1000,
      status: 'ACTIVE',
      createdAt: '2026-10-20T11:00:00.000Z',
      updatedAt: '2026-10-20T11:00:00.000Z',
    },
  ],
  nextStep: 'SET_AUDIENCE_CHANNELS',
  createdAt: '2026-10-20T11:00:00.000Z',
  updatedAt: '2026-10-20T11:00:00.000Z',
}

export const allCampaignsViewData: AllCampaignsViewDataDto = {
  summary: {
    totalCampaigns: 10,
    activeCampaigns: 4,
    scheduledCampaigns: 2,
    draftCampaigns: 3,
    completedCampaigns: 1,
    totalAllocatedBudget: 500000,
    totalSpentBudget: 120000,
    totalRemainingBudget: 380000,
    totalRedemptionsCount: 450,
  },
  campaigns: [
    {
      id: 'cmp_123',
      reference: 'CMP_KM4D82_A8B3C4D5',
      merchantId: 'MERCH_001',
      name: 'Weekend Shopping Surge',
      description: 'Special weekend incentives for repeat shoppers',
      channel: 'ALL',
      startDate: '2026-11-01T00:00:00.000Z',
      endDate: '2026-11-30T23:59:59.000Z',
      wizardStep: 'SETUP_DETAILS',
      status: 'DRAFT',
      startedAt: '2026-11-01T00:00:00.000Z',
      pausedAt: null,
      completedAt: null,
      adminApproved: false,
      targetAudience: 'ALL',
      targetGeography: [
        'Lagos',
      ],
      includedSkus: [
        'SKU-COCA-COLA-500ML',
      ],
      excludedSkus: [],
      totalBudget: 100000,
      allocatedBudget: 100000,
      spentBudget: 0,
      dailySpentBudget: 0,
      remainingBudget: 100000,
      dailyBudgetCap: 10000,
      maxRedemptionsQuota: 1000,
      redemptionsCount: 0,
      fundingSource: 'MERCHANT_WALLET',
      escrowLocked: true,
      version: 1,
      rewards: [
        {
          id: 'rwd_123',
          reference: 'RWD_KM4D82_A8B3C4D5',
          campaignId: 'cmp_123',
          name: '3rd Visit Milestone: 500 Points',
          rewardDirection: 'BACKWARD_REWARD',
          ruleType: 'BY_FREQUENCY',
          ruleConfig: {
            frequencyCount: 3,
            frequencyWindowDays: 30,
            valueThreshold: 10000,
            durationDays: 60,
            eventKind: 'BIRTHDAY',
            eventDate: '2026-12-25T00:00:00.000Z',
            gamificationTrigger: 'REVIEW',
            inactivityDays: 45,
            inactivityDaysMin: 7,
            inactivityDaysMax: 14,
            deadTimeDaysOfWeek: [
              'TUESDAY',
              'WEDNESDAY',
            ],
            deadTimeStartHourUtc: 14,
            deadTimeEndHourUtc: 17,
            minSpend: 2000,
          },
          prizeType: 'POINTS',
          prizeValue: 500,
          giftDetails: {
            isPhysical: true,
            name: 'Branded T-Shirt',
            description: 'Size L, 100% cotton',
            deliveryInstructions: 'Collect at store counter with receipt',
          },
          couponDetails: {
            couponCode: 'SAVE20',
            expiryDays: 14,
            discountPercent: 20,
          },
          raffleDetails: {
            ticketCount: 1,
            prizeDescription: 'Win a brand new generator in our end-of-year draw',
          },
          maxRewardPerUser: 5,
          maxRewardPerTxn: 1000,
          status: 'ACTIVE',
          createdAt: '2026-10-20T11:00:00.000Z',
          updatedAt: '2026-10-20T11:00:00.000Z',
        },
      ],
      nextStep: 'SET_AUDIENCE_CHANNELS',
      createdAt: '2026-10-20T11:00:00.000Z',
      updatedAt: '2026-10-20T11:00:00.000Z',
    },
  ],
}

export const rewardResponse: RewardResponseDto = {
  id: 'rwd_123',
  reference: 'RWD_KM4D82_A8B3C4D5',
  campaignId: 'cmp_123',
  name: '3rd Visit Milestone: 500 Points',
  rewardDirection: 'BACKWARD_REWARD',
  ruleType: 'BY_FREQUENCY',
  ruleConfig: {
    frequencyCount: 3,
    frequencyWindowDays: 30,
    valueThreshold: 10000,
    durationDays: 60,
    eventKind: 'BIRTHDAY',
    eventDate: '2026-12-25T00:00:00.000Z',
    gamificationTrigger: 'REVIEW',
    inactivityDays: 45,
    inactivityDaysMin: 7,
    inactivityDaysMax: 14,
    deadTimeDaysOfWeek: [
      'TUESDAY',
      'WEDNESDAY',
    ],
    deadTimeStartHourUtc: 14,
    deadTimeEndHourUtc: 17,
    minSpend: 2000,
  },
  prizeType: 'POINTS',
  prizeValue: 500,
  giftDetails: {
    isPhysical: true,
    name: 'Branded T-Shirt',
    description: 'Size L, 100% cotton',
    deliveryInstructions: 'Collect at store counter with receipt',
  },
  couponDetails: {
    couponCode: 'SAVE20',
    expiryDays: 14,
    discountPercent: 20,
  },
  raffleDetails: {
    ticketCount: 1,
    prizeDescription: 'Win a brand new generator in our end-of-year draw',
  },
  maxRewardPerUser: 5,
  maxRewardPerTxn: 1000,
  status: 'ACTIVE',
  createdAt: '2026-10-20T11:00:00.000Z',
  updatedAt: '2026-10-20T11:00:00.000Z',
}

export const listCampaignRewardsResult: RewardListCampaignRewardsResult = [
  {
    id: 'rwd_123',
    reference: 'RWD_KM4D82_A8B3C4D5',
    campaignId: 'cmp_123',
    name: '3rd Visit Milestone: 500 Points',
    rewardDirection: 'BACKWARD_REWARD',
    ruleType: 'BY_FREQUENCY',
    ruleConfig: {
      frequencyCount: 3,
      frequencyWindowDays: 30,
      valueThreshold: 10000,
      durationDays: 60,
      eventKind: 'BIRTHDAY',
      eventDate: '2026-12-25T00:00:00.000Z',
      gamificationTrigger: 'REVIEW',
      inactivityDays: 45,
      inactivityDaysMin: 7,
      inactivityDaysMax: 14,
      deadTimeDaysOfWeek: [
        'TUESDAY',
        'WEDNESDAY',
      ],
      deadTimeStartHourUtc: 14,
      deadTimeEndHourUtc: 17,
      minSpend: 2000,
    },
    prizeType: 'POINTS',
    prizeValue: 500,
    giftDetails: {
      isPhysical: true,
      name: 'Branded T-Shirt',
      description: 'Size L, 100% cotton',
      deliveryInstructions: 'Collect at store counter with receipt',
    },
    couponDetails: {
      couponCode: 'SAVE20',
      expiryDays: 14,
      discountPercent: 20,
    },
    raffleDetails: {
      ticketCount: 1,
      prizeDescription: 'Win a brand new generator in our end-of-year draw',
    },
    maxRewardPerUser: 5,
    maxRewardPerTxn: 1000,
    status: 'ACTIVE',
    createdAt: '2026-10-20T11:00:00.000Z',
    updatedAt: '2026-10-20T11:00:00.000Z',
  },
]

export const rewardApiResponse: RewardApiResponseDto = {
  success: true,
  message: 'Operation completed successfully',
  timestamp: '2026-10-20T09:00:00.000Z',
}

export const campaignBudgetResponse: CampaignBudgetResponseDto = {
  campaignReference: 'CMP_KM4D82_A8B3C4D5',
  totalBudget: 100000,
  allocatedBudget: 100000,
  spentBudget: 0,
  remainingBudget: 100000,
  escrowLocked: true,
  escrowEntryReference: 'ESC_KM4D82_E7F8A1B2',
  nextStep: 'START_CAMPAIGN',
}

export const campaignEvaluationResponse: CampaignEvaluationResponseDto = {
  transactionRef: 'TXN_20261020_001',
  customerUniversalId: 'USR_CUST_12345',
  merchantId: 'MERCH_001',
  totalPointsAwarded: 500,
  results: [
    {
      campaignId: 'cmp_123',
      campaignReference: 'CMP_KM4D82_A8B3C4D5',
      campaignName: 'Weekend Shopping Surge',
      rewardId: 'rwd_456',
      rewardReference: 'RWD_KM4D82_E7F8A1B2',
      rewardName: '3rd Visit Milestone: 500 Points',
      rewardDirection: 'BACKWARD_REWARD',
      ruleType: 'BY_FREQUENCY',
      prizeType: 'POINTS',
      rewardPoints: 500,
      budgetDeducted: 500,
      issuedCouponCode: 'SAVE20',
      couponExpiresAt: '2026-11-20T00:00:00.000Z',
      giftDescription: 'Branded T-Shirt',
      raffleTickets: 1,
      issuanceReference: 'POR_KM4D82_12345678',
      status: 'MINTED',
    },
  ],
  evaluatedAt: '2026-10-20T11:00:00.000Z',
}

export const rewardReversalResponse: RewardReversalResponseDto = {
  issuanceReference: 'POR_KM4D82_12345678',
  transactionRef: 'TXN_20261020_001',
  campaignReference: 'CMP_KM4D82_A8B3C4D5',
  pointsReversed: 500,
  budgetRestored: 500,
  status: 'REVERSED',
  reversedAt: '2026-10-20T11:15:00.000Z',
}

export const campaignLedgerResponse: CampaignLedgerResponseDto = {
  campaignReference: 'CMP_KM4D82_A8B3C4D5',
  totalBudget: 100000,
  spentBudget: 500,
  remainingBudget: 99500,
  ledger: [
    {
      reference: 'ESC_KM4D82_12345678',
      entryType: 'DRAWDOWN',
      amount: 500,
      balanceBefore: 100000,
      balanceAfter: 99500,
      relatedIssuanceRef: 'POR_KM4D82_12345678',
      actorUniversalId: 'USR_MERCH_001',
      note: 'Drawdown for reward issuance',
      createdAt: '2026-10-20T11:00:00.000Z',
    },
  ],
}

export const campaignGuardrailResponse: CampaignGuardrailResponseDto = {
  key: 'GLOBAL',
  maxCampaignBudgetCap: 5000000,
  maxRewardPercentCap: 100,
  globalDailyPointQuota: 10000000,
  requireApprovalAboveBudget: 1000000,
  updatedByUniversalId: 'USR_ADMIN_001',
  updatedAt: '2026-10-20T09:00:00.000Z',
}

export const queueStatusResponse: QueueStatusResponseDto = {
  mode: 'bullmq-redis',
  isRedisConnected: true,
  campaignLifecycle: {
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 0,
    failed: 0,
  },
  rewardEvents: {
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 0,
    failed: 0,
  },
  campaignTimeTriggers: {
    waiting: 0,
    active: 0,
    delayed: 0,
    completed: 0,
    failed: 0,
  },
}

export const queueSweepResult: QueueSweepResultDto = {
  campaignsActivated: 2,
  campaignsCompleted: 1,
  escrowReleasedAmount: 5000,
  sweptAt: '2026-10-20T09:00:00.000Z',
}

export const couponSweepResult: CouponSweepResultDto = {
  couponsExpired: 3,
  warningsDispatched: 12,
  sweptAt: '2026-10-20T09:00:00.000Z',
}

export const engagementSweepResult: EngagementSweepResultDto = {
  dormantCount: 15,
  eventCount: 4,
  sweptAt: '2026-10-20T09:00:00.000Z',
}

export const escrowAuditResult: EscrowAuditResultDto = {
  campaignsAudited: 25,
  discrepanciesFound: 0,
  sweptAt: '2026-10-20T09:00:00.000Z',
}

export const progressArchivalResult: ProgressArchivalResultDto = {
  recordsArchived: 140,
  sweptAt: '2026-10-20T09:00:00.000Z',
}

export const raffleDrawResult: RaffleDrawResultDto = {
  winnerTicket: 'POR_RAFFLE_WIN_001',
  customerUniversalId: 'USR_CUST_123',
  totalTickets: 245,
  drawnAt: '2026-10-20T09:00:00.000Z',
}

export const optInResponse: OptInResponseDto = {
  reference: 'OPT_M123_4A5B6C7D',
  universalId: 'USR_CALLER_123',
  serviceName: 'reward-ms',
  isNew: true,
  optedInAt: '2026-10-20T09:00:00.000Z',
}
