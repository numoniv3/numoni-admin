'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { uploadFile } from '@/lib/api/numoni/account.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { authClient } from '@/lib/auth/client'
import { useSession } from '@/store/use-session-store'

/** Tier 2: a person's NIN or BVN, a business's CAC (`rc`) + the director's BVN. */
export interface Tier2Identity {
  nin?: string
  bvn?: string
  rc?: string
}

/** Tier 3 documents, uploaded to `/media/upload` before the journey call. */
export interface Tier3Documents {
  bankStatement?: File
  addressProof?: File
  directorId?: File
}

const upload = (file?: File) => (file ? uploadFile(file, 'kyc').then((f) => f.key) : Promise.resolve(undefined))

/**
 * Submits a KYC tier (`POST /journey/kyc/tier2|tier3`) and re-reads the
 * session, so every screen picks up the new tier from the token. Compliance
 * may approve later rather than at once; the toast says which happened.
 * Resolves `true` when the submission went through.
 */
export function useKycUpgrade() {
  const refresh = useSession((s) => s.refresh)
  const [busy, setBusy] = useState(false)

  const run = async (submit: () => Promise<unknown>) => {
    const before = useSession.getState().user?.kycTier ?? 1
    setBusy(true)
    try {
      await submit()
      await refresh()
      const after = useSession.getState().user?.kycTier ?? before
      if (after > before) toast.success(`Tier ${after} unlocked`, { description: 'Your new limits are active.' })
      else toast.success('Submitted for review', { description: 'Your tier updates as soon as Compliance approves it.' })
      return true
    } catch (e) {
      toast.error('Couldn’t submit your KYC', { description: apiErrorMessage(e) })
      return false
    } finally {
      setBusy(false)
    }
  }

  const submitTier2 = (identity: Tier2Identity) => run(() => authClient.run('kyc-tier2', { ...identity, applyTier: true }))

  const submitTier3 = (docs: Tier3Documents) =>
    run(async () => {
      const [bankStatementRef, addressProofRef, directorIdRef] = await Promise.all([upload(docs.bankStatement), upload(docs.addressProof), upload(docs.directorId)])
      return authClient.run('kyc-tier3', { bankStatementRef, addressProofRef, directorIdRef, applyTier: true })
    })

  return { busy, submitTier2, submitTier3 }
}
