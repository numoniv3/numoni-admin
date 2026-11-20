import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import {
  addCampaignReward, createCampaign, deleteCampaignReward, getEnumCatalog, listCampaigns, updateCampaignReward,
} from '@/lib/api/numoni/rewards.api'
import type { CreateRewardDto, RewardListCampaignsParams, SetupCampaignDto } from '@/lib/api/numoni/types/rewards'
import { ensureRewardsOptIn as ensureOptIn, useSessionUser } from './ms-opt-in'

/*
 * Reward MS rewards (rule → prize) through the Gateway. Every reward belongs
 * to a campaign; campaign hooks are in `useCampaignQueries.ts`.
 */

const K = numoniKeys.rewards

// ── reads ────────────────────────────────────────────────────────────────────

/** Every Reward MS dropdown (rule types, prize types, directions, event kinds, …). Static for a session. */
export const useRewardEnumsQuery = () =>
  useSuspenseQuery({ queryKey: K.getEnumCatalog(), queryFn: getEnumCatalog, staleTime: Infinity })

/** The merchant's campaigns, each with its `rewards`, plus KPI totals. */
export function useRewardCampaignsQuery(filters: RewardListCampaignsParams = {}) {
  const user = useSessionUser()
  return useSuspenseQuery({
    queryKey: K.listCampaigns(filters),
    queryFn: async () => {
      // A failed opt-in shouldn't hide campaigns the merchant already has.
      await ensureOptIn(user).catch(() => undefined)
      return listCampaigns(filters)
    },
  })
}

// ── writes ───────────────────────────────────────────────────────────────────

function useRefreshRewards() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: K.all })
}

export interface SaveRewardInput {
  /** The reward's campaign — or, with `newCampaign`, ignored and created first. */
  campaignId?: string
  newCampaign?: SetupCampaignDto
  /** Set when editing an existing reward. */
  rewardId?: string
  body: CreateRewardDto
}

/** Creates (`POST …/rewards`) or edits (`PATCH …/rewards/{rewardId}`) a reward, creating its campaign first if asked. */
export function useSaveReward() {
  const user = useSessionUser()
  const refresh = useRefreshRewards()
  return useMutation({
    mutationFn: async ({ campaignId, newCampaign, rewardId, body }: SaveRewardInput) => {
      await ensureOptIn(user)
      const target = newCampaign ? (await createCampaign(newCampaign)).id : campaignId
      if (!target) throw new Error('Pick a campaign for this reward')
      return rewardId ? updateCampaignReward(target, rewardId, body) : addCampaignReward(target, body)
    },
    onSuccess: (reward, { rewardId }) => {
      refresh()
      toast.success(rewardId ? 'Reward updated' : 'Reward created', { description: reward.name })
    },
    onError: (e, { rewardId }) => toast.error(rewardId ? 'Couldn’t update the reward' : 'Couldn’t create the reward', { description: apiErrorMessage(e) }),
  })
}

/** Pause or resume one reward — its campaign keeps running. */
export function useSetRewardStatus() {
  const refresh = useRefreshRewards()
  return useMutation({
    mutationFn: ({ campaignId, rewardId, status }: { campaignId: string; rewardId: string; status: 'ACTIVE' | 'PAUSED'; name: string }) =>
      updateCampaignReward(campaignId, rewardId, { status }),
    onSuccess: (_, { status, name }) => {
      refresh()
      toast.success(status === 'PAUSED' ? 'Reward paused' : 'Reward resumed', { description: name })
    },
    onError: (e) => toast.error('Couldn’t change the reward', { description: apiErrorMessage(e) }),
  })
}

export function useDeleteReward() {
  const refresh = useRefreshRewards()
  return useMutation({
    mutationFn: ({ campaignId, rewardId }: { campaignId: string; rewardId: string; name: string }) => deleteCampaignReward(campaignId, rewardId),
    onSuccess: (_, { name }) => {
      refresh()
      toast.success('Reward deleted', { description: name })
    },
    onError: (e) => toast.error('Couldn’t delete the reward', { description: apiErrorMessage(e) }),
  })
}
