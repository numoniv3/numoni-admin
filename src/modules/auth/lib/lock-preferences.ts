import { toast } from 'sonner'
import { AuthError, authClient } from '@/lib/auth/client'

/** Saves app-lock / biometric preferences (`PATCH /journey/lock`); `false` means revert the toggle. */
export async function saveLockPreferences(prefs: { biometricEnabled?: boolean; appLockEnabled?: boolean }): Promise<boolean> {
  try {
    await authClient.run('lock', prefs)
    return true
  } catch (e) {
    toast.error('Couldn’t save that setting', { description: e instanceof AuthError ? e.message : 'Try again.' })
    return false
  }
}
