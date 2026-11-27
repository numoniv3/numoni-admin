'use client'

import { Suspense, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionTitle } from '@/components/ui/kit'
import type { LedgerJournal } from '@/lib/api/numoni/types/wallet'
import {
  useAllWalletsQuery, useExportPointJournal, useFiatAccountsQuery, useMintHistoryQuery, useMintPoints, usePendingOperationsQuery, usePointBalancesVsBooksQuery, usePointJournalQuery,
  usePointPoolsQuery, usePointReconciliationQuery, useResolvePendingOperation, useRunPointReconciliation, useRunWalletCutoff, useSetPoolsFrozen,
  useWalletBalancesVsBooksQuery, useWalletLedgerQuery, useWalletReconciliationQuery,
} from '@/modules/ms/api/useLedgerQueries'
import { ActionForm } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, PageTabs, RowButton } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView } from '@/modules/ms/components/shared/DataView'

const Wait = ({ children }: { children: ReactNode }) => <Suspense fallback={<div className="card-surface p-6 text-center text-xs text-muted-foreground animate-pulse">Loading…</div>}>{children}</Suspense>
const rec = (v: unknown) => v as Record<string, unknown>

/**
 * `fiat × rate` rounded half-up to 6 dp, in exact decimal arithmetic — Point MS
 * rejects a mint whose pointsToMint differs. Empty when either input isn't a number.
 */
export function pointsFor(fiat: string, rate: string): string {
  const parse = (v: string) => { const m = /^(\d+)(?:\.(\d+))?$/.exec(v.trim().replace(/,/g, '')); return m ? { n: BigInt(m[1] + (m[2] ?? '')), d: (m[2] ?? '').length } : null }
  const a = parse(fiat), b = parse(rate)
  if (!a || !b) return ''
  const scale = a.d + b.d
  let p = a.n * b.n
  if (scale > 6) { const div = 10n ** BigInt(scale - 6); p = (p + div / 2n) / div } else p *= 10n ** BigInt(6 - scale)
  const s = p.toString().padStart(7, '0')
  return `${s.slice(0, -6)}.${s.slice(-6)}`
}

/** Journal entries flattened to one row per posting. */
const postings = (journals: LedgerJournal[]) => journals.flatMap((j) => j.postings.map((p, i) => ({ id: `${j.id}-${i}`, reference: j.reference, description: j.description, account: p.account, direction: p.direction, amount: p.amount, createdAt: j.createdAt })))

function Wallets() { const { data } = useAllWalletsQuery(200); return <DataView data={data} columns={['id', 'universalUserId', 'currency', 'balance', 'status', 'createdAt']} empty="No wallets" /> }
function Ledger() { const { data } = useWalletLedgerQuery(200); return <DataView data={postings(data)} columns={['reference', 'account', 'direction', 'amount', 'description', 'createdAt']} empty="No ledger entries" /> }

function WalletRecon() {
  const { data } = useWalletReconciliationQuery()
  const run = useRunWalletCutoff()
  const books = useWalletBalancesVsBooksQuery({ limit: 200 })
  return (
    <div className="space-y-4">
      <RecordView data={rec(data)} title="Latest reconciliation" />
      <ConfirmButton label="Run cut-off now" title="Run the wallet cut-off?" description="Snapshots every wallet balance and hashes the ledger." onConfirm={() => run.mutate()} disabled={run.isPending} />
      <div className="label-caps">Balances vs books</div>
      <DataView data={books.data.rows} columns={['account', 'balance', 'books', 'difference', 'matches']} empty="Nothing to compare" />
    </div>
  )
}

