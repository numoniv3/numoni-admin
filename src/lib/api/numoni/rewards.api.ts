import { NUMONI_ENDPOINTS } from './endpoints'
import * as fx from './mocks/rewards'
import { apiGet, apiSend, cast } from './request'
import type { AllCampaignsViewDataDto, AllEnumsCatalogDto, CampaignBudgetResponseDto, CampaignEvaluationResponseDto, CampaignGuardrailResponseDto, CampaignLedgerResponseDto, CampaignResponseDto, CouponSweepResultDto, DeleteRewardTemplateResultDto, EngagementSweepResultDto, EscrowAuditResultDto, OptInResponseDto, ProgressArchivalResultDto, QueueStatusResponseDto, QueueSweepResultDto, RaffleDrawResultDto, ReplayOutboxResultDto, RewardAddCampaignRewardBody, RewardApiResponseDto, RewardCreateCampaignBody, RewardCreateRewardTemplateBody, RewardEvaluateCampaignsBody, RewardGetCampaignChannelsResult, RewardGetCampaignStatusesResult, RewardGetEventKindsResult, RewardGetFundingSourcesResult, RewardGetGamificationTriggersResult, RewardGetGiftCategoriesResult, RewardGetKycTiersResult, RewardGetPrizeTypesResult, RewardGetRewardDirectionsResult, RewardGetRewardRuleTypesResult, RewardGetWizardStepsResult, RewardLinkRewardTemplateBody, RewardListCampaignRewardsResult, RewardListCampaignsParams, RewardListRewardTemplatesParams, RewardListRewardTemplatesResult, RewardOptInBody, RewardOverrideCampaignBody, RewardReplayOutboxBody, RewardResponseDto, RewardReversalResponseDto, RewardReverseEvaluationBody, RewardSetCampaignAudienceBody, RewardSetCampaignBudgetBody, RewardSetCampaignRewardsBody, RewardSyncRewardTemplateBody, RewardTemplateResponseDto, RewardUpdateGuardrailsBody, UpdateRewardDto, UpdateRewardTemplateDto } from './types/rewards'

/*
 * Reward MS through the Gateway (`/rewards/*`). Exported from the barrel as
 * `rewardsApi`: `rewardsApi.getEnumCatalog(…)`.
 * Reads go through `apiGet` (fixture while mocked); writes through `apiSend`.
 */

const E = NUMONI_ENDPOINTS.rewards

/**
 * Get all enum catalogs and metadata options in a single call
 * Returns every Reward MS dropdown list (rule types, prize types, channels, statuses, tiers) in one call.
 * @endpoint GET /rewards/enums
 */
export function getEnumCatalog(): Promise<AllEnumsCatalogDto> {
  return apiGet<AllEnumsCatalogDto>(E.enums, () => fx.allEnumsCatalog)
}

/**
 * Get Reward Direction options (Forward Reward, Backward Reward)
 * Lists reward directions: forward (reward after a purchase) and backward (reward for past behaviour).
 * @endpoint GET /rewards/enums/reward-directions
 */
export function getRewardDirections(): Promise<RewardGetRewardDirectionsResult> {
  return apiGet<RewardGetRewardDirectionsResult>(E.enumsRewardDirections, () => fx.getRewardDirectionsResult)
}

/**
 * Get all 10 Figma Reward Archetype Rule Types
 * Lists the reward rule types a campaign reward can use (first-time, frequency, value, duration, event and more).
 * @endpoint GET /rewards/enums/reward-rule-types
 */
export function getRewardRuleTypes(): Promise<RewardGetRewardRuleTypesResult> {
  return apiGet<RewardGetRewardRuleTypesResult>(E.enumsRewardRuleTypes, () => fx.getRewardRuleTypesResult)
}

/**
 * Get Prize Type options (Points, Coupon, Gift, Raffle Draw)
 * Lists what a reward can give: points, coupon, gift or raffle draw.
 * @endpoint GET /rewards/enums/prize-types
 */
