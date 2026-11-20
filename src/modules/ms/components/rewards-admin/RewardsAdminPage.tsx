'use client'

import { useDeferredValue, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pill, SectionTitle } from '@/components/ui/kit'
import type { CampaignResponseDto } from '@/lib/api/numoni/types/rewards'
import { fmtNaira } from '@/lib/format'
import { SWEEPS, useAllCampaigns, useDrawRaffle, useGuardrails, useOverrideCampaign, useQueueStatus, useRunSweep, useUpdateGuardrails } from '@/modules/ms/api/useRewardsAdmin'
import { STATUS_TONE, titleCase } from '@/modules/ms/components/campaigns/campaign-meta'
import { ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, PageTabs, RowButton, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, RecordView } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { LookupsTab } from './LookupsTab'

const STATUSES = ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']

function CampaignsTab() {
  const [merchantId, setMerchantId] = useState('')
  const [search, setSearch] = useState('')
  const q = useAllCampaigns({ merchantId: useDeferredValue(merchantId.trim()) || undefined, search: useDeferredValue(search.trim()) || undefined })
  const override = useOverrideCampaign()
  const draw = useDrawRaffle()
  const sheet = useSheet<'override', CampaignResponseDto>()

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <Input value={merchantId} onChange={(e) => setMerchantId(e.target.value)} placeholder="Merchant ID" className="w-60 tnum" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Campaign name or CMP_ reference" className="w-72" />
      </div>
      <QueryView query={q}>
        {(d) => (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 text-sm">
              {[['Campaigns', d.summary.totalCampaigns.toLocaleString()], ['Active', d.summary.activeCampaigns.toLocaleString()], ['In escrow', fmtNaira(d.summary.totalAllocatedBudget, 0)], ['Redemptions', d.summary.totalRedemptionsCount.toLocaleString()]].map(([k, v]) => (
                <div key={k} className="card-surface p-4"><div className="label-caps">{k}</div><div className="text-lg font-bold tnum mt-1">{v}</div></div>
              ))}
            </div>
            <DataView
              data={d.campaigns.map((c) => ({ id: c.id, name: c.name, merchantId: c.merchantId, status: c.status, approved: c.adminApproved, rewards: c.rewards?.length ?? 0, budget: fmtNaira(c.totalBudget, 0), redemptions: c.redemptionsCount, created: c.createdAt }))}
              columns={['name', 'merchantId', 'status', 'approved', 'rewards', 'budget', 'redemptions', 'created']}
              maxColumns={8}
              rowActions={(r) => {
                const c = d.campaigns.find((x) => x.id === r.id)!
                return (
                  <>
                    <Pill tone={STATUS_TONE[c.status]}>{titleCase(c.status)}</Pill>
                    <RowButton onClick={() => sheet.show('override', c)}>Override</RowButton>
                    {c.rewards?.some((x) => x.prizeType === 'RAFFLE_DRAW') && (
                      <ConfirmButton label="Draw raffle" title={`Draw the raffle for “${c.name}”?`} description="Picks a provisional winner from the campaign’s raffle tickets." onConfirm={() => draw.mutate(c.id)} disabled={draw.isPending} />
                    )}
                  </>
                )
              }}
            />
          </>
        )}
      </QueryView>
      <ActionSheet
        open={sheet.is('override')} onOpenChange={sheet.onOpenChange}
        title={`Override · ${sheet.target?.name ?? ''}`} sub="Approve budgets, force a status, or restrict which merchants it applies to."
        fields={[
          { key: 'adminApproved', label: 'Budget approved', kind: 'switch' },
          { key: 'status', label: 'Force status', kind: 'select', options: STATUSES },
          { key: 'merchantWhitelist', label: 'Only these merchant IDs', kind: 'list', wide: true },
          { key: 'merchantBlacklist', label: 'Never these merchant IDs', kind: 'list', wide: true },
        ]}
        initial={{ adminApproved: sheet.target?.adminApproved }}
        submitLabel="Apply override" pending={override.isPending}
        onSubmit={(body) => sheet.target && override.mutate({ id: sheet.target.id, body }, { onSuccess: sheet.close })}
      />
    </div>
  )
}

function GuardrailsTab() {
  const q = useGuardrails()
  const update = useUpdateGuardrails()
  const sheet = useSheet<'edit'>()
  return (
    <QueryView query={q}>
      {(g) => (
        <div className="space-y-3 max-w-xl">
          <RecordView data={{ ...g, maxCampaignBudgetCap: fmtNaira(g.maxCampaignBudgetCap, 0), requireApprovalAboveBudget: fmtNaira(g.requireApprovalAboveBudget, 0), maxRewardPercentCap: `${g.maxRewardPercentCap}%` }} title="Platform-wide campaign limits" />
          <Button onClick={() => sheet.show('edit')} className="rounded-full bg-brand text-black hover:bg-brand/90">Edit guardrails</Button>
          <ActionSheet
            open={sheet.is('edit')} onOpenChange={sheet.onOpenChange} title="Edit guardrails" sub="Applied when a campaign starts."
            fields={[
              { key: 'maxCampaignBudgetCap', label: 'Max campaign budget (₦)', kind: 'number' },
              { key: 'requireApprovalAboveBudget', label: 'Needs approval above (₦)', kind: 'number' },
              { key: 'maxRewardPercentCap', label: 'Max reward / discount (%)', kind: 'number' },
              { key: 'globalDailyPointQuota', label: 'Daily points quota (platform)', kind: 'number' },
            ]}
            initial={g as unknown as Record<string, unknown>} submitLabel="Save guardrails" pending={update.isPending}
            onSubmit={(body) => update.mutate(body, { onSuccess: sheet.close })}
          />
        </div>
      )}
    </QueryView>
  )
}

function QueuesTab() {
  const q = useQueueStatus()
  const sweep = useRunSweep()
  return (
    <div className="space-y-4">
      <QueryView query={q}>
        {(s) => (
          <div className="grid lg:grid-cols-3 gap-3">
            {(['campaignLifecycle', 'rewardEvents', 'campaignTimeTriggers'] as const).map((k) => <RecordView key={k} data={s[k] as unknown as Record<string, unknown>} title={`${k.replace(/([A-Z])/g, ' $1')} · ${s.mode}${s.isRedisConnected ? '' : ' · Redis down'}`} />)}
          </div>
        )}
      </QueryView>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(Object.keys(SWEEPS) as (keyof typeof SWEEPS)[]).map((k) => (
          <div key={k} className="card-surface p-4 flex flex-col gap-2">
            <div className="font-semibold text-sm">{SWEEPS[k].label}</div>
            <div className="text-xs text-muted-foreground flex-1">{SWEEPS[k].desc}</div>
            <Button size="sm" variant="outline" className="rounded-full" disabled={sweep.isPending} onClick={() => sweep.mutate(k)}>Run now</Button>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Admin → Reward MS: campaigns across merchants, guardrails, background queues. */
export function RewardsAdminPage() {
  return (
    <div>
      <SectionTitle title="Reward Engine" sub="Every merchant’s campaigns, platform guardrails and the background jobs (Reward MS)." />
      <PageTabs tabs={[
        { id: 'campaigns', label: 'Campaigns', content: <CampaignsTab /> },
        { id: 'guardrails', label: 'Guardrails', content: <GuardrailsTab /> },
        { id: 'queues', label: 'Queues & sweeps', content: <QueuesTab /> },
        { id: 'lookups', label: 'Lookups', content: <LookupsTab /> },
      ]} />
    </div>
  )
}
