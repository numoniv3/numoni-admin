import type { RewardResponseDto, RewardRuleConfigDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'

/*
 * How each `RewardRuleConfigDto` field is edited and shown. Which fields a rule
 * type uses comes from the API (`GET /rewards/enums` → `rewardRuleTypes[].applicableFields`).
 */

export type RuleField = keyof RewardRuleConfigDto
export type RuleType = RewardResponseDto['ruleType']
export type PrizeType = RewardResponseDto['prizeType']
export type Weekday = NonNullable<RewardRuleConfigDto['deadTimeDaysOfWeek']>[number]

type FieldKind = 'number' | 'naira' | 'hour' | 'date' | 'eventKind' | 'gamification' | 'weekdays'

export const RULE_FIELDS: Record<RuleField, { label: string; kind: FieldKind; unit?: string; placeholder?: string; optional?: boolean; hidden?: boolean }> = {
  frequencyCount: { label: 'Visits needed', kind: 'number', unit: 'visits', placeholder: '3' },
  frequencyWindowDays: { label: 'Within', kind: 'number', unit: 'days', placeholder: '30' },
  valueThreshold: { label: 'Spend threshold', kind: 'naira', placeholder: '10,000' },
  durationDays: { label: 'Customer for at least', kind: 'number', unit: 'days', placeholder: '30' },
  eventKind: { label: 'Event', kind: 'eventKind' },
  // Stored by the service but not used for eligibility: EVENT rewards fire on the customer's
  // date sent at checkout (e.g. their birthday), so the form doesn't ask for it.
  eventDate: { label: 'Event date', kind: 'date', optional: true, hidden: true },
  gamificationTrigger: { label: 'Behaviour', kind: 'gamification', optional: true },
  inactivityDays: { label: 'No purchase for', kind: 'number', unit: 'days', placeholder: '30' },
  inactivityDaysMin: { label: 'Inactive from (T1)', kind: 'number', unit: 'days', placeholder: '7', optional: true },
  inactivityDaysMax: { label: 'Inactive up to (T2)', kind: 'number', unit: 'days', placeholder: '14', optional: true },
  deadTimeDaysOfWeek: { label: 'Slow days', kind: 'weekdays', optional: true },
  deadTimeStartHourUtc: { label: 'Slow hours from', kind: 'hour', unit: 'h UTC', placeholder: '14', optional: true },
  deadTimeEndHourUtc: { label: 'Slow hours to', kind: 'hour', unit: 'h UTC', placeholder: '17', optional: true },
  minSpend: { label: 'Minimum spend', kind: 'naira', placeholder: '2,000', optional: true },
}

export const WEEKDAYS: Weekday[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
export const dayShort = (d: string) => d.slice(0, 1) + d.slice(1, 3).toLowerCase()

const plural = (n: number, word: string) => `${n.toLocaleString()} ${word}${n === 1 ? '' : 's'}`
const titleCase = (v: string) => v.toLowerCase().replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

/** One line describing when a reward fires, e.g. "3 visits in 30 days · min ₦2,000". */
export function ruleSummary(r: Pick<RewardResponseDto, 'ruleType' | 'ruleConfig'>): string {
  const c = r.ruleConfig ?? {}
  const parts: string[] = []
  switch (r.ruleType) {
    case 'BY_FREQUENCY': parts.push(`${plural(c.frequencyCount ?? 1, 'visit')} in ${c.frequencyWindowDays ?? 30} days`); break
    case 'BY_VALUE': parts.push(`${fmtNaira(c.valueThreshold ?? 0, 0)} spent`); break
    case 'DURATION_OF_PATRONAGE': parts.push(`Customer for ${plural(c.durationDays ?? 30, 'day')}`); break
    case 'EVENT': parts.push(c.eventKind ? titleCase(c.eventKind) : 'Event'); break
    case 'BEHAVIOR_GAMIFICATION': parts.push(c.gamificationTrigger ? titleCase(c.gamificationTrigger) : 'Any behaviour'); break
    case 'REACTIVATION_DORMANCY': parts.push(`Inactive ${plural(c.inactivityDays ?? 30, 'day')}`); break
    case 'INACTIVITY_DEAD_TIME':
      if (c.inactivityDaysMin != null || c.inactivityDaysMax != null) parts.push(`Inactive ${c.inactivityDaysMin ?? 0}–${c.inactivityDaysMax ?? '∞'} days`)
      if (c.deadTimeDaysOfWeek?.length) parts.push(c.deadTimeDaysOfWeek.map(dayShort).join(', '))
      if (c.deadTimeStartHourUtc != null) parts.push(`${c.deadTimeStartHourUtc}–${c.deadTimeEndHourUtc}h UTC`)
      break
    case 'FIRST_TIME_CUSTOMERS': parts.push('First purchase'); break
    case 'REWARD_REFERRAL': parts.push('Successful referral'); break
    case 'REWARD_PER_PURCHASE': parts.push('Every purchase'); break
  }
  if (c.minSpend) parts.push(`min ${fmtNaira(c.minSpend, 0)}`)
  return parts.join(' · ')
}

/** What the customer gets, e.g. "500 pts" or "20% off · SAVE20". */
export function prizeSummary(r: Pick<RewardResponseDto, 'prizeType' | 'prizeValue' | 'prizePercent' | 'couponDetails' | 'giftDetails' | 'raffleDetails'>): string {
  switch (r.prizeType) {
    case 'POINTS': return r.prizePercent ? `${r.prizePercent}% of purchase in pts` : `${(r.prizeValue ?? 0).toLocaleString()} pts`
    case 'COUPON': {
      const c = r.couponDetails ?? {}
      return [c.discountPercent != null ? `${c.discountPercent}% off` : 'Coupon', c.couponCode, c.expiryDays ? `${c.expiryDays} days` : undefined].filter(Boolean).join(' · ')
    }
    case 'GIFT': return [r.giftDetails?.name ?? 'Gift', r.giftDetails?.isPhysical === false ? 'digital' : 'physical'].join(' · ')
    case 'RAFFLE_DRAW': return plural(r.raffleDetails?.ticketCount ?? 1, 'raffle ticket')
  }
}

export const PRIZE_TONE: Record<PrizeType, 'sky' | 'orange' | 'green' | 'purple'> = { POINTS: 'sky', COUPON: 'orange', GIFT: 'green', RAFFLE_DRAW: 'purple' }
