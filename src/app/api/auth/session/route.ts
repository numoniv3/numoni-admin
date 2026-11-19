import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, readSession, respond, signedOut } from '@/lib/auth/server/session'

/** `GET /api/auth/session` — who is signed in, and where their journey stands. */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  return respond(await readSession(token), token)
}

/** `DELETE /api/auth/session` — sign out (clears the httpOnly cookie). */
export async function DELETE() {
  return respond(signedOut())
}
