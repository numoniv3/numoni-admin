'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import type { RewardRuleTypeOptionDto } from '@/lib/api/numoni/types/rewards'
import type { RuleType } from './rule-fields'

interface RuleTypePickerProps {
  ruleTypes: RewardRuleTypeOptionDto[]
  value: RuleType
  onChange: (ruleType: RuleType) => void
}

/** The trigger, one of the rule types `GET /rewards/enums` lists. */
export function RuleTypePicker({ ruleTypes, value, onChange }: RuleTypePickerProps) {
  return (
    <div>
      <label className="label-caps">Reward trigger</label>
      <RadioGroup value={value} onValueChange={(v) => onChange(v as RuleType)} className="grid sm:grid-cols-2 gap-2 mt-1.5">
        {ruleTypes.map((t) => (
          <label
            key={t.value}
            className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${value === t.value ? 'border-brand bg-brand/5' : 'hover:border-foreground/25'}`}
          >
            <RadioGroupItem value={t.value ?? ''} className="mt-0.5" />
            <span>
              <span className="block text-sm font-semibold">{t.label}</span>
              <span className="block text-[11px] text-muted-foreground mt-0.5">{t.description}</span>
            </span>
          </label>
        ))}
      </RadioGroup>
    </div>
  )
}
