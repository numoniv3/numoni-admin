'use client'

import { useEffect } from 'react'
import { useSession } from '@/store/use-session-store'

/** Loads the session on first use (once per page load) and reports its status. */
export function useSessionBootstrap() {
  const status = useSession((s) => s.status)
  const load = useSession((s) => s.load)
  useEffect(() => {
    void load()
  }, [load])
  return status
}
