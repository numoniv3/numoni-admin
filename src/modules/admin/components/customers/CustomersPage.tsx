'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { ShieldCheck, Users } from 'lucide-react'
import { Pill, SectionTitle, KpiCard, stagger } from '@/components/ui/kit'
import { FormSheet } from '@/components/ui/form-sheet'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fmtNaira, fmtNairaCompact, fmtPts } from '@/lib/format'
import { useAdminCustomersQuery, useAdminCustomerSegmentsQuery } from '../../api/useAdminQueries'
import { DataTable } from '@/components/ui/data-table'

// ── Customers ────────────────────────────────────────────────────────────────
export function CustomersPage() {
  const { data: customers } = useAdminCustomersQuery()
  const { data: segmentData } = useAdminCustomerSegmentsQuery()
  const [seg, setSeg] = useState('all')
  const [open, setOpen] = useState<string | null>(null)
  const rows = customers.filter((c) => seg === 'all' || c.segment.toLowerCase().includes(seg))
  const sel = customers.find((c) => c.id === open)
  return (
    <div>
      <SectionTitle
        title="Customers"
        sub="Anonymised base — identities stay masked, behaviour stays visible."
        right={
          <div className="flex items-center gap-2">
            <ExportCsvButton
              filename="numoni-customers"
              headers={['ID', 'Customer', 'Segment', 'KYC tier', 'Wallet balance (pt)', 'Brand wallets', 'Lifetime ₦', 'Last active', 'Location', 'Status']}
              rows={rows.map((c) => [c.id, c.alias, c.segment, `Tier ${c.kyc}`, c.balance, c.brandWallets, c.lifetime, c.lastActive, c.location, c.status])}
            />
            <Tabs value={seg} onValueChange={setSeg}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="power">Power</TabsTrigger>
                <TabsTrigger value="dormant">Dormant</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />
      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <motion.div variants={stagger.item} initial="hidden" animate="show"><KpiCard label="Repeat rate" value="64%" delta={3.2} icon={Users} sub="2+ purchases in 30 days" /></motion.div>
        <motion.div variants={stagger.item} initial="hidden" animate="show" transition={{ delay: 0.05 }}><KpiCard label="KYC Tier 2+" value="41%" icon={ShieldCheck} tint="purple" sub="of active base" /></motion.div>
        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-1 text-sm">Segments</h3>
          <ResponsiveContainer width="100%" height={110}>
            <PieChart>
              <Pie data={segmentData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={48} paddingAngle={3} strokeWidth={0}>
                {segmentData.map((s) => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {segmentData.map((s) => (
              <span key={s.name} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />{s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            className="w-full text-sm min-w-[720px]"
            data={rows}
            getRowId={(c) => c.id}
            rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors cursor-pointer"
            onRowClick={(c) => setOpen(c.id)}
            columns={[
              { id: 'customer', header: 'Customer', meta: { cellClassName: 'font-medium' }, cell: ({ row: { original: c } }) => <>{c.alias} <span className="text-[10px] text-muted-foreground tnum">{c.id}</span></> },
              { id: 'segment', header: 'Segment', meta: { cellClassName: 'text-muted-foreground' }, cell: ({ row: { original: c } }) => c.segment },
              { id: 'kyc', header: 'KYC', cell: ({ row: { original: c } }) => <Pill tone={c.kyc === 3 ? 'green' : c.kyc === 2 ? 'purple' : 'neutral'}>Tier {c.kyc}</Pill> },
              { id: 'globalWallet', header: 'Global Wallet', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: c } }) => fmtPts(c.balance) },
              { id: 'brandWallets', header: 'Brand wallets', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: c } }) => c.brandWallets },
              { id: 'lifetimeSpend', header: 'Lifetime spend', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: c } }) => fmtNairaCompact(c.lifetime) },
              { id: 'lastActive', header: 'Last active', meta: { cellClassName: 'text-muted-foreground' }, cell: ({ row: { original: c } }) => c.lastActive },
              { id: 'location', header: 'Location', meta: { cellClassName: 'text-muted-foreground' }, cell: ({ row: { original: c } }) => c.location },
              { id: 'status', header: 'Status', cell: ({ row: { original: c } }) => <Pill tone={c.status === 'Active' ? 'green' : c.status === 'New' ? 'sky' : 'orange'}>{c.status}</Pill> },
            ]}
          />
        </div>
      </div>

      <FormSheet open={!!sel} onOpenChange={(o) => !o && setOpen(null)} title={sel?.alias ?? ''} sub={sel ? `${sel.id} · ${sel.segment} · ${sel.location}` : ''}>
        {sel && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Pill tone={sel.kyc === 3 ? 'green' : sel.kyc === 2 ? 'purple' : 'neutral'}>KYC Tier {sel.kyc}</Pill>
              <Pill tone={sel.status === 'Active' ? 'green' : sel.status === 'New' ? 'sky' : 'orange'}>{sel.status}</Pill>
              <span className="text-[10px] text-muted-foreground ml-auto tnum">last active {sel.lastActive}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Global wallet', fmtPts(sel.balance)],
                ['Brand wallets', String(sel.brandWallets)],
                ['Lifetime spend', fmtNaira(sel.lifetime, 0)],
                ['Est. LTV', fmtNaira(Math.round(sel.lifetime * 0.07), 0)],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl border p-3">
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                  <div className="tnum font-bold mt-0.5">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="label-caps mb-2">Recent behaviour</div>
              <div className="space-y-2">
                {[
                  ['Earned points at checkout', '2d ago', `+${fmtPts(320)}`],
                  ['Redeemed at partner store', '5d ago', `-${fmtPts(1500)}`],
                  ['Funded wallet via NIP', '1w ago', fmtNaira(5000, 0)],
                ].map(([t, w, a]) => (
                  <div key={t} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                    <div>
                      <div className="font-medium">{t}</div>
                      <div className="text-[10px] text-muted-foreground tnum">{w}</div>
                    </div>
                    <span className="tnum font-semibold">{a}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-dashed p-3 text-[11px] text-muted-foreground">
              Identity stays masked (NDPR) — admins see behaviour and balances, never names, phones, or account numbers.
            </div>
          </div>
        )}
      </FormSheet>
    </div>
  )
}
