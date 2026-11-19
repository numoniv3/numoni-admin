'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import type { MerchantConfig } from '@/modules/admin/components/treasury/TreasuryPage'
import type { Merchant } from '@/lib/api/numoni'

interface MerchantSettlementConfigCardProps {
  merchants: Merchant[]
}

export function MerchantSettlementConfigCard({ merchants }: MerchantSettlementConfigCardProps) {
  const [cfgMerchant, setCfgMerchant] = useState(merchants[0].name)
  const [configs, setConfigs] = useState<Record<string, MerchantConfig>>({})
  const cfg = configs[cfgMerchant] ?? { schedule: 'T+1 next-day', minPayout: 50_000, feeShare: 1.0, holdAll: false }
  const saveCfg = (patch: Partial<MerchantConfig>) => {
    setConfigs((c) => ({ ...c, [cfgMerchant]: { ...cfg, ...patch } }))
  }

  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-1">Merchant settlement config</h3>
      <p className="text-xs text-muted-foreground mb-4">Per-merchant schedule, minimums, and holds</p>
      <Select value={cfgMerchant} onValueChange={setCfgMerchant}>
        <SelectTrigger className="mb-4"><SelectValue /></SelectTrigger>
        <SelectContent>
          {merchants.map((m) => <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
        </SelectContent>
      </Select>

      <label className="label-caps">Settlement schedule</label>
      <div className="flex gap-1.5 mt-1.5 mb-4">
        {(['T+0 same-day', 'T+1 next-day', 'Weekly (Fri)'] as const).map((s) => (
          <button
            key={s}
            onClick={() => { saveCfg({ schedule: s }); toast.success('Schedule updated', { description: `${cfgMerchant} → ${s}` }) }}
            className={`rounded-full px-3 h-8 text-[11px] font-bold transition-colors ${cfg.schedule === s ? 'bg-brand text-black' : 'border text-muted-foreground'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="label-caps">Minimum payout (₦)</label>
      <Input
        value={cfg.minPayout}
        onChange={(e) => saveCfg({ minPayout: Number(e.target.value.replace(/\D/g, '')) || 0 })}
        inputMode="numeric"
        className="mt-1.5 mb-4 tnum"
      />

      <label className="label-caps">Platform fee share — {cfg.feeShare.toFixed(1)}%</label>
      <input
        type="range" min={0.5} max={3} step={0.1} value={cfg.feeShare}
        onChange={(e) => saveCfg({ feeShare: Number(e.target.value) })}
        className="w-full accent-[#02DC4D] mb-4"
      />

      <div className="flex items-center justify-between rounded-xl border border-orangeb/40 bg-orangeb/5 p-3.5">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="h-4 w-4 text-orangeb shrink-0" />
          <div>
            <div className="text-xs font-bold">Hold all payouts</div>
            <div className="text-[10px] text-muted-foreground">Freezes every payout for this merchant</div>
          </div>
        </div>
        <Switch checked={cfg.holdAll} onCheckedChange={(v) => { saveCfg({ holdAll: v }); toast.success(v ? 'Merchant payouts frozen' : 'Merchant payouts unfrozen', { description: cfgMerchant }) }} />
      </div>
    </div>
  )
}
