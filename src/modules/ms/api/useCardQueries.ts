import { keepPreviousData, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import {
  activateCard, chargeCard, chargeCardById, getCard, getCardLedger, getEnumCatalog, giveCard, initiateUnlock, issueCardReward, listCards, listMyCards, mintCards,
  reverseCardTransaction, updateCardStatus, verifyUnlock,
} from '@/lib/api/numoni/card.api'
import type {
  ActivateCardDto, CardDto, CardListCardsParams, ChargeCardDto, CreateCardDto, GiveCardDto, IssueRewardDto,
} from '@/lib/api/numoni/types/card'
import { fmtNaira } from '@/lib/format'
import { ensureCardOptIn, useSessionUser } from './ms-opt-in'

/*
 * Card MS through the Gateway: the merchant mints reward cards, hands them to
 * customers, loads rewards and charges them. A CLOSED_LOOP card is frozen
 * between uses: the merchant unlocks it with the customer's OTP for 60 s, charges,
 * and it re-locks. `GET /card/cards/my` and `POST /card/cards/activate` are the
 * consumer app's.
 */

const K = numoniKeys.card

function useRefresh() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: K.all })
}

const fail = (title: string) => (e: unknown) => toast.error(title, { description: apiErrorMessage(e) })

// ── reads ────────────────────────────────────────────────────────────────────

export const useCardEnumsQuery = () => useSuspenseQuery({ queryKey: K.getEnumCatalog(), queryFn: getEnumCatalog, staleTime: Infinity })

/** The merchant's cards (one page) with the KPI summary. Keeps the last page on screen while filters change. */
export function useCardsQuery(filters: CardListCardsParams) {
  const user = useSessionUser()
  return useQuery({
    queryKey: K.listCards(filters),
    queryFn: async () => {
      await ensureCardOptIn(user).catch(() => undefined)
      return listCards(filters)
    },
    placeholderData: keepPreviousData,
  })
}

/** One card — `initial` (its list row) shows while the fresh copy loads. */
export const useCardQuery = (id: string | null, initial?: CardDto) =>
  useQuery({ queryKey: K.getCard(id ?? ''), queryFn: () => getCard(id!), enabled: !!id, initialData: initial })

export const useCardLedgerQuery = (id: string) => useQuery({ queryKey: K.getCardLedger(id), queryFn: () => getCardLedger(id) })

// ── writes ───────────────────────────────────────────────────────────────────

export function useMintCards() {
  const user = useSessionUser()
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (body: CreateCardDto) => {
      await ensureCardOptIn(user)
      return mintCards(body)
    },
    onSuccess: (b) => { refresh(); toast.success(`${b.quantity} card${b.quantity === 1 ? '' : 's'} minted`, { description: b.batchReference }) },
    onError: fail('Couldn’t mint the cards'),
  })
}

/** Marks a MINTED card as given to a customer, optionally binding their phone. */
export function useGiveCard() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: GiveCardDto }) => giveCard(id, body),
    onSuccess: (c) => { refresh(); toast.success('Card handed over', { description: `${c.serialNumber}${c.customerPhone ? ` · ${c.customerPhone}` : ''}` }) },
    onError: fail('Couldn’t hand over the card'),
  })
}

/** Loads reward value onto a card. A CLOSED_LOOP card freezes afterwards. */
export function useLoadCardReward() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: IssueRewardDto }) => issueCardReward(id, body),
    onSuccess: (c, { body }) => { refresh(); toast.success(`${fmtNaira(body.amount, 0)} loaded`, { description: `${c.serialNumber} · balance ${fmtNaira(c.balance, 0)}` }) },
    onError: fail('Couldn’t load the reward'),
  })
}

/** Suspend or reinstate a card. */
export function useSetCardStatus() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: 'ACTIVE' | 'SUSPENDED'; reason?: string }) => updateCardStatus(id, { status, reason }),
    onSuccess: (c, { status }) => { refresh(); toast.success(status === 'SUSPENDED' ? 'Card suspended' : 'Card reinstated', { description: c.serialNumber }) },
    onError: fail('Couldn’t change the card status'),
  })
}

/** Sends the customer an OTP to unlock their CLOSED_LOOP card. */
export function useInitiateUnlock() {
  return useMutation({
    mutationFn: initiateUnlock,
    onSuccess: (r) => toast.success('Code sent to the customer', { description: r.customerPhone }),
    onError: fail('Couldn’t send the unlock code'),
  })
}

/** Checks the customer's OTP; the card stays unlocked for `windowSeconds` (60). */
export function useVerifyUnlock() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: verifyUnlock,
    onSuccess: (r) => { refresh(); toast.success(`Card unlocked for ${r.windowSeconds}s — charge it now`) },
    onError: fail('Couldn’t unlock the card'),
  })
}

/** Redeems value from a card (re-locks a CLOSED_LOOP card). */
export function useChargeCard() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChargeCardDto }) => chargeCardById(id, body),
    onSuccess: (t) => { refresh(); toast.success(`${fmtNaira(t.amount, 0)} charged`, { description: `${t.reference} · balance ${fmtNaira(t.balanceAfter, 0)}` }) },
    onError: fail('Couldn’t charge the card'),
  })
}

// ── customer (consumer / brand app) ──────────────────────────────────────────

/** The signed-in customer's active cards, across merchants. */
export function useMyCardsQuery() {
  const user = useSessionUser()
  return useQuery({
    queryKey: K.listMyCards(),
    queryFn: async () => {
      await ensureCardOptIn(user).catch(() => undefined)
      return listMyCards()
    },
  })
}

/** Customer activation: card number or serial + activation code + phone. */
export function useActivateCard() {
  const user = useSessionUser()
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (body: ActivateCardDto) => {
      await ensureCardOptIn(user)
      return activateCard(body)
    },
    onSuccess: (c) => { refresh(); toast.success('Card activated', { description: `${c.serialNumber} · balance ${fmtNaira(c.balance, 0)}` }) },
    onError: fail('Couldn’t activate the card'),
  })
}

// ── counter (till) ───────────────────────────────────────────────────────────

/** Charge by card number / customer phone (`POST /card/cards/charge`) — what a till does. */
export function useChargeByNumber() {
  const user = useSessionUser()
  const refresh = useRefresh()
  return useMutation({
    mutationFn: async (body: ChargeCardDto) => {
      await ensureCardOptIn(user)
      return chargeCard(body)
    },
    onSuccess: (t) => { refresh(); toast.success(`${fmtNaira(t.amount, 0)} redeemed`, { description: `Card balance ${fmtNaira(t.balanceAfter, 0)}` }) },
    onError: fail('Couldn’t redeem from the card'),
  })
}

/** Reverses a charge, restoring the card balance. */
export function useReverseCardTransaction() {
  const refresh = useRefresh()
  return useMutation({
    mutationFn: ({ ref, reason }: { ref: string; reason?: string }) => reverseCardTransaction(ref, { reason }),
    onSuccess: (t) => { refresh(); toast.success('Charge reversed', { description: `${fmtNaira(t.amount, 0)} back on the card` }) },
    onError: fail('Couldn’t reverse the charge'),
  })
}