function Pending() {
  const [status, setStatus] = useState('needs_recon')
  const { data } = usePendingOperationsQuery({ status, limit: 100 })
  const resolve = useResolvePendingOperation()
  return (
    <div className="space-y-3">
      <div className="flex gap-1.5">{['needs_recon', 'resolved', 'failed'].map((s) => <button key={s} onClick={() => setStatus(s)} className={`rounded-full border px-3 py-1 text-xs ${status === s ? 'border-brand text-brand' : 'text-muted-foreground'}`}>{s.replace('_', ' ')}</button>)}</div>
      <DataView data={data.items} columns={['opType', 'status', 'reference', 'walletId', 'points', 'error', 'createdAt']} empty="Nothing waiting"
        rowActions={(r) => (r.status === 'needs_recon' ? (
          <>
            <RowButton disabled={resolve.isPending} onClick={() => resolve.mutate({ id: String(r.id), action: 'retry' })}>Retry</RowButton>
            <ConfirmButton label="Compensate" title="Undo this operation?" description="Compensating reverses what the step already did instead of finishing it." onConfirm={() => resolve.mutate({ id: String(r.id), action: 'compensate' })} />
          </>
        ) : null)} />
    </div>
  )
}

function Pools() {
  const { data } = usePointPoolsQuery()
  const freeze = useSetPoolsFrozen()
  const books = usePointBalancesVsBooksQuery()
  return (
    <div className="space-y-4">
      <RecordView data={{ ...data.pools, totalMinted: data.totalMinted, poolsFrozen: data.poolsFrozen, asOf: data.asOf }} title="Point pools" />
      <ConfirmButton danger={!data.poolsFrozen} label={data.poolsFrozen ? 'Unfreeze pools' : 'Freeze pools (emergency stop)'}
        title={data.poolsFrozen ? 'Unfreeze the point pools?' : 'Freeze every point pool?'}
        description={data.poolsFrozen ? 'Minting, transfers and settlements resume.' : 'Minting, transfers and settlements return 503 until you unfreeze.'}
        onConfirm={() => freeze.mutate(!data.poolsFrozen)} disabled={freeze.isPending} />
      <div className="label-caps">Balances vs books</div>
      <DataView data={books.data.rows} columns={['account', 'balance', 'books', 'difference', 'matches']} />
    </div>
  )
}

function Mint() {
  const mint = useMintPoints()
  const [key, setKey] = useState(() => crypto.randomUUID())
  const { data } = useMintHistoryQuery({ limit: 50 })
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border p-4 max-w-2xl">
        <p className="text-xs text-muted-foreground mb-3">
          Every mint must be backed by a completed PayOnUs payment: Wallet MS checks the payment and books the naira from it.
          Points to mint is worked out as fiat × rate (rounded to 6 dp), as Point MS requires.
        </p>
        <ActionForm
          fields={[
            { key: 'paymentReference', label: 'Payment reference', required: true, placeholder: 'BUY_01J… or PayOnUs reference', hint: 'The completed payment backing this mint.' },
            { key: 'fiatAmount', label: 'Fiat received (₦)', required: true, placeholder: '1000000.00', hint: 'Must fit within what’s left of that payment.' },
            { key: 'rate', label: 'Points per ₦1', required: true, placeholder: '1.000000' },
            { key: 'fundingSource', label: 'Funding source' },
            { key: 'reference', label: 'Reference', hint: '8–64 letters, digits, _ or -. Generated if blank.' },
          ]}
          initial={{ rate: '1.000000' }} submitLabel="Mint points" pending={mint.isPending}
          onSubmit={(v) => {
            const fiatAmount = Number(String(v.fiatAmount).replace(/,/g, '')).toFixed(2)
            const pointsToMint = pointsFor(fiatAmount, String(v.rate))
            if (!pointsToMint || Number(pointsToMint) <= 0) return
            mint.mutate(
              { input: { ...v, currency: 'NGN', fiatAmount, pointsToMint } as never, idempotencyKey: key },
              { onSuccess: () => setKey(crypto.randomUUID()) },
            )
          }}
        />
      </div>
      <DataView data={data} columns={['reference', 'pointsMinted', 'fiatAmount', 'rate', 'fundingSource', 'createdAt']} empty="Nothing minted yet" />
    </div>
  )
}

