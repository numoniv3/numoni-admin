'use client'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { AllEnumsCatalogDto } from '@/lib/api/numoni/types/rewards'
import { useSaveReward } from '@/modules/ms/api/useRewardQueries'
import { PrizeFields } from './PrizeFields'
import { draftToBody } from './reward-draft'
import { RuleConfigFields } from './RuleConfigFields'
import { RuleTypePicker } from './RuleTypePicker'
import type { RewardForm } from './use-reward-form'

interface RewardFormSheetProps {
  form: RewardForm
  enums: AllEnumsCatalogDto
}

export function RewardFormSheet({ form, enums }: RewardFormSheetProps) {
  const { open, setOpen, editing, draft, update, reset } = form
  const save = useSaveReward()
  const ruleType = enums.rewardRuleTypes.find((t) => t.value === draft.ruleType)

  const submit = () => {
    const result = draftToBody(draft, ruleType?.applicableFields ?? [])
    if ('error' in result) return toast.error(result.error)
    save.mutate(
      { templateId: editing?.id, body: result.body },
      { onSuccess: () => { setOpen(false); reset() } },
    )
  }

  return (
    <FormSheet open={open} onOpenChange={setOpen} title={editing ? 'Edit Reward' : 'Create Reward'} sub={editing ? `Saving creates version ${editing.version + 1}. Campaigns already using it keep their copy.` : 'A trigger rule and what the customer gets when it matches. Add it to any campaign from the campaign’s Rewards step.'} wide>
      <div className="space-y-5 pb-2">
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
            {draft.ruleType === 'EVENT' && (
              <p className="text-xs text-muted-foreground mt-3">
                Fires when the customer&apos;s own date (e.g. their birthday) matches today. If checkout doesn&apos;t send a date, it fires on every qualifying purchase.
              </p>
            )}
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
