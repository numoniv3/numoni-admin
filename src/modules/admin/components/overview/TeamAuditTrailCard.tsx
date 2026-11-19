'use client'

import {
  BadgeCheck
} from 'lucide-react'
import { useAdminAuditLogQuery } from '@/modules/admin/api/useAdminQueries'

export function TeamAuditTrailCard() {
  const { data: auditLog } = useAdminAuditLogQuery()

  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold">Team audit trail</h3>
          <p className="text-xs text-muted-foreground">Every admin action, logged</p>
        </div>
        <BadgeCheck className="h-4 w-4 text-brand" />
      </div>
      <div className="space-y-1 max-h-[290px] overflow-y-auto no-scrollbar">
        {auditLog.map((a) => (
          <div key={a.id} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-accent/40 transition-colors">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs">
                <span className="font-bold">{a.actor}</span>
                <span className="text-muted-foreground"> · {a.action}</span>
              </div>
              <div className="text-[11px] text-muted-foreground truncate">{a.target}</div>
              <div className="text-[10px] text-muted-foreground/70 tnum mt-0.5">
                {a.time} · <span className="line-through">{a.diff.before}</span> → <span className="text-brand font-semibold">{a.diff.after}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
