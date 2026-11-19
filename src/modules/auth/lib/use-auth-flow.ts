'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { AUTH_MOCKING, type AuthAction } from '@/lib/auth/actions'
import { AuthError, authClient } from '@/lib/auth/client'
import { PERSONAS, type Persona } from '@/lib/auth/personas'
import type { AuthResponse } from '@/lib/auth/types'
import { useSession } from '@/store/use-session-store'

/** The screen a sign-in flow should show — local phases first, then the Gateway's `nextStep`. */
export type FlowStep = 'identify' | 'otp' | 'name' | 'pin' | 'profile' | 'done'

type Identifier = { phone: string } | { email: string }

export interface SignupInput {
  phone: string
  name?: string
  businessName?: string
  email?: string
  referralCode?: string
}

/**
 * One journey for every app: identify (phone/email) → OTP → whatever
 * `nextStep` the Gateway returns (NAME, PIN, PROFILE) → DASHBOARD. Each
 * response that carries a user updates the shared session store.
 */
export function useAuthFlow(persona: Persona) {
  const { user, nextStep, apply } = useSession()
  const [phase, setPhase] = useState<'identify' | 'otp'>('identify')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [identifier, setIdentifier] = useState<Identifier>({ phone: '' })
  const [devOtp, setDevOtp] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /** Resolves the response, or the `AuthError` (also shown as `error`). */
  const run = async (action: AuthAction, body: Record<string, unknown>, opts?: { quiet?: number }): Promise<AuthResponse | AuthError> => {
    setBusy(true)
    setError(null)
    try {
      const res = await authClient.run(action, { ...body, persona })
      if (res.devOtp) setDevOtp(res.devOtp)
      apply(res)
      return res
    } catch (e) {
      const err = e instanceof AuthError ? e : new AuthError(0, 'Something went wrong — try again')
      if (err.status !== opts?.quiet) setError(err.message)
      return err
    } finally {
      setBusy(false)
    }
  }

  const requestLogin = async (id: Identifier) => {
    setMode('login')
    setIdentifier(id)
    const res = await run('login', id)
    if (!(res instanceof AuthError) && !res.user) setPhase('otp')
  }

  /** Sign up; with `fallbackToLogin`, a number that already has an account (409) signs in instead. */
  const signUp = async (input: SignupInput, opts?: { fallbackToLogin?: boolean }) => {
    const userType = PERSONAS[persona].signupAs
    if (!userType) return setError('Accounts for this app are created by nuMoni — sign in instead')
    const res = await run('signup', { ...input, userType }, { quiet: opts?.fallbackToLogin ? 409 : undefined })
    if (res instanceof AuthError) {
      if (res.status === 409 && opts?.fallbackToLogin) await requestLogin({ phone: input.phone })
      return
    }
    setMode('signup')
    setIdentifier({ phone: input.phone })
    setPhase('otp')
  }

  const verifyOtp = (code: string) =>
    mode === 'signup' && 'phone' in identifier
      ? run('verify', { phone: identifier.phone, code, purpose: 'signup' })
      : run('login', { ...identifier, code })

  const resendOtp = async () => {
    const res = mode === 'signup' && 'phone' in identifier ? await run('signup-otp', { phone: identifier.phone }) : await run('login', identifier)
    if (!(res instanceof AuthError)) toast.info('Code resent', { description: `Sent to ${'phone' in identifier ? identifier.phone : identifier.email}` })
  }

  const saveName = (name: string) => {
    const [firstName, ...rest] = name.trim().split(/\s+/)
    return run('profile-customer', { name: name.trim(), firstName, lastName: rest.join(' ') || undefined })
  }

  const savePin = (pin: string, biometricEnabled: boolean) => run('pin', { pin, biometricEnabled })

  const saveBusiness = (profile: Record<string, unknown>) => run('profile-business', profile)

  const step: FlowStep = !user
    ? phase
    : nextStep === 'NAME'
      ? 'name'
      : nextStep === 'PIN'
        ? 'pin'
        : nextStep === 'PROFILE'
          ? 'profile'
          : 'done'

  return {
    step,
    mode,
    user,
    busy,
    error,
    clearError: () => setError(null),
    /** Where the code went, for the OTP screen. */
    sentTo: 'phone' in identifier ? identifier.phone : identifier.email,
    /** Shown under the OTP input when the Gateway (or the mock) returns the code. */
    otpHint: devOtp ? `${AUTH_MOCKING ? 'Demo' : 'Dev'} code: ${devOtp}` : null,
    back: () => {
      setPhase('identify')
      setError(null)
    },
    requestLogin,
    signUp,
    verifyOtp,
    resendOtp,
    saveName,
    savePin,
    saveBusiness,
  }
}

export type AuthFlow = ReturnType<typeof useAuthFlow>
