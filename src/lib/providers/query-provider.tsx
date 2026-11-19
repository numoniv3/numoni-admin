'use client'

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { watchSession } from './session-effects'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Created once per browser session (useState, not module scope) so each
  // request/user gets its own cache under SSR, per TanStack Query's Next.js
  // App Router guidance.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Demo data never changes underneath the user, and a background
            // refetch would hand screens a fresh copy of fixtures they have
            // already seeded local state from.
            staleTime: Infinity,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  useEffect(() => watchSession(queryClient), [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
    </QueryClientProvider>
  )
}
