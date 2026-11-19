'use client'

import { Suspense, useSyncExternalStore, type ReactNode } from 'react'
import { PageLoader } from './page-loader'
import { QueryErrorBoundary } from './query-error-boundary'

const subscribe = () => () => {}

/**
 * Renders data-driven content in the browser only, behind a Suspense boundary.
 *
 * Every screen reads the (mocked) API through `useSuspenseQuery` and the demo
 * stores are seeded from it, so there is nothing meaningful to server-render
 * below the shell — and rendering it on the server would run the mock API
 * there, and mutate module-level stores shared by every request. The server
 * HTML carries the shell plus this loader; the browser takes it from there,
 * which is exactly what the Vite SPA did. A failed request shows a retry
 * screen instead of taking the page down.
 */
export function ClientBoundary({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false)
  const loader = fallback ?? <PageLoader />
  if (!isClient) return loader
  return (
    <QueryErrorBoundary>
      <Suspense fallback={loader}>{children}</Suspense>
    </QueryErrorBoundary>
  )
}
