'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { FormSheet } from '@/components/ui/form-sheet'
import { useCancelOrder, useMyOrder, useMyOrders, usePayOrder, useToggleWishlist, useWishlist } from '@/modules/ms/api/useStorefront'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { Pager, pageInfo } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ProductGrid, type ProductCard } from './items'

/** One of my orders: details, pay (wallet PIN), cancel within the window. */
export function OrderSheet({ target, onClose }: { target: { storeId: string; orderNumber: string } | null; onClose: () => void }) {
  const q = useMyOrder(target?.storeId ?? '', target?.orderNumber ?? null)
  const pay = usePayOrder()
  const cancel = useCancelOrder()
  const order = recordOf(q.data)
  const unpaid = String(order.paymentStatus ?? '') !== 'PAID'
  return (
    <FormSheet open={!!target} onOpenChange={(o) => !o && onClose()} title={`Order ${target?.orderNumber ?? ''}`}>
      {target && (
        <div className="space-y-4 pb-2">
          <QueryView query={q}>{() => <RecordView data={order} />}</QueryView>
          {pay.data && <RecordView data={recordOf(pay.data)} title="Payment" />}
          {unpaid && (
            <div className="rounded-2xl border p-4">
              <ActionForm fields={[{ key: 'pin', label: 'Wallet PIN', required: true }]} submitLabel="Pay for this order" pending={pay.isPending}
                onSubmit={(v) => pay.mutate({ orderId: String(order.id ?? order._id ?? ''), pin: String(v.pin) })} />
            </div>
          )}
          <div className="rounded-2xl border p-4">
            <ActionForm fields={[{ key: 'reason', label: 'Why are you cancelling?', kind: 'textarea' }]} submitLabel="Cancel order" pending={cancel.isPending}
              onSubmit={(v) => cancel.mutate({ ...target, reason: v.reason as string | undefined }, { onSuccess: onClose })} />
          </div>
        </div>
      )}
    </FormSheet>
  )
}

/** All my marketplace orders across stores. */
export function OrdersTab({ onOrder }: { onOrder: (storeId: string, orderNumber: string) => void }) {
  const [page, setPage] = useState(1)
  const q = useMyOrders(page)
  return (
    <QueryView query={q}>
      {(d) => (
        <>
          <DataView data={listOf(d) ?? []} columns={['orderNumber', 'status', 'paymentStatus', 'totalAmount', 'createdAt']} maxColumns={5} empty="No orders yet"
            onRowClick={(r) => onOrder(String(r.storeId ?? recordOf(r.store).id ?? ''), String(r.orderNumber ?? ''))} />
          <Pager page={page} setPage={setPage} {...pageInfo(d, page, 20)} />
        </>
      )}
    </QueryView>
  )
}

/** Saved products; tap the heart to remove. */
export function WishlistTab({ onProduct }: { onProduct: (p: ProductCard) => void }) {
  const q = useWishlist()
  const toggle = useToggleWishlist()
  return (
    <QueryView query={q}>
      {(d) => {
        const rows = (listOf(d) ?? []).map((w) => (w.product && typeof w.product === 'object' ? (w.product as Record<string, unknown>) : w))
        return (
          <div className="space-y-2">
            <ProductGrid data={rows} onOpen={onProduct} empty="Nothing saved yet" />
            {rows.length > 0 && <p className="text-[11px] text-muted-foreground"><Heart className="h-3 w-3 inline mr-1" />Open a product and tap Wishlist to remove it{toggle.isPending ? '…' : '.'}</p>}
          </div>
        )
      }}
    </QueryView>
  )
}
