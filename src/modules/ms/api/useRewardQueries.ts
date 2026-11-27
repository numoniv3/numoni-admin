import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import {
  createRewardTemplate, deleteRewardTemplate, getEnumCatalog, listCampaigns, listRewardTemplates, updateRewardTemplate,
} from '@/lib/api/numoni/rewards.api'
import type { CreateRewardTemplateDto, RewardListCampaignsParams, RewardListRewardTemplatesParams } from '@/lib/api/numoni/types/rewards'
import { ensureRewardsOptIn as ensureOptIn, useSessionUser } from './ms-opt-in'

/*
 * Reward MS rewards (rule → prize) through the Gateway. Rewards are kept as
 * reusable templates in the merchant's library (`/rewards/reward-templates`),
 * not tied to a campaign; a campaign links a template to get its own copy
 * (`useLinkRewardTemplate` in `useCampaignQueries.ts`).
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

/** Options for the merchant's reward library — shared by the Rewards page and a campaign's Rewards step. */
export const rewardTemplatesQuery = (params: RewardListRewardTemplatesParams = {}) => ({
  queryKey: K.listRewardTemplates(params),
  queryFn: () => listRewardTemplates(params),
})

/** The reward library (`GET /reward-templates`): active templates unless `status: 'ARCHIVED'`. */
export const useRewardTemplatesQuery = (params: RewardListRewardTemplatesParams = {}) => useSuspenseQuery(rewardTemplatesQuery(params))

// ── writes ───────────────────────────────────────────────────────────────────

function useRefreshRewards() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: K.all })
}

export interface SaveRewardInput {
  /** Set when editing an existing template. */
  templateId?: string
  body: CreateRewardTemplateDto
}

/** Creates (`POST /reward-templates`) or edits (`PATCH /reward-templates/{templateId}`, a new version) a reward. */
export function useSaveReward() {
  const user = useSessionUser()
  const refresh = useRefreshRewards()
  return useMutation({
    mutationFn: async ({ templateId, body }: SaveRewardInput) => {
      await ensureOptIn(user)
      return templateId ? updateRewardTemplate(templateId, body) : createRewardTemplate(body)
    },
    onSuccess: (reward, { templateId }) => {
      refresh()
      toast.success(templateId ? 'Reward updated' : 'Reward created', { description: reward.name })
    },
    onError: (e, { templateId }) => toast.error(templateId ? 'Couldn’t update the reward' : 'Couldn’t create the reward', { description: apiErrorMessage(e) }),
  })
}

/** Deletes a never-used template; the service archives it instead when campaigns already use it. */
export function useDeleteReward() {
  const refresh = useRefreshRewards()
  return useMutation({
    mutationFn: ({ templateId }: { templateId: string; name: string }) => deleteRewardTemplate(templateId),
    onSuccess: (result, { name }) => {
      refresh()
      toast.success(result.outcome === 'ARCHIVED' ? 'Reward archived' : 'Reward deleted', {
        description: result.outcome === 'ARCHIVED' ? `${name} — campaigns using it keep their copy` : name,
      })
    },
    onError: (e) => toast.error('Couldn’t delete the reward', { description: apiErrorMessage(e) }),
  })
}
