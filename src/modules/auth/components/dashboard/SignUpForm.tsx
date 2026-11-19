'use client'

import { useState } from 'react'
import { ArrowRight, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isEmail, isPhone, toLocalPhone } from '@/lib/auth/phone'
import type { Persona } from '@/lib/auth/personas'
import { FormError } from '../shared/FormError'
import type { AuthFlow } from '../../lib/use-auth-flow'

const COPY: Partial<Record<Persona, { title: string; sub: string; nameLabel: string; referral: boolean }>> = {
  merchant: { title: 'Register your business', sub: 'Start rewarding customers in under 3 minutes.', nameLabel: 'Business name', referral: true },
  brand: { title: 'Register your brand', sub: 'Run reward campaigns across the nuMoni merchant network.', nameLabel: 'Brand name', referral: true },
  enterprise: { title: 'Register your company', sub: 'Embed nuMoni rewards with our widget and API.', nameLabel: 'Company name', referral: true },
  reseller: { title: 'Become a reseller', sub: 'Onboard merchants and earn on every one you bring.', nameLabel: 'Business name', referral: false },
}

/** Business signup: name + phone + email (+ reseller referral code) → OTP (`POST /journey/signup`). */
export function SignUpForm({ flow, persona }: { flow: AuthFlow; persona: Persona }) {
  const copy = COPY[persona] ?? COPY.merchant!
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const valid = businessName.trim().length >= 2 && isPhone(phone) && isEmail(email)

  const submit = () =>
    flow.signUp({
      businessName: businessName.trim(),
      phone: toLocalPhone(phone),
      email: email.trim().toLowerCase(),
      referralCode: referralCode.trim() || undefined,
    })

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) void submit() }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5"><Building2 className="h-5 w-5" /></span>
      <h1 className="font-display text-xl font-bold mb-1">{copy.title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{copy.sub}</p>
      <div className="space-y-3 mb-4">
        <div>
          <label htmlFor="su-name" className="label-caps">{copy.nameLabel}</label>
          <Input id="su-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Charles Store" autoComplete="organization" className="mt-1.5 h-11" />
        </div>
        <div>
          <label htmlFor="su-phone" className="label-caps">Phone</label>
          <Input id="su-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812 440 9021" inputMode="tel" autoComplete="tel" className="mt-1.5 h-11 tnum" />
        </div>
        <div>
          <label htmlFor="su-email" className="label-caps">Email</label>
          <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.ng" autoComplete="email" className="mt-1.5 h-11" />
        </div>
        {copy.referral && (
          <div>
            <label htmlFor="su-ref" className="label-caps">Reseller referral code <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
            <Input id="su-ref" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} placeholder="NUM-A1B2C3" className="mt-1.5 h-11 tnum" />
          </div>
        )}
      </div>
      <FormError error={flow.error} className="mb-3" />
      <Button type="submit" disabled={!valid || flow.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {flow.busy ? 'Sending code…' : 'Send OTP'} <ArrowRight className="h-4 w-4 ml-1" />
      </Button>
    </form>
  )
}
