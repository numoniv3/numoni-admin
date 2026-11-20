'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  useAllReviews, useBrowseTaxonomy, useHeroBanners, usePublicProducts, usePublicStores, useRandomStores, useStoresByProduct,
  useSubcategories, useTopSelling, useTrending,
} from '@/modules/ms/api/useStorefront'
import { DataView, listOf } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { Chips, ProductGrid, StoreList, type ProductCard } from './items'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-2"><div className="label-caps">{title}</div>{children}</section>
)

function Banners() {
  const q = useHeroBanners()
  const items = listOf(q.data) ?? []
  if (!items.length) return null
  return (
    <div className="flex gap-2 overflow-x-auto snap-x">
      {items.map((b, i) => (
        <a key={String(b.id ?? i)} href={typeof b.linkUrl === 'string' ? b.linkUrl : undefined} className="snap-start shrink-0 w-[85%] rounded-2xl overflow-hidden border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {typeof b.imageUrl === 'string' ? <img src={b.imageUrl} alt={String(b.title ?? '')} className="w-full h-28 object-cover" /> : <div className="h-28 p-4 font-semibold">{String(b.title ?? '')}</div>}
        </a>
      ))}
    </div>
  )
}

/** Browse the marketplace: banners, search, top-selling, trending, stores, categories, reviews. */
export function DiscoverTab({ onProduct, onStore }: { onProduct: (p: ProductCard) => void; onStore: (slug: string) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [industry, setIndustry] = useState('')
  const [tag, setTag] = useState('')
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('30d')
  const tax = useBrowseTaxonomy(industry || undefined)
  const subs = useSubcategories(category)
  const filtering = !!(search || category || tag || industry)
  const products = usePublicProducts({ search: search || undefined, category: category || undefined, subcategory: subcategory || undefined, industry: industry || undefined, tag: tag || undefined, limit: 20 })
  const stores = usePublicStores({ search: search || undefined, industry: industry || undefined, limit: 10 })
  const byProduct = useStoresByProduct(search)
  const top = useTopSelling(period)
  const trending = useTrending()
  const random = useRandomStores()
  const reviews = useAllReviews()

  return (
    <div className="space-y-5">
      <Banners />
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products and stores" className="pl-9" />
      </div>
      <Section title="Industries"><QueryView query={tax.industries}>{(d) => <Chips data={d} active={industry} onPick={setIndustry} />}</QueryView></Section>
      <Section title="Categories"><QueryView query={tax.categories}>{(d) => <Chips data={d} active={category} onPick={(c) => { setCategory(c); setSubcategory('') }} />}</QueryView></Section>
      {category && <Section title="Subcategories"><QueryView query={subs}>{(d) => <Chips data={d} active={subcategory} onPick={setSubcategory} />}</QueryView></Section>}
      <Section title="Tags"><QueryView query={tax.tags}>{(d) => <Chips data={d} active={tag} onPick={setTag} />}</QueryView></Section>

      {filtering ? (
        <>
          <Section title="Products"><QueryView query={products}>{(d) => <ProductGrid data={d} onOpen={onProduct} />}</QueryView></Section>
          <Section title="Stores"><QueryView query={stores}>{(d) => <StoreList data={d} onOpen={(s) => onStore(s.slug)} />}</QueryView></Section>
          {search.length > 1 && <Section title={`Stores selling “${search}”`}><QueryView query={byProduct}>{(d) => <StoreList data={d} onOpen={(s) => onStore(s.slug)} />}</QueryView></Section>}
        </>
      ) : (
        <>
          <Section title="Top selling">
            <div className="flex gap-1.5 mb-1">{(['7d', '30d', 'all'] as const).map((p) => <button key={p} onClick={() => setPeriod(p)} className={`rounded-full border px-2.5 py-0.5 text-[11px] ${period === p ? 'border-brand text-brand' : 'text-muted-foreground'}`}>{p === 'all' ? 'All time' : p}</button>)}</div>
            <QueryView query={top}>{(d) => <ProductGrid data={d} onOpen={onProduct} />}</QueryView>
          </Section>
          <Section title="Trending now"><QueryView query={trending}>{(d) => <ProductGrid data={d} onOpen={onProduct} />}</QueryView></Section>
          <Section title="Stores to try"><QueryView query={random}>{(d) => <StoreList data={d} onOpen={(s) => onStore(s.slug)} />}</QueryView></Section>
          <Section title="All products"><QueryView query={products}>{(d) => <ProductGrid data={d} onOpen={onProduct} />}</QueryView></Section>
          <Section title="Latest reviews"><QueryView query={reviews}>{(d) => <DataView data={listOf(d) ?? []} columns={['rating', 'comment', 'reviewerName']} maxColumns={3} empty="No reviews yet" />}</QueryView></Section>
        </>
      )}
    </div>
  )
}
