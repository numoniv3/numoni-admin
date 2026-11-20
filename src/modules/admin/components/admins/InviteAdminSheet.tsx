'use client'

import { useState } from 'react'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { splitName } from '@/lib/api/numoni/parse'
import type { AdminInvite } from '@/lib/api/numoni/types/admin'
import { isPhone } from '@/lib/auth/phone'
import { PhoneInput } from '@/components/ui/phone-input'
import { useInviteAdmin } from '../../api/useAdminMutations'

/** `POST /admin/invite` — the invitee completes sign-in with a phone OTP. */
export function InviteAdminSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const invite = useInviteAdmin()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<AdminInvite['role']>('admin')
  const valid = name.trim().split(/\s+/).length >= 2 && email.includes('@') && isPhone(phone)

  const send = () =>
    invite.mutate({ ...splitName(name), email: email.trim(), phone, role }, {
      onSuccess: () => {
        onOpenChange(false)
        setName(''); setEmail(''); setPhone(''); setRole('admin')
      },
    })

  return (
    <FormSheet open={open} onOpenChange={onOpenChange} title="Invite admin" sub="They sign in with their phone number and a one-time code.">
      <div className="space-y-4">
        <div>
          <label className="label-caps">Full name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ngozi Eze" className="mt-1.5" />
        </div>
        <div>
          <label className="label-caps">Work email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@numoni.ng" className="mt-1.5" />
        </div>
        <div>
          <label className="label-caps">Phone</label>
          <PhoneInput value={phone} onChange={setPhone} className="mt-1.5" />
        </div>
        <div>
          <label className="label-caps">Role</label>
          <Select value={role} onValueChange={(v) => setRole(v as AdminInvite['role'])}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="super_admin">Super admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button disabled={!valid || invite.isPending} onClick={send} className="w-full h-11 rounded-full bg-brand text-black font-bold hover:bg-brand/90">
          {invite.isPending ? 'Sending…' : 'Send invite'}
        </Button>
      </div>
    </FormSheet>
  )
}
