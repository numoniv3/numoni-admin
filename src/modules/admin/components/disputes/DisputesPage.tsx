'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, LifeBuoy, ScrollText, ShieldCheck, Wallet2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Pill, SectionTitle, KpiCard, stagger } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import { useAdminDisputesQuery } from '../../api/useAdminQueries'

export function DisputesPage() {
  const { data: disputeSeed } = useAdminDisputesQuery()
  const [items, setItems] = useState(disputeSeed)
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState<string | null>(null)
  const sel = items.find((d) => d.id === open)
  const shown = items.filter((d) => filter === 'all' || d.status.toLowerCase() === filter)
  const openCount = items.filter((d) => d.status === 'Open').length
  const invCount = items.filter((d) => d.status === 'Investigating').length
  const openValue = items.filter((d) => d.status !== 'Resolved').reduce((s, d) => s + d.amount, 0)

  const resolve = (id: string, refund: boolean) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: 'Resolved' } : x)))
    if (refund) toast.success('Reversal posted', { description: `${id} · points returned as a ledger reversal entry` })
    else toast.success('Dispute closed', { description: `${id} · found in merchant's favour` })
  }
  const escalate = (id: string) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: 'Investigating' } : x)))
    toast.success('Escalated to investigation', { description: `${id} · settlement for this merchant paused until cleared` })
  }
  return (
    <div>
      <SectionTitle
        title="Disputes & Support"
        sub="Reversals are ledger entries — money never moves off-book."
        right={
          <ExportCsvButton
            filename="numoni-disputes"
            headers={['ID', 'Customer', 'Merchant', 'Issue', 'Amount (₦)', 'Age', 'Status']}
            rows={items.map((d) => [d.id, d.customer, d.merchant, d.issue, d.amount, d.age, d.status])}
          />
        }
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <motion.div variants={stagger.item} initial="hidden" animate="show"><KpiCard label="Open disputes" numeric={openCount} format={(n) => String(Math.round(n))} icon={LifeBuoy} tint="orange" sub="awaiting first response" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.05 }}><KpiCard label="Under investigation" numeric={invCount} format={(n) => String(Math.round(n))} icon={ScrollText} tint="orange" sub="evidence requested from merchant" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.1 }}><KpiCard label="Value at risk" numeric={openValue} format={fmtNairaCompact} icon={Wallet2} tint="purple" sub="open + investigating, unresolved" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.15 }}><KpiCard label="Avg resolution" value="6.2h" delta={-14.0} icon={ShieldCheck} tint="sky" sub="this week · target < 8h" /></motion.div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({items.length})</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {shown.map((d, i) => (
          <motion.div key={d.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setOpen(d.id)} className="card-surface p-5 cursor-pointer hover:border-brand/40 transition-colors">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orangeb/10 text-orangeb shrink-0"><LifeBuoy className="h-4 w-4" /></span>
              <div className="flex-1 min-w-[220px]">
                <div className="font-semibold text-sm">{d.issue}</div>
                <div className="text-xs text-muted-foreground mt-0.5 tnum">{d.id} · {d.customer} vs {d.merchant} · {d.age} ago</div>
              </div>
              <span className="tnum font-bold">{fmtNaira(d.amount, 0)}</span>
              <Pill tone={d.status === 'Open' ? 'red' : d.status === 'Investigating' ? 'orange' : 'green'}>{d.status}</Pill>
              {d.status !== 'Resolved' && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" onClick={() => resolve(d.id, true)} className="bg-brand text-black hover:bg-brand/90"><Check className="h-3.5 w-3.5 mr-1" /> Refund</Button>
                  <Button size="sm" variant="outline" onClick={() => resolve(d.id, false)}><X className="h-3.5 w-3.5 mr-1" /> Reject</Button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {shown.length === 0 && <div className="card-surface p-8 text-center text-sm text-muted-foreground">No disputes in this state right now.</div>}
      </div>

      <FormSheet open={!!sel} onOpenChange={(o) => !o && setOpen(null)} title={sel ? `Dispute ${sel.id}` : ''} sub={sel ? `${sel.customer} vs ${sel.merchant} · ${fmtNaira(sel.amount, 0)}` : ''}>
        {sel && (
          <div className="space-y-4">
            <div className="rounded-xl border p-4">
              <div className="text-sm font-semibold">{sel.issue}</div>
              <div className="text-xs text-muted-foreground mt-1">Opened {sel.age} ago · channel: in-app chat · linked transaction holds the points in escrow until resolution.</div>
            </div>
            <div>
              <div className="label-caps mb-2.5">Timeline</div>
              <div className="space-y-0">
                {[
                  ['Dispute opened by customer', `${sel.age} ago`],
                  ['Points escrowed on the ledger', `${sel.age} ago`],
                  ...(sel.status !== 'Open' ? [['Evidence requested from merchant', '1h later']] : []),
                  ...(sel.status === 'Resolved' ? [['Resolution posted to both parties', '6h later']] : []),
                ].map(([t, w]) => (
                  <div key={t as string} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-brand shrink-0 mt-1" />
                      <span className="w-px flex-1 bg-border" />
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-medium">{t}</div>
                      <div className="text-[10px] text-muted-foreground tnum">{w}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {sel.status !== 'Resolved' && (
              <div className="space-y-2">
                <Button onClick={() => { resolve(sel.id, true); setOpen(null) }} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">Refund customer — {fmtNaira(sel.amount, 0)}</Button>
                <div className="grid grid-cols-2 gap-2">
                  {sel.status === 'Open' && <Button variant="outline" onClick={() => { escalate(sel.id); setOpen(null) }} className="h-10 rounded-full">Escalate</Button>}
                  <Button variant="outline" onClick={() => { resolve(sel.id, false); setOpen(null) }} className={`h-10 rounded-full ${sel.status === 'Open' ? '' : 'col-span-2'}`}>Reject dispute</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </FormSheet>
    </div>
  )
}
