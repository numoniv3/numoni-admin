'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StoreResponseDto } from '@/lib/api/numoni'
import { useStorePolicies } from '@/modules/ms/api/useMarketplaceMerchant'
import type { Values } from '@/modules/ms/components/shared/ActionForm'
import { QueryView } from '@/modules/ms/components/shared/QueryView'

type PolicyKey = 'refundPolicy' | 'shippingPolicy'

const POLICIES: { key: PolicyKey; title: string }[] = [
  { key: 'refundPolicy', title: 'Refund policy' },
  { key: 'shippingPolicy', title: 'Shipping policy' },
]

/**
 * Settings → Policies: the store's own refund / shipping wording next to nuMoni's
 * standard copy (`GET /marketplace/merchant/stores/policies`), with a one-click
 * "use standard wording". Edit the text freely under Details.
 */
export function StorePolicies({ store, save, saving }: { store: StoreResponseDto; save: (body: Values) => void; saving: boolean }) {
  return (
    <QueryView query={useStorePolicies()}>
      {(standard) => (
        <div className="space-y-4 max-w-3xl">
          <p className="text-xs text-muted-foreground">Shoppers see these on your store. Start from nuMoni’s standard wording, then tailor it under Details.</p>
          {POLICIES.map(({ key, title }) => {
            const mine = store[key]?.trim() || ''
            const std = standard[key]?.trim() || ''
            const same = !!mine && mine === std
            return (
              <div key={key} className="card-surface p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{title}</span>
                  {same ? (
                    <span className="flex items-center gap-1 text-xs text-brand"><Check className="h-3.5 w-3.5" /> Using standard wording</span>
                  ) : std && (
                    <Button size="sm" variant="outline" className="rounded-full" disabled={saving} onClick={() => save({ [key]: std })}>
                      Use standard wording
                    </Button>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <div className="label-caps mb-1.5">Your store</div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{mine || <span className="text-muted-foreground">Not set yet.</span>}</p>
                  </div>
                  {!same && std && (
                    <div className="md:border-l md:pl-3">
                      <div className="label-caps mb-1.5">nuMoni standard</div>
                      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{std}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </QueryView>
  )
}
