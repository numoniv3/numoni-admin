import type { Field, Values } from './ActionForm'
import { label } from './DataView'

const isObj = (v: unknown): v is Values => !!v && typeof v === 'object' && !Array.isArray(v)

/** The record inside a payload (`{ data: {...} }`, `{ profile: {...} }` or the object itself). */
export function recordOf(v: unknown): Values {
  if (!isObj(v)) return {}
  for (const k of ['data', 'profile', 'result', 'record']) if (isObj(v[k])) return v[k] as Values
  return v
}

const SKIP = /^_?id$|Id$|^__v$|createdAt|updatedAt|status$|^userId$|password|token|secret/i

/**
 * Form fields for a payload the spec doesn't describe: `defaults` first, then
 * every other scalar or string-list field the service already returned, so a
 * saved record round-trips without losing fields.
 */
export function fieldsFrom(defaults: Field[], data: unknown): Field[] {
  const rec = recordOf(data)
  const extra: Field[] = Object.entries(rec)
    .filter(([k, v]) => !defaults.some((f) => f.key === k) && !SKIP.test(k) && (['string', 'number', 'boolean'].includes(typeof v) || (Array.isArray(v) && v.every((x) => typeof x === 'string'))))
    .map(([k, v]) => ({ key: k, label: label(k), kind: /phone/i.test(k) ? (Array.isArray(v) ? 'phones' : 'phone') : typeof v === 'number' ? 'number' : typeof v === 'boolean' ? 'switch' : Array.isArray(v) ? 'list' : 'text' }))
  return [...defaults, ...extra]
}
