'use client'

import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useSession } from '@/store/use-session-store'

/** Ends the session; the console's gate then shows its sign-in screen. */
export function SignOutButton() {
  const signOut = useSession((s) => s.signOut)
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 rounded-full"
      onClick={() => {
        void signOut()
        toast.success('Signed out', { description: 'Session ended — see you soon.' })
      }}
    >
      <LogOut className="h-3.5 w-3.5" /> Log out
    </Button>
  )
}
