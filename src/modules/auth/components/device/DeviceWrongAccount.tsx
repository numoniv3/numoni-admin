'use client'

import { UserX } from 'lucide-react'
import { PERSONAS, USER_TYPE_LABEL, homeFor, type Persona } from '@/lib/auth/personas'
import type { SessionUser } from '@/lib/auth/types'
import { useSession } from '@/store/use-session-store'

interface Palette { background: string; color: string; primary: string }

const DEFAULT: Palette = { background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', primary: 'hsl(var(--brand))' }

/** Phone-app version of the wrong-account screen; white-label apps pass their colours. */
export function DeviceWrongAccount({ persona, user, palette = DEFAULT }: { persona: Persona; user: SessionUser; palette?: Palette }) {
  const signOut = useSession((s) => s.signOut)
  const home = homeFor(user.userType)
  const who = user.businessName ?? user.name ?? user.phone ?? 'this account'
  const allowed = PERSONAS[persona].userTypes.map((t) => USER_TYPE_LABEL[t].toLowerCase()).join(' or ')

  return (
    <div className="flex-1 flex flex-col px-6 pt-20 pb-8" style={{ background: palette.background, color: palette.color }}>
      <span className="flex h-14 w-14 items-center justify-center rounded-3xl mb-6" style={{ background: palette.primary, color: '#fff' }}>
        <UserX className="h-6 w-6" />
      </span>
      <h1 className="font-display text-2xl font-bold tracking-tight">Wrong account</h1>
      <p className="text-sm opacity-70 mt-2">
        You&apos;re signed in as {who}, a {USER_TYPE_LABEL[user.userType].toLowerCase()} account. The {PERSONAS[persona].label.toLowerCase()} needs a {allowed} account.
      </p>
      <div className="mt-auto space-y-2.5">
        {home && (
          <a href={home} className="flex w-full h-12 items-center justify-center rounded-full font-bold text-sm text-black" style={{ background: palette.primary }}>
            Go to my console
          </a>
        )}
        <button onClick={() => void signOut()} className="w-full h-12 rounded-full border font-bold text-sm" style={palette === DEFAULT ? undefined : { borderColor: `${palette.color}33` }}>
          Sign out and use another number
        </button>
      </div>
    </div>
  )
}
