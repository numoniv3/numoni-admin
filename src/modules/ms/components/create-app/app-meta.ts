/*
 * Create-App MS responses aren't typed in the spec, so apps are read defensively.
 * Lifecycle (`PUT /create-app/apps/{id}` status enum): draft → submitted → approved | rejected;
 * `incomplete` means the reviewer needs more from the merchant.
 */

export type AppStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'incomplete'

export interface App {
  id: string
  name: string
  alias: string
  websiteUrl: string
  description: string
  status: AppStatus
  rejectionReason?: string
  productKeys: string[]
  merchantId?: string
  createdAt?: string
  updatedAt?: string
}

const s = (v: unknown) => (typeof v === 'string' ? v : v === undefined || v === null ? '' : String(v))
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

export function appOf(raw: unknown): App {
  const o = isObj(raw) ? raw : {}
  const status = s(o.status).toLowerCase() as AppStatus
  return {
    id: s(o.id ?? o._id),
    name: s(o.name) || 'Untitled app',
    alias: s(o.alias),
    websiteUrl: s(o.websiteUrl),
    description: s(o.description),
    status: (['draft', 'submitted', 'approved', 'rejected', 'incomplete'] as const).includes(status) ? status : 'draft',
    rejectionReason: s(o.rejectionReason) || undefined,
    productKeys: keysOf(o.productKeys),
    merchantId: s(o.merchantId) || undefined,
    createdAt: s(o.createdAt) || undefined,
    updatedAt: s(o.updatedAt) || undefined,
  }
}

/** A list response: an array, or `{ apps | data | items | rows: [] }`. */
export function appsOf(raw: unknown): App[] {
  const rows = Array.isArray(raw) ? raw : isObj(raw) ? ([raw.apps, raw.data, raw.items, raw.rows].find(Array.isArray) as unknown[] | undefined) ?? [] : []
  return rows.map(appOf).filter((a) => a.id)
}

/** Product keys: `string[]`, `{ productKey | key }[]`, or `{ productKeys: … }`. */
export function keysOf(raw: unknown): string[] {
  const rows = Array.isArray(raw) ? raw : isObj(raw) ? ([raw.productKeys, raw.keys, raw.data].find(Array.isArray) as unknown[] | undefined) ?? [] : []
  return rows.map((k) => (typeof k === 'string' ? k : isObj(k) ? s(k.productKey ?? k.key ?? k.id) : '')).filter(Boolean)
}

export const STATUS: Record<AppStatus, { label: string; tone: 'neutral' | 'sky' | 'green' | 'red' | 'orange'; next: string }> = {
  draft: { label: 'Draft', tone: 'neutral', next: 'Submit it for review when it’s ready.' },
  submitted: { label: 'In review', tone: 'sky', next: 'nuMoni is reviewing it — you’ll be able to use it once approved.' },
  approved: { label: 'Approved', tone: 'green', next: 'Live. Add product keys and track transactions.' },
  rejected: { label: 'Rejected', tone: 'red', next: 'Fix what the reviewer flagged, then submit again.' },
  incomplete: { label: 'Needs info', tone: 'orange', next: 'The reviewer needs more — update the details and resubmit.' },
}

export const canSubmit = (a: App) => a.status === 'draft' || a.status === 'rejected' || a.status === 'incomplete'

/** `"Charles Store Rewards"` → `"charles-store-rewards"`. */
export const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '')
