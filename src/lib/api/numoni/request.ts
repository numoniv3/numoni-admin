import { axiosClient } from '@/lib/axios'
import { API_MODE, MOCK_LATENCY_MS } from '@/lib/config'
import { isGatewayPath } from './endpoints'
import { toQuery } from './envelope'
import { shrinkFormImages } from './images'

export { API_MODE, type ApiMode } from '@/lib/config'

/** Whether `path` answers from its fixture under the current `API_MODE` (`src/lib/config.ts`). */
export const isMocked = (path: string) => API_MODE === 'mock' || (API_MODE === 'partial' && !isGatewayPath(path))

/**
 * Resolves a fixture as if it came over the wire. The fixture is deep-copied
 * so a screen that edits what it received can never mutate the fixture itself
 * (and so React Query always sees a fresh reference, as with a real response).
 */
export function mockResponse<T>(build: () => T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(build())), MOCK_LATENCY_MS))
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)

/** An empty value of `v`'s shape: `[]`, `{…}` with empty fields, `0`, `''`, `false`. */
function emptyLike(v: unknown): unknown {
  if (Array.isArray(v)) return []
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, emptyLike(x)]))
  if (typeof v === 'number') return 0
  if (typeof v === 'string') return ''
  if (typeof v === 'boolean') return false
  return v
}

/**
 * Fills the keys `data` lacks with empty values shaped like the fixture,
 * descending into objects (not arrays). Records each filled key in `missing`.
 */
function fillMissing(data: unknown, shape: unknown, missing: string[], at: string): unknown {
  if (data === undefined || (data === null && (Array.isArray(shape) || isObj(shape)))) {
    if (at) missing.push(at)
    return emptyLike(shape)
  }
  if (!isObj(shape) || !isObj(data)) return data
  const out: Obj = { ...data }
  for (const [key, value] of Object.entries(shape)) out[key] = fillMissing(data[key], value, missing, at ? `${at}.${key}` : key)
  return out
}

/**
 * The Gateway assembles workspaces from whichever services it has configured,
 * so a live response can lack whole sections. Those render empty rather than
 * crashing the screen; development builds log which ones were missing.
 */
function withDefaults<T>(data: unknown, fixture: () => T, path: string): T {
  const missing: string[] = []
  const filled = fillMissing(data, fixture(), missing, '') as T
  if (missing.length && process.env.NODE_ENV !== 'production') {
    console.warn(`[api] ${path}: response has no ${data === undefined || data === null ? 'data' : missing.join(', ')} — rendering empty`)
  }
  return filled
}

/**
 * The payload of a response. Services wrap it differently: workspace and Reward
 * endpoints as `{ success, message, data }`, Marketplace as
 * `{ status: "success", message, data }`, Auth routes bare or as `{ data }`.
 * An object whose keys are all envelope keys is unwrapped; a payload that
 * merely has a `data` field among others (e.g. `{ data, count, currentpage }`) isn't.
 */
const ENVELOPE_KEYS = new Set(['data', 'success', 'status', 'message', 'timestamp', 'meta', 'statusCode'])

export function unwrap(body: unknown): unknown {
  if (!isObj(body) || !('data' in body)) return body
  return 'success' in body || Object.keys(body).every((k) => ENVELOPE_KEYS.has(k)) ? body.data : body
}

/**
 * GET an endpoint and unwrap its envelope — or, while it's mocked, resolve the
 * fixture that stands in for it. Every read in `*.api.ts` goes through here,
 * so the fixture and the real call always sit side by side.
 */
export async function apiGet<T>(path: string, fixture: () => T, params?: Record<string, unknown>): Promise<T> {
  if (isMocked(path)) return mockResponse(fixture)
  const response = await axiosClient.get<unknown>(path, { params: params ? toQuery(params) : undefined })
  return withDefaults(unwrap(response.data), fixture, path)
}

/**
 * GET an endpoint whose payload the spec doesn't type, and hand the raw
 * payload to `parse`. The mock resolves `fixture` through the same `parse`,
 * so both paths produce the same shape.
 */
