import type { Persona } from '@/lib/auth/personas'

/**
 * App-wide runtime settings. Only the Gateway URL comes from the environment;
 * everything else is set here — change it in code, not in a deploy's env.
 */

/**
 * Where API reads go:
 * - `mock` — every call resolves its fixture, so the demo runs with no backend.
 * - `partial` — paths in `GATEWAY_ENDPOINTS` (`api/numoni/endpoints.ts`) call the Gateway; the rest stay on fixtures.
 * - `live` — every call goes to the Gateway.
 */
export type ApiMode = 'mock' | 'partial' | 'live'
export const API_MODE = 'partial' as ApiMode

/**
 * Sign-in is mocked (any phone/email, OTP `123456`) only when every read is,
 * since live endpoints need a real Gateway token.
 */
export const AUTH_MOCKING = API_MODE === 'mock'

/** Simulated round trip for mocked calls, so loading states are exercised. */
export const MOCK_LATENCY_MS = 200

/**
 * nuMoni Gateway base URL, used by the browser API client and the
 * `/api/auth/*` route handlers alike. Override with `NEXT_PUBLIC_API_URL`
 * (e.g. Kong: `http://localhost:8000/v1`).
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://numoni-gateway-ms.fly.dev').replace(/\/+$/, '')

/** Which nuMoni app this project is. */
export const APP: Persona = 'admin'

/**
 * Where the other nuMoni apps are deployed. Fill these in once each Vercel
 * project is live: "wrong account" screens link a user to the app for their
 * account type, and the enterprise White-label Studio links to the brand app.
 * Apps without a URL here aren't linked.
 */
export const APP_URLS: Partial<Record<Persona, string>> = {
  // consumer: 'https://…',
  // brandapp: 'https://…',
  // merchant: 'https://…',
  // till: 'https://…',
  // brand: 'https://…',
  // enterprise: 'https://…',
  // reseller: 'https://…',
  // admin: 'https://…',
}
