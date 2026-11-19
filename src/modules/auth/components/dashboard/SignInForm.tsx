'use client'

import { useState } from 'react'
import { ArrowRight, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AUTH_MOCKING } from '@/lib/auth/actions'
import { isEmail, isPhone, toIdentifier } from '@/lib/auth/phone'
import { FormError } from '../shared/FormError'
import type { AuthFlow } from '../../lib/use-auth-flow'

/** Passwordless sign-in: phone or email → OTP (`POST /journey/login`). */
export function SignInForm({ flow, note }: { flow: AuthFlow; note?: string }) {
  const [value, setValue] = useState('')
  const valid = isEmail(value) || isPhone(value)

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) void flow.requestLogin(toIdentifier(value)) }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5"><LogIn className="h-5 w-5" /></span>
      <h1 className="font-display text-xl font-bold mb-1">Sign in</h1>
      <p className="text-sm text-muted-foreground mb-6">We&apos;ll send a one-time code to your phone or email. No password needed.</p>
      <label htmlFor="auth-identifier" className="label-caps">Phone or email</label>
      <Input
        id="auth-identifier"
        value={value}
        onChange={(e) => { setValue(e.target.value); flow.clearError() }}
        placeholder="0803 555 0142 or you@business.ng"
        autoComplete="username"
        className="mt-1.5 h-11 mb-2"
      />
      <FormError error={flow.error} className="mb-2" />
      {AUTH_MOCKING && <p className="text-[11px] text-muted-foreground mb-4">Demo: any number or email works, and the code is 123456.</p>}
      {note && <p className="text-[11px] text-muted-foreground mb-4">{note}</p>}
      <Button type="submit" disabled={!valid || flow.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90 mt-2">
        {flow.busy ? 'Sending code…' : 'Send code'} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </form>
  )
}
