import type { NextRequest } from 'next/server'
import { isAuthAction } from '@/lib/auth/actions'
import { errorOutcome } from '@/lib/auth/server/gateway'
import { SESSION_COOKIE, respond, runAuthAction } from '@/lib/auth/server/session'

/** `POST /api/auth/{action}` — one Gateway journey step; see `AUTH_ACTIONS`. */
export async function POST(request: NextRequest, ctx: RouteContext<'/api/auth/[action]'>) {
  const { action } = await ctx.params
  if (!isAuthAction(action)) return respond(errorOutcome(404, `Unknown auth action "${action}"`, 'Not Found'))
  // JSON only — a cross-site form post can't set this header without CORS.
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return respond(errorOutcome(415, 'Send the body as application/json', 'Unsupported Media Type'))
  }

  const body: unknown = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) return respond(errorOutcome(400, 'Body must be a JSON object', 'Bad Request'))

  const token = request.cookies.get(SESSION_COOKIE)?.value
  return respond(await runAuthAction(action, body as Record<string, unknown>, token), token)
}
