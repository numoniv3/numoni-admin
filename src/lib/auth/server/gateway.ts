import { request as httpRequest } from 'node:http'
import { request as httpsRequest } from 'node:https'
import { brotliDecompressSync, gunzipSync, inflateSync } from 'node:zlib'
import { API_URL as GATEWAY_URL } from '@/lib/config'
import { decodeJwt, toSessionUser } from '../claims'
import type { AuthErrorBody, AuthResponse, NextStep } from '../types'

/** What an auth call resolves to. `token: null` clears the session cookie. */
export interface AuthOutcome {
  status: number
  body: AuthResponse | AuthErrorBody
  token?: string | null
}

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v)

const NEXT_STEPS: NextStep[] = ['OTP', 'LOGIN_OTP', 'NAME', 'PIN', 'PROFILE', 'DASHBOARD']

export const errorOutcome = (status: number, message: string | string[], error = 'Error'): AuthOutcome => ({
  status,
  body: { statusCode: status, message, error },
})

/**
 * Decodes a response body by its `Content-Encoding`, falling back to the raw
 * bytes. The Gateway forwards the upstream services' `Content-Encoding: br`
 * header on bodies it has already decompressed, so a strict decoder (like
 * `fetch`'s) fails on perfectly good JSON.
 */
function decodeBody(raw: Buffer, encoding: string | undefined): string {
  try {
    if (encoding === 'br') return brotliDecompressSync(raw).toString('utf8')
    if (encoding === 'gzip') return gunzipSync(raw).toString('utf8')
    if (encoding === 'deflate') return inflateSync(raw).toString('utf8')
  } catch {
    // Mislabelled — the body isn't actually compressed.
  }
  return raw.toString('utf8')
}

/**
 * How long a journey step may take. Signup and login create the account and
 * send the OTP through the Gateway's downstream services, which can take well
 * over 15 s while a sleeping service wakes up. Keep under the route's
 * `maxDuration` (`app/api/auth/[action]/route.ts`).
 */
const GATEWAY_TIMEOUT_MS = 45_000

class GatewayTimeout extends Error {}

/** A raw HTTP(S) request, so the body can be decoded leniently (see `decodeBody`). */
function send(url: URL, method: string, headers: Record<string, string>, payload?: string): Promise<{ status: number; text: string }> {
  return new Promise((resolve, reject) => {
    const req = (url.protocol === 'http:' ? httpRequest : httpsRequest)(url, { method, headers, timeout: GATEWAY_TIMEOUT_MS }, (res) => {
      const chunks: Buffer[] = []
      res.on('data', (c: Buffer) => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode ?? 502, text: decodeBody(Buffer.concat(chunks), res.headers['content-encoding']?.toLowerCase()) }))
      res.on('error', reject)
    })
    req.on('timeout', () => req.destroy(new GatewayTimeout(`Gateway request timed out after ${GATEWAY_TIMEOUT_MS / 1000}s`)))
    req.on('error', reject)
    if (payload !== undefined) req.write(payload)
    req.end()
  })
}

export async function callGateway(path: string, init: { method: string; body?: unknown; token?: string }): Promise<{ status: number; body: unknown }> {
  const payload = init.body === undefined ? undefined : JSON.stringify(init.body)
  try {
    const res = await send(new URL(GATEWAY_URL + path), init.method, {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'identity',
      ...(payload !== undefined ? { 'Content-Length': String(Buffer.byteLength(payload)) } : {}),
      ...(init.token ? { Authorization: `Bearer ${init.token}` } : {}),
    }, payload)
    let body: unknown = {}
    try {
      body = res.text ? JSON.parse(res.text) : {}
    } catch {
      body = { message: res.text }
    }
    return { status: res.status, body }
  } catch (error) {
    // Shows in the Vercel function logs; the browser only gets the generic message.
    console.error(`[auth] ${init.method} ${GATEWAY_URL}${path} failed:`, error)
    if (error instanceof GatewayTimeout) {
      return { status: 504, body: { statusCode: 504, message: 'The nuMoni Gateway took too long to respond — please try again', error: 'Gateway Timeout' } }
    }
    return { status: 502, body: { statusCode: 502, message: 'The nuMoni Gateway is unreachable', error: 'Bad Gateway' } }
  }
}

/**
 * Normalises a Gateway journey response. The spec documents the fields
 * (`accessToken`, `nextStep`, `requiresOtp`, `devOtp`) but not their nesting,
 * so a `{ data: … }` envelope and a `user`/`profile` sub-object are both read.
 * Errors (NestJS `ApiErrorDto`) pass through.
 */
export function fromGateway(status: number, raw: unknown, currentToken?: string): AuthOutcome {
  const top = isObj(raw) ? raw : {}
  if (status >= 400) {
    const message = typeof top.message === 'string' || Array.isArray(top.message) ? (top.message as string | string[]) : 'Request failed'
    return errorOutcome(status, message, typeof top.error === 'string' ? top.error : 'Error')
  }

  const b: Obj = isObj(top.data) ? { ...top, ...top.data } : top
  const issued = [b.accessToken, b.access_token, b.token].find((t): t is string => typeof t === 'string' && t.length > 0)
  const token = issued ?? currentToken
  const extra = [b.user, b.profile, b.journey].find(isObj) ?? {}
  const claims = token ? decodeJwt(token) : null
  const user = claims ? toSessionUser(claims, extra) : null

  const rawStep = b.nextStep ?? (isObj(b.journey) ? b.journey.nextStep : undefined)
  const step = NEXT_STEPS.find((s) => s === rawStep) ?? null
  const requiresOtp = b.requiresOtp === true || step === 'LOGIN_OTP'

  const body: AuthResponse = {
    user,
    nextStep: step ?? (user ? 'DASHBOARD' : null),
    requiresOtp,
    devOtp: typeof b.devOtp === 'string' ? b.devOtp : undefined,
    referralCode: typeof b.referralCode === 'string' ? b.referralCode : undefined,
    valid: typeof b.valid === 'boolean' ? b.valid : undefined,
  }
  return { status, body, token: issued }
}
