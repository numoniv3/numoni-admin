import { numoniKeys } from '@/lib/api/numoni/query-keys'
import {
  drawRaffle, getGuardrails, getQueueStatus, listCampaigns, overrideCampaign, runCouponSweep, runEngagementSweep, runEscrowAudit,
  runLifecycleSweep, runProgressArchival, updateGuardrails,
} from '@/lib/api/numoni/rewards.api'
import type { AdminCampaignOverrideDto, RewardListCampaignsParams, UpdateGuardrailDto } from '@/lib/api/numoni/types/rewards'
import { useMsAction, useMsQuery } from './ms-hooks'

/* Reward MS platform-admin endpoints (`/rewards/admin/*`) — Admin app only. */

const K = numoniKeys.rewards

/** Every merchant's campaigns (admin sees all; filter with `merchantId`). */
export const useAllCampaigns = (filters: RewardListCampaignsParams) => useMsQuery(K.listCampaigns(filters), () => listCampaigns(filters))
export const useGuardrails = () => useMsQuery(K.getGuardrails(), getGuardrails)
export const useQueueStatus = () => useMsQuery(K.getQueueStatus(), getQueueStatus)

export const useUpdateGuardrails = () =>
  useMsAction((body: UpdateGuardrailDto) => updateGuardrails(body), { success: 'Guardrails updated', error: 'Couldn’t update the guardrails', invalidate: [K.getGuardrails()] })

export const useOverrideCampaign = () =>
  useMsAction(({ id, body }: { id: string; body: AdminCampaignOverrideDto }) => overrideCampaign(id, body), {
    success: (c) => `Override applied to ${c.name}`, error: 'Couldn’t apply the override', invalidate: [K.all],
  })

export const useDrawRaffle = () =>
  useMsAction((id: string) => drawRaffle(id), {
    success: (r) => (r.winnerTicket ? `Winner: ticket ${r.winnerTicket} of ${r.totalTickets}` : `No winner — ${r.totalTickets} tickets`),
    error: 'Couldn’t draw the raffle',
  })

export const SWEEPS = {
  lifecycle: { label: 'Campaign lifecycle', desc: 'Starts scheduled campaigns and closes expired ones.', run: runLifecycleSweep },
  coupons: { label: 'Coupons', desc: 'Expires old coupons and sends 48-hour reminders.', run: runCouponSweep },
  engagement: { label: 'Engagement', desc: 'Dormancy and event (birthday, anniversary) greetings.', run: runEngagementSweep },
  escrow: { label: 'Escrow audit', desc: 'Checks escrow ledger integrity.', run: runEscrowAudit },
  archive: { label: 'Archive progress', desc: 'Archives progress of campaigns completed over 90 days ago.', run: runProgressArchival },
} as const

export const useRunSweep = () =>
  useMsAction((kind: keyof typeof SWEEPS): Promise<Record<string, unknown>> => SWEEPS[kind].run() as Promise<never>, {
    success: (r, kind) => `${SWEEPS[kind].label} sweep done — ${Object.entries(r).filter(([k]) => k !== 'sweptAt' && k !== 'auditedAt').map(([k, v]) => `${k}: ${v}`).join(', ')}`,
    error: 'Sweep failed', invalidate: [K.getQueueStatus()],
  })
