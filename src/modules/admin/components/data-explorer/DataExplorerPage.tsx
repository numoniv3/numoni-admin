'use client'

import { useMemo, useState } from 'react'
import { SectionTitle } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { type ExplorerCustomer } from '@/lib/api/numoni/types/admin'
import { useAdminExplorerCustomersQuery } from '../../api/useAdminQueries'
import { ExplorerResultsTable } from '@/modules/admin/components/data-explorer/ExplorerResultsTable'
import { ExplorerResultStats } from '@/modules/admin/components/data-explorer/ExplorerResultStats'
import { ExplorerFilterBuilder } from '@/modules/admin/components/data-explorer/ExplorerFilterBuilder'
import { FIELDS } from '@/modules/admin/components/data-explorer/fields'
import { ExplorerPresets } from '@/modules/admin/components/data-explorer/ExplorerPresets'

// ── query builder ────────────────────────────────────────────────────────────
export type FieldId = 'age' | 'gender' | 'location' | 'source' | 'industry' | 'segment' | 'kyc' | 'lifetime' | 'visits' | 'cards'

export interface FilterRow { id: number; field: FieldId; op: string; value: string }

function matches(c: ExplorerCustomer, f: FilterRow): boolean {
  const field = FIELDS.find((x) => x.id === f.field)!
  if (field.type === 'cat') {
    const actual = f.field === 'kyc' ? String(c.kyc) : String(c[f.field as 'age' | 'gender' | 'location' | 'source' | 'industry' | 'segment'])
    return f.op === 'is' ? actual === f.value : actual !== f.value
  }
  const actual = c[f.field as 'lifetime' | 'visits' | 'cards']
  const target = Number(f.value.replace(/[^\d]/g, '')) || 0
  return f.op === 'gte' ? actual >= target : actual <= target
}

export function DataExplorerPage() {
  const { data: explorerCustomers } = useAdminExplorerCustomersQuery()
  const [filters, setFilters] = useState<FilterRow[]>([
    { id: 0, field: 'segment', op: 'is', value: 'Power Spender' },
  ])
  const [ran, setRan] = useState(0)

  const results = useMemo(
    () => explorerCustomers.filter((c) => filters.every((f) => f.value && matches(c, f))),
    [filters, ran], // eslint-disable-line react-hooks/exhaustive-deps
  )

  const totalValue = results.reduce((s, c) => s + c.lifetime, 0)

  return (
    <div>
      <SectionTitle
        title="Data Explorer"
        sub="Cross-reference any data point — age, demography, location, business type, industry — and turn the answer into a marketable segment."
        right={
          <ExportCsvButton
            filename="numoni-segment-export"
            headers={['ID', 'Customer', 'Age', 'Gender', 'Location', 'Type', 'Industry', 'Segment', 'KYC', 'Lifetime ₦', 'Visits 30d', 'Cards', 'Last active']}
            rows={results.map((c) => [c.id, c.alias, c.age, c.gender, c.location, c.source, c.industry, c.segment, `Tier ${c.kyc}`, c.lifetime, c.visits, c.cards, c.lastActive])}
          />
        }
      />

      {/* presets */}
      <ExplorerPresets setFilters={setFilters} />

      {/* filter rows */}
      <ExplorerFilterBuilder filters={filters} results={results} setFilters={setFilters} setRan={setRan} />

      {/* result KPIs */}
      <ExplorerResultStats results={results} totalValue={totalValue} />

      {/* results table */}
      <ExplorerResultsTable results={results} totalValue={totalValue} />
    </div>
  )
}