export async function apiRead<T>(path: string, parse: (raw: unknown) => T, fixture: () => unknown, params?: Record<string, unknown>): Promise<T> {
  if (isMocked(path)) return parse(await mockResponse(fixture))
  const response = await axiosClient.get<unknown>(path, { params: params ? toQuery(params) : undefined })
  return parse(unwrap(response.data))
}

export interface SendOptions {
  /** Extra request headers, e.g. `Idempotency-Key`. */
  headers?: Record<string, string>
  params?: Record<string, unknown>
  /** `body` is `FormData`: let the browser set the multipart boundary. */
  multipart?: boolean
  /** Upload progress, 0–1 (multipart calls). */
  onProgress?: (fraction: number) => void
  /** Overrides the client's timeout (ms); multipart calls default to `UPLOAD_TIMEOUT_MS`. */
  timeout?: number
}

/**
 * Uploads get far longer than the client's 15 s: a logo or banner on a slow
 * mobile connection can take a minute even after it's been shrunk.
 */
export const UPLOAD_TIMEOUT_MS = 120_000

const progress = (cb?: (fraction: number) => void) =>
  cb ? (e: { loaded: number; total?: number }) => cb(e.total ? Math.min(1, e.loaded / e.total) : 0) : undefined

/** Parser for payloads the spec types: the response is taken as `T`. */
export const cast = <T>(raw: unknown): T => raw as T

/** Parser for payloads the spec leaves untyped. */
export const identity = (raw: unknown): unknown => raw

/**
 * A typed multipart body as `FormData`: files and blobs as parts, arrays as
 * repeated fields, objects as JSON. Empty values are left out.
 */
export function toFormData(body: object): FormData {
  const form = new FormData()
  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return
    if (value instanceof Blob) form.append(key, value)
    else if (typeof value === 'object') form.append(key, JSON.stringify(value))
    else form.append(key, String(value))
  }
  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value) && value.every((v) => v instanceof Blob)) value.forEach((v) => append(key, v))
    else append(key, value)
  }
  return form
}

/**
 * A write: POST / PATCH / PUT `body` and return the parsed payload. While the
 * path is mocked, `fixture` stands in for the response (it receives the body).
 */
export async function apiSend<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body: unknown,
  parse: (raw: unknown) => T,
  fixture: (body: unknown) => unknown,
  opts: SendOptions = {},
): Promise<T> {
  if (isMocked(path)) return parse(await mockResponse(() => fixture(body)))
  // Multipart: shrink pictures first (see `images.ts`), then allow a long upload and report progress.
  const data = opts.multipart && body instanceof FormData ? await shrinkFormImages(body) : body
  const response = await axiosClient.request<unknown>({
    method,
    url: path,
    data,
    headers: opts.multipart ? { ...opts.headers, 'Content-Type': undefined } : opts.headers,
    params: opts.params ? toQuery(opts.params) : undefined,
    timeout: opts.timeout ?? (opts.multipart ? UPLOAD_TIMEOUT_MS : undefined),
    onUploadProgress: progress(opts.onProgress),
  })
  return parse(unwrap(response.data))
}

/** A fresh `Idempotency-Key` header — one per user action, so a retried request isn't applied twice. */
export const idempotent = (key: string = crypto.randomUUID()): SendOptions => ({ headers: { 'Idempotency-Key': key } })

/** `multipart/form-data` POST — file uploads. */
export async function apiUpload<T>(path: string, form: FormData, parse: (raw: unknown) => T, fixture: () => unknown, opts: Pick<SendOptions, 'onProgress' | 'timeout'> = {}): Promise<T> {
  if (isMocked(path)) return parse(await mockResponse(fixture))
  // Let the browser set the multipart boundary; allow a long upload.
  const response = await axiosClient.post<unknown>(path, form, {
    headers: { 'Content-Type': undefined },
    timeout: opts.timeout ?? UPLOAD_TIMEOUT_MS,
    onUploadProgress: progress(opts.onProgress),
  })
  return parse(unwrap(response.data))
}
