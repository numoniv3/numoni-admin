'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionTitle } from '@/components/ui/kit'
import { useSessionUser } from '@/modules/ms/api/ms-opt-in'
import { useApps, useCreateApp } from '@/modules/ms/api/useCreateApp'
import { ActionSheet } from '@/modules/ms/components/shared/ActionForm'
import { RowButton } from '@/modules/ms/components/shared/bits'
import { DataView, listOf, type Row } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { APP_FIELDS } from './app-fields'
import { AppSheet } from './AppSheet'

const idOf = (r: Row) => String(r.id ?? r._id ?? '')

/** The account's white-label apps (Create-App MS): create, edit, submit for review, keys, transactions, drive. */
export function AppStudioPage({ title = 'White-label Apps' }: { title?: string }) {
  const merchantId = useSessionUser()?.universalId
  const q = useApps(merchantId)
  const create = useCreateApp()
  const [creating, setCreating] = useState(false)
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div>
      <SectionTitle
        title={title}
        sub="Your branded apps — create one, submit it for nuMoni review, then manage its product keys, transactions and documents."
        right={<Button onClick={() => setCreating(true)} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold"><Plus className="h-4 w-4 mr-1.5" /> New app</Button>}
      />
      <QueryView query={q}>
        {(d) => (
          <DataView data={listOf(d) ?? []} empty="No apps yet" columns={['name', 'alias', 'websiteUrl', 'status', 'rejectionReason', 'createdAt']}
            onRowClick={(r) => setOpen(idOf(r))} rowActions={(r) => <RowButton onClick={() => setOpen(idOf(r))}>Manage</RowButton>} />
        )}
      </QueryView>
      <ActionSheet
        open={creating} onOpenChange={setCreating} title="New white-label app" sub="Starts as a draft — submit it for review when it’s ready."
        fields={APP_FIELDS} submitLabel="Create app" pending={create.isPending}
        onSubmit={(v) => create.mutate(v as never, { onSuccess: () => setCreating(false) })}
      />
      <AppSheet id={open} onClose={() => setOpen(null)} />
    </div>
  )
}
