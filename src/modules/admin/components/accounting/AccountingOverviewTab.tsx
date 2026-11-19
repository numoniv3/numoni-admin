'use client'

import { motion } from 'framer-motion'
import { Area, CartesianGrid, Cell, ComposedChart, Legend, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { CheckCircle2, PiggyBank, Receipt, Scale, TrendingUp, Wallet } from 'lucide-react'
import { KpiCard, Pill } from '@/components/ui/kit'
import { fmtNairaCompact } from '@/lib/format'
import { chartTooltip } from '@/modules/admin/components/accounting/chart-tooltip'
import type { AccountingMonth } from '@/lib/api/numoni'

interface AccountingOverviewTabProps {
  assets: number
  cogs: number
  equity: number
  gross: number
  liabilities: number
  monthTrend: AccountingMonth[]
  net: number
  opex: number
  revenue: number
}

export function AccountingOverviewTab({ assets, cogs, equity, gross, liabilities, monthTrend, net, opex, revenue }: AccountingOverviewTabProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <motion.div variants={{ item: {} }} initial="hidden" animate="show"><KpiCard label="Revenue (MTD)" numeric={revenue} format={fmtNairaCompact} delta={13.9} icon={TrendingUp} sub="spread · fees · licences · subscriptions" /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="Cost of sales" numeric={cogs} format={fmtNairaCompact} icon={Receipt} tint="orange" sub="redemptions · rails · SMS · KYC" /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="Gross profit" numeric={gross} format={fmtNairaCompact} delta={16.2} icon={PiggyBank} tint="purple" sub={`${Math.round((gross / revenue) * 100)}% gross margin`} /></motion.div>
        <motion.div initial="hidden" animate="show"><KpiCard label="Net profit (MTD)" numeric={net} format={fmtNairaCompact} delta={1.5} icon={Wallet} tint="sky" sub={`${Math.round((net / revenue) * 100)}% net margin after ₦${(opex / 1e6).toFixed(1)}M opex`} /></motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card-surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold">Revenue vs cost of doing business</h3>
            <Pill tone="green">profitable 6 months straight</Pill>
          </div>
          <p className="text-xs text-muted-foreground mb-4">₦ millions · revenue against COGS + operating expenses</p>
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={monthTrend}>
              <defs>
                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#02DC4D" stopOpacity={0.35} /><stop offset="100%" stopColor="#02DC4D" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="m" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartTooltip} />
              <Area isAnimationActive={false} type="monotone" dataKey="revenue" stroke="#02DC4D" fill="url(#revG)" strokeWidth={2} name="Revenue" />
              <Line isAnimationActive={false} type="monotone" dataKey="costs" stroke="#E8A33D" strokeWidth={2} dot={false} name="COGS + opex" />
              <Line isAnimationActive={false} type="monotone" dataKey="profit" stroke="#7C5CBF" strokeWidth={2} strokeDasharray="5 4" dot={false} name="Net profit" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-1">Where the money goes</h3>
          <p className="text-xs text-muted-foreground mb-2">Cost structure — October</p>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={[
                { name: 'Redemptions', v: cogs * 0.71, c: '#EF4444' },
                { name: 'Rails & SMS', v: cogs * 0.29, c: '#E8A33D' },
                { name: 'Payroll', v: opex * 0.58, c: '#7C5CBF' },
                { name: 'Growth', v: opex * 0.19, c: '#0EA5E9' },
                { name: 'Infra & ops', v: opex * 0.23, c: '#02DC4D' },
              ]} dataKey="v" nameKey="name" innerRadius={40} outerRadius={64} paddingAngle={3} strokeWidth={0} isAnimationActive={false}>
                {[0, 1, 2, 3, 4].map((i) => <Cell key={i} fill={['#EF4444', '#E8A33D', '#7C5CBF', '#0EA5E9', '#02DC4D'][i]} />)}
              </Pie>
              <Tooltip contentStyle={chartTooltip} formatter={(v: number) => [fmtNairaCompact(v)]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {[
              ['Redemptions (points cost)', '#EF4444', cogs * 0.71],
              ['Rails, SMS & KYC', '#E8A33D', cogs * 0.29],
              ['Payroll & benefits', '#7C5CBF', opex * 0.58],
              ['Marketing & growth', '#0EA5E9', opex * 0.19],
              ['Infra, office & prof. fees', '#02DC4D', opex * 0.23],
            ].map(([n, c, v]) => (
              <div key={n as string} className="flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: c as string }} />
                <span className="flex-1 text-muted-foreground">{n as string}</span>
                <span className="tnum font-semibold">{fmtNairaCompact(v as number)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface p-5 mt-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-brand" />
          <span className="text-sm font-bold">Trial balance check</span>
          <Pill tone="green"><CheckCircle2 className="h-3 w-3" /> Debits = Credits · ₦{(assets + cogs + opex).toLocaleString()} = ₦{(liabilities + equity + revenue).toLocaleString()}</Pill>
          <span className="text-[10px] text-muted-foreground ml-auto tnum">last closed Oct 10 · 00:05</span>
        </div>
      </div>
    </div>
  )
}
