'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowLeft, Coins, Landmark, MapPin, Phone, Star, Store, Users } from 'lucide-react'
import { KpiCard, Pill, stagger } from '@/components/ui/kit'
import { fmtNaira, fmtNairaCompact, fmtCompact, initials } from '@/lib/format'
import { useAdminMerchantPerformanceQuery, useAdminMerchantsQuery, useAdminProductsQuery, useAdminTransactionsQuery } from '../../api/useAdminQueries'

export function Merchant360Page({ id }: { id: string }) {
  const { data: merchants } = useAdminMerchantsQuery()
  const { data: products } = useAdminProductsQuery()
  const { data: transactions } = useAdminTransactionsQuery()
  const { data: { volume, settlements } } = useAdminMerchantPerformanceQuery(id)
  const m = merchants.find((x) => x.id === id) ?? merchants[0]
  const merchantProducts = products.filter((p) => p.merchant === m.name)
  const merchantTxns = transactions.filter((t) => t.merchant === m.name)

  return (
    <div>
      <Link href="/admin/merchants" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="h-4 w-4" /> All merchants
      </Link>

      {/* Profile header */}
      <div className="card-surface p-6 mb-5">
        <div className="flex flex-wrap items-start gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 text-brand font-display text-xl font-bold">
            {initials(m.name)}
          </span>
          <div className="flex-1 min-w-[220px]">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-bold tracking-tight">{m.name}</h1>
              <Pill tone={m.status === 'Active' ? 'green' : 'orange'}>{m.status}</Pill>
              <Pill tone="purple">KYC Tier {m.tier}</Pill>
              <Pill tone={m.model === 'V2' ? 'purple' : m.model === 'V3' ? 'orange' : 'green'}>{m.model} {m.model === 'V1' ? 'Global Reward' : m.model === 'V2' ? 'Brand Wallet' : 'Product Discount'}</Pill>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5" /> {m.type} · {m.id}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {m.location}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {m.owner} · {m.phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {m.services.map((s) => (
              <Pill key={s} tone="neutral">{s}</Pill>
            ))}
          </div>
        </div>
      </div>

      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <motion.div variants={stagger.item}><KpiCard label="Lifetime GMV" numeric={m.gmv} format={fmtNairaCompact} delta={14.2} icon={Landmark} /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Reward liability" numeric={m.rewardLiability} format={fmtNairaCompact} icon={Coins} tint="orange" sub="Points outstanding at this merchant" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Customers" numeric={m.customers} format={(n) => fmtCompact(n)} delta={6.4} icon={Users} tint="sky" /></motion.div>
        <motion.div variants={stagger.item}><KpiCard label="Impressions" numeric={m.impressions} format={(n) => fmtCompact(n)} icon={Star} tint="purple" sub="Storefront + app surfaces" /></motion.div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <div className="card-surface p-5 lg:col-span-2">
          <h3 className="font-display font-bold mb-1">Volume trend</h3>
          <p className="text-xs text-muted-foreground mb-3">Monthly GMV · ₦ millions</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volume}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#02DC4D" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#02DC4D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => [`₦${v}M`]} />
              <Area type="monotone" dataKey="v" stroke="#02DC4D" strokeWidth={2.5} fill="url(#gV)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-3">Settlement history</h3>
          <div className="space-y-2.5">
            {settlements.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium tnum">{s.id}</div>
                  <div className="text-xs text-muted-foreground">{s.date} · T+1 payout</div>
                </div>
                <div className="text-right">
                  <div className="tnum font-semibold">{fmtNaira(s.amount, 0)}</div>
                  <Pill tone={s.status === 'Paid' ? 'green' : 'orange'}>{s.status}</Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-3">Products {merchantProducts.length > 0 && `(${merchantProducts.length})`}</h3>
          {merchantProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Catalogue managed via merchant dashboard.</p>
          ) : (
            <div className="space-y-2">
              {merchantProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.category} · {fmtCompact(p.sold)} sold</div>
                  </div>
                  <div className="text-right">
                    <div className="tnum font-semibold">{fmtNaira(p.price, 0)}</div>
                    {p.discount && <Pill tone="orange">-{p.discount}% V3</Pill>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-3">Recent activity & disputes</h3>
          <div className="space-y-2">
            {(merchantTxns.length > 0 ? merchantTxns : transactions.slice(0, 3)).map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl border p-3 text-sm">
                <div>
                  <div className="font-medium">{t.type} · {t.customer}</div>
                  <div className="text-xs text-muted-foreground tnum">{t.id} · {t.rail} · {t.time}</div>
                </div>
                <div className="text-right">
                  <div className="tnum font-semibold">{t.amount > 0 ? fmtNaira(t.amount, 0) : `${t.points} pt`}</div>
                  <Pill tone={t.status === 'Success' ? 'green' : t.status === 'Pending' ? 'orange' : 'red'}>{t.status}</Pill>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-dashed p-3 text-center text-xs text-muted-foreground">
            0 open disputes · last resolved 12 days ago
          </div>
        </div>
      </div>
    </div>
  )
}
