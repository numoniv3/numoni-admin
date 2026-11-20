'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormSheet } from '@/components/ui/form-sheet'
import { Switch } from '@/components/ui/switch'
import {
  useCreateManualOrder, useRejectOrder, useSendReminder, useStoreOrder, useStoreOrders, useUpdateOrderStatus,
} from '@/modules/ms/api/useMarketplaceMerchant'
import { ActionForm, ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { Pager, RowButton, pageInfo, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { MANUAL_ORDER, ORDER_STATUSES, PAYMENT_STATUSES } from './store-fields'

const LIMIT = 20
const idOf = (r?: Row) => (r ? String(r.id ?? r._id ?? '') : '')

function OrderDetail({ storeId, order, onDone }: { storeId: string; order: Row; onDone: () => void }) {
  const q = useStoreOrder(storeId, idOf(order))
  const status = useUpdateOrderStatus()
  const reject = useRejectOrder()
  const remind = useSendReminder()
  return (
    <div className="space-y-4 pb-2">
      <QueryView query={q}>{(d) => <RecordView data={recordOf(d)} />}</QueryView>
      <div className="rounded-2xl border p-4">
        <div className="label-caps mb-3">Update status</div>
        <ActionForm
          fields={[
            { key: 'status', label: 'Order status', kind: 'select', options: ORDER_STATUSES, required: true },
            { key: 'paymentStatus', label: 'Payment status', kind: 'select', options: PAYMENT_STATUSES },
            { key: 'deliveryCode', label: 'Customer’s delivery code', hint: 'Required by some stores to mark it delivered.' },
          ]}
          initial={order} submitLabel="Save status" pending={status.isPending}
          onSubmit={(body) => status.mutate({ storeId, id: idOf(order), body: body as never }, { onSuccess: onDone })}
        />
      </div>
      <div className="rounded-2xl border p-4">
        <div className="label-caps mb-3">Remind the customer</div>
        <ActionForm
          fields={[{ key: 'email', label: 'Customer email', required: true }, { key: 'message', label: 'Message', kind: 'textarea', required: true }]}
          initial={{ email: order.customerEmail, message: `Hi, a reminder about your order ${String(order.orderNumber ?? '')}.` }}
          submitLabel="Send reminder" pending={remind.isPending}
          onSubmit={(v) => remind.mutate({ storeId, body: { ...v, orderId: idOf(order) } as never })}
        />
      </div>
      <div className="rounded-2xl border border-red-500/30 p-4">
        <div className="label-caps mb-3">Reject a paid order</div>
        <ActionForm fields={[{ key: 'reason', label: 'Reason', kind: 'textarea' }]} submitLabel="Reject & refund" pending={reject.isPending}
          onSubmit={(v) => reject.mutate({ storeId, id: idOf(order), reason: v.reason as string | undefined }, { onSuccess: onDone })} />
      </div>
    </div>
  )
}

/** A store's orders: list, open, status, reject, remind, and manual (offline) orders. */
export function OrdersPanel({ storeId }: { storeId: string }) {
  const [page, setPage] = useState(1)
  const [pickup, setPickup] = useState(false)
  const q = useStoreOrders(storeId, { page, limit: LIMIT, isStorePickup: pickup || undefined })
  const manual = useCreateManualOrder()
  const sheet = useSheet<'open' | 'manual'>()

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground"><Switch checked={pickup} onCheckedChange={(v) => { setPickup(v); setPage(1) }} /> Store pickup only</label>
        <Button onClick={() => sheet.show('manual')} className="ml-auto rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> Manual order</Button>
      </div>
      <QueryView query={q}>
        {(d) => (
          <>
            <DataView data={listOf(d) ?? []} empty="No orders yet" columns={['orderNumber', 'customerName', 'totalAmount', 'total', 'status', 'paymentStatus', 'createdAt']}
              onRowClick={(r) => sheet.show('open', r)} rowActions={(r) => <RowButton onClick={() => sheet.show('open', r)}>Open</RowButton>} />
            <Pager page={page} setPage={setPage} {...pageInfo(d, page, LIMIT)} />
          </>
        )}
      </QueryView>
      <FormSheet open={sheet.is('open')} onOpenChange={sheet.onOpenChange} title={`Order ${String(sheet.target?.orderNumber ?? '')}`} wide>
        {sheet.is('open') && sheet.target && <OrderDetail storeId={storeId} order={sheet.target} onDone={sheet.close} />}
      </FormSheet>
      <ActionSheet open={sheet.is('manual')} onOpenChange={sheet.onOpenChange} title="Manual order" sub="Record a sale made offline or in person."
        fields={MANUAL_ORDER} initial={{ country: 'Nigeria', paymentStatus: 'PAID' }} submitLabel="Create order" pending={manual.isPending}
        onSubmit={(body) => manual.mutate({ storeId, body: body as never }, { onSuccess: sheet.close })} />
    </div>
  )
}
