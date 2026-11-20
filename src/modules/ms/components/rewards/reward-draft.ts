import type { CampaignResponseDto, CreateRewardDto, RewardResponseDto, RewardRuleConfigDto } from '@/lib/api/numoni/types/rewards'
import { RULE_FIELDS, type PrizeType, type RuleField, type RuleType, type Weekday } from './rule-fields'

/** The reward form's values, as typed (strings for inputs), and their mapping to `CreateRewardDto`. */
export interface RewardDraft {
  /** An existing campaign's id, or `NEW_CAMPAIGN`. */
  campaignId: string
  newCampaignName: string
  newCampaignChannel: CampaignResponseDto['channel']
  name: string
  direction: RewardResponseDto['rewardDirection']
  ruleType: RuleType
  config: Partial<Record<RuleField, string>>
  weekdays: Weekday[]
  prizeType: PrizeType
  points: string
  couponCode: string
  couponDiscount: string
  couponExpiry: string
  giftName: string
  giftPhysical: boolean
  giftDescription: string
  giftDelivery: string
  raffleTickets: string
  raffleDescription: string
  maxPerUser: string
  maxPerTxn: string
}

export const NEW_CAMPAIGN = '__new__'

export const emptyDraft = (campaignId = ''): RewardDraft => ({
  campaignId, newCampaignName: '', newCampaignChannel: 'ALL',
  name: '', direction: 'FORWARD_REWARD', ruleType: 'FIRST_TIME_CUSTOMERS', config: {}, weekdays: [],
  prizeType: 'POINTS', points: '', couponCode: '', couponDiscount: '', couponExpiry: '',
  giftName: '', giftPhysical: true, giftDescription: '', giftDelivery: '', raffleTickets: '1', raffleDescription: '',
  maxPerUser: '', maxPerTxn: '',
})

const text = (v: unknown) => (v === undefined || v === null ? '' : String(v))

export function draftFromReward(r: RewardResponseDto): RewardDraft {
  const c = r.ruleConfig ?? {}
  const config: Partial<Record<RuleField, string>> = {}
  for (const key of Object.keys(RULE_FIELDS) as RuleField[]) {
    if (key === 'deadTimeDaysOfWeek') continue
    const v = c[key]
    if (v !== undefined && v !== null) config[key] = key === 'eventDate' ? String(v).slice(0, 10) : String(v)
  }
  return {
    ...emptyDraft(r.campaignId),
    name: r.name, direction: r.rewardDirection, ruleType: r.ruleType, config, weekdays: c.deadTimeDaysOfWeek ?? [],
    prizeType: r.prizeType, points: text(r.prizeValue),
    couponCode: text(r.couponDetails?.couponCode), couponDiscount: text(r.couponDetails?.discountPercent), couponExpiry: text(r.couponDetails?.expiryDays),
    giftName: text(r.giftDetails?.name), giftPhysical: r.giftDetails?.isPhysical ?? true,
    giftDescription: text(r.giftDetails?.description), giftDelivery: text(r.giftDetails?.deliveryInstructions),
    raffleTickets: text(r.raffleDetails?.ticketCount ?? 1), raffleDescription: text(r.raffleDetails?.prizeDescription),
    maxPerUser: text(r.maxRewardPerUser), maxPerTxn: text(r.maxRewardPerTxn),
  }
}

/** A number typed with thousands separators; `undefined` when blank. */
const num = (v: string | undefined) => {
  const s = (v ?? '').replace(/[,\s₦]/g, '')
  return s === '' || !Number.isFinite(Number(s)) ? undefined : Number(s)
}

/**
 * Builds the request body, keeping only the rule fields the chosen type uses
 * (`applicableFields`). Returns an error message for anything the service would reject.
 */
export function draftToBody(d: RewardDraft, applicableFields: string[]): { body: CreateRewardDto } | { error: string } {
  if (!d.name.trim()) return { error: 'Name the reward' }

  const ruleConfig: RewardRuleConfigDto = {}
  for (const key of applicableFields as RuleField[]) {
    const kind = RULE_FIELDS[key]?.kind
    const raw = d.config[key]
    if (kind === 'weekdays') { if (d.weekdays.length) ruleConfig.deadTimeDaysOfWeek = d.weekdays; continue }
    if (!raw) continue
    if (kind === 'date') ruleConfig.eventDate = new Date(`${raw}T00:00:00.000Z`).toISOString()
    else if (kind === 'eventKind') ruleConfig.eventKind = raw as RewardRuleConfigDto['eventKind']
    else if (kind === 'gamification') ruleConfig.gamificationTrigger = raw as RewardRuleConfigDto['gamificationTrigger']
    else if (num(raw) !== undefined) Object.assign(ruleConfig, { [key]: num(raw) })
  }
  if (d.ruleType === 'EVENT' && !ruleConfig.eventKind) return { error: 'Pick the event this reward is for' }
  if ((ruleConfig.deadTimeStartHourUtc === undefined) !== (ruleConfig.deadTimeEndHourUtc === undefined)) return { error: 'Set both the start and end hour' }
  if (d.ruleType === 'INACTIVITY_DEAD_TIME'
    && ruleConfig.inactivityDaysMin === undefined && ruleConfig.inactivityDaysMax === undefined
    && !ruleConfig.deadTimeDaysOfWeek && ruleConfig.deadTimeStartHourUtc === undefined) {
    return { error: 'Set an inactivity range, slow days or slow hours' }
  }

  const body: CreateRewardDto = {
    name: d.name.trim(), rewardDirection: d.direction, ruleType: d.ruleType, prizeType: d.prizeType,
    ...(Object.keys(ruleConfig).length ? { ruleConfig } : {}),
    ...(num(d.maxPerUser) !== undefined ? { maxRewardPerUser: num(d.maxPerUser) } : {}),
    ...(num(d.maxPerTxn) !== undefined ? { maxRewardPerTxn: num(d.maxPerTxn) } : {}),
  }
  switch (d.prizeType) {
    case 'POINTS':
      if (!num(d.points) || num(d.points)! <= 0) return { error: 'Set how many points the customer gets' }
      body.prizeValue = num(d.points)
      break
    case 'COUPON':
      if (!d.couponCode.trim() && num(d.couponDiscount) === undefined) return { error: 'Set a coupon code or discount' }
      body.couponDetails = { couponCode: d.couponCode.trim() || undefined, discountPercent: num(d.couponDiscount), expiryDays: num(d.couponExpiry) }
      break
    case 'GIFT':
      if (!d.giftName.trim()) return { error: 'Name the gift' }
      body.giftDetails = { name: d.giftName.trim(), isPhysical: d.giftPhysical, description: d.giftDescription.trim() || undefined, deliveryInstructions: d.giftDelivery.trim() || undefined }
      break
    case 'RAFFLE_DRAW':
      if (!num(d.raffleTickets) || num(d.raffleTickets)! <= 0) return { error: 'Award at least one raffle ticket' }
      body.raffleDetails = { ticketCount: num(d.raffleTickets)!, prizeDescription: d.raffleDescription.trim() || undefined }
      break
  }
  return { body }
}
