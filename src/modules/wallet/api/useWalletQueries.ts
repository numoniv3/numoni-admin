import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { pointsOptIn } from '@/lib/api/numoni/points.api'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { BuyPointsInput, SettlementInput, TransferInput, Wallet, WalletTransactionFilters } from '@/lib/api/numoni/types/wallet'
import {
  buyPoints, confirmQrPayment, createWallet, freezeWallet, generateQrPayment, getBuyOrder, getSettlement, getWallet, listMyWallets,
  listWalletTransactions, lookupBankAccount, redeemPoints, settleToBank, transferPoints, unfreezeWallet, verifyBuyOrder, verifySettlement,
  walletOptIn,
} from '@/lib/api/numoni/wallet.api'
import { useUniversalId } from '@/modules/auth'

/*
 * The signed-in account's nuMoni wallet (Wallet MS via the Gateway), shared by
 * every app that holds points: consumer, brand app, till, and the merchant /
 * reseller / brand / enterprise consoles. Hooks must render inside an auth gate.
 *
 * Money mutations take an optional `idempotencyKey`: pass one you keep for the
 * life of a single user action (e.g. created when the confirm sheet opens) so
 * a double tap or retry can't move money twice.
 */

const K = numoniKeys.wallet

// ── reads ────────────────────────────────────────────────────────────────────

export const useMyWalletsQuery = () => useSuspenseQuery({ queryKey: K.mine(), queryFn: listMyWallets })

export const useWalletQuery = (walletId: string) =>
  useSuspenseQuery({ queryKey: K.detail(walletId), queryFn: () => getWallet(walletId) })

export const useWalletTransactionsQuery = (filters: WalletTransactionFilters = {}) =>
  useSuspenseQuery({ queryKey: K.transactions(filters), queryFn: () => listWalletTransactions(filters) })

export const useBuyOrderQuery = (id: string) => useSuspenseQuery({ queryKey: K.buyOrder(id), queryFn: () => getBuyOrder(id) })

export const useSettlementQuery = (id: string) => useSuspenseQuery({ queryKey: K.settlement(id), queryFn: () => getSettlement(id) })

// ── writes ───────────────────────────────────────────────────────────────────

/** Balances and history change after any money movement. */
function useRefreshWallets() {
  const queryClient = useQueryClient()
  return () => void queryClient.invalidateQueries({ queryKey: K.all })
}

/** Registers the account with Wallet MS and Point MS. Idempotent — run once after sign-in. */
export function useWalletOptIn() {
  const universalId = useUniversalId()
  return useMutation({
    mutationFn: async () => {
      await Promise.all([walletOptIn(), pointsOptIn(universalId)])
    },
  })
}

export function useCreateWallet() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: (currency?: string) => createWallet(currency),
    onSuccess: () => {
      refresh()
      toast.success('Wallet created')
    },
    onError: (e) => toast.error('Couldn’t create the wallet', { description: apiErrorMessage(e) }),
  })
}

/** Start a purchase; when `data.payment` is set, show its account details and poll with `useVerifyBuyOrder`. */
export function useBuyPoints() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: ({ walletId, input, idempotencyKey }: { walletId: string; input: BuyPointsInput; idempotencyKey?: string }) =>
      buyPoints(walletId, input, idempotencyKey),
    onSuccess: ({ order }) => {
      refresh()
      if (order.status === 'completed') toast.success('Points added to your wallet')
    },
    onError: (e) => toast.error('Couldn’t start the purchase', { description: apiErrorMessage(e) }),
  })
}

export function useVerifyBuyOrder() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: (orderId: string) => verifyBuyOrder(orderId),
    onSuccess: (order) => {
      refresh()
      if (order.status === 'completed') toast.success('Payment received — points added')
    },
    onError: (e) => toast.error('Couldn’t check the payment', { description: apiErrorMessage(e) }),
  })
}

export function useTransferPoints() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: ({ input, idempotencyKey }: { input: TransferInput; idempotencyKey?: string }) => transferPoints(input, idempotencyKey),
    onSuccess: () => {
      refresh()
      toast.success('Transfer sent')
    },
    onError: (e) => toast.error('Transfer failed', { description: apiErrorMessage(e) }),
  })
}

/** The receiving side of a QR payment (till, merchant). */
export function useGenerateQrPayment() {
  return useMutation({
    mutationFn: ({ walletId, points }: { walletId: string; points: string | number }) => generateQrPayment(walletId, points),
    onError: (e) => toast.error('Couldn’t create the payment QR', { description: apiErrorMessage(e) }),
  })
}

/** The paying side: confirm a scanned QR token. */
export function useConfirmQrPayment() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: ({ reference, fromWalletId, idempotencyKey }: { reference: string; fromWalletId: string; idempotencyKey?: string }) =>
      confirmQrPayment(reference, fromWalletId, idempotencyKey),
    onSuccess: () => {
      refresh()
      toast.success('Payment complete')
    },
    onError: (e) => toast.error('Payment failed', { description: apiErrorMessage(e) }),
  })
}

export function useRedeemPoints() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: ({ walletId, points, idempotencyKey }: { walletId: string; points: string | number; idempotencyKey?: string }) =>
      redeemPoints(walletId, points, idempotencyKey),
    onSuccess: (r) => {
      refresh()
      if (r.needsRecon) toast.warning('Redemption is being reviewed', { description: 'Your points are held; operations will finish it shortly.' })
      else toast.success('Points redeemed')
    },
    onError: (e) => toast.error('Couldn’t redeem points', { description: apiErrorMessage(e) }),
  })
}

export function useSettleToBank() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: ({ walletId, input, idempotencyKey }: { walletId: string; input: SettlementInput; idempotencyKey?: string }) =>
      settleToBank(walletId, input, idempotencyKey),
    onSuccess: ({ settlement }) => {
      refresh()
      toast.success(settlement.status === 'completed' ? 'Settlement paid' : 'Settlement started', { description: settlement.reference })
    },
    onError: (e) => toast.error('Settlement failed', { description: apiErrorMessage(e) }),
  })
}

export function useVerifySettlement() {
  const refresh = useRefreshWallets()
  return useMutation({
    mutationFn: (settlementId: string) => verifySettlement(settlementId),
    onSuccess: refresh,
    onError: (e) => toast.error('Couldn’t check the payout', { description: apiErrorMessage(e) }),
  })
}

/** Resolves the account holder's name; errors surface on the form, not as a toast. */
export const useLookupBankAccount = () =>
  useMutation({ mutationFn: ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) => lookupBankAccount(accountNumber, bankCode) })

/** Freeze or unfreeze — used by the account holder and by admins. */
export function useSetWalletFrozen() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ walletId, frozen }: { walletId: string; frozen: boolean }) => (frozen ? freezeWallet(walletId) : unfreezeWallet(walletId)),
    onSuccess: (wallet: Wallet) => {
      const apply = (rows?: Wallet[]) => rows?.map((w) => (w.id === wallet.id ? { ...w, status: wallet.status } : w))
      queryClient.setQueryData(K.mine(), apply)
      queryClient.setQueriesData({ queryKey: [...K.admin.all, 'wallets'] }, apply)
      void queryClient.invalidateQueries({ queryKey: K.detail(wallet.id) })
      toast.success(wallet.status === 'frozen' ? 'Wallet frozen' : 'Wallet unfrozen')
    },
    onError: (e) => toast.error('Couldn’t update the wallet', { description: apiErrorMessage(e) }),
  })
}
