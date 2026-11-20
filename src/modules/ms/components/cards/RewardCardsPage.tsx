'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PhoneInput } from '@/components/ui/phone-input'
import { PageLoader } from '@/components/layout/page-loader'
import { SectionTitle } from '@/components/ui/kit'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CardDto, CardListCardsParams } from '@/lib/api/numoni/types/card'
import { useCardEnumsQuery, useCardsQuery } from '@/modules/ms/api/useCardQueries'
import { CardDetailSheet } from './CardDetailSheet'
import { CardKpis } from './CardKpis'
import { CardsTable } from './CardsTable'
import { titleCase } from './card-meta'
import { MintCardsSheet } from './MintCardsSheet'

const ALL = '__all__'
const LIMIT = 20

// ── REWARD CARDS (Card MS) ───────────────────────────────────────────────────
export function RewardCardsPage() {
  const { data: enums } = useCardEnumsQuery()
  const [status, setStatus] = useState(ALL)
  const [scheme, setScheme] = useState(ALL)
  const [phone, setPhone] = useState('')
  const [page, setPage] = useState(1)
  const [mintOpen, setMintOpen] = useState(false)
  const [open, setOpen] = useState<CardDto | null>(null)

  const filters: CardListCardsParams = {
    status: status === ALL ? undefined : (status as CardListCardsParams['status']),
    scheme: scheme === ALL ? undefined : (scheme as CardListCardsParams['scheme']),
    customerPhone: phone.trim() || undefined,
    page,
    limit: LIMIT,
  }
  const { data, isPending, isError, refetch } = useCardsQuery(filters)
  const pages = data ? Math.max(1, Math.ceil(data.total / (data.limit || LIMIT))) : 1
  const filter = (set: (v: string) => void) => (v: string) => { set(v); setPage(1) }

  return (
    <div>
      <SectionTitle
        title="Reward Cards"
        sub="Mint cards, hand them to customers, load rewards and charge them."
        right={<Button onClick={() => setMintOpen(true)} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> Mint cards</Button>}
      />

      {data && <CardKpis summary={data.summary} />}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <PhoneInput value={phone} onChange={filter(setPhone)} placeholder="Customer phone" className="w-72" />
        <Select value={status} onValueChange={filter(setStatus)}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {(enums.cardStatuses ?? []).map((s) => <SelectItem key={s} value={s}>{titleCase(s)}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={scheme} onValueChange={filter(setScheme)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All schemes</SelectItem>
            {(enums.cardSchemes ?? []).map((s) => <SelectItem key={s} value={s}>{titleCase(s)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <PageLoader />
      ) : isError || !data ? (
        <div className="card-surface p-6 text-center text-sm text-muted-foreground">
          Couldn’t load your cards. <Button variant="link" onClick={() => refetch()}>Try again</Button>
        </div>
      ) : (
        <>
          <CardsTable cards={data.items} onOpen={setOpen} />
          {pages > 1 && (
            <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
              <span className="tnum">Page {page} of {pages} · {data.total} cards</span>
              <Button size="sm" variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" className="h-8" disabled={page >= pages} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </>
      )}

      <MintCardsSheet open={mintOpen} onOpenChange={setMintOpen} />
      <CardDetailSheet card={open} onClose={() => setOpen(null)} />
    </div>
  )
}
