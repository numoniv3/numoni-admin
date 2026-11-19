'use client'

import { Pill } from '@/components/ui/kit'
import { fmtNaira, fmtNairaCompact } from '@/lib/format'
import type { Account, AccountClass } from '@/lib/api/numoni/types/admin'
import { DataTable } from '@/components/ui/data-table'

const CLS_ORDER: AccountClass[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'COGS', 'Expense']

const CLS_TONE: Record<AccountClass, 'sky' | 'red' | 'purple' | 'green' | 'orange' | 'neutral'> = {
  Asset: 'sky', Liability: 'red', Equity: 'purple', Revenue: 'green', COGS: 'orange', Expense: 'neutral',
}

const CLS_LABEL: Record<AccountClass, string> = {
  Asset: 'Assets', Liability: 'Liabilities', Equity: 'Equity', Revenue: 'Revenue', COGS: 'Cost of sales', Expense: 'Expenses',
}

interface ChartOfAccountsTabProps {
  accounts: Account[]
}

export function ChartOfAccountsTab({ accounts }: ChartOfAccountsTabProps) {
  return (
    <div className="space-y-4">
      {CLS_ORDER.map((cls) => {
        const rows = accounts.filter((a) => a.cls === cls)
        const total = rows.reduce((s, a) => s + a.balance, 0)
        return (
          <div key={cls} className="card-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b bg-muted/30">
              <div className="flex items-center gap-2.5">
                <Pill tone={CLS_TONE[cls]}>{CLS_LABEL[cls]}</Pill>
                <span className="text-[10px] text-muted-foreground tnum">{rows.length} accounts · normal balance: {rows[0].normal}</span>
              </div>
              <span className="tnum font-display font-bold">{fmtNairaCompact(total)}</span>
            </div>
            <DataTable
              data={rows}
              getRowId={(a) => a.code}
              showHeader={false}
              cellClassName="px-5 py-2.5"
              rowClassName="border-b last:border-0 hover:bg-accent/40 transition-colors"
              columns={[
                { id: 'code', header: 'Code', meta: { cellClassName: 'font-mono text-xs text-muted-foreground w-20' }, cell: ({ row: { original: a } }) => a.code },
                { id: 'name', header: 'Account', meta: { ownCellClassName: true, cellClassName: 'px-2 py-2.5 font-medium' }, cell: ({ row: { original: a } }) => a.name },
                { id: 'balance', header: 'Balance', meta: { cellClassName: 'text-right tnum font-semibold w-40' }, cell: ({ row: { original: a } }) => fmtNaira(a.balance, 0) },
                { id: 'normal', header: 'Normal', meta: { cellClassName: 'text-right w-24' }, cell: ({ row: { original: a } }) => <span className="text-[10px] text-muted-foreground">{a.normal}</span> },
              ]}
            />
          </div>
        )
      })}
    </div>
  )
}
