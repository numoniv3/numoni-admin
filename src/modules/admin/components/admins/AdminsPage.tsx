'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { SectionTitle } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { AdminListCard } from './AdminListCard'
import { InviteAdminSheet } from './InviteAdminSheet'
import { PermissionMatrixCard } from './PermissionMatrixCard'

export function AdminsPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div>
      <SectionTitle
        title="Admins & Roles"
        sub="Platform owners, admins and sub-admins — suspend access instantly, invite new admins by phone and email."
        right={<Button size="sm" onClick={() => setInviteOpen(true)} className="bg-brand text-black hover:bg-brand/90 font-bold"><Plus className="h-4 w-4 mr-1.5" /> Invite admin</Button>}
      />
      <div className="grid lg:grid-cols-2 gap-4">
        <AdminListCard />
        <PermissionMatrixCard />
      </div>
      <InviteAdminSheet open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  )
}
