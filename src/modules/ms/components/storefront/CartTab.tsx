'use client'

import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Input } from '@/components/ui/input'
import { fmtNaira } from '@/lib/format'
import {
  useCart, useCarts, useCheckout, useCheckoutAndPay, useClearCart, useLocations, useRemoveCartItem, useSetDeliveryLocation, useUpdateCartItem,
} from '@/modules/ms/api/useStorefront'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { toE164 } from '@/lib/auth/phone'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton } from '@/modules/ms/components/shared/bits'
import { listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'

const name = (i: Row) => String((recordOf(i.product).name as string | undefined) ?? i.productName ?? 'Item')

function Checkout({ storeId, onDone }: { storeId: string; onDone: (orderNumber?: string) => void }) {
  const user = useSessionUser()
  const locations = useLocations()
  const checkout = useCheckout()
  const pay = useCheckoutAndPay()
  const [payNow, setPayNow] = useState(true)
  const states = (listOf(locations.data) ?? []).map((l) => String(l.state ?? l.name ?? '')).filter(Boolean)
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={payNow} onChange={(e) => setPayNow(e.target.checked)} /> Pay now with my nuMoni wallet PIN</label>
      <ActionForm
        fields={[
          { key: 'customerName', label: 'Name', required: true },
          { key: 'customerPhone', label: 'Phone', kind: 'phone', required: true },
          { key: 'customerEmail', label: 'Email' },
          { key: 'country', label: 'Country', required: true },
          ...(states.length ? [{ key: 'state', label: 'State', kind: 'select' as const, options: [...new Set(states)].map((s) => ({ value: s, label: s })) }] : []),
          { key: 'customerAddress', label: 'Delivery address', wide: true },
          { key: 'shippingLocationId', label: 'Shipping option ID' },
          { key: 'customerNote', label: 'Note', kind: 'textarea' },
          { key: 'dataConsentAccepted', label: 'I agree to share my details with the store', kind: 'switch' },
          ...(payNow ? [{ key: 'pin', label: 'Wallet PIN', required: true }] : []),
        ]}
        initial={{ customerName: user?.name, customerPhone: user?.phone ? toE164(user.phone) : undefined, customerEmail: user?.email, country: 'Nigeria', dataConsentAccepted: true }}
        submitLabel={payNow ? 'Place order & pay' : 'Place order'} pending={checkout.isPending || pay.isPending}
        onSubmit={({ state, ...v }) => {
          const body = { ...v, customerAddress: [v.customerAddress, state].filter(Boolean).join(', ') || undefined, customerUserId: user?.universalId } as never
          if (payNow) pay.mutate({ storeId, body }, { onSuccess: (r) => onDone(String(recordOf(r.order).orderNumber ?? '')) })
          else checkout.mutate({ storeId, body }, { onSuccess: (o) => onDone(String(o.orderNumber ?? '')) })
        }}
      />
    </div>
  )
}

function StoreCart({ storeId, onOrder }: { storeId: string; onOrder: (storeId: string, orderNumber: string) => void }) {
  const q = useCart(storeId)
  const update = useUpdateCartItem()
  const remove = useRemoveCartItem()
  const clear = useClearCart()
  const [checkingOut, setCheckingOut] = useState(false)
  return (
    <QueryView query={q}>
      {(d) => {
        const items = listOf(recordOf(d).items ?? d) ?? []
        const total = items.reduce((a, i) => a + Number(i.price ?? 0) * Number(i.quantity ?? 1), 0)
        return (
          <div className="rounded-2xl border p-3 space-y-2">
            {items.map((i) => (
              <div key={String(i.id)} className="flex items-center gap-2 text-sm">
                <span className="flex-1 min-w-0 truncate">{name(i)}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => update.mutate({ itemId: String(i.id), storeId, quantity: Math.max(1, Number(i.quantity) - 1) })}><Minus className="h-3 w-3" /></Button>
                <span className="tnum w-5 text-center">{String(i.quantity)}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => update.mutate({ itemId: String(i.id), storeId, quantity: Number(i.quantity) + 1 })}><Plus className="h-3 w-3" /></Button>
                <span className="tnum w-20 text-right">{fmtNaira(Number(i.price ?? 0) * Number(i.quantity ?? 1), 0)}</span>
                <button onClick={() => remove.mutate({ itemId: String(i.id), storeId })} className="text-muted-foreground hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
            <div className="flex items-center justify-between border-t pt-2">
              <ConfirmButton danger label="Clear cart" title="Clear this cart?" description="Removes every item from this store’s cart." onConfirm={() => clear.mutate(storeId)} />
              <span className="font-bold tnum">{fmtNaira(total, 0)}</span>
            </div>
            <Button onClick={() => setCheckingOut(true)} disabled={!items.length} className="w-full rounded-full bg-brand text-black font-bold hover:bg-brand/90">Checkout</Button>
            <FormSheet open={checkingOut} onOpenChange={setCheckingOut} title="Checkout">
              {checkingOut && <Checkout storeId={storeId} onDone={(n) => { setCheckingOut(false); if (n) onOrder(storeId, n) }} />}
            </FormSheet>
          </div>
        )
      }}
    </QueryView>
  )
}

/** Every store cart (`GET …/cart/all`), each with quantity, remove, clear and checkout; plus the delivery address. */
export function CartTab({ onOrder }: { onOrder: (storeId: string, orderNumber: string) => void }) {
  const carts = useCarts()
  const setAddress = useSetDeliveryLocation()
  const [address, setAddr] = useState('')
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input value={address} onChange={(e) => setAddr(e.target.value)} placeholder="Delivery address for all carts" />
        <Button variant="outline" disabled={!address.trim() || setAddress.isPending} onClick={() => setAddress.mutate(address.trim())}>Save</Button>
      </div>
      <QueryView query={carts}>
        {(d) => {
          const list = listOf(d) ?? []
          if (!list.length) return <div className="text-sm text-muted-foreground text-center py-6">Your cart is empty.</div>
          return <div className="space-y-3">{list.map((c) => <div key={String(c.storeId ?? c.id)}><div className="label-caps mb-1">{String(recordOf(c.store).name ?? c.storeName ?? 'Store')}</div><StoreCart storeId={String(c.storeId ?? recordOf(c.store).id)} onOrder={onOrder} /></div>)}</div>
        }}
      </QueryView>
    </div>
  )
}
