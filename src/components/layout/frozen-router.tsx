'use client'

import { useContext, useState, type ReactNode } from 'react'
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'

/**
 * Pins the App Router's segment context to the value it had when this subtree
 * mounted. Inside an exiting framer-motion element that keeps rendering the
 * *previous* page while it fades out — without it, the App Router hands the
 * exiting element the next page's tree and the old route never appears to
 * leave (react-router's <Routes> gave us this for free).
 *
 * Relies on a Next.js internal export; if a Next upgrade drops it, render
 * `children` directly and the transition degrades to enter-only.
 */
export function FrozenRouter({ children }: { children: ReactNode }) {
  const context = useContext(LayoutRouterContext)
  const [frozen] = useState(context)
  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>
}
