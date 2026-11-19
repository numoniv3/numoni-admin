'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight, ScrollText,
  Search
} from 'lucide-react'
import { SectionTitle } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Input } from '@/components/ui/input'
import { useAdminAuditLogQuery } from '../../api/useAdminQueries'

// ── Audit Log ────────────────────────────────────────────────────────────────
export function AuditPage() {
  const { data: auditLog } = useAdminAuditLogQuery()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const cats = ['all', ...Array.from(new Set(auditLog.map((a) => a.action.split('.')[0])))]
  const rows = auditLog.filter((a) =>
    (cat === 'all' || a.action.startsWith(cat + '.')) &&
    (q === '' || a.action.includes(q.toLowerCase()) || a.actor.includes(q.toLowerCase()) || a.target.toLowerCase().includes(q.toLowerCase())),
  )
  return (
    <div>
      <SectionTitle
        title="Audit Log"
        sub="Immutable activity stream — every admin action with before/after diffs."
        right={
          <ExportCsvButton
            filename="numoni-audit-log"
            headers={['ID', 'Actor', 'Action', 'Target', 'Time', 'Before', 'After']}
            rows={rows.map((a) => [a.id, a.actor, a.action, a.target, a.time, a.diff.before, a.diff.after])}
          />
        }
      />
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative max-w-sm flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by actor, action, or target…" className="pl-9" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`rounded-full px-3 h-8 text-[11px] font-bold border transition-colors ${cat === c ? 'bg-brand text-black border-brand' : 'text-muted-foreground hover:text-foreground'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
      </div>
      <div className="card-surface divide-y">
        {rows.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="p-4 flex flex-wrap items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0"><ScrollText className="h-4 w-4" /></span>
            <div className="flex-1 min-w-[220px]">
              <div className="text-sm"><span className="font-mono text-xs font-semibold text-brand">{a.action}</span> <span className="text-muted-foreground">·</span> <span className="font-medium">{a.target}</span></div>
              <div className="text-[10px] text-muted-foreground tnum mt-0.5">{a.id} · {a.actor} · {a.time}</div>
            </div>
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="rounded-md bg-red-500/10 text-red-500 px-2 py-1 font-mono tnum">{a.diff.before}</span>
              <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
              <span className="rounded-md bg-brand/10 text-brand px-2 py-1 font-mono tnum">{a.diff.after}</span>
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && <div className="p-8 text-center text-sm text-muted-foreground">Nothing matches this filter.</div>}
      </div>
    </div>
  )
}
