import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { inviteAdmin, setAccountLimits, setAccountStatus } from '@/lib/api/numoni/admin.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { AccountLimits, AccountStatus, AdminInvite, PlatformAccount } from '@/lib/api/numoni/types/admin'

const K = numoniKeys.admin

/**
 * Applies a saved change to every cached account list (admins + each filtered
 * accounts view), so screens update without refetching.
 */
function usePatchAccount() {
  const queryClient = useQueryClient()
  return (universalId: string, patch: Partial<PlatformAccount>) => {
    const apply = (rows?: PlatformAccount[]) => rows?.map((a) => (a.universalId === universalId ? { ...a, ...patch } : a))
    queryClient.setQueryData(K.admins(), apply)
    queryClient.setQueriesData({ queryKey: [...K.all, 'accounts'] }, apply)
  }
}

export function useInviteAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (invite: AdminInvite) => inviteAdmin(invite),
    onSuccess: (_, invite) => {
      void queryClient.invalidateQueries({ queryKey: K.admins() })
      toast.success('Invite sent', { description: `${invite.email} · they finish with a phone OTP` })
    },
    onError: (e) => toast.error('Couldn’t send the invite', { description: apiErrorMessage(e) }),
  })
}

export function useSetAccountStatus() {
  const patch = usePatchAccount()
  return useMutation({
    mutationFn: ({ universalId, status }: { universalId: string; status: AccountStatus }) => setAccountStatus(universalId, status),
    onSuccess: (_, { universalId, status }) => {
      patch(universalId, { accountStatus: status })
      toast.success(`Account ${status.toLowerCase()}`)
    },
    onError: (e) => toast.error('Couldn’t change the status', { description: apiErrorMessage(e) }),
  })
}

export function useSetAccountLimits() {
  const patch = usePatchAccount()
  return useMutation({
    mutationFn: ({ universalId, limits }: { universalId: string; limits: AccountLimits }) => setAccountLimits(universalId, limits),
    onSuccess: (_, { universalId, limits }) => {
      patch(universalId, { limits })
      toast.success('Limits updated')
    },
    onError: (e) => toast.error('Couldn’t update the limits', { description: apiErrorMessage(e) }),
  })
}
