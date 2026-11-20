'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import type { StoreResponseDto } from '@/lib/api/numoni'
import { useMkBlockStore, useMkCommission, useMkCommissionAudits, useMkStoreStatus } from '@/modules/ms/api/useMarketplaceAdmin'
import { ADMIN_OPS, useStoreAction } from '@/modules/ms/api/useMarketplaceMerchant'
import { useSlugProducts } from '@/modules/ms/api/useStorefront'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ProductSheet } from '@/modules/ms/components/marketplace/ProductSheet'
import { StoreSettings } from '@/modules/ms/components/marketplace/StoreSettings'

function Moderation({ store }: { store: Row }) {
  const id = String(store.id)
  const status = useMkStoreStatus()
  const block = useMkBlockStore()
  const commission = useMkCommission()
  const audits = useMkCommissionAudits(id)
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4">
        <div className="label-caps mb-3">Status</div>
        <ActionForm fields={[{ key: 'status', label: 'Status', kind: 'select', options: ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DRAFT'], required: true }, { key: 'reason', label: 'Reason (required to suspend or deactivate)', kind: 'textarea' }]}
          initial={{ status: store.status }} submitLabel="Change status" pending={status.isPending} onSubmit={(v) => status.mutate({ id, status: v.status as never, reason: v.reason as string | undefined })} />
      </div>
      <div className="rounded-2xl border p-4">
        <div className="label-caps mb-3">Block (legacy)</div>
        <ActionForm fields={[{ key: 'block', label: 'Blocked', kind: 'switch' }, { key: 'reason', label: 'Reason' }]} initial={{ block: store.status === 'SUSPENDED' }}
          submitLabel="Save" pending={block.isPending} onSubmit={(v) => block.mutate({ id, block: v.block === true, reason: v.reason as string | undefined })} />
      </div>
      <div className="rounded-2xl border p-4 space-y-3">
        <div className="label-caps">nuMoni commission</div>
        <ActionForm fields={[{ key: 'commissionPercent', label: 'Commission (%)', kind: 'number', required: true }, { key: 'reason', label: 'Reason' }]}
          initial={{ commissionPercent: store.commissionPercent }} submitLabel="Update commission" pending={commission.isPending}
          onSubmit={(v) => commission.mutate({ id, commissionPercent: Number(v.commissionPercent), reason: v.reason as string | undefined })} />
        <div className="label-caps">History</div>
        <QueryView query={audits}>{(d) => <DataView data={listOf(d) ?? []} empty="No changes yet" />}</QueryView>
      </div>
    </div>
  )
}

function Products({ store }: { store: Row }) {
  const id = String(store.id)
  const list = useSlugProducts(String(store.slug ?? ''), { limit: 50 })
  const importCsv = useStoreAction((file: File) => ADMIN_OPS.importProducts(id, file), 'Import finished', 'Couldn’t import the products')
  const [adding, setAdding] = useState(false)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <Button onClick={() => setAdding(true)} className="rounded-full bg-brand text-black hover:bg-brand/90">Add product for merchant</Button>
        <label className="text-xs text-muted-foreground flex items-center gap-2">Import CSV
          <Input type="file" accept=".csv,text/csv" className="w-56" disabled={importCsv.isPending} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) importCsv.mutate(f) }} />
        </label>
      </div>
      <QueryView query={list}>{(d) => <DataView data={listOf(d) ?? []} columns={['name', 'category', 'price', 'discountPercent', 'quantity', 'status']} empty="No published products" />}</QueryView>
      <ProductSheet storeId={id} product={null} open={adding} onOpenChange={setAdding} categories={[]} ops={ADMIN_OPS} admin />
    </div>
  )
}

/** Admin view of one store: details, moderation & commission, on-behalf settings and products. */
export function AdminStoreSheet({ store, onClose }: { store: Row | null; onClose: () => void }) {
  return (
    <FormSheet open={!!store} onOpenChange={(o) => !o && onClose()} title={String(store?.name ?? '')} sub={String(store?.slug ?? '')} wide>
      {store && (
        <PageTabs tabs={[
          { id: 'details', label: 'Details', content: <RecordView data={store} /> },
          { id: 'moderation', label: 'Moderation', content: <Moderation store={store} /> },
          { id: 'settings', label: 'Settings (on behalf)', content: <StoreSettings store={store as unknown as StoreResponseDto} ops={ADMIN_OPS} admin /> },
          { id: 'products', label: 'Products', content: <Products store={store} /> },
        ]} />
      )}
    </FormSheet>
  )
}
