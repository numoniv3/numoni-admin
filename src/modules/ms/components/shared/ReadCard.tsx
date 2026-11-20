'use client'

import type { UseQueryResult } from '@tanstack/react-query'
import { DataView, RecordView, listOf } from './DataView'
import { recordOf } from './fields'
import { QueryView } from './QueryView'

/** A titled card showing one read endpoint's payload. */
export function ReadCard({ title, query }: { title: string; query: UseQueryResult<unknown> }) {
  return (
    <div>
      <div className="label-caps mb-2">{title}</div>
      <QueryView query={query}>
        {(d) => (listOf(d) ? <DataView data={d} /> : <RecordView data={recordOf(d)} />)}
      </QueryView>
    </div>
  )
}
