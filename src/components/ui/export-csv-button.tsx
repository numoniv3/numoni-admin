'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

// ── CSV EXPORT ───────────────────────────────────────────────────────────────
export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const esc = (v: string | number) => {
    const s = String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.success('CSV exported', { description: `${a.download} · ${rows.length} rows` })
}

export function ExportCsvButton({ filename, headers, rows }: { filename: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => exportCsv(filename, headers, rows)}>
      <Download className="h-3.5 w-3.5" /> Export CSV
    </Button>
  )
}
