'use client'

import { Check, KeyRound, X } from 'lucide-react'
import { DataTable } from '@/components/ui/data-table'

const permissions = ['View dashboards', 'Approve KYC', 'Run settlement', 'Edit pricing', 'Manage admins', 'Reverse transactions', 'Export customer data', 'Manage campaigns', 'Freeze reward cards']

export function PermissionMatrixCard() {
  return (
    <div className="card-surface p-5">
      <h3 className="font-display font-bold mb-3">Permission matrix</h3>
      <div className="overflow-x-auto">
        <DataTable
          className="w-full text-xs min-w-[380px]"
          data={permissions.map((name) => ({ name }))}
          getRowId={(p) => p.name}
          headerRowClassName="border-b"
          headerCellClassName="label-caps"
          cellClassName="py-2.5"
          columns={[
            { id: 'permission', header: 'Permission', meta: { headerClassName: 'text-left py-2 pr-2', cellClassName: 'pr-2 font-medium' }, cell: ({ row: { original: p } }) => p.name },
            ...['Super', 'Ops', 'Finance', 'Support'].map((role, r) => ({
              id: role.toLowerCase(),
              header: role,
              meta: { headerClassName: 'py-2 px-2', cellClassName: 'px-2 text-center' },
              cell: ({ row: { index: i } }: { row: { index: number } }) => {
                const allowed = r === 0 || (r === 1 && (i <= 1 || i === 7 || i === 8)) || (r === 2 && (i === 2 || i === 3 || i === 5 || i === 6)) || (r === 3 && i === 0)
                return allowed ? <Check className="h-3.5 w-3.5 text-brand mx-auto" /> : <X className="h-3.5 w-3.5 text-muted-foreground/40 mx-auto" />
              },
            })),
          ]}
        />
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><KeyRound className="h-3.5 w-3.5" /> Role changes require a second super-admin approval.</div>
    </div>
  )
}
