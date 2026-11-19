/**
 * Shapes shared by every nuMoni endpoint — see `specs/numoni.json` (`ApiEnvelope`).
 * Every response is wrapped in `{ success, message, data }`; list endpoints may
 * add a sibling `meta` block.
 */

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginationMeta {
  current_page: number
  total: number
  per_page: number
  last_page: number
}

export interface PaginatedEnvelope<T> extends ApiEnvelope<T> {
  meta?: PaginationMeta
}

/** Drops empty/undefined entries so blank filters don't reach the backend. */
export function toQuery(params: Record<string, unknown>): Record<string, string> {
  const query: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    query[key] = String(value)
  }
  return query
}
