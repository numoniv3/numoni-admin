'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductResponseDto } from '@/lib/api/numoni'
import { fmtNaira } from '@/lib/format'
import {
  useDeleteProduct, useMerchantTaxonomy, useProductFeatured, useProductVisibility, useStoreAction, useStoreProducts, type StoreOps,
} from '@/modules/ms/api/useMarketplaceMerchant'
import { ConfirmButton, Pager, RowButton, pageInfo } from '@/modules/ms/components/shared/bits'
import { DataView, listOf } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ProductSheet } from './ProductSheet'

const LIMIT = 20

/** A store's products with filters, toggles, edit and CSV import. */
export function ProductsPanel({ storeId, ops, admin }: { storeId: string; ops: StoreOps; admin?: boolean }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const q = useStoreProducts(storeId, { page, limit: LIMIT, search: search.trim() || undefined })
  const tax = useMerchantTaxonomy()
  const categories = (listOf(tax.categories.data) ?? []).map((c) => String(c.name ?? c.category ?? c.value ?? '')).filter(Boolean)
  const visibility = useProductVisibility()
  const featured = useProductFeatured()
  const remove = useDeleteProduct()
  const importCsv = useStoreAction((file: File) => ops.importProducts(storeId, file), 'Import finished', 'Couldn’t import the products')
  const [sheet, setSheet] = useState<{ product: ProductResponseDto | null } | null>(null)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search products" className="pl-9 w-64" />
        </div>
        <label className="text-xs text-muted-foreground flex items-center gap-2">Import CSV
          <Input type="file" accept=".csv,text/csv" className="w-56" disabled={importCsv.isPending} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) importCsv.mutate(f) }} />
        </label>
        <Button onClick={() => setSheet({ product: null })} className="ml-auto rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> New product</Button>
      </div>
      <QueryView query={q}>
        {(d) => (
          <>
            <DataView
              data={d.products.map((p) => ({ ...p, price: fmtNaira(Number(p.price), 0), discountPercent: `${p.discountPercent}%` }))}
              columns={['name', 'category', 'price', 'discountPercent', 'quantity', 'status', 'isVisible', 'isFeatured']} maxColumns={8} empty="No products"
              rowActions={(r) => {
                const p = d.products.find((x) => x.id === r.id)!
                return admin ? null : (
                  <>
                    <RowButton onClick={() => setSheet({ product: p })}>Edit</RowButton>
                    <RowButton onClick={() => visibility.mutate({ storeId, id: p.id, isVisible: !p.isVisible })}>{p.isVisible ? 'Hide' : 'Show'}</RowButton>
                    <RowButton onClick={() => featured.mutate({ storeId, id: p.id, isFeatured: !p.isFeatured })}>{p.isFeatured ? 'Unfeature' : 'Feature'}</RowButton>
                    <ConfirmButton danger label="Delete" title={`Delete ${p.name}?`} description="It’s removed from the store." onConfirm={() => remove.mutate({ storeId, id: p.id })} />
                  </>
                )
              }}
            />
            <Pager page={page} setPage={setPage} {...pageInfo({ total: d.count }, page, LIMIT)} total={d.count} />
          </>
        )}
      </QueryView>
      <ProductSheet storeId={storeId} product={sheet?.product ?? null} open={!!sheet} onOpenChange={(o) => !o && setSheet(null)} categories={categories} ops={ops} admin={admin} />
    </div>
  )
}
