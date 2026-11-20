'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { StoreResponseDto } from '@/lib/api/numoni'
import { useSetStoreStatus, useStoreAction, useUpdateBranding, type StoreOps } from '@/modules/ms/api/useMarketplaceMerchant'
import { ActionForm, type Values } from '@/modules/ms/components/shared/ActionForm'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { RecordView } from '@/modules/ms/components/shared/DataView'
import { recordOf } from '@/modules/ms/components/shared/fields'
import { BRANDING, STORE_UPDATE } from './store-fields'
import { useUploadProgress } from '@/modules/ms/components/shared/use-upload-progress'

const STATUS_ACTIONS = [
  { status: 'ACTIVE', label: 'Publish' }, { status: 'INACTIVE', label: 'Unpublish' }, { status: 'DRAFT', label: 'Back to draft' },
] as const

function Subscription({ store, ops }: { store: StoreResponseDto; ops: StoreOps }) {
  const [account, setAccount] = useState<Values | null>(null)
  const get = useStoreAction((id: string) => ops.subscriptionAccount(id), '', 'Couldn’t get the payment account')
  const verify = useStoreAction(({ id, body }: { id: string; body: Values }) => ops.verifySubscription(id, body), 'Payment verified — your store is paid up', 'Couldn’t verify the payment')
  return (
    <div className="space-y-3 max-w-xl">
      <p className="text-sm">{store.isPaid ? 'This store’s subscription is paid.' : 'Pay the store subscription to publish products.'}</p>
      <Button variant="outline" className="rounded-full" disabled={get.isPending} onClick={() => get.mutate(store.id, { onSuccess: (r) => setAccount(recordOf(r)) })}>Get payment account</Button>
      {account && <RecordView data={account} title="Transfer to" />}
      <ActionForm
        fields={[{ key: 'onusReference', label: 'Payment reference' }, { key: 'transactionReference', label: 'Bank transaction reference' }]}
        initial={{ onusReference: account?.onusReference }} submitLabel="I’ve paid — verify" pending={verify.isPending}
        onSubmit={(body) => verify.mutate({ id: store.id, body })}
      />
    </div>
  )
}

/** Store details, publishing, branding, payment charges, shipping and subscription. `ops` decides merchant vs admin-on-behalf. */
export function StoreSettings({ store, ops, admin }: { store: StoreResponseDto; ops: StoreOps; admin?: boolean }) {
  const logoUpload = useUploadProgress()
  const bannerUpload = useUploadProgress()
  const update = useStoreAction((body: Values) => ops.update(store.id, body, { onProgress: logoUpload.onProgress }), 'Store saved', 'Couldn’t save the store')
  const payment = useStoreAction((body: Values) => ops.payment(store.id, body as never), 'Payment settings saved', 'Couldn’t save payment settings')
  const shipping = useStoreAction((body: Values) => ops.shipping(store.id, body as never), 'Shipping saved', 'Couldn’t save shipping')
  const status = useSetStoreStatus()
  const branding = useUpdateBranding()
  const initial = store as unknown as Values

  return (
    <PageTabs tabs={[
      { id: 'details', label: 'Details', content: <div className="max-w-2xl"><ActionForm fields={STORE_UPDATE} initial={initial} submitLabel="Save store" pendingLabel={logoUpload.label('Saving…')} pending={update.isPending} onSubmit={(v) => update.mutate(v, { onSettled: logoUpload.reset })} /></div> },
      ...(admin ? [] : [{
        id: 'publish', label: 'Publishing', content: (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm mr-2">Status: <b>{store.status}</b></span>
            {STATUS_ACTIONS.filter((a) => a.status !== store.status).map((a) => (
              <Button key={a.status} variant="outline" className="rounded-full" disabled={status.isPending} onClick={() => status.mutate({ id: store.id, status: a.status })}>{a.label}</Button>
            ))}
          </div>
        ),
      }, {
        id: 'branding', label: 'Branding', content: <div className="max-w-2xl"><ActionForm fields={BRANDING} initial={initial} submitLabel="Save branding" pendingLabel={bannerUpload.label('Saving…')} pending={branding.isPending} onSubmit={(body) => branding.mutate({ id: store.id, body, onProgress: bannerUpload.onProgress }, { onSettled: bannerUpload.reset })} /></div>,
      }]),
      {
        id: 'payment', label: 'Checkout charges', content: (
          <div className="max-w-2xl">
            <ActionForm
              fields={[
                { key: 'chargesPayer', label: 'Who pays the charges', kind: 'select', options: ['MERCHANT', 'CUSTOMER'], required: true },
                { key: 'charges', label: 'Charges', kind: 'json', required: true, placeholder: '[{ "name": "VAT", "type": "PERCENTAGE", "value": 7.5, "enabled": true }]' },
              ]}
              initial={{ chargesPayer: store.chargesPayer, charges: (initial.charges as unknown) ?? [] }}
              submitLabel="Save charges" pending={payment.isPending} onSubmit={(v) => payment.mutate(v)}
            />
          </div>
        ),
      },
      {
        id: 'shipping', label: 'Shipping', content: (
          <div className="max-w-2xl">
            <ActionForm
              fields={[{ key: 'shippingLocations', label: 'Delivery locations and fees', kind: 'json', required: true, placeholder: '[{ "name": "Lagos Mainland", "amount": 1500, "currency": "NGN" }]' }]}
              initial={{ shippingLocations: store.shippingLocations ?? [] }}
              submitLabel="Save shipping" pending={shipping.isPending} onSubmit={(v) => shipping.mutate(v)}
            />
          </div>
        ),
      },
      { id: 'subscription', label: 'Subscription', content: <Subscription store={store} ops={ops} /> },
    ]} />
  )
}
