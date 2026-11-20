'use client'

import { Suspense, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBuyOrderQuery, useSettlementQuery } from '@/modules/wallet'
import { RecordView } from '@/modules/ms/components/shared/DataView'

function Order({ id }: { id: string }) {
  const { data } = useBuyOrderQuery(id)
  return <RecordView data={data as unknown as Record<string, unknown>} title="Funding order" />
}

function Settlement({ id }: { id: string }) {
  const { data } = useSettlementQuery(id)
  return <RecordView data={data as unknown as Record<string, unknown>} title="Withdrawal" />
}

/** Look up a funding order (`GET /wallet/buy-orders/{id}`) or withdrawal (`GET /wallet/settlements/{id}`). */
export function StatusLookup() {
  const [kind, setKind] = useState<'order' | 'settlement'>('order')
  const [id, setId] = useState('')
  const [shown, setShown] = useState<{ kind: 'order' | 'settlement'; id: string } | null>(null)
  return (
    <div className="card-surface p-4 space-y-3">
      <div className="label-caps">Check a payment</div>
      <div className="flex flex-wrap gap-2">
        {(['order', 'settlement'] as const).map((k) => <button key={k} onClick={() => setKind(k)} className={`rounded-full border px-3 py-1 text-xs ${kind === k ? 'border-brand text-brand' : 'text-muted-foreground'}`}>{k === 'order' ? 'Funding' : 'Withdrawal'}</button>)}
        <Input value={id} onChange={(e) => setId(e.target.value.trim())} placeholder="ID" className="flex-1 min-w-40 font-mono" />
        <Button variant="outline" disabled={!id} onClick={() => setShown({ kind, id })}>Check</Button>
      </div>
      {shown && (
        <Suspense fallback={<div className="text-xs text-muted-foreground">Checking…</div>}>
          {shown.kind === 'order' ? <Order key={shown.id} id={shown.id} /> : <Settlement key={shown.id} id={shown.id} />}
        </Suspense>
      )}
    </div>
  )
}
