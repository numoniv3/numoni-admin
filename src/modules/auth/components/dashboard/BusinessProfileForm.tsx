'use client'

import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormError } from '../shared/FormError'
import type { AuthFlow } from '../../lib/use-auth-flow'

/** `nextStep: PROFILE` — the account has no business name yet (`POST /journey/profile/business`). */
export function BusinessProfileForm({ flow }: { flow: AuthFlow }) {
  const [businessName, setBusinessName] = useState(flow.user?.businessName ?? '')
  const [whatYouDo, setWhatYouDo] = useState('')
  const [address, setAddress] = useState('')
  const valid = businessName.trim().length >= 2

  const submit = () =>
    flow.saveBusiness({
      businessName: businessName.trim(),
      whatYouDo: whatYouDo.trim() || undefined,
      industry: whatYouDo.trim() || undefined,
      address: address.trim() || undefined,
    })

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (valid) void submit() }}>
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-5"><BadgeCheck className="h-5 w-5" /></span>
      <h1 className="font-display text-xl font-bold mb-1">Phone verified — KYC Tier 1</h1>
      <p className="text-sm text-muted-foreground mb-6">Tell us about the business to open your dashboard. You can change this later in Settings.</p>
      <div className="space-y-3 mb-4">
        <div>
          <label htmlFor="bp-name" className="label-caps">Business name</label>
          <Input id="bp-name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Charles Store" className="mt-1.5 h-11" />
        </div>
        <div>
          <label htmlFor="bp-what" className="label-caps">What you do <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
          <Input id="bp-what" value={whatYouDo} onChange={(e) => setWhatYouDo(e.target.value)} placeholder="Retail, food, fintech…" className="mt-1.5 h-11" />
        </div>
        <div>
          <label htmlFor="bp-address" className="label-caps">Address <span className="normal-case font-normal text-muted-foreground">(optional)</span></label>
          <Input id="bp-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="24 Aminu Kano Crescent, Wuse II" className="mt-1.5 h-11" />
        </div>
      </div>
      <FormError error={flow.error} className="mb-3" />
      <Button type="submit" disabled={!valid || flow.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
        {flow.busy ? 'Saving…' : 'Enter my dashboard'}
      </Button>
    </form>
  )
}
