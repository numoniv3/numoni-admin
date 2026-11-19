'use client'

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { displayPhone, isEmail } from '@/lib/auth/phone'
import { FormError } from '../shared/FormError'
import type { AuthFlow } from '../../lib/use-auth-flow'

/** The 6-digit code from signup or login. */
export function OtpForm({ flow }: { flow: AuthFlow }) {
  const [otp, setOtp] = useState('')
  const to = isEmail(flow.sentTo) ? flow.sentTo : displayPhone(flow.sentTo)

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) void flow.verifyOtp(otp) }}>
      <button type="button" onClick={flow.back} className="flex items-center gap-1 text-sm text-muted-foreground mb-5 hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="font-display text-xl font-bold mb-1">{flow.mode === 'signup' ? 'Verify your phone' : 'Enter your code'}</h1>
      <p className="text-sm text-muted-foreground mb-6">
        We sent a 6-digit code to <span className="font-semibold text-foreground tnum">{to}</span>.
        {flow.otpHint && <span className="text-brand font-semibold"> {flow.otpHint}</span>}
      </p>
      <div className="flex justify-center mb-3">
        <InputOTP maxLength={6} value={otp} onChange={(v) => { setOtp(v); flow.clearError() }} autoFocus>
          <InputOTPGroup>{[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} className="h-12 w-11" />)}</InputOTPGroup>
        </InputOTP>
      </div>
      <FormError error={flow.error} className="text-center mb-3" />
      <button type="button" onClick={() => { setOtp(''); void flow.resendOtp() }} disabled={flow.busy} className="block mx-auto text-xs font-semibold text-brand mb-6 disabled:opacity-50">
        Resend code
      </button>
      <Button type="submit" disabled={otp.length !== 6 || flow.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {flow.busy ? 'Verifying…' : flow.mode === 'signup' ? 'Verify & activate' : 'Sign in'}
      </Button>
    </form>
  )
}
