'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, LayoutGrid, List, Megaphone, Wallet2 } from 'lucide-react'
import { toast } from 'sonner'
import { SectionTitle, KpiCard, EmptyState, stagger } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { fmtNairaCompact } from '@/lib/format'
import { type Campaign } from '@/lib/api/numoni/types/platform'
import { useAdminCampaignsQuery } from '../../api/useAdminQueries'
import { CampaignPreviewSheet } from '@/modules/admin/components/campaigns/CampaignPreviewSheet'
import { CampaignTable } from '@/modules/admin/components/campaigns/CampaignTable'
import { CampaignGrid } from '@/modules/admin/components/campaigns/CampaignGrid'
import { CampaignFilters } from '@/modules/admin/components/campaigns/CampaignFilters'

export function CampaignsPage() {
  const { data: seed } = useAdminCampaignsQuery()
  const [items, setItems] = useState(seed)
  const [tab, setTab] = useState('all')
  const [mtype, setMtype] = useState('all')
  const [view, setView] = useState<'grid' | 'table'>('table')
  const [q, setQ] = useState('')
  const [preview, setPreview] = useState<Campaign | null>(null)
  const filtered = items.filter((c) =>
    (tab === 'all' || c.status.toLowerCase().includes(tab)) &&
    (mtype === 'all' || c.merchantType === mtype) &&
    (q === '' || c.name.toLowerCase().includes(q.toLowerCase()) || c.owner.toLowerCase().includes(q.toLowerCase())),
  )

  const live = items.filter((c) => c.status === 'Live').length
  const budget = items.filter((c) => c.status !== 'Ended').reduce((s, c) => s + c.budget, 0)
  const spent = items.reduce((s, c) => s + c.spent, 0)
  const sales = items.reduce((s, c) => s + c.sales, 0)

  const approve = (id: string, ok: boolean) => {
    const c = items.find((x) => x.id === id)
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: ok ? 'Live' : 'Draft' } : x)))
    if (ok) toast.success(`${c?.name} approved & live`, { description: 'Budget escrow locked · pacing started' })
    else toast.error(`${c?.name} sent back`, { description: 'Returned to draft with review notes' })
    setPreview(null)
  }
  const togglePause = (id: string) => {
    const c = items.find((x) => x.id === id)!
    const next = c.status === 'Live' ? 'Paused' : 'Live'
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: next } : x)))
    toast.success(`${c.name} ${next === 'Live' ? 'resumed' : 'paused'}`, { description: 'Escrow pacing updated · audit logged' })
  }

  return (
    <div>
      <SectionTitle
        title="Campaigns"
        sub="Every reward campaign across merchants and brands — budgets sit in escrow. Switch between grid and table as the list grows."
        right={
          <div className="flex items-center gap-2">
            <ExportCsvButton
              filename="numoni-campaigns"
              headers={['ID', 'Campaign', 'Owner', 'Merchant type', 'Model', 'Goal', 'Trigger', 'Budget (₦)', 'Spent (₦)', 'Sales (₦)', 'Status', 'Window']}
              rows={filtered.map((c) => [c.id, c.name, c.owner, c.merchantType, c.model, c.goal, c.trigger, c.budget, c.spent, c.sales, c.status, c.window])}
            />
            <div className="flex gap-1 rounded-full border p-1">
              <button onClick={() => setView('grid')} className={`rounded-full h-7 w-8 flex items-center justify-center transition-colors ${view === 'grid' ? 'bg-brand text-black' : 'text-muted-foreground'}`} title="Grid view"><LayoutGrid className="h-3.5 w-3.5" /></button>
              <button onClick={() => setView('table')} className={`rounded-full h-7 w-8 flex items-center justify-center transition-colors ${view === 'table' ? 'bg-brand text-black' : 'text-muted-foreground'}`} title="Table view"><List className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        }
      />

      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <motion.div variants={stagger.item}><KpiCard label="Live campaigns" numeric={live} format={(n) => String(Math.round(n))} icon={Megaphone} sub={`${items.length} total across the platform`} /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Budget in escrow" numeric={budget} format={fmtNairaCompact} icon={Wallet2} tint="purple" sub="locked until rewards pay out" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Reward spend" numeric={spent} format={fmtNairaCompact} icon={Check} tint="orange" sub={`of ${fmtNairaCompact(items.reduce((s, c) => s + c.budget, 0))} total budgeted`} /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Blended ROI" value={spent > 0 ? (sales / spent).toFixed(1) + '×' : '—'} delta={6.4} icon={LayoutGrid} tint="sky" sub="attributed sales ÷ reward spend" /></motion.div>
      </motion.div>

      <CampaignFilters items={items} mtype={mtype} q={q} setMtype={setMtype} setQ={setQ} setTab={setTab} tab={tab} />

      {filtered.length === 0 ? (
        <div className="card-surface"><EmptyState icon={Megaphone} title="Nothing here" sub="No campaigns match these filters." /></div>
      ) : view === 'grid' ? (
        <CampaignGrid approve={approve} filtered={filtered} setPreview={setPreview} />
      ) : (
        <CampaignTable approve={approve} filtered={filtered} setPreview={setPreview} togglePause={togglePause} />
      )}

      {/* campaign preview */}
      <CampaignPreviewSheet approve={approve} preview={preview} setPreview={setPreview} togglePause={togglePause} />
    </div>
  )
}
