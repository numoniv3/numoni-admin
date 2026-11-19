import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createSubAdmin, getAccountProfiles, getMyPolicy, listApiCredentials, rotateApiCredentials, updateBusinessProfile, updateUserProfile,
} from '@/lib/api/numoni/account.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { AccountProfiles, BusinessProfile, SubAdminInput, UserProfile } from '@/lib/api/numoni/types/account'
import { useSession } from '@/store/use-session-store'

/*
 * The signed-in account's own records — profiles, API keys and team — shared
 * by every console and phone app. Each hook resolves the account from the
 * session, so it must render inside an app's auth gate.
 */

const K = numoniKeys.account

/** The signed-in account's universalId (the auth gates guarantee one). */
export function useUniversalId(): string {
  const id = useSession((s) => s.user?.universalId)
  if (!id) throw new Error('No signed-in account')
  return id
}

export function useAccountProfilesQuery() {
  const id = useUniversalId()
  return useSuspenseQuery({ queryKey: K.profiles(id), queryFn: () => getAccountProfiles(id) })
}

/** Writes the saved side back into the cached `GET /profiles/{id}`. */
function useProfileCache() {
  const queryClient = useQueryClient()
  const id = useUniversalId()
  return (patch: Partial<AccountProfiles>) =>
    queryClient.setQueryData<AccountProfiles>(K.profiles(id), (old) => ({ user: null, business: null, ...old, ...patch }))
}

export function useUpdateUserProfile(opts: { silent?: boolean } = {}) {
  const id = useUniversalId()
  const cache = useProfileCache()
  return useMutation({
    mutationFn: (patch: UserProfile) => updateUserProfile(id, patch),
    onSuccess: (user, patch) => {
      cache({ user: { ...patch, ...user } })
      if (!opts.silent) toast.success('Profile updated')
    },
    onError: (e) => toast.error('Couldn’t save your profile', { description: apiErrorMessage(e) }),
  })
}

export function useUpdateBusinessProfile() {
  const id = useUniversalId()
  const cache = useProfileCache()
  return useMutation({
    mutationFn: (patch: BusinessProfile) => updateBusinessProfile(id, patch),
    onSuccess: (business) => {
      cache({ business })
      toast.success('Profile saved')
    },
    onError: (e) => toast.error('Couldn’t save the profile', { description: apiErrorMessage(e) }),
  })
}

/** The limits and permissions every service enforces for the signed-in account. */
export function useMyPolicyQuery() {
  const id = useUniversalId()
  return useSuspenseQuery({ queryKey: K.policy(id), queryFn: () => getMyPolicy(id) })
}

export function useApiCredentialsQuery() {
  const id = useUniversalId()
  return useSuspenseQuery({ queryKey: K.credentials(id), queryFn: () => listApiCredentials(id) })
}

/** Rotates the SK/PK pair; the caller shows `data.secretKey` once. */
export function useRotateCredentials() {
  const id = useUniversalId()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rotateApiCredentials(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: K.credentials(id) })
      toast.success('New keys issued', { description: 'The previous pair no longer works.' })
    },
    onError: (e) => toast.error('Couldn’t rotate the keys', { description: apiErrorMessage(e) }),
  })
}

/** Invites a team member as a sub-admin of the signed-in account. */
export function useCreateSubAdmin() {
  const id = useUniversalId()
  return useMutation({
    mutationFn: (input: SubAdminInput) => createSubAdmin(id, input),
    onError: (e) => toast.error('Couldn’t send the invite', { description: apiErrorMessage(e) }),
  })
}
