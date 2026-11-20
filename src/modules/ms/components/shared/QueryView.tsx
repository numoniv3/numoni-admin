'use client'

import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { DataView } from './DataView'

interface QueryViewProps<T> {
  query: UseQueryResult<T>
  /** Render the data; defaults to `DataView`. */
  children?: (data: T) => ReactNode
}

/** Loading, error (with retry) and data states for a `useMsQuery`. */
export function QueryView<T>({ query, children }: QueryViewProps<T>) {
  if (query.isPending) return <div className="card-surface p-6 text-center text-xs text-muted-foreground animate-pulse">Loading…</div>
  if (query.isError) {
    return (
      <div className="card-surface p-5 text-center text-sm">
        <div className="text-muted-foreground">{apiErrorMessage(query.error)}</div>
        <Button variant="link" onClick={() => query.refetch()}>Try again</Button>
      </div>
    )
  }
  return <>{children ? children(query.data as T) : <DataView data={query.data} />}</>
}