export function getPrizeTypes(): Promise<RewardGetPrizeTypesResult> {
  return apiGet<RewardGetPrizeTypesResult>(E.enumsPrizeTypes, () => fx.getPrizeTypesResult)
}

/**
 * Get Event Kind options (New Years, Birthday, Date-based, Purchase Anniversary)
 * Lists event kinds for event-based rewards (New Year, birthday, fixed date, purchase anniversary).
 * @endpoint GET /rewards/enums/event-kinds
 */
export function getEventKinds(): Promise<RewardGetEventKindsResult> {
  return apiGet<RewardGetEventKindsResult>(E.enumsEventKinds, () => fx.getEventKindsResult)
}

/**
 * Get Gamification Trigger options (Referral, UGC Sharing, Review, Product Purchase)
 * Lists actions that can trigger a gamified reward (referral, sharing, review, product purchase).
 * @endpoint GET /rewards/enums/gamification-triggers
 */
export function getGamificationTriggers(): Promise<RewardGetGamificationTriggersResult> {
  return apiGet<RewardGetGamificationTriggersResult>(E.enumsGamificationTriggers, () => fx.getGamificationTriggersResult)
}

/**
 * Get Gift Category options (Physical, Digital)
 * Lists gift categories: physical or digital.
 * @endpoint GET /rewards/enums/gift-categories
 */
export function getGiftCategories(): Promise<RewardGetGiftCategoriesResult> {
  return apiGet<RewardGetGiftCategoriesResult>(E.enumsGiftCategories, () => fx.getGiftCategoriesResult)
}

/**
 * Get Campaign Channel options (In-Store, Online, All)
 * Lists the channels a campaign can run on: in-store, online or all.
 * @endpoint GET /rewards/enums/campaign-channels
 */
export function getCampaignChannels(): Promise<RewardGetCampaignChannelsResult> {
  return apiGet<RewardGetCampaignChannelsResult>(E.enumsCampaignChannels, () => fx.getCampaignChannelsResult)
}

/**
 * Get Campaign Status options
 * Lists every campaign status (for example draft, scheduled, active, paused, completed).
 * @endpoint GET /rewards/enums/campaign-statuses
 */
export function getCampaignStatuses(): Promise<RewardGetCampaignStatusesResult> {
  return apiGet<RewardGetCampaignStatusesResult>(E.enumsCampaignStatuses, () => fx.getCampaignStatusesResult)
}

/**
 * Get 5-Step Campaign Creation Wizard step details and sequence
 * Returns the five campaign wizard steps in order, so the UI can render progress.
 * @endpoint GET /rewards/enums/wizard-steps
 */
export function getWizardSteps(): Promise<RewardGetWizardStepsResult> {
  return apiGet<RewardGetWizardStepsResult>(E.enumsWizardSteps, () => fx.getWizardStepsResult)
}

/**
 * Get Funding Source options
 * Lists where campaign budget can be funded from.
 * @endpoint GET /rewards/enums/funding-sources
 */
export function getFundingSources(): Promise<RewardGetFundingSourcesResult> {
  return apiGet<RewardGetFundingSourcesResult>(E.enumsFundingSources, () => fx.getFundingSourcesResult)
}

/**
 * Get KYC Tier options
 * Lists the KYC tiers (T0, T1, T2, T3) used for eligibility rules.
 * @endpoint GET /rewards/enums/kyc-tiers
 */
export function getKycTiers(): Promise<RewardGetKycTiersResult> {
  return apiGet<RewardGetKycTiersResult>(E.enumsKycTiers, () => fx.getKycTiersResult)
}

/**
 * Step 1: Setup Campaign Details
 * Initializes a new Campaign (CMP_...) with name, description, channel, and scheduled date windows. Returns nextStep: SET_AUDIENCE_CHANNELS.
 * @endpoint POST /rewards/campaigns
 */
