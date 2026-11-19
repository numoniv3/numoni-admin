'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Pill } from '@/components/ui/kit'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdminPricingQuery } from '@/modules/admin/api/useAdminQueries'
import { DataTable } from '@/components/ui/data-table'

export function ServicePricingCard() {
  const { data: pricingServices } = useAdminPricingQuery()
  const [services, setServices] = useState(pricingServices)
  const updateService = (i: number, value: string) => {
    setServices((s) => s.map((x, j) => (j === i ? { ...x, value } : x)))
  }

  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4 text-brand" />
        <h3 className="font-display font-bold">Service pricing configurator</h3>
        <Pill tone="neutral">per service · per country</Pill>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-sm min-w-[640px]"
          data={services}
          getRowId={(s) => s.service}
          headerCellClassName="label-caps font-semibold px-3 py-2.5"
          cellClassName="px-3 py-2.5"
          columns={[
            { id: 'service', header: 'Service', meta: { cellClassName: 'font-medium font-mono text-xs' }, cell: ({ row: { original: s } }) => s.service },
            {
              id: 'mode',
              header: 'Mode',
              cell: ({ row: { original: s, index: i } }) => (
                <Select value={s.mode} onValueChange={(v) => setServices((xs) => xs.map((x, j) => (j === i ? { ...x, mode: v } : x)))}>
                  <SelectTrigger className="h-8 w-[130px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Flat', 'Percent', 'Range', 'Flat + %', 'Subscription', 'Percent of budget', 'Licence'].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ),
            },
            { id: 'rate', header: 'Rate', cell: ({ row: { original: s, index: i } }) => <Input value={s.value} onChange={(e) => updateService(i, e.target.value)} className="h-8 w-[120px] text-xs tnum" /> },
            { id: 'cap', header: 'Cap', meta: { cellClassName: 'text-muted-foreground tnum text-xs' }, cell: ({ row: { original: s } }) => s.cap },
            { id: 'country', header: 'Country', cell: ({ row: { original: s } }) => <Pill tone="neutral">{s.country}</Pill> },
            { id: 'extraFees', header: 'Extra fees', meta: { cellClassName: 'text-xs text-muted-foreground' }, cell: () => <>—</> },
          ]}
        />
      </div>
    </div>
  )
}
