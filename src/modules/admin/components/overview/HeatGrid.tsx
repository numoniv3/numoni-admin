'use client'

import { useMemo } from 'react'
import { fmtCompact } from '@/lib/format'
import { type HeatMetric, type HeatGran, rnd, METRIC_LABEL } from '@/modules/admin/lib/heat-grid'

const METRIC_MULT: Record<HeatMetric, number> = { visits: 1, cards: 0.42, patronage: 0.68 }

// ── activity heat grid ───────────────────────────────────────────────────────
export function HeatGrid({ gran, metric, factor }: { gran: HeatGran; metric: HeatMetric; factor: number }) {
  const cells = useMemo(() => {
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const out: { label: string; value: number }[] = []
    if (gran === 'day') {
      for (let h = 0; h < 24; h++) {
        const label = `${h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : h - 12 + 'pm'}`
        const rush = h >= 11 && h <= 14 ? 1.9 : h >= 17 && h <= 20 ? 1.6 : h < 6 ? 0.12 : 1
        out.push({ label, value: Math.round(3100 * rush * (0.55 + rnd(h + 7) * 0.9) * METRIC_MULT[metric] * factor) })
      }
    } else if (gran === 'week') {
      dayLabels.forEach((d, di) => {
        for (let b = 0; b < 6; b++) {
          const block = ['6a', '9a', '12p', '3p', '6p', '9p'][b]
          const rush = b === 2 ? 1.8 : b === 4 ? 1.5 : b === 0 ? 0.3 : 1
          const weekend = di >= 5 ? 1.25 : 1
          out.push({ label: `${d} ${block}`, value: Math.round(9800 * rush * weekend * (0.5 + rnd(di * 10 + b) * 1) * METRIC_MULT[metric] * factor) })
        }
      })
    } else {
      for (let w = 0; w < 4; w++) {
        dayLabels.forEach((d, di) => {
          const weekend = di >= 5 ? 1.35 : 1
          const growth = 0.85 + w * 0.09
          out.push({ label: `W${w + 1} ${d}`, value: Math.round(68500 * weekend * growth * (0.6 + rnd(w * 7 + di + 40) * 0.8) * METRIC_MULT[metric] * factor) })
        })
      }
    }
    return out
  }, [gran, metric, factor])

  const max = Math.max(...cells.map((c) => c.value), 1)
  const cols = gran === 'day' ? 'grid-cols-6 sm:grid-cols-12' : 'grid-cols-7'

  return (
    <div>
      <div className={`grid ${cols} gap-1.5`}>
        {cells.map((c) => (
          <div
            key={c.label}
            title={`${c.label} · ${fmtCompact(c.value)} ${METRIC_LABEL[metric].toLowerCase()}`}
            className="rounded-md h-9 flex items-center justify-center text-[8px] font-bold transition-transform hover:scale-110 cursor-default"
            style={{ background: `rgba(2,220,77,${0.06 + (c.value / max) * 0.85})`, color: c.value / max > 0.45 ? '#04120a' : 'hsl(var(--muted-foreground))' }}
          >
            {gran === 'day' ? c.label : ''}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
        <span>{gran === 'day' ? 'Today, by hour' : gran === 'week' ? 'This week · each row is a day, 6 time blocks' : 'Last 4 weeks · each row is a week'}</span>
        <span className="flex items-center gap-1.5">
          Low
          {[0.08, 0.25, 0.45, 0.7, 0.91].map((o) => (
            <span key={o} className="h-3 w-3 rounded-sm" style={{ background: `rgba(2,220,77,${o})` }} />
          ))}
          High
        </span>
      </div>
    </div>
  )
}
