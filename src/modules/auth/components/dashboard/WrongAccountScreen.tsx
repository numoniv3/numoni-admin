'use client'

import { ArrowRight, LogOut, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PERSONAS, USER_TYPE_LABEL, homeFor, type Persona } from '@/lib/auth/personas'
import type { SessionUser } from '@/lib/auth/types'
import { useSession } from '@/store/use-session-store'
import { AuthFrame } from './AuthFrame'

/** Signed in, but as an account type this console doesn't admit. */
export function WrongAccountScreen({ persona, user }: { persona: Persona; user: SessionUser }) {
  const signOut = useSession((s) => s.signOut)
  const config = PERSONAS[persona]
  const allowed = config.userTypes.map((t) => USER_TYPE_LABEL[t].toLowerCase()).join(' or ')
  const home = homeFor(user.userType)
  const who = user.businessName ?? user.name ?? user.phone ?? user.email ?? 'this account'

  return (
    <AuthFrame label={config.label} stepKey="wrong-account">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orangeb/10 text-orangeb mb-5"><UserX className="h-5 w-5" /></span>
      <h1 className="font-display text-xl font-bold mb-1">Wrong account for this console</h1>
      <p className="text-sm text-muted-foreground mb-6">
        You&apos;re signed in as <span className="font-semibold text-foreground">{who}</span>, a {USER_TYPE_LABEL[user.userType].toLowerCase()} account.
        This console is for {allowed} accounts.
      </p>
      <div className="space-y-2.5">
        {home && (
          <Button asChild className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
            <a href={home}>Go to my console <ArrowRight className="h-4 w-4 ml-1" /></a>
          </Button>
        )}
        <Button variant="outline" onClick={() => void signOut()} className="w-full h-11 rounded-full font-bold">
          <LogOut className="h-4 w-4 mr-1.5" /> Sign out and use another account
        </Button>
      </div>
    </AuthFrame>
  )
}
