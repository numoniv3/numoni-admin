'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { AllEnumsCatalogDto, CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { useSaveReward } from '@/modules/ms/api/useRewardQueries'
import { CampaignPicker } from './CampaignPicker'
import { PrizeFields } from './PrizeFields'
import { NEW_CAMPAIGN, draftToBody } from './reward-draft'
import { RuleConfigFields } from './RuleConfigFields'
import { RuleTypePicker } from './RuleTypePicker'
import type { RewardForm } from './use-reward-form'

interface RewardFormSheetProps {
  form: RewardForm
  enums: AllEnumsCatalogDto
  campaigns: CampaignResponseDto[]
}

export function RewardFormSheet({ form, enums, campaigns }: RewardFormSheetProps) {
  const { open, setOpen, editing, draft, update, reset } = form
  const save = useSaveReward()
  const ruleType = enums.rewardRuleTypes.find((t) => t.value === draft.ruleType)

  const submit = () => {
    const isNew = draft.campaignId === NEW_CAMPAIGN
    if (!draft.campaignId) return toast.error('Pick a campaign for this reward')
    if (isNew && !draft.newCampaignName.trim()) return toast.error('Name the new campaign')
    const result = draftToBody(draft, ruleType?.applicableFields ?? [])
    if ('error' in result) return toast.error(result.error)
    save.mutate(
      {
        campaignId: isNew ? undefined : draft.campaignId,
        newCampaign: isNew ? { name: draft.newCampaignName.trim(), channel: draft.newCampaignChannel } : undefined,
        rewardId: editing?.id,
        body: result.body,
      },
      { onSuccess: () => { setOpen(false); reset() } },
    )
  }

  return (
    <FormSheet open={open} onOpenChange={setOpen} title={editing ? 'Edit Reward' : 'Create Reward'} sub="A trigger rule and what the customer gets when it matches." wide>
      <div className="space-y-5 pb-2">
        <CampaignPicker campaigns={campaigns} channels={enums.campaignChannels} draft={draft} update={update} locked={!!editing} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label-caps">Reward name</label>
            <Input value={draft.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. 3rd Visit: 500 Points" className="mt-1.5" />
          </div>
          <div>
            <label className="label-caps">Direction</label>
            <div className="flex gap-1.5 mt-1.5">
              {enums.rewardDirections.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  title={d.description}
                  onClick={() => update({ direction: d.value as typeof draft.direction })}
                  className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${draft.direction === d.value ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <RuleTypePicker ruleTypes={enums.rewardRuleTypes} value={draft.ruleType} onChange={(t) => update({ ruleType: t, config: {}, weekdays: [] })} />

        {!!ruleType?.applicableFields.length && (
          <div className="rounded-2xl border border-dashed p-4">
            <div className="label-caps mb-3">{ruleType.label} · settings</div>
            <RuleConfigFields fields={ruleType.applicableFields} enums={enums} draft={draft} update={update} />
          </div>
        )}

        <PrizeFields prizeTypes={enums.prizeTypes} draft={draft} update={update} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground">Max per customer · optional</label>
            <Input value={draft.maxPerUser} onChange={(e) => update({ maxPerUser: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 5" className="mt-1 tnum" inputMode="numeric" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Max per transaction · optional</label>
            <Input value={draft.maxPerTxn} onChange={(e) => update({ maxPerTxn: e.target.value.replace(/\D/g, '') })} placeholder="e.g. 1000" className="mt-1 tnum" inputMode="numeric" />
          </div>
        </div>

        <Button onClick={submit} disabled={save.isPending} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
          {save.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create Reward'}
        </Button>
      </div>
    </FormSheet>
  )
}
