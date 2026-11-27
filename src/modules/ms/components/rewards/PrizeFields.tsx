'use client'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { EnumOptionDto } from '@/lib/api/numoni/types/rewards'
import type { RewardDraft } from './reward-draft'
import type { PrizeType } from './rule-fields'

interface PrizeFieldsProps {
  prizeTypes: EnumOptionDto[]
  draft: RewardDraft
  update: (patch: Partial<RewardDraft>) => void
}

const digits = (v: string) => v.replace(/[^\d,]/g, '')

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <label className="text-xs text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

/** What the customer gets — the fields each prize type requires. */
export function PrizeFields({ prizeTypes, draft: d, update }: PrizeFieldsProps) {
  const current = prizeTypes.find((p) => p.value === d.prizeType)
  return (
    <div>
      <label className="label-caps">Customer gets</label>
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {prizeTypes.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => update({ prizeType: p.value as PrizeType })}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${d.prizeType === p.value ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {current && <p className="text-[11px] text-muted-foreground mt-1.5">{current.description}</p>}

      <div className="grid grid-cols-2 gap-3 mt-3">
        {d.prizeType === 'POINTS' && (
          <>
            <div className="col-span-2 flex gap-1.5">
              {([['fixed', 'Fixed points'], ['percent', '% of purchase']] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => update({ pointsMode: mode })}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${d.pointsMode === mode ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground hover:border-foreground/30'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            {d.pointsMode === 'fixed' ? (
              <Field label="Points per reward">
                <Input value={d.points} onChange={(e) => update({ points: digits(e.target.value) })} placeholder="e.g. 500" className="tnum" inputMode="numeric" />
              </Field>
            ) : (
              <>
                <Field label="Percentage of the purchase">
                  <Input value={d.percent} onChange={(e) => update({ percent: e.target.value.replace(/[^\d.]/g, '') })} placeholder="e.g. 5" className="tnum" inputMode="decimal" />
                </Field>
                <p className="col-span-2 text-[11px] text-muted-foreground -mt-1">
                  E.g. 5% of a ₦20,000 purchase is 1,000 points. Set a max per transaction below to cap big purchases.
                </p>
              </>
            )}
          </>
        )}
        {d.prizeType === 'COUPON' && (
          <>
            <Field label="Coupon code or prefix"><Input value={d.couponCode} onChange={(e) => update({ couponCode: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" /></Field>
            <Field label="Discount (%)"><Input value={d.couponDiscount} onChange={(e) => update({ couponDiscount: digits(e.target.value) })} placeholder="20" className="tnum" inputMode="numeric" /></Field>
            <Field label="Valid for (days)"><Input value={d.couponExpiry} onChange={(e) => update({ couponExpiry: digits(e.target.value) })} placeholder="14" className="tnum" inputMode="numeric" /></Field>
          </>
        )}
        {d.prizeType === 'GIFT' && (
          <>
            <Field label="Gift name"><Input value={d.giftName} onChange={(e) => update({ giftName: e.target.value })} placeholder="e.g. Branded T-Shirt" /></Field>
            <Field label="Physical item">
              <div className="flex items-center gap-2 h-9">
                <Switch checked={d.giftPhysical} onCheckedChange={(giftPhysical) => update({ giftPhysical })} />
                <span className="text-xs text-muted-foreground">{d.giftPhysical ? 'Physical — picked up or shipped' : 'Digital perk'}</span>
              </div>
            </Field>
            <Field label="Description" wide><Input value={d.giftDescription} onChange={(e) => update({ giftDescription: e.target.value })} placeholder="e.g. Size L, 100% cotton" /></Field>
            <Field label="Delivery / pickup instructions" wide><Input value={d.giftDelivery} onChange={(e) => update({ giftDelivery: e.target.value })} placeholder="e.g. Collect at the counter with your receipt" /></Field>
          </>
        )}
        {d.prizeType === 'RAFFLE_DRAW' && (
          <>
            <Field label="Raffle tickets"><Input value={d.raffleTickets} onChange={(e) => update({ raffleTickets: digits(e.target.value) })} placeholder="1" className="tnum" inputMode="numeric" /></Field>
            <Field label="Prize description" wide><Input value={d.raffleDescription} onChange={(e) => update({ raffleDescription: e.target.value })} placeholder="e.g. Win a generator in our end-of-year draw" /></Field>
          </>
        )}
      </div>
    </div>
  )
}
