'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCustomer, useStoreCustomers, useStoreReviews, useUpdateCustomer } from '@/modules/ms/api/useMarketplaceMerchant'
import { ActionSheet, type Field } from '@/modules/ms/components/shared/ActionForm'
import { Pager, RowButton, pageInfo, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'

const CUSTOMER: Field[] = [
  { key: 'name', label: 'Name', required: true },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Phone', kind: 'phone' },
  { key: 'country', label: 'Country', placeholder: 'Nigeria' },
]

/** `…/customers`: list (search), add, edit. */
export function CustomersPanel({ storeId }: { storeId: string }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const q = useStoreCustomers(storeId, page, search.trim() || undefined)
  const create = useCreateCustomer()
  const update = useUpdateCustomer()
  const sheet = useSheet<'add' | 'edit'>()
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search customers" className="pl-9 w-64" />
        </div>
        <Button onClick={() => sheet.show('add')} className="ml-auto rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> Add customer</Button>
      </div>
      <QueryView query={q}>
        {(d) => (
          <>
            <DataView data={d.data} empty="No customers yet" columns={['name', 'email', 'phone', 'country', 'createdAt']} rowActions={(r) => <RowButton onClick={() => sheet.show('edit', r)}>Edit</RowButton>} />
            <Pager page={page} setPage={setPage} hasNext={page < (d.lastpage ?? 1)} total={d.count} />
          </>
        )}
      </QueryView>
      <ActionSheet open={sheet.kind !== null} onOpenChange={sheet.onOpenChange} title={sheet.is('edit') ? 'Edit customer' : 'Add customer'}
        fields={CUSTOMER} initial={sheet.target} submitLabel="Save customer" pending={create.isPending || update.isPending}
        onSubmit={(body) => (sheet.is('edit')
          ? update.mutate({ storeId, id: String((sheet.target as Row).id), body }, { onSuccess: sheet.close })
          : create.mutate({ storeId, body: body as never }, { onSuccess: sheet.close }))} />
    </div>
  )
}

/** `…/reviews` for the store. */
export function ReviewsPanel({ storeId }: { storeId: string }) {
  const [page, setPage] = useState(1)
  const q = useStoreReviews(storeId, page)
  return (
    <QueryView query={q}>
      {(d) => (
        <>
          <DataView data={listOf(d) ?? []} empty="No reviews yet" columns={['rating', 'comment', 'customerName', 'productId', 'createdAt']} />
          <Pager page={page} setPage={setPage} {...pageInfo(d, page, 20)} />
        </>
      )}
    </QueryView>
  )
}
