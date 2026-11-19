/**
 * Readers for payloads `specs/numoni.json` leaves untyped (most Auth routes the
 * Gateway proxies document their request DTOs but not their responses). Each
 * `*.api.ts` parser picks fields by the DTO's names, with the common
 * alternatives, so a renamed or nested field degrades to "missing" rather than
 * a crash.
 */

export type Obj = Record<string, unknown>

export const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)

export const obj = (v: unknown): Obj => (isObj(v) ? v : {})

/** The first non-empty string among `keys`. */
export function str(o: Obj, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number') return String(v)
  }
  return undefined
}

/** The first finite number among `keys` (numeric strings count). */
export function num(o: Obj, ...keys: string[]): number | undefined {
  for (const k of keys) {
    const v = typeof o[k] === 'string' ? Number(o[k]) : o[k]
    if (typeof v === 'number' && Number.isFinite(v)) return v
  }
  return undefined
}

/** The first nested object among `keys`. */
export function child(o: Obj, ...keys: string[]): Obj | undefined {
  for (const k of keys) if (isObj(o[k])) return o[k]
  return undefined
}

/** A list payload: a bare array, or the first array under `keys`. */
export function list(v: unknown, ...keys: string[]): unknown[] {
  if (Array.isArray(v)) return v
  const o = obj(v)
  for (const k of [...keys, 'items', 'results', 'data']) if (Array.isArray(o[k])) return o[k]
  return []
}

/** `kycStatus` arrives as `T1`/`TIER_2`/`2` depending on the service. */
export function tier(v: unknown): 1 | 2 | 3 {
  const n = Number(String(v ?? '').replace(/\D/g, ''))
  return n === 2 || n === 3 ? n : 1
}

/** "First Last" from first/last name fields, else a single name field. */
export function fullName(o: Obj): string | undefined {
  const joined = [str(o, 'firstName', 'first_name'), str(o, 'lastName', 'last_name')].filter(Boolean).join(' ')
  return joined || str(o, 'name', 'fullName', 'businessName')
}

/** Splits a display name into the `firstName` / `lastName` the DTOs take. */
export function splitName(name: string): { firstName: string; lastName: string } {
  const [firstName = '', ...rest] = name.trim().split(/\s+/)
  return { firstName, lastName: rest.join(' ') || firstName }
}
