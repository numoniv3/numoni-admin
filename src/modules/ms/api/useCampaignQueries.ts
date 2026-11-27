import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import {
  createCampaign, deleteCampaignReward, getCampaign, getCampaignLedger, linkRewardTemplate, listCampaignRewards, pauseCampaign, resumeCampaign,
  setCampaignAudience, setCampaignBudget, startCampaign, stopCampaign, syncRewardTemplate, updateCampaignReward,
} from '@/lib/api/numoni/rewards.api'
import type {
  CampaignResponseDto, RewardTemplateOverridesDto, SetAudienceChannelsDto, SetCampaignBudgetDto, SetupCampaignDto,
} from '@/lib/api/numoni/types/rewards'
import { ensureRewardsOptIn, useSessionUser } from './ms-opt-in'

/*
 * Reward MS campaigns through the Gateway — the 5-step wizard
 * (details → audience → rewards → budget → start) and the lifecycle
 * (pause / resume / stop). The list lives in `useRewardCampaignsQuery`.
 * `POST /rewards/campaigns/evaluate` and `…/reverse` are for checkout
 * services, not the frontend (Gateway integration guide).
 */

const K = numoniKeys.rewards

function useRefresh() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: K.all })
}

const fail = (title: string) => (e: unknown) => toast.error(title, { description: apiErrorMessage(e) })

// ── reads ────────────────────────────────────────────────────────────────────

/** One campaign with its rewards and budget. `initial` (from the list) shows while it loads. */
export const useCampaignQuery = (campaignId: string | null, initial?: CampaignResponseDto) =>
  useQuery({
    queryKey: K.getCampaign(campaignId ?? ''),
    queryFn: () => getCampaign(campaignId!),
    enabled: !!campaignId,
    initialData: initial,
  })

/** Step 3 — the campaign's rewards on their own. */
export const useCampaignRewardsQuery = (campaignId: string) =>
  useQuery({ queryKey: K.listCampaignRewards(campaignId), queryFn: () => listCampaignRewards(campaignId) })

/** Escrow history: LOCK, TOP_UP, DRAWDOWN, REVERSAL_CREDIT, RELEASE. */
export const useCampaignLedgerQuery = (campaignId: string, enabled: boolean) =>
  useQuery({ queryKey: K.getCampaignLedger(campaignId), queryFn: () => getCampaignLedger(campaignId), enabled })

// ── wizard ───────────────────────────────────────────────────────────────────

/** Step 1 — creates a DRAFT campaign. */
export function useCreateCampaign() {
  const user = useSessionUser()
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (body: SetupCampaignDto) => {
      await ensureRewardsOptIn(user)
      return createCampaign(body)
    },
    onSuccess: (c) => { refresh(); toast.success('Campaign created', { description: `${c.name} · ${c.reference}` }) },
    onError: fail('Couldn’t create the campaign'),
  })
}

/** Step 2 — channel, audience, geography and SKU filters. */
export function useSetCampaignAudience() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body: SetAudienceChannelsDto }) => setCampaignAudience(campaignId, body),
    onSuccess: () => { refresh(); toast.success('Audience saved') },
    onError: fail('Couldn’t save the audience'),
  })
}

/** Step 3 — attaches a library reward to the campaign as its own copy (`POST …/rewards/from-template`), optionally with per-campaign amounts. */
export function useLinkRewardTemplate() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, templateId, overrides }: { campaignId: string; templateId: string; overrides?: RewardTemplateOverridesDto; name: string }) =>
      linkRewardTemplate(campaignId, { templateId, ...(overrides && Object.keys(overrides).length ? { overrides } : {}) }),
    onSuccess: (_, { name }) => { refresh(); toast.success('Reward added to the campaign', { description: name }) },
    onError: (e) => toast.error('Couldn’t add the reward', {
      description: isAxiosError(e) && e.response?.status === 409 ? 'It’s already on this campaign.' : apiErrorMessage(e),
    }),
  })
}

/** Step 3 — re-copies a linked reward from its template's latest version (`POST …/sync-template`). Keeps the overrides chosen when it was attached. */
export function useSyncCampaignReward() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, rewardId }: { campaignId: string; rewardId: string; name: string }) => syncRewardTemplate(campaignId, rewardId, {}),
    onSuccess: (_, { name }) => { refresh(); toast.success('Reward updated to the latest version', { description: name }) },
    onError: fail('Couldn’t update the reward'),
  })
}

/** Pause or resume one reward on the campaign — the campaign keeps running. */
export function useSetCampaignRewardStatus() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, rewardId, status }: { campaignId: string; rewardId: string; status: 'ACTIVE' | 'PAUSED'; name: string }) =>
      updateCampaignReward(campaignId, rewardId, { status }),
    onSuccess: (_, { status, name }) => { refresh(); toast.success(status === 'PAUSED' ? 'Reward paused' : 'Reward resumed', { description: name }) },
    onError: fail('Couldn’t change the reward'),
  })
}

/** Removes a reward from the campaign (`DELETE …/rewards/{rewardId}`). The library reward is untouched. */
export function useRemoveCampaignReward() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, rewardId }: { campaignId: string; rewardId: string; name: string }) => deleteCampaignReward(campaignId, rewardId),
    onSuccess: (_, { name }) => { refresh(); toast.success('Reward removed from the campaign', { description: name }) },
    onError: fail('Couldn’t remove the reward'),
  })
}

/** Step 4 — sets or tops up the budget and locks it in escrow. */
export function useSetCampaignBudget() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, body }: { campaignId: string; body: SetCampaignBudgetDto }) => setCampaignBudget(campaignId, body),
    onSuccess: (b) => { refresh(); toast.success('Budget locked in escrow', { description: `₦${b.totalBudget.toLocaleString()} · ${b.campaignReference}` }) },
    onError: fail('Couldn’t set the budget'),
  })
}

// ── lifecycle ────────────────────────────────────────────────────────────────

export type CampaignAction = 'start' | 'pause' | 'resume' | 'stop'

const ACTIONS: Record<CampaignAction, { run: (id: string) => Promise<CampaignResponseDto>; done: (c: CampaignResponseDto) => string; failed: string }> = {
  start: { run: startCampaign, done: (c) => (c.status === 'SCHEDULED' ? 'Campaign scheduled' : 'Campaign is live'), failed: 'Couldn’t start the campaign' },
  pause: { run: pauseCampaign, done: () => 'Campaign paused', failed: 'Couldn’t pause the campaign' },
  resume: { run: resumeCampaign, done: () => 'Campaign resumed', failed: 'Couldn’t resume the campaign' },
  stop: { run: stopCampaign, done: () => 'Campaign stopped — unspent budget released', failed: 'Couldn’t stop the campaign' },
}

/** Step 5 (`start`) and pause / resume / stop. */
export function useCampaignAction() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ campaignId, action }: { campaignId: string; action: CampaignAction }) => ACTIONS[action].run(campaignId),
    onSuccess: (c, { action }) => { refresh(); toast.success(ACTIONS[action].done(c), { description: c.name }) },
    onError: (e, { action }) => fail(ACTIONS[action].failed)(e),
  })
}
