import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getAccountPolicy, getJourneyState } from '@/lib/api/numoni/admin.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import {
  exportPointJournalCsv, getPointBalancesVsBooks, getPointPools, getPointReconciliation, listMints, listPointJournal, mintPoints, runPointReconciliation, setPoolsFrozen,
} from '@/lib/api/numoni/points.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { JournalFilters, MintInput, PageFilters } from '@/lib/api/numoni/types/points'
import type { PendingOperationFilters, ResolveAction } from '@/lib/api/numoni/types/wallet'
import {
  getFiatAccounts, getWalletBalancesVsBooks, getWalletReconciliation, listAllWallets, listPendingOperations, listWalletLedger, resolvePendingOperation, runWalletCutoff,
} from '@/lib/api/numoni/wallet.api'

/*
 * Control Tower money-core reads and operator actions: Wallet MS and Point MS
 * ledgers, reconciliation and pools, plus an account's policy and journey.
 * Platform Admin only.
 */

const W = numoniKeys.wallet.admin
const P = numoniKeys.points
const A = numoniKeys.admin

// ── account detail ───────────────────────────────────────────────────────────

export const useAccountPolicyQuery = (universalId: string) =>
  useSuspenseQuery({ queryKey: A.policy(universalId), queryFn: () => getAccountPolicy(universalId) })

export const useJourneyStateQuery = (universalId: string) =>
  useSuspenseQuery({ queryKey: A.journey(universalId), queryFn: () => getJourneyState(universalId) })

// ── Wallet MS ────────────────────────────────────────────────────────────────

export const useAllWalletsQuery = (limit = 100) => useSuspenseQuery({ queryKey: W.wallets(limit), queryFn: () => listAllWallets(limit) })

export const useWalletLedgerQuery = (limit = 100) => useSuspenseQuery({ queryKey: W.ledger(limit), queryFn: () => listWalletLedger(limit) })

export const useWalletReconciliationQuery = () => useSuspenseQuery({ queryKey: W.reconciliation(), queryFn: getWalletReconciliation })

export const useWalletBalancesVsBooksQuery = (page: { cursor?: string; limit?: number } = {}) =>
  useSuspenseQuery({ queryKey: W.balancesVsBooks(page), queryFn: () => getWalletBalancesVsBooks(page) })

/** A read sent as POST (filters in the body) — still cached like a query. */
export const usePendingOperationsQuery = (filters: PendingOperationFilters = { status: 'needs_recon' }) =>
  useSuspenseQuery({ queryKey: W.pending(filters), queryFn: () => listPendingOperations(filters) })

export function useRunWalletCutoff() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: runWalletCutoff,
    onSuccess: (snapshot) => {
      queryClient.setQueryData(W.reconciliation(), snapshot)
      void queryClient.invalidateQueries({ queryKey: [...W.all, 'balances-vs-books'] })
      toast.success('Cutoff complete', { description: snapshot.reference })
    },
    onError: (e) => toast.error('Cutoff failed', { description: apiErrorMessage(e) }),
  })
}

export function useResolvePendingOperation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: ResolveAction }) => resolvePendingOperation(id, action),
    onSuccess: (_, { action }) => {
      void queryClient.invalidateQueries({ queryKey: W.all })
      void queryClient.invalidateQueries({ queryKey: P.all })
      toast.success(action === 'retry' ? 'Operation completed' : 'Operation reversed')
    },
    onError: (e) => toast.error('Couldn’t resolve the operation', { description: apiErrorMessage(e) }),
  })
}

// ── Point MS ─────────────────────────────────────────────────────────────────

export const usePointPoolsQuery = () => useSuspenseQuery({ queryKey: P.pools(), queryFn: getPointPools })

export const useMintHistoryQuery = (page: PageFilters = {}) => useSuspenseQuery({ queryKey: P.mints(page), queryFn: () => listMints(page) })

export const usePointReconciliationQuery = () => useSuspenseQuery({ queryKey: P.reconciliation(), queryFn: getPointReconciliation })

export const usePointJournalQuery = (filters: JournalFilters = {}) =>
  useSuspenseQuery({ queryKey: P.journal(filters), queryFn: () => listPointJournal(filters) })

export const usePointBalancesVsBooksQuery = () => useSuspenseQuery({ queryKey: P.balancesVsBooks(), queryFn: getPointBalancesVsBooks })

/** Fiat funding accounts (`GET /wallet/admin/fiat`) — returned as-is (the spec doesn't type it). */
export const useFiatAccountsQuery = (limit = 50) => useSuspenseQuery({ queryKey: W.fiat(limit), queryFn: () => getFiatAccounts(limit) })

/** Downloads the point journal as CSV (`?format=csv`, up to 5,000 entries). */
export function useExportPointJournal() {
  return useMutation({
    mutationFn: (filters: JournalFilters) => exportPointJournalCsv(filters),
    onSuccess: (csv, f) => {
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
      const a = Object.assign(document.createElement('a'), { href: url, download: `point-journal${f.from ? `-${f.from}` : ''}${f.to ? `-to-${f.to}` : ''}.csv` })
      a.click()
      URL.revokeObjectURL(url)
    },
    onError: (e) => toast.error('Export failed', { description: apiErrorMessage(e) }),
  })
}

/** Pass one `idempotencyKey` per mint form so a retry can't mint twice. */
export function useMintPoints() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ input, idempotencyKey }: { input: MintInput; idempotencyKey?: string }) => mintPoints(input, idempotencyKey),
    onSuccess: (r) => {
      void queryClient.invalidateQueries({ queryKey: P.all })
      toast.success('Points minted', { description: `${r.reference} · buy pool ${r.buyPoolBalance}` })
    },
    onError: (e) => toast.error('Mint failed', { description: apiErrorMessage(e) }),
  })
}

export function useRunPointReconciliation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (externalWalletsTotal?: string) => runPointReconciliation(externalWalletsTotal),
    onSuccess: (report) => {
      queryClient.setQueryData(P.reconciliation(), report)
      if (report.balanced) toast.success('Points are conserved')
      else toast.error('Reconciliation is out of balance', { description: report.reference })
    },
    onError: (e) => toast.error('Reconciliation failed', { description: apiErrorMessage(e) }),
  })
}

export function useSetPoolsFrozen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (frozen: boolean) => setPoolsFrozen(frozen),
    onSuccess: (frozen) => {
      void queryClient.invalidateQueries({ queryKey: P.pools() })
      if (frozen) toast.warning('Pools frozen', { description: 'Mint, transfer and settle are paused.' })
      else toast.success('Pools unfrozen')
    },
    onError: (e) => toast.error('Couldn’t change the pool freeze', { description: apiErrorMessage(e) }),
  })
}
