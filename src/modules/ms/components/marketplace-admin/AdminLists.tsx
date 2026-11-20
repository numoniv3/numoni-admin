'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useMarkReport, useMkAuditLogs, useMkCreateStoreFor, useMkDashboard, useMkFinance, useMkMovements, useMkOwners, useMkRecentOrders, useMkReports,
  useMkSales, useMkStoreStats, useMkStores,
} from '@/modules/ms/api/useMarketplaceAdmin'
import { ActionForm, ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { RowButton } from '@/modules/ms/components/shared/bits'
import { RecordView, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { FilteredList, type Filter, type UseList } from '@/modules/ms/components/shared/FilteredList'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { STORE_CREATE } from '@/modules/ms/components/marketplace/store-fields'
import { AdminStoreSheet } from './AdminStoreSheet'

const ORDER: Filter = { key: 'status', label: 'Order status', kind: 'select', options: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'] }
const PAYMENT: Filter = { key: 'paymentStatus', label: 'Payment', kind: 'select', options: ['PENDING', 'PARTIAL', 'PAID', 'FAILED', 'REFUNDED'] }
const STORE_STATUS: Filter = { key: 'status', label: 'Status', kind: 'select', options: ['DRAFT', 'ACTIVE', 'INACTIVE', 'SUSPENDED'] }
const DATES: Filter[] = [{ key: 'startDate', label: 'From', kind: 'date' }, { key: 'endDate', label: 'To', kind: 'date' }]
const Totals = ({ data }: { data: unknown }) => {
  const r = recordOf(data)
  const scalars = Object.fromEntries(Object.entries(r).filter(([, v]) => typeof v !== 'object' || v === null))
  return Object.keys(scalars).length ? <div className="mb-4"><RecordView data={scalars} /></div> : null
}

export function DashboardTab() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'all_time'>('month')
  return (
    <div className="space-y-4">
      <div className="flex gap-1.5">{(['day', 'week', 'month', 'all_time'] as const).map((p) => <button key={p} onClick={() => setPeriod(p)} className={`rounded-full border px-3 py-1 text-xs font-semibold ${period === p ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>{p.replace('_', ' ')}</button>)}</div>
      <ReadCard title="E-commerce dashboard" query={useMkDashboard({ period })} />
      <ReadCard title="Recent orders" query={useMkRecentOrders({ period })} />
      <ReadCard title="Store counters" query={useMkStoreStats()} />
    </div>
  )
}

export const SalesTab = () => (
  <FilteredList filters={[{ key: 'search', label: 'Order, customer or store' }, ORDER, PAYMENT, { key: 'country', label: 'Country' }, ...DATES]}
    useList={useMkSales as UseList} columns={['orderNumber', 'storeName', 'customerName', 'totalAmount', 'status', 'paymentStatus', 'createdAt']} empty="No sales" />
)

export function StoresTab() {
  const [open, setOpen] = useState<Row | null>(null)
  const [creating, setCreating] = useState(false)
  const create = useMkCreateStoreFor()
  return (
    <div>
      <div className="flex justify-end mb-3"><Button onClick={() => setCreating(true)} className="rounded-full bg-brand text-black hover:bg-brand/90"><Plus className="h-4 w-4 mr-1.5" /> Create store for a merchant</Button></div>
      <FilteredList
        filters={[{ key: 'search', label: 'Store name' }, STORE_STATUS, { key: 'type', label: 'Type', kind: 'select', options: ['PRODUCT', 'SERVICE'] }, { key: 'country', label: 'Country' }, { key: 'merchantId', label: 'Merchant ID' }, { key: 'createdFrom', label: 'Created from', kind: 'date' }]}
        useList={useMkStores as UseList} columns={['name', 'slug', 'status', 'storeType', 'country', 'isPaid', 'createdAt']}
        onRowClick={setOpen} rowActions={(r) => <RowButton onClick={() => setOpen(r)}>Manage</RowButton>} empty="No stores"
      />
      <AdminStoreSheet store={open} onClose={() => setOpen(null)} />
      <ActionSheet open={creating} onOpenChange={setCreating} title="Create store for a merchant"
        fields={[{ key: 'ownerId', label: 'Merchant user ID (owner)', required: true }, ...STORE_CREATE]} initial={{ storeType: 'PRODUCT', country: 'Nigeria' }}
        submitLabel="Create store" pending={create.isPending}
        onSubmit={({ ownerId, ...body }) => create.mutate({ ownerId: String(ownerId), body: body as never }, { onSuccess: () => setCreating(false) })} />
    </div>
  )
}

export const OwnersTab = () => (
  <FilteredList filters={[{ key: 'search', label: 'Owner name or email' }, STORE_STATUS, { key: 'sortBy', label: 'Sort', kind: 'select', options: ['dateJoined', 'totalStores', 'revenue'] }, { key: 'sortOrder', label: 'Order', kind: 'select', options: ['desc', 'asc'] }]}
    useList={useMkOwners as UseList} empty="No store owners" />
)

export function ReportsTab() {
  const mark = useMarkReport()
  return (
    <FilteredList filters={[{ key: 'search', label: 'Search' }, { key: 'priority', label: 'Priority', kind: 'select', options: ['LOW', 'HIGH', 'CRITICAL'] }, { key: 'status', label: 'Status', kind: 'select', options: ['PENDING_REVIEW', 'OPENED', 'RESOLVED'] }]}
      useList={useMkReports as UseList} columns={['subject', 'message', 'priority', 'status', 'customerName', 'createdAt']} empty="No reports"
      rowActions={(r) => (['OPENED', 'PENDING_REVIEW', 'RESOLVED'] as const).filter((s) => s !== r.status).map((s) => (
        <RowButton key={s} onClick={() => mark.mutate({ id: String(r.id), to: s })} disabled={mark.isPending}>{s === 'OPENED' ? 'Open' : s === 'RESOLVED' ? 'Resolve' : 'Pending'}</RowButton>
      ))} />
  )
}

export function FinanceTab() {
  const [type, setType] = useState<'' | 'ORDER_SETTLEMENT' | 'STORE_SUBSCRIPTION'>('')
  return (
    <div className="space-y-4">
      <ActionForm fields={[{ key: 'type', label: 'Movement type', kind: 'select', options: ['ORDER_SETTLEMENT', 'STORE_SUBSCRIPTION'] }]} submitLabel="Show analytics" onSubmit={(v) => setType((v.type as typeof type) ?? '')} />
      <ReadCard title="Money movement analytics" query={useMkFinance({ period: 'month', type: type || undefined })} />
      <FilteredList filters={[{ key: 'type', label: 'Type', kind: 'select', options: ['ORDER_SETTLEMENT', 'STORE_SUBSCRIPTION'] }, { key: 'storeId', label: 'Store ID' }, { key: 'orderId', label: 'Order ID' }, ...DATES]}
        useList={useMkMovements as UseList} header={(d) => <Totals data={d} />} empty="No money movements" />
    </div>
  )
}

export const AuditTab = () => (
  <FilteredList filters={[{ key: 'action', label: 'Action' }, { key: 'entityType', label: 'Entity type' }, { key: 'entityId', label: 'Entity ID' }, { key: 'actorType', label: 'Actor type' }, { key: 'actorEmail', label: 'Actor email' }]}
    useList={useMkAuditLogs as UseList} columns={['action', 'entityType', 'entityId', 'actorEmail', 'actorType', 'createdAt']} empty="No audit entries" />
)

