'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'
import { toast } from 'sonner'
import { Pill, SectionTitle } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

// ── Settings ─────────────────────────────────────────────────────────────────
export function SettingsPage() {
  const [flags, setFlags] = useState({ c2m: true, raffle: true, whiteLabel: true, maintenance: false })
  const flagRows = [
    { key: 'c2m' as const, name: 'Customer-to-merchant transfers', desc: 'Allow customers to push points directly to merchants' },
    { key: 'raffle' as const, name: 'Raffle tickets', desc: 'Issue raffle entries on qualifying redemptions' },
    { key: 'whiteLabel' as const, name: 'White-label programme', desc: 'Enterprise App-as-a-Service onboarding' },
    { key: 'maintenance' as const, name: 'Maintenance mode', desc: 'Freeze all customer-facing writes' },
  ]
  return (
    <div>
      <SectionTitle title="Settings" sub="Platform identity, notification templates, feature flags, experience policies." />
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-4">Platform</h3>
          <div className="space-y-3">
            <div>
              <label className="label-caps">Platform name</label>
              <Input defaultValue="nuMoni" className="mt-1.5" />
            </div>
            <div>
              <label className="label-caps">Support email</label>
              <Input defaultValue="hello@numoni.io" className="mt-1.5" />
            </div>
            <div>
              <label className="label-caps">Membership classes</label>
              <div className="flex gap-2 mt-1.5">
                <Pill tone="neutral">Silver · free</Pill>
                <Pill tone="purple">Gold · ₦2,500/mo</Pill>
                <Pill tone="orange">Platinum · ₦7,500/mo</Pill>
              </div>
            </div>
          </div>
          <h3 className="font-display font-bold mt-6 mb-3">Notification templates</h3>
          <div className="space-y-2 text-sm">
            {['Funding success (SMS)', 'Reward earned (push)', 'Settlement paid (email)', 'KYC approved (SMS)'].map((t) => (
              <div key={t} className="flex items-center justify-between rounded-xl border p-3">
                <span>{t}</span>
                <Button size="sm" variant="ghost" onClick={() => toast.success('Template opened', { description: t })}>Edit</Button>
              </div>
            ))}
          </div>
        </div>
        <div className="card-surface p-5">
          <h3 className="font-display font-bold mb-4">Feature flags & experience policies</h3>
          <div className="space-y-1">
            {flagRows.map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded-xl border p-4 mb-2">
                <div>
                  <div className="text-sm font-semibold">{f.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.desc}</div>
                </div>
                <Switch
                  checked={flags[f.key]}
                  onCheckedChange={(v) => {
                    setFlags((s) => ({ ...s, [f.key]: v }))
                    toast.success(`${f.name} ${v ? 'enabled' : 'disabled'}`, { description: 'Flag change written to audit log' })
                  }}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed p-3 text-xs text-muted-foreground flex gap-2">
            <Settings className="h-4 w-4 shrink-0" /> Flag changes propagate to all rails within 60 seconds.
          </div>
        </div>
      </div>
    </div>
  )
}
