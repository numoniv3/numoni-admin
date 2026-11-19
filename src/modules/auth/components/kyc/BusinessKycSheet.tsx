'use client'

import { useState } from 'react'
import { BadgeCheck, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormSheet } from '@/components/ui/form-sheet'
import { useKycUpgrade, type Tier3Documents } from '../../lib/use-kyc-upgrade'
import { DocumentInput } from '../shared/DocumentInput'

export interface TierUnlock { name: string; customers: string; txns: string; transfer: string; needs: string }

const DOCS: { key: keyof Tier3Documents; label: string }[] = [
  { key: 'directorId', label: 'Director ID' },
  { key: 'addressProof', label: 'Proof of address' },
]

/**
 * A business account's KYC upgrade — Tier 2: CAC (rc) + director BVN;
 * Tier 3: director ID + proof of address, uploaded first. Merchant, brand,
 * enterprise and reseller consoles share it.
 */
export function BusinessKycSheet({ kycTier, next, open, onOpenChange }: {
  kycTier: 1 | 2 | 3
  next?: TierUnlock
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const kyc = useKycUpgrade()
  const [cac, setCac] = useState('')
  const [bvn, setBvn] = useState('')
  const [docs, setDocs] = useState<Tier3Documents>({})

  const submit = async () => {
    if (kycTier === 1 && (!cac.trim() || bvn.length < 11)) return toast.error('CAC number and 11-digit BVN are required for Tier 2')
    if (kycTier === 2 && (!docs.directorId || !docs.addressProof)) return toast.error('Upload director ID and proof of address for Tier 3')
    const ok = kycTier === 1 ? await kyc.submitTier2({ rc: cac.trim(), bvn }) : await kyc.submitTier3(docs)
    if (!ok) return
    onOpenChange(false)
    setCac(''); setBvn(''); setDocs({})
  }

  return (
    <FormSheet open={open} onOpenChange={(v) => { if (!kyc.busy) onOpenChange(v) }} title={`Upgrade to Tier ${kycTier + 1}`} sub={next ? `${next.name} — ${next.needs}` : undefined}>
      {next && (
        <div className="space-y-4 pb-2">
          <div className="rounded-2xl bg-brand/5 border border-brand/20 p-4">
            <div className="label-caps mb-2 text-brand">What you unlock</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Customers</span><span className="font-bold">{next.customers}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total transactions</span><span className="font-bold">{next.txns}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Transfers</span><span className="font-bold">{next.transfer}</span></div>
            </div>
          </div>

          {kycTier === 1 && (
            <>
              <div>
                <label className="label-caps">CAC registration number</label>
                <Input value={cac} onChange={(e) => setCac(e.target.value)} placeholder="RC1234567" className="mt-1.5 tnum" />
              </div>
              <div>
                <label className="label-caps">Director&apos;s BVN (11 digits)</label>
                <Input value={bvn} onChange={(e) => setBvn(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="2••••••••••" inputMode="numeric" className="mt-1.5 tnum" />
              </div>
            </>
          )}
          {kycTier === 2 && (
            <div>
              <label className="label-caps">Required documents</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {DOCS.map(({ key, label }) => {
                  const file = docs[key]
                  return (
                    <DocumentInput key={key} onPick={(f) => setDocs((d) => ({ ...d, [key]: f }))}
                      className={`cursor-pointer rounded-xl border border-dashed p-4 text-center transition-colors ${file ? 'border-brand bg-brand/5' : 'hover:border-foreground/30'}`}>
                      {file ? <BadgeCheck className="h-5 w-5 mx-auto mb-1.5 text-brand" /> : <Upload className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />}
                      <div className="text-xs font-semibold">{label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{file ? file.name : 'PDF or photo'}</div>
                    </DocumentInput>
                  )
                })}
              </div>
            </div>
          )}

          <Button onClick={() => void submit()} disabled={kyc.busy} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
            {kyc.busy ? (kycTier === 2 ? 'Uploading documents…' : 'Verifying…') : 'Submit & upgrade'}
          </Button>
          <p className="text-[10px] text-muted-foreground text-center">Compliance verifies your details — your tier updates as soon as it&apos;s approved.</p>
        </div>
      )}
    </FormSheet>
  )
}
