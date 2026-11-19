'use client'

import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  AlertTriangle, BookOpen, CheckCircle2, Coins, Scale, ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard, Pill } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import { DataTable } from '@/components/ui/data-table'

import { chartTooltip } from '@/modules/admin/components/accounting/chart-tooltip'
import type { Account, WalletCheck, WalletDriftPoint, WalletSide } from '@/lib/api/numoni'

interface WalletReconciliationTabProps {
  accounts: Account[]
  walletChecks: WalletCheck[]
  walletDrift: WalletDriftPoint[]
  walletSides: WalletSide[]
}

export function WalletReconciliationTab({ accounts, walletChecks, walletDrift, walletSides }: WalletReconciliationTabProps) {
  const WALLET_TOTAL = walletSides.reduce((s, w) => s + w.balance, 0)
  const ppl = accounts.find((a) => a.code === '2001')!.balance
  const float = accounts.find((a) => a.code === '1003')!.balance
  const variance = WALLET_TOTAL - ppl
  const coverage = (float / ppl) * 100

  return (
    <div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <motion.div initial="hidden" animate="show"><KpiCard label="Points outstanding" numeric={WALLET_TOTAL} format={fmtNairaCompact} icon={Coins} tint="orange" sub="across every customer, brand, card & coupon" /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="PPL ledger (2001)" numeric={ppl} format={fmtNairaCompact} icon={BookOpen} tint="purple" sub="what the books say we owe" /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="Ledger variance" numeric={variance} format={(n) => fmtNaira(n, 0)} icon={Scale} tint={variance === 0 ? 'brand' : 'orange'} sub={variance === 0 ? 'perfectly balanced — no money leaking' : 'investigate immediately'} /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="Settlement coverage" value={coverage.toFixed(1) + '%'} delta={0.8} icon={ShieldCheck} tint="sky" sub={`${fmtNairaCompact(float)} float vs ${fmtNairaCompact(ppl)} owed`} /></motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* The equation */}
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold">The wallet equation</h3>
            {variance === 0
              ? <Pill tone="green"><CheckCircle2 className="h-3 w-3" /> Balanced</Pill>
              : <Pill tone="red"><AlertTriangle className="h-3 w-3" /> Off by {fmtNaira(Math.abs(variance), 0)}</Pill>}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Every point ever issued lives in exactly one wallet — and the sum must equal the Point Pool Liability. If this ever drifts, money is being created or destroyed.</p>
          <DataTable
            data={walletSides}
            getRowId={(w) => w.name}
            showHeader={false}
            cellClassName="py-2.5"
            columns={[
              {
                id: 'wallet',
                header: 'Wallet',
                meta: { cellClassName: 'pr-2' },
                cell: ({ row: { original: w } }) => (
                  <>
                    <div className="font-medium">{w.name}</div>
                    <div className="text-[10px] text-muted-foreground tnum">{w.count} · posts to {w.ledger}</div>
                  </>
                ),
              },
              { id: 'balance', header: 'Balance', meta: { cellClassName: 'text-right tnum font-semibold w-40' }, cell: ({ row: { original: w } }) => fmtNaira(w.balance, 0) },
            ]}
            afterRows={
              <tr className="border-t-2 border-foreground/20">
                <td className="py-3 font-display font-bold">Σ wallets <span className="text-xs font-normal text-muted-foreground">vs PPL {fmtNaira(ppl, 0)}</span></td>
                <td className={`py-3 text-right tnum font-display font-bold ${variance === 0 ? 'text-brand' : 'text-red-500'}`}>{fmtNaira(WALLET_TOTAL, 0)}</td>
              </tr>
            }
          />
          <div className="mt-3 rounded-xl border border-brand/30 bg-brand/5 p-3 text-[11px] text-muted-foreground">
            Checked at every cut-off: <span className="font-mono font-semibold text-brand">[NERW + PPL + ΣRCS] − Payonus = 0</span>. Any non-zero result freezes settlement automatically.
          </div>
        </div>

        {/* Coverage + drift */}
        <div className="space-y-4">
          <div className="card-surface p-5">
            <h3 className="font-display font-bold mb-1">Float coverage</h3>
            <p className="text-xs text-muted-foreground mb-3">Zenith settlement float ÷ points owed</p>
            <div className="flex items-end justify-between mb-1.5">
              <span className="tnum font-display font-bold text-2xl">{coverage.toFixed(1)}%</span>
              <span className="text-[10px] text-muted-foreground">policy floor 100% + 2% buffer</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: `${Math.min(100, coverage)}%` }} />
            </div>
            <div className="text-[10px] text-muted-foreground mt-2 tnum">Excess buffer {fmtNaira(float - ppl, 0)} · topped up from NERW when below floor</div>
          </div>
          <div className="card-surface p-5">
            <h3 className="font-display font-bold mb-1">Daily variance drift</h3>
            <p className="text-xs text-muted-foreground mb-2">₦ difference at cut-off · resolved same day</p>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={walletDrift}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 8 }} stroke="hsl(var(--muted-foreground))" interval={2} />
                <YAxis hide />
                <Tooltip contentStyle={chartTooltip} formatter={(v: number) => [fmtNaira(v, 0), 'Variance']} />
                <Bar isAnimationActive={false} dataKey="v" radius={[3, 3, 3, 3]} maxBarSize={14}>
                  {walletDrift.map((d) => <Cell key={d.d} fill={d.v === 0 ? '#02DC4D' : '#E8A33D'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Integrity checks */}
      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b">
          <div>
            <h3 className="font-display font-bold text-sm">Ledger integrity checks</h3>
            <p className="text-[10px] text-muted-foreground">Continuous tests that catch money leaking before it compounds</p>
          </div>
          <Pill tone="orange">{walletChecks.filter((c) => !c.ok).length} need attention</Pill>
        </div>
        <div className="divide-y">
          {walletChecks.map((c) => (
            <div key={c.name} className="flex flex-wrap items-center gap-4 px-5 py-3.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${c.ok ? 'bg-brand/10 text-brand' : 'bg-orangeb/10 text-orangeb'}`}>
                {c.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-[240px]">
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-[10px] text-muted-foreground">{c.detail}</div>
              </div>
              <span className={`tnum text-sm font-bold ${c.ok ? 'text-brand' : 'text-orangeb'}`}>{c.result}</span>
              {!c.ok && <Button size="sm" variant="outline" onClick={() => toast.success('Investigation opened', { description: `${c.name} · assigned to Finance sub-admin` })}>Investigate</Button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
