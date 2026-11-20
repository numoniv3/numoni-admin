'use client'

import { useState } from 'react'
import { ArrowLeft, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useAddReview, useMyStoreOrders, useReportStore, useSlugCategories, useSlugFeatured, useSlugProducts, useSlugReviews, useStoreBySlug, useStoreReviewsById,
} from '@/modules/ms/api/useStorefront'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { DataView, listOf } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { Chips, ProductGrid, storeOf, type ProductCard } from './items'

function Products({ slug, storeId, onProduct }: { slug: string; storeId: string; onProduct: (p: ProductCard) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const featured = useSlugFeatured(slug)
  const cats = useSlugCategories(slug)
  const products = useSlugProducts(slug, { search: search || undefined, category: category || undefined, limit: 30 })
  const open = (p: ProductCard) => onProduct({ ...p, storeSlug: slug, storeId: p.storeId || storeId })
  return (
    <div className="space-y-4">
      <QueryView query={featured}>{(d) => (listOf(d)?.length ? <div className="space-y-2"><div className="label-caps">Featured</div><ProductGrid data={d} onOpen={open} /></div> : null)}</QueryView>
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search this store" />
      <QueryView query={cats}>{(d) => <Chips data={d} active={category} onPick={setCategory} />}</QueryView>
      <QueryView query={products}>{(d) => <ProductGrid data={d} onOpen={open} />}</QueryView>
    </div>
  )
}

function Reviews({ slug, storeId }: { slug: string; storeId: string }) {
  const bySlug = useSlugReviews(slug)
  const byId = useStoreReviewsById(storeId)
  const add = useAddReview()
  const rows = listOf(bySlug.data) ?? listOf(byId.data) ?? []
  return (
    <div className="space-y-4">
      <QueryView query={bySlug}>{() => <DataView data={rows} columns={['rating', 'comment', 'reviewerName', 'createdAt']} maxColumns={4} empty="No reviews yet" />}</QueryView>
      <div className="rounded-2xl border p-4">
        <div className="label-caps mb-3">Leave a review</div>
        <ActionForm
          fields={[{ key: 'rating', label: 'Rating (1–5)', kind: 'select', options: ['5', '4', '3', '2', '1'].map((v) => ({ value: v, label: '★'.repeat(Number(v)) })), required: true }, { key: 'comment', label: 'Comment', kind: 'textarea' }, { key: 'reviewerName', label: 'Your name' }]}
          submitLabel="Post review" pending={add.isPending} onSubmit={(v) => add.mutate({ storeId, body: { ...v, rating: Number(v.rating) } as never })}
        />
      </div>
    </div>
  )
}

function Report({ storeId }: { storeId: string }) {
  const report = useReportStore()
  return (
    <ActionForm
      fields={[
        { key: 'subject', label: 'Subject' },
        { key: 'priority', label: 'How serious', kind: 'select', options: ['LOW', 'HIGH', 'CRITICAL'] },
        { key: 'message', label: 'What happened', kind: 'textarea', required: true },
        { key: 'images', label: 'Screenshot links (up to 3)', kind: 'list' },
      ]}
      submitLabel="Report store" pending={report.isPending} onSubmit={(body) => report.mutate({ storeId, body: body as never })}
    >
      <p className="text-[11px] text-muted-foreground"><Flag className="h-3 w-3 inline mr-1" />Reports go to the nuMoni marketplace team.</p>
    </ActionForm>
  )
}

/** A store by its slug: products, reviews, my orders there, report. */
export function StoreView({ slug, onBack, onProduct, onOrder }: { slug: string; onBack?: () => void; onProduct: (p: ProductCard) => void; onOrder: (storeId: string, orderNumber: string) => void }) {
  const q = useStoreBySlug(slug)
  return (
    <QueryView query={q}>
      {(d) => {
        const raw = recordOf(d)
        const s = storeOf(raw)
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {onBack && <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-4 w-4" /></Button>}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {s.logo && <img src={s.logo} alt="" className="h-10 w-10 rounded-xl object-cover" />}
              <div className="min-w-0"><div className="font-bold truncate">{s.name}</div><div className="text-[11px] text-muted-foreground">{s.meta}</div></div>
            </div>
            {typeof raw.description === 'string' && <p className="text-xs text-muted-foreground">{raw.description}</p>}
            <PageTabs tabs={[
              { id: 'products', label: 'Shop', content: <Products slug={slug} storeId={s.id} onProduct={onProduct} /> },
              { id: 'reviews', label: 'Reviews', content: <Reviews slug={slug} storeId={s.id} /> },
              { id: 'orders', label: 'My orders', content: <MyStoreOrders storeId={s.id} onOrder={onOrder} /> },
              { id: 'report', label: 'Report', content: <Report storeId={s.id} /> },
            ]} />
          </div>
        )
      }}
    </QueryView>
  )
}

function MyStoreOrders({ storeId, onOrder }: { storeId: string; onOrder: (storeId: string, orderNumber: string) => void }) {
  const q = useMyStoreOrders(storeId)
  return <QueryView query={q}>{(d) => <DataView data={listOf(d) ?? []} columns={['orderNumber', 'status', 'paymentStatus', 'totalAmount', 'createdAt']} maxColumns={5} empty="No orders here yet" onRowClick={(r) => onOrder(storeId, String(r.orderNumber ?? ''))} />}</QueryView>
}