function PointRecon() {
  const { data } = usePointReconciliationQuery()
  const run = useRunPointReconciliation()
  const [external, setExternal] = useState('')
  return (
    <div className="space-y-3 max-w-xl">
      <RecordView data={rec(data)} title="Conservation check: minted = buy pool + sell pool + wallets" />
      <div className="flex gap-2">
        <Input value={external} onChange={(e) => setExternal(e.target.value)} placeholder="Wallets total (optional override)" className="tnum" />
        <Button variant="outline" disabled={run.isPending} onClick={() => run.mutate(external.trim() || undefined)}>Run now</Button>
      </div>
    </div>
  )
}

function Journal() {
  const [prefix, setPrefix] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const filters = { referencePrefix: prefix || undefined, from: from || undefined, to: to || undefined }
  const { data } = usePointJournalQuery({ ...filters, limit: 200 })
  const exportCsv = useExportPointJournal()
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2">
        <Input value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} placeholder="Reference prefix, e.g. POINT_MINT_" className="w-72 font-mono" />
        <label className="text-xs text-muted-foreground">From<Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40 mt-1" /></label>
        <label className="text-xs text-muted-foreground">To (whole day)<Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40 mt-1" /></label>
        <Button variant="outline" disabled={exportCsv.isPending} onClick={() => exportCsv.mutate(filters)}>{exportCsv.isPending ? 'Exporting…' : 'Export CSV'}</Button>
      </div>
      <DataView data={postings(data)} columns={['reference', 'account', 'direction', 'amount', 'description', 'createdAt']} empty="No journal entries" />
    </div>
  )
}

/** `GET /wallet/admin/fiat` — untyped in the spec, so totals show as a record and any lists as tables. */
function Fiat() {
  const { data } = useFiatAccountsQuery(50)
  const scalars: Record<string, unknown> = {}
  const tables: [string, unknown[]][] = []
  const walk = (o: Record<string, unknown>, prefix = '') => {
    for (const [k, v] of Object.entries(o)) {
      const name = prefix ? `${prefix}.${k}` : k
      if (Array.isArray(v)) tables.push([name, v])
      else if (v && typeof v === 'object') walk(v as Record<string, unknown>, name)
      else scalars[name] = v
    }
  }
  walk(data)
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground max-w-2xl">FIAT_BANK_NGN and FIAT_POINTS_BACKING_NGN should always be equal; the cut-off reconciliation re-derives both from postings and fails on any mismatch.</p>
      <div className="max-w-xl"><RecordView data={scalars} title="Fiat funding accounts" /></div>
      {tables.map(([name, rows]) => (
        <div key={name} className="space-y-2">
          <div className="label-caps">{name.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
          <DataView data={rows} empty="None yet" />
        </div>
      ))}
    </div>
  )
}

/** Admin → Wallet MS + Point MS operations: wallets, ledgers, reconciliation, pending ops, pools, minting. */
export function MoneyCorePage() {
  return (
    <div>
      <SectionTitle title="Money Core" sub="Wallets, ledgers, reconciliation and the point pools (Wallet MS + Point MS)." />
      <PageTabs tabs={[
        { id: 'wallets', label: 'Wallets', content: <Wait><Wallets /></Wait> },
        { id: 'ledger', label: 'Wallet ledger', content: <Wait><Ledger /></Wait> },
        { id: 'recon', label: 'Reconciliation', content: <Wait><WalletRecon /></Wait> },
        { id: 'pending', label: 'Pending operations', content: <Wait><Pending /></Wait> },
        { id: 'fiat', label: 'Fiat accounts', content: <Wait><Fiat /></Wait> },
        { id: 'pools', label: 'Point pools', content: <Wait><Pools /></Wait> },
        { id: 'mint', label: 'Mint points', content: <Wait><Mint /></Wait> },
        { id: 'precon', label: 'Point reconciliation', content: <Wait><PointRecon /></Wait> },
        { id: 'journal', label: 'Point journal', content: <Wait><Journal /></Wait> },
      ]} />
    </div>
  )
}
