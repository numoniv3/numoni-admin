'use client'

import { useState } from 'react'
import type { BusinessProfile } from '@/lib/api/numoni/types/account'
import { useAccountProfilesQuery, useUpdateBusinessProfile } from '../api/useAccountQueries'

export type BusinessProfileField = 'businessName' | 'industry' | 'phone' | 'email' | 'address' | 'state'

const defined = (p: BusinessProfile | null) => Object.fromEntries(Object.entries(p ?? {}).filter(([, v]) => v !== undefined && v !== ''))

/**
 * The business-profile form for any business console: starts from the saved
 * profile (`GET /profiles/{id}`), filling gaps from `fallback`, and saves with
 * `PATCH /profiles/{id}/merchant`.
 */
export function useBusinessProfileForm(fallback: Pick<BusinessProfile, BusinessProfileField>) {
  const { data } = useAccountProfilesQuery()
  const [form, setForm] = useState<Pick<BusinessProfile, BusinessProfileField>>(() => ({ ...fallback, ...defined(data.business) }))
  const update = useUpdateBusinessProfile()

  return {
    form,
    set: (field: BusinessProfileField) => (value: string) => setForm((f) => ({ ...f, [field]: value })),
    save: () => update.mutate(form),
    saving: update.isPending,
  }
}
