'use client'

import { useState } from 'react'
import { ArrowRight, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { AUTH_MOCKING } from '@/lib/auth/actions'
import { isEmail, isPhone } from '@/lib/auth/phone'
import { FormError } from '../shared/FormError'
import type { AuthFlow } from '../../lib/use-auth-flow'

/** Passwordless sign-in: phone (international) or email → OTP (`POST /journey/login`). */
export function SignInForm({ flow, note }: { flow: AuthFlow; note?: string }) {
  const [mode, setMode] = useState<'phone' | 'email'>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const valid = mode === 'phone' ? isPhone(phone) : isEmail(email)
  const submit = () => flow.requestLogin(mode === 'phone' ? { phone } : { email: email.trim().toLowerCase() })

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) void submit() }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5"><LogIn className="h-5 w-5" /></span>
      <h1 className="font-display text-xl font-bold mb-1">Sign in</h1>
      <p className="text-sm text-muted-foreground mb-6">We&apos;ll send a one-time code to your phone or email. No password needed.</p>
      <div className="flex gap-1.5 mb-3">
        {(['phone', 'email'] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); flow.clearError() }}
            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${mode === m ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>{m}</button>
        ))}
      </div>
      <label htmlFor="auth-identifier" className="label-caps">{mode === 'phone' ? 'Phone number' : 'Email'}</label>
      {mode === 'phone' ? (
        <PhoneInput id="auth-identifier" value={phone} onChange={(v) => { setPhone(v); flow.clearError() }} className="mt-1.5 h-11 mb-2" />
      ) : (
        <Input
          id="auth-identifier" type="email" value={email}
          onChange={(e) => { setEmail(e.target.value); flow.clearError() }}
          placeholder="you@business.ng" autoComplete="email" className="mt-1.5 h-11 mb-2"
        />
      )}
      <FormError error={flow.error} className="mb-2" />
      {AUTH_MOCKING && <p className="text-[11px] text-muted-foreground mb-4">Demo: any number or email works, and the code is 123456.</p>}
      {note && <p className="text-[11px] text-muted-foreground mb-4">{note}</p>}
      <Button type="submit" disabled={!valid || flow.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90 mt-2">
        {flow.busy ? 'Sending code…' : 'Send code'} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </form>
  )
}
