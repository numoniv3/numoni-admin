'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { checkStoreSlug, getSubscriptionAmount } from '@/lib/api/numoni/marketplace.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import { useMsQuery } from '@/modules/ms/api/ms-hooks'
import {
  MERCHANT_OPS, useCreateStore, useMerchantTaxonomyTrees, useMyStores, useStore, useStoreOverview, useStorePolicies,
} from '@/modules/ms/api/useMarketplaceMerchant'
import { ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'
import { CustomersPanel, ReviewsPanel } from './CustomersReviews'
import { OrdersPanel } from './OrdersPanel'
import { ProductsPanel } from './ProductsPanel'
import { StoreSettings } from './StoreSettings'
import { STORE_CREATE } from './store-fields'
import { useUploadProgress } from '@/modules/ms/components/shared/use-upload-progress'

const PERIODS = [{ v: 'this-week', l: 'This week' }, { v: 'this-month', l: 'This month' }, { v: 'this-year', l: 'This year' }] as const

function Overview({ storeId }: { storeId: string }) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]['v']>('this-month')
  const trees = useMerchantTaxonomyTrees()
  return (
    <div className="space-y-4">
      <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
        <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
        <SelectContent>{PERIODS.map((p) => <SelectItem key={p.v} value={p.v}>{p.l}</SelectItem>)}</SelectContent>
      </Select>
      <ReadCard title="Store performance" query={useStoreOverview(storeId, { period })} />
      <div className="grid lg:grid-cols-2 gap-4">
        <ReadCard title="Standard policies" query={useStorePolicies()} />
        <ReadCard title="Store subscription" query={useMsQuery(numoniKeys.marketplace.getSubscriptionAmount(), getSubscriptionAmount)} />
        <ReadCard title="Product categories" query={trees.tree} />
        <ReadCard title="Industry taxonomy" query={trees.v2} />
      </div>
    </div>
  )
}

function SlugCheck() {
  const [slug, setSlug] = useState('')
  const q = useMsQuery(numoniKeys.marketplace.checkStoreSlug(slug), () => checkStoreSlug(slug), { enabled: slug.length > 2 })
  const r = recordOf(q.data)
  return (
    <div className="flex items-center gap-2">
      <Input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="Check a store link" className="w-56" />
      {q.data !== undefined && <span className={`text-xs ${r.available === false ? 'text-red-500' : 'text-brand'}`}>{r.available === false ? 'Taken' : 'Available'}</span>}
    </div>
  )
}

/** Merchant → Marketplace MS: their online stores, products, orders, customers, reviews and settings. */
export function OnlineStorePage() {
  const stores = useMyStores()
  const create = useCreateStore()
  const upload = useUploadProgress()
  const [creating, setCreating] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const list = stores.data?.stores ?? []
  const storeId = picked ?? list[0]?.id ?? null
  const store = useStore(storeId ?? '')

  return (
    <div>
      <SectionTitle
        title="Online Store"
        sub="Your nuMoni marketplace stores — products, orders and customers."
        right={<Button onClick={() => setCreating(true)} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> New store</Button>}
      />
      <QueryView query={stores}>
        {() => (list.length === 0 ? (
          <div className="card-surface p-8 text-center text-sm text-muted-foreground">You don’t have a store yet — create one to start selling.</div>
        ) : (
          <>
            {list.length > 1 && (
              <Select value={storeId ?? undefined} onValueChange={setPicked}>
                <SelectTrigger className="w-72 mb-4"><SelectValue /></SelectTrigger>
                <SelectContent>{list.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.status.toLowerCase()}</SelectItem>)}</SelectContent>
              </Select>
            )}
            {storeId && (
              <PageTabs key={storeId} tabs={[
                { id: 'overview', label: 'Overview', content: <Overview storeId={storeId} /> },
                { id: 'products', label: 'Products', content: <ProductsPanel storeId={storeId} ops={MERCHANT_OPS} /> },
                { id: 'orders', label: 'Orders', content: <OrdersPanel storeId={storeId} /> },
                { id: 'customers', label: 'Customers', content: <CustomersPanel storeId={storeId} /> },
                { id: 'reviews', label: 'Reviews', content: <ReviewsPanel storeId={storeId} /> },
                { id: 'settings', label: 'Settings', content: <QueryView query={store}>{(s) => <StoreSettings store={s} ops={MERCHANT_OPS} />}</QueryView> },
              ]} />
            )}
          </>
        ))}
      </QueryView>
      <ActionSheet
        open={creating} onOpenChange={setCreating} title="New store" sub="Pay the store subscription afterwards to start selling."
        fields={STORE_CREATE} initial={{ storeType: 'PRODUCT', country: 'Nigeria' }} submitLabel="Create store" pendingLabel={upload.label('Creating store…')} pending={create.isPending}
        onSubmit={(v) => create.mutate({ body: v as never, onProgress: upload.onProgress }, { onSuccess: (s) => { setPicked(s.id); setCreating(false) }, onSettled: upload.reset })}
      >
        <SlugCheck />
      </ActionSheet>
    </div>
  )
}
