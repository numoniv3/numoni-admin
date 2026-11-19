'use client'

import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { useAdmin } from '@/store/use-admin-store'

export function ReconBanner() {
  const { cutoffPhase, reconOk } = useAdmin()
  if (cutoffPhase !== 'idle' && cutoffPhase !== 'done') {
    return (
      <Pill tone="orange">
        <span className="h-1.5 w-1.5 rounded-full bg-orangeb animate-pulse" />
        Cut-off running — books frozen
      </Pill>
    )
  }
  return reconOk ? (
    <Pill tone="green">
      <CheckCircle2 className="h-3 w-3" /> Books balanced
    </Pill>
  ) : (
    <Pill tone="red">
      <AlertTriangle className="h-3 w-3" /> Variance detected — settlement halted
    </Pill>
  )
}