export function createCampaign(body: RewardCreateCampaignBody): Promise<CampaignResponseDto> {
  return apiSend('POST', E.campaigns, body, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * All Campaigns View with Summary KPIs
 * Returns filtered campaigns for the merchant (or all for Admin) along with aggregated KPI totals (total allocated, spent, remaining budgets, redemptions count).
 * @endpoint GET /rewards/campaigns
 */
export function listCampaigns(params: RewardListCampaignsParams = {}): Promise<AllCampaignsViewDataDto> {
  return apiGet<AllCampaignsViewDataDto>(E.campaigns, () => fx.allCampaignsViewData, { ...params })
}

/**
 * Step 2: Set Audience, Targeting & Channels
 * Configures channel (In-Store, Online, All), target audience segment, geographic regions, SKU inclusions/exclusions, and whitelists. Returns nextStep: CONFIGURE_REWARDS.
 * @endpoint PATCH /rewards/campaigns/{campaignId}/audience-channels
 */
export function setCampaignAudience(campaignId: string, body: RewardSetCampaignAudienceBody): Promise<CampaignResponseDto> {
  return apiSend('PATCH', E.campaignAudienceChannels(campaignId), body, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Step 3: Add a Standalone Rule-Action Reward
 * Attaches a single rule-action reward (First-time, Frequency, Value, Duration, Event, etc.) with prize type (Points, Gift, Coupon, Raffle) to the campaign.
 * **Blocked rule pairs** (checked against the rewards already on the campaign):
 * - **FIRST_TIME_CUSTOMERS** + **REACTIVATION_DORMANCY**: rejected with 400.
 * - **FIRST_TIME_CUSTOMERS** + **DURATION_OF_PATRONAGE**: rejected with 400.
 * - **BY_FREQUENCY** + **REACTIVATION_DORMANCY**: rejected with 400 unless frequencyWindowDays is greater than inactivityDays (both default to 30, so the default pair is rejected).
 * @endpoint POST /rewards/campaigns/{campaignId}/rewards
 */
export function addCampaignReward(campaignId: string, body: RewardAddCampaignRewardBody): Promise<RewardResponseDto> {
  return apiSend('POST', E.campaignRewards(campaignId), body, cast<RewardResponseDto>, () => fx.rewardResponse)
}

/**
 * Step 3: Bulk Set / Replace Rewards
 * Replaces all rewards on the campaign with the provided list of rule-action rewards. Returns nextStep: SET_BUDGET.
 * **Blocked rule pairs** (checked across the whole submitted list):
 * - **FIRST_TIME_CUSTOMERS** + **REACTIVATION_DORMANCY**: rejected with 400.
 * - **FIRST_TIME_CUSTOMERS** + **DURATION_OF_PATRONAGE**: rejected with 400.
 * - **BY_FREQUENCY** + **REACTIVATION_DORMANCY**: rejected with 400 unless frequencyWindowDays is greater than inactivityDays (both default to 30, so the default pair is rejected).
 * @endpoint PUT /rewards/campaigns/{campaignId}/rewards
 */
export function setCampaignRewards(campaignId: string, body: RewardSetCampaignRewardsBody): Promise<CampaignResponseDto> {
  return apiSend('PUT', E.campaignRewards(campaignId), body, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Step 3: List All Rewards for Campaign
 * Lists all rewards attached to a campaign (wizard step 3).
 * @endpoint GET /rewards/campaigns/{campaignId}/rewards
 */
export function listCampaignRewards(campaignId: string): Promise<RewardListCampaignRewardsResult> {
  return apiGet<RewardListCampaignRewardsResult>(E.campaignRewards(campaignId), () => fx.listCampaignRewardsResult)
}

/**
 * Step 3: Link a Reward Template from your library
 * Copies a template from GET /reward-templates into this campaign as its own reward (templateId and templateVersion are recorded). Later edits to the template do not change this copy. A template can be linked once per campaign. Optional `overrides` replace only amounts: prizeValue, maxRewardPerUser, maxRewardPerTxn, minSpend.
 * **Blocked rule pairs** (checked against the rewards already on the campaign):
 * - **FIRST_TIME_CUSTOMERS** + **REACTIVATION_DORMANCY**: rejected with 400.
 * - **FIRST_TIME_CUSTOMERS** + **DURATION_OF_PATRONAGE**: rejected with 400.
 * - **BY_FREQUENCY** + **REACTIVATION_DORMANCY**: rejected with 400 unless frequencyWindowDays is greater than inactivityDays (both default to 30, so the default pair is rejected).
 * @endpoint POST /rewards/campaigns/{campaignId}/rewards/from-template
 */
export function linkRewardTemplate(campaignId: string, body: RewardLinkRewardTemplateBody): Promise<RewardResponseDto> {
  return apiSend('POST', E.campaignRewardsFromTemplate(campaignId), body, cast<RewardResponseDto>, () => fx.rewardResponse)
}

/**
 * Step 3: Update a linked reward to its template's latest version
 * Re-copies the template into this campaign reward. Allowed only while the campaign is DRAFT, SCHEDULED or PAUSED, so a live campaign never changes payout silently. Send `overrides` to replace them, or omit to keep the ones chosen at link time.
 * @endpoint POST /rewards/campaigns/{campaignId}/rewards/{rewardId}/sync-template
 */
export function syncRewardTemplate(campaignId: string, rewardId: string, body: RewardSyncRewardTemplateBody): Promise<RewardResponseDto> {
  return apiSend('POST', E.campaignRewardSyncTemplate(campaignId, rewardId), body, cast<RewardResponseDto>, () => fx.rewardResponse)
}

/**
 * Step 3: Update a Specific Reward
 * Partial update. Prize and rule fields are checked the same way as on create, against the merged reward.
 * **Blocked rule pairs** (checked against the other rewards on the campaign):
 * - **FIRST_TIME_CUSTOMERS** + **REACTIVATION_DORMANCY**: rejected with 400.
 * - **FIRST_TIME_CUSTOMERS** + **DURATION_OF_PATRONAGE**: rejected with 400.
 * - **BY_FREQUENCY** + **REACTIVATION_DORMANCY**: rejected with 400 unless frequencyWindowDays is greater than inactivityDays (both default to 30, so the default pair is rejected).
 * @endpoint PATCH /rewards/campaigns/{campaignId}/rewards/{rewardId}
 */
export function updateCampaignReward(campaignId: string, rewardId: string, body: Partial<UpdateRewardDto>): Promise<RewardResponseDto> {
  return apiSend('PATCH', E.campaignReward(campaignId, rewardId), body, cast<RewardResponseDto>, () => fx.rewardResponse)
}

/**
 * Step 3: Delete a Specific Reward
 * Removes the reward from this campaign. If it was linked from a template, the template stays in your library.
 * @endpoint DELETE /rewards/campaigns/{campaignId}/rewards/{rewardId}
 */
export function deleteCampaignReward(campaignId: string, rewardId: string): Promise<RewardApiResponseDto> {
  return apiSend('DELETE', E.campaignReward(campaignId, rewardId), undefined, cast<RewardApiResponseDto>, () => fx.rewardApiResponse)
}

/**
 * Step 4: Set / Top-up Budget & Lock Escrow
 * Allocates budget into campaign reward escrow, calculates delta top-up/release, enforces non-negative budget invariants, and writes ESC_... ledger entry. Returns nextStep: START_CAMPAIGN.
 * @endpoint PATCH /rewards/campaigns/{campaignId}/budget
 */
export function setCampaignBudget(campaignId: string, body: RewardSetCampaignBudgetBody): Promise<CampaignBudgetResponseDto> {
  return apiSend('PATCH', E.campaignBudget(campaignId), body, cast<CampaignBudgetResponseDto>, () => fx.campaignBudgetResponse)
}

/**
 * Step 5: Start or Schedule Campaign
 * Validates completeness (at least 1 reward, budget > 0 for Points, admin guardrails), sets status to ACTIVE (or SCHEDULED if future startDate), and enqueues BullMQ delay job. Returns nextStep: ALL_CAMPAIGNS_VIEW.
 * @endpoint POST /rewards/campaigns/{campaignId}/start
 */
export function startCampaign(campaignId: string): Promise<CampaignResponseDto> {
  return apiSend('POST', E.campaignStart(campaignId), undefined, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Pause an active campaign
 * Pauses an active campaign. It stops rewarding until resumed; escrow stays locked.
 * @endpoint POST /rewards/campaigns/{campaignId}/pause
 */
export function pauseCampaign(campaignId: string): Promise<CampaignResponseDto> {
  return apiSend('POST', E.campaignPause(campaignId), undefined, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Resume a paused campaign
 * Resumes a paused campaign so it rewards qualifying transactions again.
 * @endpoint POST /rewards/campaigns/{campaignId}/resume
 */
export function resumeCampaign(campaignId: string): Promise<CampaignResponseDto> {
  return apiSend('POST', E.campaignResume(campaignId), undefined, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Stop Campaign & Release Unspent Escrow
 * Marks campaign as COMPLETED and automatically releases any remaining unspent budget back to merchant via ESC_... RELEASE entry.
 * @endpoint POST /rewards/campaigns/{campaignId}/stop
 */
export function stopCampaign(campaignId: string): Promise<CampaignResponseDto> {
  return apiSend('POST', E.campaignStop(campaignId), undefined, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Get campaign details by ID or CMP_... reference
 * Returns one campaign by id or CMP_ reference, with its rewards, budget and status.
 * @endpoint GET /rewards/campaigns/{campaignId}
 */
export function getCampaign(campaignId: string): Promise<CampaignResponseDto> {
  return apiGet<CampaignResponseDto>(E.campaign(campaignId), () => fx.campaignResponse)
}

/**
 * Create a reusable reward template
 * Saves a reward to your library. It does nothing until linked to a campaign with POST /campaigns/{campaignId}/rewards/from-template. Same payload and prize rules as a campaign reward.
 * @endpoint POST /rewards/reward-templates
 */
export function createRewardTemplate(body: RewardCreateRewardTemplateBody): Promise<RewardTemplateResponseDto> {
  return apiSend('POST', E.rewardTemplates, body, cast<RewardTemplateResponseDto>, () => fx.rewardTemplateResponse)
}

/**
 * List your reward templates
 * Active templates by default. linkedRewardCount shows how many campaign rewards were copied from each.
 * @endpoint GET /rewards/reward-templates
 */
export function listRewardTemplates(params: RewardListRewardTemplatesParams = {}): Promise<RewardListRewardTemplatesResult> {
  return apiGet<RewardListRewardTemplatesResult>(E.rewardTemplates, () => fx.listRewardTemplatesResult, { ...params })
}

/**
 * Get a reward template by id or RWT_... reference
 * Get a reward template by id or RWT_... reference. Needs a signed-in user token.
 * @endpoint GET /rewards/reward-templates/{templateId}
 */
export function getRewardTemplate(templateId: string): Promise<RewardTemplateResponseDto> {
  return apiGet<RewardTemplateResponseDto>(E.rewardTemplate(templateId), () => fx.rewardTemplateResponse)
}

/**
 * Edit a reward template (creates a new version)
 * Partial update that increases version by 1. Campaigns that already linked this template keep their copy; draft, scheduled or paused campaigns can pull the new version with POST /campaigns/{campaignId}/rewards/{rewardId}/sync-template. Archived templates cannot be edited.
 * @endpoint PATCH /rewards/reward-templates/{templateId}
 */
export function updateRewardTemplate(templateId: string, body: Partial<UpdateRewardTemplateDto>): Promise<RewardTemplateResponseDto> {
  return apiSend('PATCH', E.rewardTemplate(templateId), body, cast<RewardTemplateResponseDto>, () => fx.rewardTemplateResponse)
}

/**
 * Delete or archive a reward template
 * Deleted outright if it was never used. If any campaign reward or issued reward references it, it is archived instead: hidden from the library and no longer linkable, while campaign copies keep working.
 * @endpoint DELETE /rewards/reward-templates/{templateId}
 */
export function deleteRewardTemplate(templateId: string): Promise<DeleteRewardTemplateResultDto> {
  return apiSend('DELETE', E.rewardTemplate(templateId), undefined, cast<DeleteRewardTemplateResultDto>, () => fx.deleteRewardTemplateResult)
}

/**
 * Real-time Campaign & Reward Evaluation (PRD §26.7 FR-RWD-07)
 * Evaluates transaction against active campaigns, checks stateful customer progress (frequency/value/first-time), applies Optimistic Concurrency Control, draws down budget escrow (ESC_...), and mints POR_... issuance.
 * @endpoint POST /rewards/campaigns/evaluate
 */
export function evaluateCampaigns(body: RewardEvaluateCampaignsBody): Promise<CampaignEvaluationResponseDto> {
  return apiSend('POST', E.campaignsEvaluate, body, cast<CampaignEvaluationResponseDto>, () => fx.campaignEvaluationResponse)
}

/**
 * Reverse Reward Issuance (Gap G7 & PRD §23.7 FR-PNT-05)
 * Atomically reverses a minted POR_... reward on refund/chargeback, restores campaign budget escrow (ESC_... REVERSAL_CREDIT), and rolls back customer progress.
 * @endpoint POST /rewards/campaigns/evaluations/{reference}/reverse
 */
export function reverseEvaluation(reference: string, body: RewardReverseEvaluationBody): Promise<RewardReversalResponseDto> {
  return apiSend('POST', E.campaignsEvaluationReverse(reference), body, cast<RewardReversalResponseDto>, () => fx.rewardReversalResponse)
}

/**
 * Get Campaign Escrow & Reward Ledger
 * Returns escrow balance history (LOCK, TOP_UP, DRAWDOWN, REVERSAL_CREDIT, RELEASE) for a campaign.
 * @endpoint GET /rewards/campaigns/{campaignId}/ledger
 */
export function getCampaignLedger(campaignId: string): Promise<CampaignLedgerResponseDto> {
  return apiGet<CampaignLedgerResponseDto>(E.campaignLedger(campaignId), () => fx.campaignLedgerResponse)
}

/**
 * Get global campaign guardrails (budget caps, V1 discount percent limits, etc.)
 * Admin only. Returns the platform-wide campaign limits (budget caps, discount percent limits).
 * @endpoint GET /rewards/admin/guardrails
 */
export function getGuardrails(): Promise<CampaignGuardrailResponseDto> {
  return apiGet<CampaignGuardrailResponseDto>(E.adminGuardrails, () => fx.campaignGuardrailResponse)
}

/**
 * Update global campaign guardrails (Admin only)
 * Admin only. Updates the platform-wide campaign limits applied when campaigns start.
 * @endpoint PUT /rewards/admin/guardrails
 */
export function updateGuardrails(body: RewardUpdateGuardrailsBody): Promise<CampaignGuardrailResponseDto> {
  return apiSend('PUT', E.adminGuardrails, body, cast<CampaignGuardrailResponseDto>, () => fx.campaignGuardrailResponse)
}

/**
 * Admin override for campaign whitelist/blacklist, budget approval, or status
 * Admin only. Overrides a campaign whitelist or blacklist, budget approval or status.
 * @endpoint PATCH /rewards/admin/campaigns/{campaignId}/override
 */
export function overrideCampaign(campaignId: string, body: RewardOverrideCampaignBody): Promise<CampaignResponseDto> {
  return apiSend('PATCH', E.adminCampaignOverride(campaignId), body, cast<CampaignResponseDto>, () => fx.campaignResponse)
}

/**
 * Inspect BullMQ queue counts (waiting, active, delayed, completed, failed)
 * Admin only. Shows background queue counts (waiting, active, delayed, completed, failed), outbox event counts (pending, held, delivered, failed) and which delivery targets are switched on.
 * @endpoint GET /rewards/admin/queues/status
 */
export function getQueueStatus(): Promise<QueueStatusResponseDto> {
  return apiGet<QueueStatusResponseDto>(E.adminQueuesStatus, () => fx.queueStatusResponse)
}

/**
 * Trigger an immediate on-demand lifecycle sweep for scheduled & expired campaigns
 * Admin only. Runs the campaign lifecycle sweep now, activating scheduled and closing expired campaigns.
 * @endpoint POST /rewards/admin/queues/sweep
 */
export function runLifecycleSweep(): Promise<QueueSweepResultDto> {
  return apiSend('POST', E.adminQueuesSweep, undefined, cast<QueueSweepResultDto>, () => fx.queueSweepResult)
}

/**
 * Trigger on-demand coupon expiration & 48-hour reminder warning sweep
 * Admin only. Runs the coupon sweep now: expires old coupons and sends 48-hour reminders.
 * @endpoint POST /rewards/admin/queues/sweep-coupons
 */
export function runCouponSweep(): Promise<CouponSweepResultDto> {
  return apiSend('POST', E.adminQueuesSweepCoupons, undefined, cast<CouponSweepResultDto>, () => fx.couponSweepResult)
}

/**
 * Trigger on-demand customer lifecycle dormancy & event greeting sweep
 * Admin only. Runs the engagement sweep now: dormant-customer nudges and event greetings.
 * @endpoint POST /rewards/admin/queues/sweep-engagement
 */
export function runEngagementSweep(): Promise<EngagementSweepResultDto> {
  return apiSend('POST', E.adminQueuesSweepEngagement, undefined, cast<EngagementSweepResultDto>, () => fx.engagementSweepResult)
}

/**
 * Trigger on-demand escrow ledger integrity reconciliation audit
 * Admin only. Runs an escrow ledger integrity check now and reports any mismatch.
 * @endpoint POST /rewards/admin/queues/audit-escrow
 */
export function runEscrowAudit(): Promise<EscrowAuditResultDto> {
  return apiSend('POST', E.adminQueuesAuditEscrow, undefined, cast<EscrowAuditResultDto>, () => fx.escrowAuditResult)
}

/**
 * Trigger on-demand progress archival for campaigns completed > 90 days ago
 * Admin only. Archives customer progress for campaigns completed more than 90 days ago.
 * @endpoint POST /rewards/admin/queues/archive-progress
 */
export function runProgressArchival(): Promise<ProgressArchivalResultDto> {
  return apiSend('POST', E.adminQueuesArchiveProgress, undefined, cast<ProgressArchivalResultDto>, () => fx.progressArchivalResult)
}

/**
 * Replay undelivered outbox events (points, card credits, notifications)
 * Re-sends outbox events oldest first. With the queue up they are re-queued; with it down they are delivered directly. Events whose target is switched off (REWARD_DELIVERY_*) stay HELD. DELIVERED events are never replayed.
 * @endpoint POST /rewards/admin/queues/replay-outbox
 */
export function replayOutbox(body: RewardReplayOutboxBody): Promise<ReplayOutboxResultDto> {
  return apiSend('POST', E.adminQueuesReplayOutbox, body, cast<ReplayOutboxResultDto>, () => fx.replayOutboxResult)
}

/**
 * Trigger provisional raffle draw for a campaign on demand
 * Admin only. Runs a provisional raffle draw for a campaign on demand.
 * @endpoint POST /rewards/admin/campaigns/{campaignId}/raffle-draw
 */
export function drawRaffle(campaignId: string): Promise<RaffleDrawResultDto> {
  return apiSend('POST', E.adminCampaignRaffleDraw(campaignId), undefined, cast<RaffleDrawResultDto>, () => fx.raffleDrawResult)
}

/**
 * Opt-in User / Merchant to Reward MS
 * Provisions or updates a local user/merchant record keyed by universal user ID (PRD §32 & MS Standards §3).
 * @endpoint POST /rewards/opt-in
 */
export function optIn(body: RewardOptInBody): Promise<OptInResponseDto> {
  return apiSend('POST', E.optIn, body, cast<OptInResponseDto>, () => fx.optInResponse)
}
