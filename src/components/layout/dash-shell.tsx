'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Search, type LucideIcon } from 'lucide-react'
import { ClientBoundary } from '@/components/layout/client-boundary'
import { FrozenRouter } from '@/components/layout/frozen-router'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

function NavList({ items, base, onNavigate }: { items: NavItem[]; base: string; onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col gap-1 px-3">
      {items.map((item) => {
        const full = base + item.to
        // A section is active on its own page and its sub-pages (`/store/…`), not on a
        // sibling that merely shares the prefix (`/store` vs `/storefront`).
        const active = pathname === full || (!item.end && pathname.startsWith(`${full}/`))
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            href={full}
            onClick={onNavigate}
            className={cn(
              'relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            {active && (
              <motion.span
                layoutId="dash-nav-pill"
                className="absolute inset-0 rounded-xl bg-brand"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4 shrink-0" />
            <span className="relative z-10">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function DashShell({
  base,
  items,
  title,
  accent,
  children,
  onCommand,
  headerRight,
}: {
  base: string
  items: NavItem[]
  title: string
  accent?: string
  children: ReactNode
  onCommand?: () => void
  headerRight?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const locationKey = usePathname()

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-sidebar-background sticky top-0 h-dvh">
        <div className="flex items-center gap-2 px-5 h-16 border-b">
          <Link href="/" className="flex items-baseline gap-2">
            <Logo className="text-xl" />
          </Link>
          <span className={cn('label-caps mt-1', accent)}>{title}</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <NavList items={items} base={base} />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/80 backdrop-blur-md px-4 lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground">
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-sidebar-background">
              <div className="flex items-center gap-2 px-5 h-16 border-b">
                <Logo className="text-xl" />
                <span className={cn('label-caps mt-1', accent)}>{title}</span>
              </div>
              <div className="py-4">
                <NavList items={items} base={base} onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="lg:hidden">
            <Logo className="text-lg" />
          </div>

          {onCommand && (
            <button
              onClick={onCommand}
              className="hidden sm:flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:border-brand/50 transition-colors ml-2"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search or jump to…</span>
              <kbd className="ml-4 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {headerRight}
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={locationKey}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <FrozenRouter>
                <ClientBoundary>{children}</ClientBoundary>
              </FrozenRouter>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
