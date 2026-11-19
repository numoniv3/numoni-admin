'use client'

import type { ReactNode } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

// Right-side modal (sheet) used for every create / edit / preview flow across
// the whole platform — keeps the table underneath in context and gives forms a
// tall, well-margined column.
export function FormSheet({
  open,
  onOpenChange,
  title,
  sub,
  children,
  wide,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  title: string
  sub?: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          'w-full gap-0 border-l p-0',
          wide ? 'sm:max-w-xl' : 'sm:max-w-md',
        )}
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b px-6 py-5">
            <SheetTitle className="font-display text-lg">{title}</SheetTitle>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </SheetHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
