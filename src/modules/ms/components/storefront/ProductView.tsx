'use client'

import { useState } from 'react'
import { Heart, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { fmtNaira } from '@/lib/format'
import { useAddToCart, useSlugProduct, useToggleWishlist } from '@/modules/ms/api/useStorefront'
import { RecordView } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { productOf, type ProductCard } from './items'

/** One product: details (from its store when the slug is known), quantity, add to cart, wishlist. */
export function ProductView({ product, onClose, onOpenStore }: { product: ProductCard | null; onClose: () => void; onOpenStore?: (slug: string) => void }) {
  const detail = useSlugProduct(product?.storeSlug ?? '', product?.id ?? null)
  const add = useAddToCart()
  const wish = useToggleWishlist()
  const [qty, setQty] = useState(1)
  const full = detail.data ? recordOf(detail.data) : null
  const p = full ? { ...product!, ...productOf(full), storeSlug: product!.storeSlug } : product
  const storeId = p?.storeId || String(full?.storeId ?? '')

  return (
    <FormSheet open={!!product} onOpenChange={(o) => !o && onClose()} title={p?.name ?? ''} sub={p?.storeName}>
      {p && (
        <div className="space-y-4 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.image && <img src={p.image} alt="" className="w-full aspect-square object-cover rounded-2xl" />}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold tnum">{fmtNaira(p.price * (1 - p.discount / 100), 0)}</div>
              {p.discount > 0 && <div className="text-xs text-muted-foreground tnum line-through">{fmtNaira(p.price, 0)}</div>}
            </div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => wish.mutate(p.id)} disabled={wish.isPending}><Heart className="h-4 w-4 mr-1" /> Wishlist</Button>
          </div>
          {full && <RecordView data={Object.fromEntries(Object.entries(full).filter(([k]) => ['description', 'category', 'subcategory', 'quantity', 'tags', 'type'].includes(k)))} />}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
            <span className="tnum font-semibold w-6 text-center">{qty}</span>
            <Button variant="outline" size="icon" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            <Button className="flex-1 rounded-full bg-brand text-black font-bold hover:bg-brand/90" disabled={!storeId || add.isPending}
              onClick={() => add.mutate({ storeId, productId: p.id, quantity: qty }, { onSuccess: onClose })}>Add to cart</Button>
          </div>
          {onOpenStore && p.storeSlug && <Button variant="ghost" className="w-full" onClick={() => onOpenStore(p.storeSlug)}>Visit the store →</Button>}
        </div>
      )}
    </FormSheet>
  )
}
