'use client'

import { Store as StoreIcon, Package } from 'lucide-react'
import { fmtNaira } from '@/lib/format'
import { listOf, type Row } from '@/modules/ms/components/shared/DataView'

/*
 * Compact product / store cards from untyped list payloads — sized for the
 * phone apps. Field names follow `ProductResponseDto` / `StoreResponseDto`.
 */

const str = (v: unknown) => (typeof v === 'string' && v ? v : undefined)
const store = (p: Row) => (p.store && typeof p.store === 'object' ? (p.store as Row) : {})

export const productOf = (p: Row) => ({
  id: String(p.id ?? p._id ?? p.productId ?? ''),
  name: str(p.name) ?? 'Product',
  price: Number(p.price ?? p.finalPrice ?? 0),
  discount: Number(p.discountPercent ?? 0),
  image: Array.isArray(p.images) ? str(p.images[0]) : str(p.image),
  storeId: str(p.storeId) ?? str(store(p).id) ?? '',
  storeSlug: str(p.storeSlug) ?? str(store(p).slug) ?? '',
  storeName: str(p.storeName) ?? str(store(p).name),
})

export const storeOf = (s: Row) => ({
  id: String(s.id ?? s._id ?? ''),
  slug: str(s.slug) ?? '',
  name: str(s.name) ?? 'Store',
  logo: str(s.logoUrl) ?? str(s.logo),
  meta: [str(s.industry), str(s.country), s.averageRating ? `★ ${Number(s.averageRating).toFixed(1)}` : undefined].filter(Boolean).join(' · '),
})

export type ProductCard = ReturnType<typeof productOf>
export type StoreCard = ReturnType<typeof storeOf>

export function ProductGrid({ data, onOpen, empty = 'No products' }: { data: unknown; onOpen: (p: ProductCard) => void; empty?: string }) {
  const items = (listOf(data) ?? []).map(productOf)
  if (!items.length) return <div className="text-xs text-muted-foreground py-4 text-center">{empty}</div>
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((p) => (
        <button key={p.id} onClick={() => onOpen(p)} className="text-left rounded-2xl border overflow-hidden hover:border-brand/60 transition-colors">
          <div className="aspect-square bg-muted flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {p.image ? <img src={p.image} alt="" className="h-full w-full object-cover" /> : <Package className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div className="p-2">
            <div className="text-xs font-semibold line-clamp-2">{p.name}</div>
            <div className="text-xs tnum mt-0.5">{fmtNaira(p.price * (1 - p.discount / 100), 0)} {p.discount > 0 && <span className="text-[10px] text-brand">−{p.discount}%</span>}</div>
            {p.storeName && <div className="text-[10px] text-muted-foreground truncate">{p.storeName}</div>}
          </div>
        </button>
      ))}
    </div>
  )
}

export function StoreList({ data, onOpen, empty = 'No stores' }: { data: unknown; onOpen: (s: StoreCard) => void; empty?: string }) {
  const items = (listOf(data) ?? []).map(storeOf)
  if (!items.length) return <div className="text-xs text-muted-foreground py-4 text-center">{empty}</div>
  return (
    <div className="space-y-2">
      {items.map((s) => (
        <button key={s.id || s.slug} onClick={() => onOpen(s)} className="w-full flex items-center gap-3 rounded-2xl border p-2.5 text-left hover:border-brand/60 transition-colors">
          <span className="h-10 w-10 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {s.logo ? <img src={s.logo} alt="" className="h-full w-full object-cover" /> : <StoreIcon className="h-4 w-4 text-muted-foreground" />}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold truncate">{s.name}</span>
            <span className="block text-[11px] text-muted-foreground truncate">{s.meta}</span>
          </span>
        </button>
      ))}
    </div>
  )
}

/** Chips for a list of names (categories, tags, industries). */
export function Chips({ data, onPick, active }: { data: unknown; onPick: (v: string) => void; active?: string }) {
  const names = (listOf(data) ?? []).map((r) => String(r.name ?? r.category ?? r.value ?? r.tag ?? r.label ?? '')).filter(Boolean)
  return (
    <div className="flex flex-wrap gap-1.5">
      {names.map((n) => (
        <button key={n} onClick={() => onPick(active === n ? '' : n)} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${active === n ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>{n}</button>
      ))}
    </div>
  )
}
