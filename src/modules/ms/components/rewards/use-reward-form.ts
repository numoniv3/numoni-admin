import { useState } from 'react'
import type { RewardTemplateResponseDto } from '@/lib/api/numoni/types/rewards'
import { draftFromReward, emptyDraft, type RewardDraft } from './reward-draft'

/** Create/edit form state: the draft, which reward template is being edited, and whether the sheet is open. */
export function useRewardForm() {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<RewardTemplateResponseDto | null>(null)
  const [draft, setDraft] = useState<RewardDraft>(() => emptyDraft())

  const update = (patch: Partial<RewardDraft>) => setDraft((d) => ({ ...d, ...patch }))
  const reset = () => { setEditing(null); setDraft(emptyDraft()) }
  const openAdd = () => { setEditing(null); setDraft(emptyDraft()); setOpen(true) }
  const openEdit = (r: RewardTemplateResponseDto) => { setEditing(r); setDraft(draftFromReward(r)); setOpen(true) }

  return { open, setOpen, editing, draft, update, reset, openAdd, openEdit }
}

export type RewardForm = ReturnType<typeof useRewardForm>
