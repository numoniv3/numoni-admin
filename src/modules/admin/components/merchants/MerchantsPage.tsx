'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Store } from 'lucide-react'
import { SectionTitle, Pill, EmptyState } from '@/components/ui/kit'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fmtNairaCompact, fmtCompact } from '@/lib/format'
import { type MerchantStatus } from '@/lib/api/numoni/types/platform'
import { DataTable } from '@/components/ui/data-table'
import { useAdminMerchantsQuery } from '../../api/useAdminQueries'

const statusTone: Record<MerchantStatus, 'green' | 'orange' | 'red' | 'neutral'> = {
  Active: 'green',
  'Pending KYC': 'orange',
  Suspended: 'red',
  Onboarding: 'neutral',
}

export function MerchantsPage() {
  const { data: merchants } = useAdminMerchantsQuery()
  const [q, setQ] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const router = useRouter()

  const rows = useMemo(
    () =>
      merchants.filter(
        (m) =>
          (q === '' || m.name.toLowerCase().includes(q.toLowerCase()) || m.location.toLowerCase().includes(q.toLowerCase())) &&
          (type === 'all' || m.type === type) &&
          (status === 'all' || m.status === status),
      ),
    [merchants, q, type, status],
  )

  return (
    <div>
      <SectionTitle title="Merchants" sub={`${merchants.length} businesses on the network · click a row for Merchant 360`} />

      <div className="flex flex-wrap gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or location…" className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {['Retail', 'Brand', 'FMCG', 'Importer', 'Fintech', 'Online Seller'].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {['Active', 'Pending KYC', 'Suspended', 'Onboarding'].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {rows.length === 0 ? (
        <div className="card-surface"><EmptyState icon={Store} title="No merchants match" sub="Try clearing a filter or searching a different name." /></div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="card-surface overflow-hidden hidden md:block">
            <DataTable
              data={rows}
              getRowId={(m) => m.id}
              rowClassName="border-b last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
              rowMotion={(i) => ({ initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.03 } })}
              onRowClick={(m) => router.push(`/admin/merchants/${m.id}`)}
              columns={[
                { id: 'merchant', header: 'Merchant', meta: { cellClassName: 'font-medium' }, cell: ({ row: { original: m } }) => m.name },
                { id: 'type', header: 'Type', meta: { cellClassName: 'text-muted-foreground' }, cell: ({ row: { original: m } }) => m.type },
                {
                  id: 'services',
                  header: 'Services',
                  cell: ({ row: { original: m } }) => (
                    <div className="flex flex-wrap gap-1">
                      {m.services.slice(0, 2).map((s) => (
                        <Pill key={s} tone={s.includes('V2') ? 'purple' : s.includes('V3') ? 'orange' : 'neutral'}>{s}</Pill>
                      ))}
                    </div>
                  ),
                },
                { id: 'location', header: 'Location', meta: { cellClassName: 'text-muted-foreground' }, cell: ({ row: { original: m } }) => m.location },
                { id: 'joined', header: 'Joined', meta: { cellClassName: 'text-muted-foreground tnum' }, cell: ({ row: { original: m } }) => m.joined },
                { id: 'txns', header: 'Txns', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: m } }) => fmtCompact(m.transactions) },
                { id: 'customers', header: 'Customers', meta: { cellClassName: 'tnum' }, cell: ({ row: { original: m } }) => fmtCompact(m.customers) },
                { id: 'bestSeller', header: 'Best seller', meta: { cellClassName: 'text-muted-foreground max-w-[140px] truncate' }, cell: ({ row: { original: m } }) => m.bestSeller },
                { id: 'status', header: 'Status', cell: ({ row: { original: m } }) => <Pill tone={statusTone[m.status]}>{m.status}</Pill> },
              ]}
            />
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {rows.map((m, i) => (
              <motion.button
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => router.push(`/admin/merchants/${m.id}`)}
                className="card-surface w-full text-left p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.type} · {m.location}</div>
                  </div>
                  <Pill tone={statusTone[m.status]}>{m.status}</Pill>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="rounded-lg bg-muted/60 py-2">
                    <div className="tnum text-sm font-bold">{fmtCompact(m.transactions)}</div>
                    <div className="text-[10px] text-muted-foreground">Txns</div>
                  </div>
                  <div className="rounded-lg bg-muted/60 py-2">
                    <div className="tnum text-sm font-bold">{fmtCompact(m.customers)}</div>
                    <div className="text-[10px] text-muted-foreground">Customers</div>
                  </div>
                  <div className="rounded-lg bg-muted/60 py-2">
                    <div className="tnum text-sm font-bold">{fmtNairaCompact(m.gmv)}</div>
                    <div className="text-[10px] text-muted-foreground">GMV</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
