'use client'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AllEnumsCatalogDto } from '@/lib/api/numoni/types/rewards'
import type { RewardDraft } from './reward-draft'
import { RULE_FIELDS, WEEKDAYS, dayShort, type RuleField } from './rule-fields'

const ANY = '__any__'

interface RuleConfigFieldsProps {
  /** `applicableFields` of the chosen rule type. */
  fields: string[]
  enums: AllEnumsCatalogDto
  draft: RewardDraft
  update: (patch: Partial<RewardDraft>) => void
}

/** The settings of the chosen rule type — only the fields that type uses. */
export function RuleConfigFields({ fields, enums, draft, update }: RuleConfigFieldsProps) {
  const known = fields.filter((f): f is RuleField => f in RULE_FIELDS && !RULE_FIELDS[f as RuleField].hidden)
  if (!known.length) return null
  const set = (key: RuleField, value: string) => update({ config: { ...draft.config, [key]: value } })

  return (
    <div className="grid grid-cols-2 gap-3">
      {known.map((key) => {
        const f = RULE_FIELDS[key]
        const label = (
          <label className="text-xs text-muted-foreground">
            {f.label}{f.unit && <span className="tnum"> ({f.unit})</span>}{f.optional && <span className="opacity-70"> · optional</span>}
          </label>
        )
        if (f.kind === 'weekdays') {
          return (
            <div key={key} className="col-span-2">
              {label}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {WEEKDAYS.map((d) => {
                  const on = draft.weekdays.includes(d)
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => update({ weekdays: on ? draft.weekdays.filter((x) => x !== d) : [...draft.weekdays, d] })}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${on ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}
                    >
                      {dayShort(d)}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        }
        if (f.kind === 'eventKind' || f.kind === 'gamification') {
          const options = f.kind === 'eventKind' ? enums.eventKinds : enums.gamificationTriggers
          return (
            <div key={key}>
              {label}
              <Select value={draft.config[key] || (f.optional ? ANY : undefined)} onValueChange={(v) => set(key, v === ANY ? '' : v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Pick…" /></SelectTrigger>
                <SelectContent>
                  {f.optional && <SelectItem value={ANY}>Any</SelectItem>}
                  {options.map((o) => <SelectItem key={o.value} value={o.value ?? ''}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )
        }
        return (
          <div key={key}>
            {label}
            <Input
              type={f.kind === 'date' ? 'date' : 'text'}
              inputMode={f.kind === 'date' ? undefined : 'numeric'}
              value={draft.config[key] ?? ''}
              onChange={(e) => set(key, f.kind === 'date' ? e.target.value : e.target.value.replace(/[^\d,]/g, ''))}
              placeholder={f.placeholder}
              className="mt-1 tnum"
            />
          </div>
        )
      })}
    </div>
  )
}
