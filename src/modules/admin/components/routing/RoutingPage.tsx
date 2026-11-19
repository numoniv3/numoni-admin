'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Split } from 'lucide-react'
import { toast } from 'sonner'
import { Pill, SectionTitle } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAdminRoutingQuery } from '../../api/useAdminQueries'
import type { RailGroup } from '@/lib/api/numoni/types/admin'

const defaultSplit = (g: RailGroup): Record<string, number> => {
  const base = Object.fromEntries(g.members.map((m) => [m, Math.floor(100 / g.members.length)]))
  base[g.members[0]] = 100 - Math.floor(100 / g.members.length) * (g.members.length - 1)
  return base
}

const seedSplit = (g: RailGroup): Record<string, number> => {
  if (g.id === 'kyc') return { VerifyMe: 60, Prembly: 40 }
  if (g.id === 'messaging') return { Termii: 70, Brevo: 30 }
  return defaultSplit(g)
}

export function RoutingPage() {
  const { data: { partners, railGroups: RAIL_GROUPS } } = useAdminRoutingQuery()
  const [splits, setSplits] = useState<Record<string, Record<string, number>>>(() =>
    Object.fromEntries(RAIL_GROUPS.map((g) => [g.id, seedSplit(g)])),
  )
  const [draft, setDraft] = useState<Record<string, number> | null>(null)
  const [openGroup, setOpenGroup] = useState<RailGroup | null>(null)
  const draftTotal = draft ? Object.values(draft).reduce((s, v) => s + v, 0) : 0

  const openSplit = (g: RailGroup) => {
    setOpenGroup(g)
    setDraft({ ...splits[g.id] })
  }
  const saveSplit = () => {
    if (!openGroup || !draft || draftTotal !== 100) return
    setSplits((s) => ({ ...s, [openGroup.id]: draft }))
    toast.success('Traffic split applied', {
      description: `${openGroup.label} · ${Object.entries(draft).map(([k, v]) => `${k} ${v}%`).join(' / ')} · propagates in 60s · audit logged`,
    })
    setOpenGroup(null)
  }

  return (
    <div>
      <SectionTitle title="Traffic Routing" sub="Every rail routes 100% of its traffic across partners — set the split, fail over instantly, stay within quota." />
      <div className="space-y-6">
        {RAIL_GROUPS.map((g) => {
          const split = splits[g.id]
          const members = g.members.map((name) => partners.find((p) => p.name === name)!).filter(Boolean)
          return (
            <div key={g.id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-sm">{g.label} <span className="text-xs text-muted-foreground font-normal">· {g.note}</span></h3>
                </div>
                <div className="flex items-center gap-2">
                  {g.members.length > 1
                    ? <Pill tone="sky">Split {g.members.map((m) => `${split[m]}%`).join(' / ')}</Pill>
                    : <Pill tone="neutral">Single partner</Pill>}
                  {g.members.length > 1 && (
                    <Button size="sm" variant="outline" onClick={() => openSplit(g)}><Split className="h-3.5 w-3.5 mr-1.5" /> Set split</Button>
                  )}
                </div>
              </div>
              {/* shared traffic bar */}
              {g.members.length > 1 && (
                <div className="h-2 rounded-full overflow-hidden flex mb-3">
                  {g.members.map((m, i) => (
                    <div key={m} className="h-full transition-all" style={{ width: `${split[m]}%`, background: ['#02DC4D', '#0EA5E9', '#7C5CBF', '#E8A33D'][i % 4] }} title={`${m} ${split[m]}%`} />
                  ))}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {members.map((p, i) => (
                  <motion.div key={p.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-surface p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold" style={{ background: ['#02DC4D1a', '#0EA5E91a', '#7C5CBF1a', '#E8A33D1a'][i % 4], color: ['#02DC4D', '#0EA5E9', '#7C5CBF', '#E8A33D'][i % 4] }}>{p.name.slice(0, 2).toUpperCase()}</span>
                        <div>
                          <div className="font-display font-bold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.role}</div>
                        </div>
                      </div>
                      <Pill tone="green"><span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" /> {p.health}%</Pill>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground tnum">p95 latency {p.latency} · circuit breaker armed</span>
                      {g.members.length > 1 && <span className="tnum font-bold">{split[p.name]}% of traffic</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Split configuration modal */}
      <FormSheet open={!!openGroup} onOpenChange={(o) => !o && setOpenGroup(null)} title={openGroup ? `Split traffic — ${openGroup.label}` : ''} sub="Percentages must add up to exactly 100%. Changes propagate to the gateway within 60 seconds.">
        {openGroup && draft && (
          <div className="space-y-5">
            {openGroup.members.map((m, i) => (
              <div key={m}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: ['#02DC4D', '#0EA5E9', '#7C5CBF', '#E8A33D'][i % 4] }} />
                    {m}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Input
                      value={String(draft[m])}
                      onChange={(e) => setDraft((d) => ({ ...d!, [m]: Math.max(0, Math.min(100, Number(e.target.value.replace(/\D/g, '')) || 0)) }))}
                      className="w-20 h-9 text-right tnum"
                      inputMode="numeric"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
                <input
                  type="range" min={0} max={100} value={draft[m]}
                  onChange={(e) => setDraft((d) => ({ ...d!, [m]: Number(e.target.value) }))}
                  className="w-full accent-[#02DC4D]"
                />
              </div>
            ))}
            <div className={`rounded-xl border p-3.5 flex items-center justify-between text-sm font-bold ${draftTotal === 100 ? 'border-brand/40 bg-brand/5 text-brand' : 'border-orangeb/40 bg-orangeb/5 text-orangeb'}`}>
              <span>Total allocation</span>
              <span className="tnum">{draftTotal}% {draftTotal !== 100 && `— adjust by ${100 - draftTotal > 0 ? '+' : ''}${100 - draftTotal}%`}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden flex">
              {openGroup.members.map((m, i) => (
                <div key={m} className="h-full transition-all" style={{ width: `${draft[m]}%`, background: ['#02DC4D', '#0EA5E9', '#7C5CBF', '#E8A33D'][i % 4] }} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Failover is automatic: if a partner's circuit breaker trips, its share shifts to the healthiest member until it recovers.</p>
            <Button disabled={draftTotal !== 100} onClick={saveSplit} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
              Apply split
            </Button>
          </div>
        )}
      </FormSheet>
    </div>
  )
}
