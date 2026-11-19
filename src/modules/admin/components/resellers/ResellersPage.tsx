'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight, ShieldCheck, Store, Wallet2
} from 'lucide-react'
import { toast } from 'sonner'
import { Pill, SectionTitle, KpiCard, stagger } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Button } from '@/components/ui/button'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import { useAdminResellersQuery } from '../../api/useAdminQueries'

// ── Resellers ────────────────────────────────────────────────────────────────
export function ResellersPage() {
  const { data: resellers } = useAdminResellersQuery()
  const [open, setOpen] = useState<string | null>(null)
  const [paid, setPaid] = useState<string[]>([])
  const sel = resellers.find((r) => r.id === open)
  const totalVolume = resellers.reduce((s, r) => s + r.volume, 0)
  const totalCommission = resellers.reduce((s, r) => s + r.commission, 0)
  const totalMerchants = resellers.reduce((s, r) => s + r.merchants, 0)
  const totalActive = resellers.reduce((s, r) => s + r.active, 0)

  const payCommission = (id: string) => {
    const r = resellers.find((x) => x.id === id)!
    setPaid((p) => [...p, id])
    toast.success('Commission paid', { description: `${r.name} · ${fmtNaira(r.commission, 0)} via NIP · entry posted to 2003` })
  }

  return (
    <div>
      <SectionTitle
        title="Resellers"
        sub="The field network onboarding merchants across Nigeria — volumes, activation and commissions in one view."
        right={
          <ExportCsvButton
            filename="numoni-resellers"
            headers={['ID', 'Reseller', 'Contact', 'Region', 'Merchants', 'Active', 'Volume (₦)', 'Commission (₦)', 'Status']}
            rows={resellers.map((r) => [r.id, r.name, r.contact, r.region, r.merchants, r.active, r.volume, r.commission, r.status])}
          />
        }
      />
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <motion.div variants={stagger.item} initial="hidden" animate="show"><KpiCard label="Network volume" numeric={totalVolume} format={fmtNairaCompact} delta={12.4} icon={ArrowLeftRight} sub="merchant sales via reseller portfolio" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.05 }}><KpiCard label="Commission payable" numeric={totalCommission} format={fmtNairaCompact} icon={Wallet2} tint="orange" sub="accrued · owed to 2003 ledger" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.1 }}><KpiCard label="Merchants onboarded" numeric={totalMerchants} format={(n) => String(Math.round(n))} icon={Store} tint="purple" sub={`${totalActive} transacting in the last 30 days`} /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.15 }}><KpiCard label="Avg activation rate" value={`${Math.round((totalActive / totalMerchants) * 100)}%`} delta={4.1} icon={ShieldCheck} tint="sky" sub="merchants with ≥1 sale / week" /></motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {resellers.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setOpen(r.id)} className="card-surface p-5 cursor-pointer hover:border-brand/40 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-display font-bold">{r.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{r.contact} · {r.region}</div>
              </div>
              <Pill tone={r.status === 'Settled' ? 'green' : 'orange'}>{paid.includes(r.id) ? 'Paid' : r.status}</Pill>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { l: 'Merchants', v: String(r.merchants) },
                { l: 'Active', v: String(r.active) },
                { l: 'Volume', v: fmtNairaCompact(r.volume) },
                { l: 'Commission', v: fmtNairaCompact(r.commission) },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-muted/50 py-2.5 px-1">
                  <div className="tnum text-sm font-bold truncate">{s.v}</div>
                  <div className="text-[10px] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Activation rate</span><span className="tnum font-semibold">{Math.round((r.active / r.merchants) * 100)}%</span></div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full bg-brand rounded-full" initial={{ width: 0 }} animate={{ width: `${(r.active / r.merchants) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.06 }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <FormSheet open={!!sel} onOpenChange={(o) => !o && setOpen(null)} title={sel?.name ?? ''} sub={sel ? `${sel.id} · ${sel.region} · ${sel.contact}` : ''}>
        {sel && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Merchants onboarded', String(sel.merchants)],
                ['Active this month', String(sel.active)],
                ['Portfolio volume', fmtNaira(sel.volume, 0)],
                ['Commission accrued', fmtNaira(sel.commission, 0)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border p-3">
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                  <div className="tnum font-bold mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="label-caps mb-2">Top merchants</div>
              <div className="space-y-2">
                {['Wura Market Stores', 'Mama Put Express', 'Zobo & Co.'].slice(0, Math.min(3, sel.merchants)).map((m, i) => (
                  <div key={m} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                    <span className="font-medium">{m}</span>
                    <span className="tnum text-muted-foreground text-xs">{fmtNairaCompact(sel.volume * (0.3 - i * 0.08))} · 30d</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground">
              Commission = 1% of portfolio volume, paid weekly via NIP once the settlement run confirms.
            </div>
            <Button
              disabled={paid.includes(sel.id) || sel.status === 'Settled'}
              onClick={() => payCommission(sel.id)}
              className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90"
            >
              {paid.includes(sel.id) ? 'Commission paid' : `Pay ${fmtNaira(sel.commission, 0)} commission`}
            </Button>
          </div>
        )}
      </FormSheet>
    </div>
  )
}
