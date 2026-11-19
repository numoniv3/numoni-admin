'use client'

import {
  AlertTriangle, CheckCircle2
} from 'lucide-react'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import type { Account } from '@/lib/api/numoni'

interface FinancialStatementsTabProps {
  accounts: Account[]
  assets: number
  equity: number
  gross: number
  liabilities: number
  net: number
  revenue: number
}

export function FinancialStatementsTab({ accounts, assets, equity, gross, liabilities, net, revenue }: FinancialStatementsTabProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* P&L */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold">Profit & Loss</h3>
            <p className="text-xs text-muted-foreground">October 2026 · month to date</p>
          </div>
          <ExportCsvButton
            filename="numoni-pnl-oct-2026"
            headers={['Line', 'Amount (₦)']}
            rows={[
              ...accounts.filter((a) => a.cls === 'Revenue').map((a) => [a.name, a.balance]),
              ['Total revenue', revenue],
              ...accounts.filter((a) => a.cls === 'COGS').map((a) => [a.name, -a.balance]),
              ['Gross profit', gross],
              ...accounts.filter((a) => a.cls === 'Expense').map((a) => [a.name, -a.balance]),
              ['Net profit', net],
            ]}
          />
        </div>
        <div className="space-y-1 text-sm">
          <div className="label-caps pt-1 pb-1.5">Revenue</div>
          {accounts.filter((a) => a.cls === 'Revenue').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum">{fmtNaira(a.balance, 0)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-semibold"><span>Total revenue</span><span className="tnum">{fmtNaira(revenue, 0)}</span></div>

          <div className="label-caps pt-3 pb-1.5">Cost of sales</div>
          {accounts.filter((a) => a.cls === 'COGS').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum text-red-500">({fmtNaira(a.balance, 0)})</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-semibold rounded-lg bg-brand/5 px-2 -mx-2">
            <span>Gross profit <span className="text-[10px] text-brand font-bold ml-1">{Math.round((gross / revenue) * 100)}%</span></span>
            <span className="tnum text-brand">{fmtNaira(gross, 0)}</span>
          </div>

          <div className="label-caps pt-3 pb-1.5">Operating expenses</div>
          {accounts.filter((a) => a.cls === 'Expense').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum text-red-500">({fmtNaira(a.balance, 0)})</span>
            </div>
          ))}
          <div className="flex justify-between py-2.5 mt-1 font-display font-bold text-base border-t-2 border-foreground/20">
            <span>Net profit <span className="text-[10px] text-muted-foreground font-normal ml-1">{Math.round((net / revenue) * 100)}% margin</span></span>
            <span className="tnum text-brand">{fmtNaira(net, 0)}</span>
          </div>
        </div>
      </div>

      {/* Balance sheet */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold">Balance Sheet</h3>
            <p className="text-xs text-muted-foreground">as at Oct 10, 2026</p>
          </div>
          <ExportCsvButton
            filename="numoni-balance-sheet-oct-2026"
            headers={['Line', 'Class', 'Amount (₦)']}
            rows={[
              ...accounts.filter((a) => ['Asset', 'Liability', 'Equity'].includes(a.cls)).map((a) => [a.name, a.cls, a.balance]),
              ['Current period profit (from P&L)', 'Equity', net],
              ['Total assets', 'Asset', assets],
              ['Total liabilities', 'Liability', liabilities],
              ['Total equity', 'Equity', equity + net],
            ]}
          />
        </div>
        <div className="space-y-1 text-sm">
          <div className="label-caps pt-1 pb-1.5">Assets</div>
          {accounts.filter((a) => a.cls === 'Asset').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum">{fmtNaira(a.balance, 0)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-semibold"><span>Total assets</span><span className="tnum">{fmtNaira(assets, 0)}</span></div>

          <div className="label-caps pt-3 pb-1.5">Liabilities</div>
          {accounts.filter((a) => a.cls === 'Liability').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum">{fmtNaira(a.balance, 0)}</span>
            </div>
          ))}
          <div className="flex justify-between py-2 font-semibold"><span>Total liabilities</span><span className="tnum">{fmtNaira(liabilities, 0)}</span></div>

          <div className="label-caps pt-3 pb-1.5">Equity</div>
          {accounts.filter((a) => a.cls === 'Equity').map((a) => (
            <div key={a.code} className="flex justify-between py-1.5 border-b border-dashed border-border/60">
              <span className="text-muted-foreground pl-3">{a.name}</span>
              <span className="tnum">{fmtNaira(a.balance, 0)}</span>
            </div>
          ))}
          <div className="flex justify-between py-1.5 border-b border-dashed border-border/60">
            <span className="text-muted-foreground pl-3">Current period profit (from P&L)</span>
            <span className="tnum text-brand">{fmtNaira(net, 0)}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold"><span>Total equity</span><span className="tnum">{fmtNaira(equity + net, 0)}</span></div>

          <div className={`mt-3 rounded-xl border p-3.5 flex items-center gap-2.5 text-xs font-semibold ${assets === liabilities + equity + net ? 'border-brand/40 bg-brand/5 text-brand' : 'border-red-500/40 bg-red-500/5 text-red-500'}`}>
            {assets === liabilities + equity + net ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            Assets ({fmtNairaCompact(assets)}) = Liabilities ({fmtNairaCompact(liabilities)}) + Equity ({fmtNairaCompact(equity + net)}) — the books balance.
          </div>
        </div>
      </div>
    </div>
  )
}
