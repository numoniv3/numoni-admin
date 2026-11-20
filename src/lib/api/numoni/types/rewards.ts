/*
 * Reward MS shapes, proxied by the Gateway (`specs/numoni.json`).
 * Generated from the spec's schemas — regenerate rather than hand-edit shapes.
 */

/** Response payload of `GET /rewards/enums/reward-directions`. */
export type RewardGetRewardDirectionsResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/reward-rule-types`. */
export type RewardGetRewardRuleTypesResult = RewardRuleTypeOptionDto[]

/** Response payload of `GET /rewards/enums/prize-types`. */
export type RewardGetPrizeTypesResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/event-kinds`. */
export type RewardGetEventKindsResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/gamification-triggers`. */
export type RewardGetGamificationTriggersResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/gift-categories`. */
export type RewardGetGiftCategoriesResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/campaign-channels`. */
export type RewardGetCampaignChannelsResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/campaign-statuses`. */
export type RewardGetCampaignStatusesResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/wizard-steps`. */
export type RewardGetWizardStepsResult = WizardStepOptionDto[]

/** Response payload of `GET /rewards/enums/funding-sources`. */
export type RewardGetFundingSourcesResult = EnumOptionDto[]

/** Response payload of `GET /rewards/enums/kyc-tiers`. */
export type RewardGetKycTiersResult = EnumOptionDto[]

/** Request body of `POST /rewards/campaigns`. */
export type RewardCreateCampaignBody = SetupCampaignDto

/** Query parameters of `GET /rewards/campaigns`. */
export interface RewardListCampaignsParams {
  /** Filter by merchant ID (Admin only) */
  merchantId?: string
  status?: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
  wizardStep?: "SETUP_DETAILS" | "AUDIENCE_CHANNELS_SET" | "REWARDS_CONFIGURED" | "BUDGET_SET" | "STARTED"
  /** Search by campaign name or reference */
  search?: string
}

/** Request body of `PATCH /rewards/campaigns/{campaignId}/audience-channels`. */
export type RewardSetCampaignAudienceBody = SetAudienceChannelsDto

/** Request body of `POST /rewards/campaigns/{campaignId}/rewards`. */
export type RewardAddCampaignRewardBody = CreateRewardDto

/** Request body of `PUT /rewards/campaigns/{campaignId}/rewards`. */
export type RewardSetCampaignRewardsBody = BulkSetRewardsDto

/** Response payload of `GET /rewards/campaigns/{campaignId}/rewards`. */
export type RewardListCampaignRewardsResult = RewardResponseDto[]

/** Request body of `PATCH /rewards/campaigns/{campaignId}/budget`. */
export type RewardSetCampaignBudgetBody = SetCampaignBudgetDto

/** Request body of `POST /rewards/campaigns/evaluate`. */
export type RewardEvaluateCampaignsBody = EvaluateCampaignsDto

/** Request body of `POST /rewards/campaigns/evaluations/{reference}/reverse`. */
export type RewardReverseEvaluationBody = ReverseEvaluationDto

/** Request body of `PUT /rewards/admin/guardrails`. */
export type RewardUpdateGuardrailsBody = UpdateGuardrailDto

/** Request body of `PATCH /rewards/admin/campaigns/{campaignId}/override`. */
export type RewardOverrideCampaignBody = AdminCampaignOverrideDto

/** Request body of `POST /rewards/opt-in`. */
export type RewardOptInBody = RewardOptInDto

export interface AllEnumsCatalogDto {
  rewardDirections: EnumOptionDto[]
  rewardRuleTypes: RewardRuleTypeOptionDto[]
  prizeTypes: EnumOptionDto[]
  eventKinds: EnumOptionDto[]
  gamificationTriggers: EnumOptionDto[]
  giftCategories: EnumOptionDto[]
  campaignChannels: EnumOptionDto[]
  campaignStatuses: EnumOptionDto[]
  wizardSteps: WizardStepOptionDto[]
  fundingSources: EnumOptionDto[]
  kycTiers: EnumOptionDto[]
}

export interface EnumOptionDto {
  /** Constant enum value */
  value: string | null
  /** Human-friendly label */
  label: string
  /** Domain explanation */
  description: string
}

export interface RewardRuleTypeOptionDto {
  /** Constant enum value */
  value: string | null
  /** Human-friendly label */
  label: string
  /** Domain explanation */
  description: string
  /** Applicable rule parameter fields for this archetype */
  applicableFields: string[]
}

export interface WizardStepOptionDto {
  /** Constant enum value */
  value: string | null
  /** Human-friendly label */
  label: string
  /** Domain explanation */
  description: string
  /** Step progression sequence (1 to 5) */
  stepNumber: number
  /** Next step in campaign wizard */
  nextStep: "SETUP_DETAILS" | "AUDIENCE_CHANNELS_SET" | "REWARDS_CONFIGURED" | "BUDGET_SET" | "STARTED" | null
}

export interface SetupCampaignDto {
  /** Campaign name */
  name: string
  /** Detailed campaign description */
  description?: string
  channel?: "IN_STORE" | "ONLINE" | "ALL"
  /** Campaign start time (ISO 8601) */
  startDate?: string
  /** Campaign end time (ISO 8601) */
  endDate?: string
}

export interface CampaignResponseDto {
  id: string
  reference: string
  merchantId: string
  name: string
  description?: string | null
  channel: "IN_STORE" | "ONLINE" | "ALL"
  startDate?: string | null
  endDate?: string | null
  wizardStep: "SETUP_DETAILS" | "AUDIENCE_CHANNELS_SET" | "REWARDS_CONFIGURED" | "BUDGET_SET" | "STARTED"
  status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
  startedAt?: string | null
  pausedAt?: string | null
  completedAt?: string | null
  adminApproved: boolean
  targetAudience?: string | null
  targetGeography: string[]
  includedSkus: string[]
  excludedSkus: string[]
  totalBudget: number
  allocatedBudget: number
  spentBudget: number
  dailySpentBudget: number
  remainingBudget: number
  dailyBudgetCap?: number | null
  maxRedemptionsQuota?: number | null
  redemptionsCount: number
  fundingSource: "MERCHANT_WALLET" | "BRAND_POOL" | "NUMONI_MARKETING_BUDGET"
  escrowLocked: boolean
  version: number
  rewards: RewardResponseDto[]
  nextStep: string
  createdAt: string
  updatedAt: string
}

export interface AllCampaignsViewDataDto {
  summary: AllCampaignsKpiSummaryDto
  campaigns: CampaignResponseDto[]
}

export interface SetAudienceChannelsDto {
  channel?: "IN_STORE" | "ONLINE" | "ALL"
  /** Audience segment name or tier */
  targetAudience?: string
  /** Target geographic regions/states */
  targetGeography?: string[]
  /** Eligible product SKU IDs */
  includedSkus?: string[]
  /** Excluded product SKU IDs */
  excludedSkus?: string[]
  /** Permitted merchant IDs */
  merchantWhitelist?: string[]
  /** Prohibited merchant IDs */
  merchantBlacklist?: string[]
}

export interface CreateRewardDto {
  /** Name of this reward tier/cadre */
  name: string
  rewardDirection: "FORWARD_REWARD" | "BACKWARD_REWARD"
  /**
   * Rule that triggers the reward. Only the ruleConfig fields listed for this type apply.
   * 
   * - **FIRST_TIME_CUSTOMERS**: No ruleConfig fields required. Default: awarded on the customer's first completed purchase.
   * - **BY_FREQUENCY**: ruleConfig.frequencyCount (default 1) and ruleConfig.frequencyWindowDays (default 30).
   * - **BY_VALUE**: ruleConfig.valueThreshold (default 0).
   * - **DURATION_OF_PATRONAGE**: ruleConfig.durationDays (default 30).
   * - **REWARD_REFERRAL**: No ruleConfig fields required. Fires only for evaluation events with gamificationTrigger = REFERRAL.
   * - **REWARD_PER_PURCHASE**: No ruleConfig fields required. Fires on every qualifying purchase.
   * - **EVENT**: ruleConfig.eventKind (NEW_YEARS, BIRTHDAY, DATE_BASED, PURCHASE_ANNIVERSARY). ruleConfig.eventDate is optional; when set, the reward applies only on that month and day (UTC).
   * - **BEHAVIOR_GAMIFICATION**: ruleConfig.gamificationTrigger is optional. Omit it to match any trigger.
   * - **REACTIVATION_DORMANCY**: ruleConfig.inactivityDays (default 30).
   * - **INACTIVITY_DEAD_TIME**: At least one of: ruleConfig.inactivityDaysMin / inactivityDaysMax (T1 to T2 days since last purchase), ruleConfig.deadTimeDaysOfWeek, or ruleConfig.deadTimeStartHourUtc together with ruleConfig.deadTimeEndHourUtc. All specified conditions must match.
   */
  ruleType: "FIRST_TIME_CUSTOMERS" | "BY_FREQUENCY" | "BY_VALUE" | "DURATION_OF_PATRONAGE" | "REWARD_REFERRAL" | "REWARD_PER_PURCHASE" | "EVENT" | "BEHAVIOR_GAMIFICATION" | "REACTIVATION_DORMANCY" | "INACTIVITY_DEAD_TIME"
  /**
   * Rule parameters. Read the fields for the chosen ruleType. Missing values fall back to the defaults listed in ruleType.
   */
  ruleConfig?: RewardRuleConfigDto
  /**
   * Prize given when the rule matches. Each prize type needs its own field, enforced with 400 if missing.
   * 
   * - **POINTS**: Enforced: prizeValue must be greater than 0. Drawn from the campaign escrow budget.
   * - **COUPON**: Enforced: couponDetails is required.
   * - **GIFT**: Enforced: giftDetails.name is required. giftDetails.isPhysical is required.
   * - **RAFFLE_DRAW**: Enforced: raffleDetails.ticketCount must be greater than 0.
   */
  prizeType: "POINTS" | "COUPON" | "GIFT" | "RAFFLE_DRAW"
  /** Required and greater than 0 when prizeType = POINTS. Amount is drawn from campaign escrow. */
  prizeValue?: number
  /** Required when prizeType = GIFT (name and isPhysical). */
  giftDetails?: GiftDetailsDto
  /** Required when prizeType = COUPON. */
  couponDetails?: CouponDetailsDto
  /** Required when prizeType = RAFFLE_DRAW (ticketCount greater than 0). */
  raffleDetails?: RaffleDetailsDto
  /** Max times a single customer can earn this reward */
  maxRewardPerUser?: number
  /** Max reward per single transaction */
  maxRewardPerTxn?: number
}

export interface RewardResponseDto {
  id: string
  reference: string
  campaignId: string
  name: string
  rewardDirection: "FORWARD_REWARD" | "BACKWARD_REWARD"
  ruleType: "FIRST_TIME_CUSTOMERS" | "BY_FREQUENCY" | "BY_VALUE" | "DURATION_OF_PATRONAGE" | "REWARD_REFERRAL" | "REWARD_PER_PURCHASE" | "EVENT" | "BEHAVIOR_GAMIFICATION" | "REACTIVATION_DORMANCY" | "INACTIVITY_DEAD_TIME"
  ruleConfig?: RewardRuleConfigDto
  prizeType: "POINTS" | "COUPON" | "GIFT" | "RAFFLE_DRAW"
  prizeValue?: number | null
  giftDetails?: GiftDetailsDto
  couponDetails?: CouponDetailsDto
  raffleDetails?: RaffleDetailsDto
  maxRewardPerUser?: number | null
  maxRewardPerTxn?: number | null
  status: "ACTIVE" | "PAUSED"
  createdAt: string
  updatedAt: string
}

export interface BulkSetRewardsDto {
  /** List of rule-action rewards for this campaign */
  rewards: CreateRewardDto[]
}

export interface UpdateRewardDto {
  /** Name of this reward tier/cadre */
  name: string
  rewardDirection: "FORWARD_REWARD" | "BACKWARD_REWARD"
  /**
   * Rule that triggers the reward. Only the ruleConfig fields listed for this type apply.
   * 
   * - **FIRST_TIME_CUSTOMERS**: No ruleConfig fields required. Default: awarded on the customer's first completed purchase.
   * - **BY_FREQUENCY**: ruleConfig.frequencyCount (default 1) and ruleConfig.frequencyWindowDays (default 30).
   * - **BY_VALUE**: ruleConfig.valueThreshold (default 0).
   * - **DURATION_OF_PATRONAGE**: ruleConfig.durationDays (default 30).
   * - **REWARD_REFERRAL**: No ruleConfig fields required. Fires only for evaluation events with gamificationTrigger = REFERRAL.
   * - **REWARD_PER_PURCHASE**: No ruleConfig fields required. Fires on every qualifying purchase.
   * - **EVENT**: ruleConfig.eventKind (NEW_YEARS, BIRTHDAY, DATE_BASED, PURCHASE_ANNIVERSARY). ruleConfig.eventDate is optional; when set, the reward applies only on that month and day (UTC).
   * - **BEHAVIOR_GAMIFICATION**: ruleConfig.gamificationTrigger is optional. Omit it to match any trigger.
   * - **REACTIVATION_DORMANCY**: ruleConfig.inactivityDays (default 30).
   * - **INACTIVITY_DEAD_TIME**: At least one of: ruleConfig.inactivityDaysMin / inactivityDaysMax (T1 to T2 days since last purchase), ruleConfig.deadTimeDaysOfWeek, or ruleConfig.deadTimeStartHourUtc together with ruleConfig.deadTimeEndHourUtc. All specified conditions must match.
   */
  ruleType: "FIRST_TIME_CUSTOMERS" | "BY_FREQUENCY" | "BY_VALUE" | "DURATION_OF_PATRONAGE" | "REWARD_REFERRAL" | "REWARD_PER_PURCHASE" | "EVENT" | "BEHAVIOR_GAMIFICATION" | "REACTIVATION_DORMANCY" | "INACTIVITY_DEAD_TIME"
  /**
   * Rule parameters. Read the fields for the chosen ruleType. Missing values fall back to the defaults listed in ruleType.
   */
  ruleConfig?: RewardRuleConfigDto
  /**
   * Prize given when the rule matches. Each prize type needs its own field, enforced with 400 if missing.
   * 
   * - **POINTS**: Enforced: prizeValue must be greater than 0. Drawn from the campaign escrow budget.
   * - **COUPON**: Enforced: couponDetails is required.
   * - **GIFT**: Enforced: giftDetails.name is required. giftDetails.isPhysical is required.
   * - **RAFFLE_DRAW**: Enforced: raffleDetails.ticketCount must be greater than 0.
   */
  prizeType: "POINTS" | "COUPON" | "GIFT" | "RAFFLE_DRAW"
  /** Required and greater than 0 when prizeType = POINTS. Amount is drawn from campaign escrow. */
  prizeValue?: number
  /** Required when prizeType = GIFT (name and isPhysical). */
  giftDetails?: GiftDetailsDto
  /** Required when prizeType = COUPON. */
  couponDetails?: CouponDetailsDto
  /** Required when prizeType = RAFFLE_DRAW (ticketCount greater than 0). */
  raffleDetails?: RaffleDetailsDto
  /** Max times a single customer can earn this reward */
  maxRewardPerUser?: number
  /** Max reward per single transaction */
  maxRewardPerTxn?: number
  status?: "ACTIVE" | "PAUSED"
}

export interface RewardApiResponseDto {
  success: boolean
  message: string
  timestamp: string
}

export interface SetCampaignBudgetDto {
  /** Total campaign budget in NGN locked into escrow */
  totalBudget: number
  /** Daily spending limit in NGN (resets at midnight) */
  dailyBudgetCap?: number
  /** Maximum total redemptions allowed across all users */
  maxRedemptionsQuota?: number
  fundingSource?: "MERCHANT_WALLET" | "BRAND_POOL" | "NUMONI_MARKETING_BUDGET"
}

export interface CampaignBudgetResponseDto {
  campaignReference: string
  totalBudget: number
  allocatedBudget: number
  spentBudget: number
  remainingBudget: number
  escrowLocked: boolean
  escrowEntryReference: string
  nextStep: string
}

export interface EvaluateCampaignsDto {
  /** Merchant ID where the transaction or event occurred */
  merchantId: string
  /** Universal user ID of customer */
  customerUniversalId: string
  /** Idempotency transaction reference from Payment/Order MS */
  transactionRef: string
  /** Total purchase amount in NGN */
  transactionAmount: number
  /** List of product SKU IDs purchased */
  skuIds?: string[]
  /** Event date (for birthday / holiday evaluation) */
  eventDate?: string
  gamificationTrigger?: "REFERRAL" | "UGC_SHARING" | "REVIEW" | "PRODUCT_PURCHASE"
}

export interface CampaignEvaluationResponseDto {
  transactionRef: string
  customerUniversalId: string
  merchantId: string
  totalPointsAwarded: number
  results: CampaignEvaluationResultItemDto[]
  evaluatedAt: string
}

export interface ReverseEvaluationDto {
  /** Reason for compensating reversal (e.g. order refund, chargeback) */
  reason: string
}

export interface RewardReversalResponseDto {
  issuanceReference: string
  transactionRef: string
  campaignReference: string
  pointsReversed: number
  budgetRestored: number
  status: "MINTED" | "REVERSED" | "EXPIRED"
  reversedAt: string
}

export interface CampaignLedgerResponseDto {
  campaignReference: string
  totalBudget: number
  spentBudget: number
  remainingBudget: number
  ledger: EscrowLedgerItemDto[]
}

export interface CampaignGuardrailResponseDto {
  key: string
  maxCampaignBudgetCap: number
  maxRewardPercentCap: number
  globalDailyPointQuota: number
  requireApprovalAboveBudget: number
  updatedByUniversalId: string | null
  updatedAt: string
}

export interface UpdateGuardrailDto {
  /** Maximum total budget allowed for any merchant campaign */
  maxCampaignBudgetCap?: number
  /** Maximum reward percent cap */
  maxRewardPercentCap?: number
  /** Platform-wide daily point quota cap */
  globalDailyPointQuota?: number
  /** Budget threshold triggering admin approval requirement */
  requireApprovalAboveBudget?: number
}

export interface AdminCampaignOverrideDto {
  /** Grant admin budget approval */
  adminApproved?: boolean
  status?: "DRAFT" | "SCHEDULED" | "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED"
  /** Override merchant whitelist */
  merchantWhitelist?: string[]
  /** Override merchant blacklist */
  merchantBlacklist?: string[]
}

export interface QueueStatusResponseDto {
  mode: string
  isRedisConnected: boolean
  campaignLifecycle: QueueStatusCountsDto
  rewardEvents: QueueStatusCountsDto
  campaignTimeTriggers: QueueStatusCountsDto
}

export interface QueueSweepResultDto {
  campaignsActivated: number
  campaignsCompleted: number
  escrowReleasedAmount: number
  sweptAt: string
}

export interface CouponSweepResultDto {
  couponsExpired: number
  warningsDispatched: number
  sweptAt: string
}

export interface EngagementSweepResultDto {
  dormantCount: number
  eventCount: number
  sweptAt: string
}

export interface EscrowAuditResultDto {
  campaignsAudited: number
  discrepanciesFound: number
  sweptAt: string
}

export interface ProgressArchivalResultDto {
  recordsArchived: number
  sweptAt: string
}

export interface RaffleDrawResultDto {
  winnerTicket: string | null
  customerUniversalId: string | null
  totalTickets: number
  drawnAt: string
}

export interface RewardOptInDto {
  /** Universal User ID (defaults to JWT subject) */
  universalId?: string
  userType?: "CUSTOMER" | "SME_MERCHANT" | "ENTERPRISE_MERCHANT" | "BRAND_MERCHANT" | "FINTECH_MERCHANT" | "RESELLER" | "ADMIN" | "SERVICE" | "SYSTEM"
  appId?: string
}

export interface OptInResponseDto {
  reference: string
  universalId: string
  serviceName: string
  /** True if newly provisioned in this service */
  isNew: boolean
  optedInAt: string
}

export interface AllCampaignsKpiSummaryDto {
  totalCampaigns: number
  activeCampaigns: number
  scheduledCampaigns: number
  draftCampaigns: number
  completedCampaigns: number
  totalAllocatedBudget: number
  totalSpentBudget: number
  totalRemainingBudget: number
  totalRedemptionsCount: number
}

export interface RewardRuleConfigDto {
  /** BY_FREQUENCY only. Visits or purchases needed inside the window. Default 1. */
  frequencyCount?: number
  /**
   * BY_FREQUENCY only. Rolling window in days. Default 30. When paired with REACTIVATION_DORMANCY it must be longer than inactivityDays.
   */
  frequencyWindowDays?: number
  /** BY_VALUE only. Cumulative spend threshold in NGN. Default 0. */
  valueThreshold?: number
  /** DURATION_OF_PATRONAGE only. Days since the customer's first purchase. Default 30. */
  durationDays?: number
  /** EVENT only. Type of date-based event. */
  eventKind?: "NEW_YEARS" | "BIRTHDAY" | "DATE_BASED" | "PURCHASE_ANNIVERSARY"
  /**
   * EVENT only, optional. When set, the reward applies only on this month and day (UTC). Year is ignored.
   */
  eventDate?: string
  /** BEHAVIOR_GAMIFICATION only, optional. Omit to match any trigger. */
  gamificationTrigger?: "REFERRAL" | "UGC_SHARING" | "REVIEW" | "PRODUCT_PURCHASE"
  /** REACTIVATION_DORMANCY only. Days without a purchase before the reward applies. Default 30. */
  inactivityDays?: number
  /**
   * INACTIVITY_DEAD_TIME only. T1: minimum days since last purchase. Use with inactivityDaysMax or another dead-time condition.
   */
  inactivityDaysMin?: number
  /**
   * INACTIVITY_DEAD_TIME only. T2: maximum days since last purchase. Use with inactivityDaysMin or another dead-time condition.
   */
  inactivityDaysMax?: number
  /** INACTIVITY_DEAD_TIME only. Days of the week the reward applies (UTC). */
  deadTimeDaysOfWeek?: ("MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY")[]
  /** INACTIVITY_DEAD_TIME only. Start hour UTC (0-23). Must be sent together with deadTimeEndHourUtc. */
  deadTimeStartHourUtc?: number
  /** INACTIVITY_DEAD_TIME only. End hour UTC (0-23). Must be sent together with deadTimeStartHourUtc. */
  deadTimeEndHourUtc?: number
  /** Any rule type, optional. Transactions below this amount are skipped for this reward. */
  minSpend?: number
}

export interface GiftDetailsDto {
  /** Whether the gift is a tangible physical item */
  isPhysical: boolean
  /** Gift name */
  name: string
  /** Gift description / specs */
  description?: string
  /** Fulfillment / delivery pickup instructions */
  deliveryInstructions?: string
}

export interface CouponDetailsDto {
  /** Pre-generated coupon code or prefix */
  couponCode?: string
  /** Coupon validity period in days */
  expiryDays?: number
  /** Coupon discount percentage */
  discountPercent?: number
}

export interface RaffleDetailsDto {
  /** Number of raffle tickets awarded */
  ticketCount: number
  /** Prize pool description */
  prizeDescription?: string
}

export interface CampaignEvaluationResultItemDto {
  campaignId: string
  campaignReference: string
  campaignName: string
  rewardId: string
  rewardReference: string
  rewardName: string
  rewardDirection: "FORWARD_REWARD" | "BACKWARD_REWARD"
  ruleType: "FIRST_TIME_CUSTOMERS" | "BY_FREQUENCY" | "BY_VALUE" | "DURATION_OF_PATRONAGE" | "REWARD_REFERRAL" | "REWARD_PER_PURCHASE" | "EVENT" | "BEHAVIOR_GAMIFICATION" | "REACTIVATION_DORMANCY" | "INACTIVITY_DEAD_TIME"
  prizeType: "POINTS" | "COUPON" | "GIFT" | "RAFFLE_DRAW"
  rewardPoints: number
  budgetDeducted: number
  issuedCouponCode?: string | null
  couponExpiresAt?: string | null
  giftDescription?: string | null
  raffleTickets?: number | null
  issuanceReference: string
  status: "MINTED" | "REVERSED" | "EXPIRED"
}

export interface EscrowLedgerItemDto {
  reference: string
  entryType: "LOCK" | "TOP_UP" | "DRAWDOWN" | "REVERSAL_CREDIT" | "RELEASE"
  amount: number
  balanceBefore: number
  balanceAfter: number
  relatedIssuanceRef?: string | null
  actorUniversalId: string
  note?: string | null
  createdAt: string
}

export interface QueueStatusCountsDto {
  waiting: number
  active: number
  delayed: number
  completed: number
  failed: number
}
