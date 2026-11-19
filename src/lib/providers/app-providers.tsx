'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { QueryProvider } from './query-provider'

/**
 * Single composition root for all client-side providers. Kept out of
 * app/layout.tsx (a server component) so the "use client" boundary starts
 * here instead of at the root.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="numoni-theme">
      <QueryProvider>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </QueryProvider>
    </ThemeProvider>
  )
}
