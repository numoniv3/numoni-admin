import type { AuthAction } from './actions'
import type { AuthErrorBody, AuthResponse } from './types'

/** A failed auth call, carrying the Gateway's status and message. */
export class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

async function request(path: string, init?: { method?: string; body?: unknown }): Promise<AuthResponse> {
  let res: Response
  try {
    res = await fetch(path, {
      method: init?.method ?? 'GET',
      headers: init?.body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: init?.body === undefined ? undefined : JSON.stringify(init.body),
      credentials: 'same-origin',
      cache: 'no-store',
    })
  } catch {
    throw new AuthError(0, 'No connection — check your network and try again')
  }
  const json: unknown = await res.json().catch(() => ({}))
  if (!res.ok) {
    const { message } = json as Partial<AuthErrorBody>
    const text = Array.isArray(message) ? message.join('. ') : message
    throw new AuthError(res.status, text || 'Something went wrong — try again')
  }
  return json as AuthResponse
}

/**
 * The browser's only way to authenticate: same-origin route handlers that
 * talk to the Gateway and keep the token in an httpOnly cookie.
 */
export const authClient = {
  session: () => request('/api/auth/session'),
  signOut: () => request('/api/auth/session', { method: 'DELETE' }),
  run: (action: AuthAction, body: Record<string, unknown>) => request(`/api/auth/${action}`, { method: 'POST', body }),
}
