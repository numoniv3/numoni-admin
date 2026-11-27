'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { RewardResponseDto, RewardTemplateOverridesDto, RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import { useLinkRewardTemplate } from '@/modules/ms/api/useCampaignQueries'
import { prizeSummary, ruleSummary } from '@/modules/ms/components/rewards/rule-fields'
import { ruleConflict } from './campaign-meta'

type OverrideKey = keyof RewardTemplateOverridesDto

const digits = (v: string) => v.replace(/[^\d]/g, '')
const num = (v: string) => (v === '' ? undefined : Number(v))

interface AttachRewardPanelProps {
  campaignId: string
  /** Active rewards in the merchant's library. */
  library: RewardTemplateResponseDto[]
  /** Rewards already on the campaign. */
  attached: RewardResponseDto[]
}

/**
 * Attaches a library reward to the campaign (`POST …/rewards/from-template`). The campaign
 * gets its own copy; `overrides` change only its amounts. A reward can be attached once.
 */
export function AttachRewardPanel({ campaignId, library, attached }: AttachRewardPanelProps) {
  const link = useLinkRewardTemplate()
  const [templateId, setTemplateId] = useState('')
  const [amounts, setAmounts] = useState<Partial<Record<OverrideKey, string>>>({})

  const available = library.filter((t) => !attached.some((r) => r.templateId === t.id))
  const picked = available.find((t) => t.id === templateId)
  const conflict = picked ? ruleConflict(picked, attached) : null

  const fields: { key: OverrideKey; label: string; current?: number | null }[] = picked
    ? [
        // A percentage prize ignores prizeValue, so there's no fixed amount to override.
        ...(picked.prizeType === 'POINTS' && !(picked as { prizePercent?: number | null }).prizePercent ? [{ key: 'prizeValue' as const, label: 'Points', current: picked.prizeValue }] : []),
        { key: 'maxRewardPerUser', label: 'Max per customer', current: picked.maxRewardPerUser },
        { key: 'maxRewardPerTxn', label: 'Max per transaction', current: picked.maxRewardPerTxn },
        { key: 'minSpend', label: 'Minimum spend (₦)', current: picked.ruleConfig?.minSpend },
      ]
    : []

  const choose = (id: string) => { setTemplateId(id); setAmounts({}) }

  const attach = () => {
    if (!picked || conflict) return
    const overrides: RewardTemplateOverridesDto = {}
    for (const { key } of fields) {
      const v = num(amounts[key] ?? '')
      if (v !== undefined) overrides[key] = v
    }
    link.mutate({ campaignId, templateId: picked.id, overrides, name: picked.name }, { onSuccess: () => choose('') })
  }

  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div>
        <div className="label-caps mb-2">Attach a reward from your library</div>
        <Select value={templateId} onValueChange={choose} disabled={available.length === 0}>
          <SelectTrigger>
            <SelectValue placeholder={library.length === 0 ? 'Your reward library is empty' : available.length ? 'Pick a reward…' : 'Every reward is already attached'} />
          </SelectTrigger>
          <SelectContent>
            {available.map((t) => <SelectItem key={t.id} value={t.id}>{t.name} · {ruleSummary(t)} → {prizeSummary(t)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {picked && (
        <>
          <div>
            <div className="text-xs text-muted-foreground mb-1.5">For this campaign only · optional — blank keeps the reward’s own value</div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ key, label, current }) => (
                <div key={key}>
                  <label className="text-xs text-muted-foreground">{label}</label>
                  <Input
                    value={amounts[key] ?? ''}
                    onChange={(e) => setAmounts((a) => ({ ...a, [key]: digits(e.target.value) }))}
                    placeholder={current != null ? current.toLocaleString() : 'No limit'}
                    className="mt-1 tnum"
                    inputMode="numeric"
                  />
                </div>
              ))}
            </div>
          </div>
          {conflict && <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-500">{conflict}</p>}
        </>
      )}

      <Button onClick={attach} disabled={!picked || !!conflict || link.isPending} variant="outline" className="w-full rounded-full">
        {link.isPending ? 'Attaching…' : 'Attach to campaign'}
      </Button>
      <p className="text-[11px] text-muted-foreground">The campaign keeps its own copy — later edits to the reward don’t change it until you update it here.</p>
    </div>
  )
}
