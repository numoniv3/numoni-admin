import { NextResponse } from 'next/server'
import { AUTH_ACTIONS, AUTH_MOCKING, type AuthAction } from '../actions'
import { decodeJwt, secondsLeft, toSessionUser } from '../claims'
import { APP } from '@/lib/config'
import { PERSONA_IDS, type Persona } from '../personas'
import type { AuthResponse } from '../types'
import { callGateway, errorOutcome, fromGateway, type AuthOutcome } from './gateway'
import { mockAuthAction, mockSession } from './mock'

/** httpOnly, so page scripts (and anything injected into them) can't read it. */
export const SESSION_COOKIE = 'numoni_session'

const WEEK = 60 * 60 * 24 * 7
const SIGNED_OUT: AuthOutcome = { status: 200, token: null, body: { user: null, nextStep: null, requiresOtp: false } }

const idFrom = (token?: string) => (token ? toSessionUser(decodeJwt(token) ?? {})?.universalId : undefined)

/** Runs one journey action against the Gateway (or the mock). */
export async function runAuthAction(action: AuthAction, input: Record<string, unknown>, token?: string): Promise<AuthOutcome> {
  // `persona` only steers the mock's demo accounts — the Gateway validates
  // bodies strictly, so it never goes upstream.
  const { persona: rawPersona, ...body } = input
  const persona: Persona = PERSONA_IDS.find((p) => p === rawPersona) ?? APP
  const spec = AUTH_ACTIONS[action]

  delete body.universalId
  if (spec.withId) {
    const universalId = idFrom(token)
    if (!universalId) return errorOutcome(401, 'Your session has ended — sign in again', 'Unauthorized')
    body.universalId = universalId
  }
  if (AUTH_MOCKING) return mockAuthAction(action, body, persona, token)

  const res = await callGateway(spec.path, { method: spec.method, body, token: spec.withId ? token : undefined })
  return fromGateway(res.status, res.body, spec.withId ? token : undefined)
}

/** Resolves the cookie's session via `GET /journey/me` (fresh token + nextStep). */
export async function readSession(token?: string): Promise<AuthOutcome> {
  if (!token) return { ...SIGNED_OUT, token: undefined }
  const claims = decodeJwt(token)
  const left = claims ? secondsLeft(claims) : 0
  if (!claims || (left !== null && left <= 0)) return SIGNED_OUT
  if (AUTH_MOCKING) return mockSession(token)

  const res = await callGateway('/journey/me', { method: 'GET', token })
  if (res.status === 401 || res.status === 403 || res.status === 404) return SIGNED_OUT
  return fromGateway(res.status, res.body, token)
}

export const signedOut = () => SIGNED_OUT

/**
 * Turns an outcome into the route's response: sets or clears the cookie, and
 * hands the browser the token for its in-memory copy only when a user is
 * signed in.
 */
export function respond(outcome: AuthOutcome, currentToken?: string): NextResponse {
  const ok = outcome.status < 400
  const token = outcome.token === null ? undefined : (outcome.token ?? currentToken)
  const body = ok
    ? { ...(outcome.body as AuthResponse), accessToken: (outcome.body as AuthResponse).user ? token : undefined }
    : outcome.body
  const res = NextResponse.json(body, { status: outcome.status, headers: { 'Cache-Control': 'no-store' } })

  if (outcome.token) {
    const left = secondsLeft(decodeJwt(outcome.token) ?? {})
    res.cookies.set(SESSION_COOKIE, outcome.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: left && left > 0 ? left : WEEK,
    })
  } else if (outcome.token === null) {
    res.cookies.delete(SESSION_COOKIE)
  }
  return res
}
