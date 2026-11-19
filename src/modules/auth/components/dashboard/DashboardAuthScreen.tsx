'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PERSONAS, type Persona } from '@/lib/auth/personas'
import { useSession } from '@/store/use-session-store'
import { useAuthFlow } from '../../lib/use-auth-flow'
import { AuthFrame } from './AuthFrame'
import { BusinessProfileForm } from './BusinessProfileForm'
import { OtpForm } from './OtpForm'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

const ADMIN_NOTE = 'Platform admins are invited by the platform owner — there is no public signup.'

/** Sign in / sign up for a dashboard, then any `nextStep` it still owes. */
export function DashboardAuthScreen({ persona }: { persona: Persona }) {
  const flow = useAuthFlow(persona)
  const signOut = useSession((s) => s.signOut)
  const config = PERSONAS[persona]
  const canSignUp = !!config.signupAs
  const [tab, setTab] = useState<'login' | 'signup'>('login')

  const stepKey = flow.step === 'identify' ? `identify-${tab}` : flow.step

  return (
    <AuthFrame label={config.label} stepKey={stepKey}>
      {flow.step === 'identify' && (
        <>
          {canSignUp && (
            <div className="grid grid-cols-2 gap-1 rounded-full border p-1 mb-6" role="tablist">
              {(['login', 'signup'] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => { setTab(t); flow.clearError() }}
                  className={cn('h-9 rounded-full text-sm font-semibold transition-colors', tab === t ? 'bg-brand text-black' : 'text-muted-foreground hover:text-foreground')}
                >
                  {t === 'login' ? 'Sign in' : 'Create account'}
                </button>
              ))}
            </div>
          )}
          {tab === 'signup' && canSignUp ? <SignUpForm flow={flow} persona={persona} /> : <SignInForm flow={flow} note={persona === 'admin' ? ADMIN_NOTE : undefined} />}
        </>
      )}

      {flow.step === 'otp' && <OtpForm flow={flow} />}

      {flow.step === 'profile' && <BusinessProfileForm flow={flow} />}

      {(flow.step === 'name' || flow.step === 'pin') && (
        <>
          <h1 className="font-display text-xl font-bold mb-1">Finish setting up in the app</h1>
          <p className="text-sm text-muted-foreground mb-6">This account still needs its name and PIN. Complete them in the nuMoni app, then sign in here again.</p>
          <Button variant="outline" onClick={() => void signOut()} className="w-full h-11 rounded-full font-bold">
            <LogOut className="h-4 w-4 mr-1.5" /> Sign out
          </Button>
        </>
      )}
    </AuthFrame>
  )
}
