'use client'

import { Check, FileText, X } from 'lucide-react'
import { FormSheet } from '@/components/ui/form-sheet'
import { Button } from '@/components/ui/button'
import type { Dispatch, SetStateAction } from 'react'
import type { KycCase } from '@/lib/api/numoni'

interface KycDocumentsSheetProps {
  decide: (id: string, ok: boolean) => void
  setViewing: Dispatch<SetStateAction<KycCase | null>>
  viewing: KycCase | null
}

export function KycDocumentsSheet({ decide, setViewing, viewing }: KycDocumentsSheetProps) {
  return (
    <FormSheet open={!!viewing} onOpenChange={() => setViewing(null)}
      title={`${viewing?.name ?? ''} — documents`} sub={viewing ? `${viewing.kind} · ${viewing.doc} · via ${viewing.provider}` : undefined}>
      <div className="space-y-3">
        <div className="rounded-xl border bg-muted/40 h-64 flex flex-col items-center justify-center text-muted-foreground">
          <FileText className="h-8 w-8 mb-2" />
          <span className="text-xs">{viewing?.doc}</span>
          <span className="text-[10px] mt-1">scanned PDF · rendered preview</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg border p-2.5"><span className="text-muted-foreground">Provider</span><div className="font-semibold mt-0.5">{viewing?.provider}</div></div>
          <div className="rounded-lg border p-2.5"><span className="text-muted-foreground">Match score</span><div className="font-semibold mt-0.5 tnum">{viewing?.score}%</div></div>
          <div className="rounded-lg border p-2.5"><span className="text-muted-foreground">Reference</span><div className="font-semibold mt-0.5 tnum">{viewing?.id}</div></div>
          <div className="rounded-lg border p-2.5"><span className="text-muted-foreground">Submitted</span><div className="font-semibold mt-0.5">{viewing?.submitted}</div></div>
        </div>
        <div className="flex gap-2 pt-1">
          <Button className="flex-1 bg-brand text-black hover:bg-brand/90" onClick={() => { decide(viewing!.id, true); setViewing(null) }}>
            <Check className="h-4 w-4 mr-1" /> Approve
          </Button>
          <Button variant="outline" className="flex-1 text-red-500 border-red-500/30" onClick={() => { decide(viewing!.id, false); setViewing(null) }}>
            <X className="h-4 w-4 mr-1" /> Deny
          </Button>
        </div>
      </div>
    </FormSheet>
  )
}
