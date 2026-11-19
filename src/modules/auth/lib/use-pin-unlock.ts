'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { AuthError, authClient } from '@/lib/auth/client'

/**
 * Lock-screen PIN check (`POST /journey/pin/verify`). `attempt` changes after
 * each wrong PIN — use it as the PinPad's `key` to clear the dots.
 * `verify` is stable, so PinPad's completion effect fires once per entry.
 */
export function usePinUnlock(onUnlock: () => void) {
  const [attempt, setAttempt] = useState(0)
  const [checking, setChecking] = useState(false)

  const verify = useCallback(
    async (pin: string) => {
      setChecking(true)
      try {
        await authClient.run('pin-verify', { pin })
        onUnlock()
      } catch (e) {
        toast.error(e instanceof AuthError && e.status === 401 ? 'Wrong PIN' : 'Couldn’t check your PIN', {
          description: e instanceof AuthError && e.status !== 401 ? e.message : 'Try again.',
        })
        setAttempt((n) => n + 1)
      } finally {
        setChecking(false)
      }
    },
    [onUnlock],
  )

  return { verify, attempt, checking }
}
