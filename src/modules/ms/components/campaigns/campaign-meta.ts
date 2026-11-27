import type { CampaignResponseDto, RewardResponseDto } from '@/lib/api/numoni/types/rewards'
import type { CampaignAction } from '@/modules/ms/api/useCampaignQueries'

export type CampaignStatus = CampaignResponseDto['status']
export type WizardStep = CampaignResponseDto['wizardStep']

export const STATUS_TONE: Record<CampaignStatus, 'green' | 'sky' | 'neutral' | 'orange' | 'purple' | 'red'> = {
  ACTIVE: 'green', SCHEDULED: 'sky', DRAFT: 'neutral', PAUSED: 'orange', COMPLETED: 'purple', CANCELLED: 'red',
}

/** The wizard's steps, in order. `done` is the `wizardStep` a campaign reports once the step is complete. */
export const STEPS: { key: string; label: string; done: WizardStep }[] = [
  { key: 'details', label: 'Details', done: 'SETUP_DETAILS' },
  { key: 'audience', label: 'Audience', done: 'AUDIENCE_CHANNELS_SET' },
  { key: 'rewards', label: 'Rewards', done: 'REWARDS_CONFIGURED' },
  { key: 'budget', label: 'Budget', done: 'BUDGET_SET' },
  { key: 'launch', label: 'Launch', done: 'STARTED' },
]

/** How many steps the campaign has completed (0–5). */
export const stepsDone = (c?: Pick<CampaignResponseDto, 'wizardStep'>) => (c ? STEPS.findIndex((s) => s.done === c.wizardStep) + 1 : 0)

/** The step to open a campaign at: the first one it hasn't completed. */
export const nextStepIndex = (c?: Pick<CampaignResponseDto, 'wizardStep'>) => Math.min(stepsDone(c), STEPS.length - 1)

export const isClosed = (s: CampaignStatus) => s === 'COMPLETED' || s === 'CANCELLED'

/** Lifecycle actions that apply in each status. */
export function actionsFor(s: CampaignStatus): CampaignAction[] {
  if (s === 'ACTIVE') return ['pause', 'stop']
  if (s === 'PAUSED') return ['resume', 'stop']
  if (s === 'SCHEDULED') return ['stop']
  if (s === 'DRAFT') return ['stop']
  return []
}

export const titleCase = (v: string) => v.charAt(0) + v.slice(1).toLowerCase().replace(/_/g, ' ')

export const fmtDate = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

/** `yyyy-mm-dd` (date input) → ISO at the start of that day, UTC. */
export const dayToIso = (day: string, endOfDay = false) => (day ? new Date(`${day}T${endOfDay ? '23:59:59.000' : '00:00:00.000'}Z`).toISOString() : undefined)

/** Comma/newline separated text → trimmed list. */
export const toList = (text: string) => text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean)

type RuleSettings = Pick<RewardResponseDto, 'ruleType' | 'ruleConfig'>

/**
 * Rule pairs the Reward MS rejects (400) on one campaign — checked before
 * attaching so the merchant sees why. `null` when the reward can be added.
 */
export function ruleConflict(adding: RuleSettings & { name: string }, onCampaign: (RuleSettings & { name: string })[]): string | null {
  for (const r of onCampaign) {
    const pair = new Set([adding.ruleType, r.ruleType])
    const has = (a: string, b: string) => pair.has(a as never) && pair.has(b as never) && pair.size === 2
    if (has('FIRST_TIME_CUSTOMERS', 'REACTIVATION_DORMANCY') || has('FIRST_TIME_CUSTOMERS', 'DURATION_OF_PATRONAGE')) {
      return `Can’t be on the same campaign as “${r.name}” (${titleCase(r.ruleType)}).`
    }
    if (has('BY_FREQUENCY', 'REACTIVATION_DORMANCY')) {
      const freq = adding.ruleType === 'BY_FREQUENCY' ? adding : r
      const dormant = adding.ruleType === 'REACTIVATION_DORMANCY' ? adding : r
      const window = freq.ruleConfig?.frequencyWindowDays ?? 30
      const inactive = dormant.ruleConfig?.inactivityDays ?? 30
      if (window <= inactive) return `With “${r.name}” on the campaign, the visit window (${window} days) must be longer than the inactivity period (${inactive} days).`
    }
  }
  return null
}
