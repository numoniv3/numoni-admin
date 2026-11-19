import type { KycTier, SessionUser, UserType } from './types'

type Claims = Record<string, unknown>

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)

/**
 * Reads a JWT's payload without verifying it. Verification is the Gateway's
 * job (it holds `JWT_SECRET`); the frontend only needs the claims to route.
 */
export function decodeJwt(token: string): Claims | null {
  const part = token.split('.')[1]
  if (!part) return null
  try {
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=')
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
    const claims: unknown = JSON.parse(new TextDecoder().decode(bytes))
    return claims && typeof claims === 'object' ? (claims as Claims) : null
  } catch {
    return null
  }
}

export function encodeJwtPart(value: unknown): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Seconds until `exp`, or `null` when the token carries none. */
export function secondsLeft(claims: Claims): number | null {
  return typeof claims.exp === 'number' ? Math.floor(claims.exp - Date.now() / 1000) : null
}

/** `kycStatus` arrives as `T1`/`TIER_2`/`2` depending on the service. */
function toTier(v: unknown): KycTier {
  const n = Number(String(v ?? '').replace(/\D/g, ''))
  return n === 2 || n === 3 ? n : 1
}

/**
 * Maps fat-JWT claims (plus any user object the response carried) to a
 * `SessionUser`. The spec documents `userID` = universalId; the other claim
 * names follow the Gateway's policy envelope (`user_type`, `user_role`,
 * `kycStatus`), with camelCase fallbacks.
 */
export function toSessionUser(claims: Claims, extra: Claims = {}): SessionUser | null {
  const c = { ...extra, ...claims }
  const universalId = str(c.userID) ?? str(c.universalId) ?? str(c.sub)
  const userType = (str(c.user_type) ?? str(c.userType)) as UserType | undefined
  if (!universalId || !userType) return null
  const fullName = [str(c.firstName), str(c.lastName)].filter(Boolean).join(' ')
  return {
    universalId,
    userType,
    role: str(c.user_role) ?? str(c.role),
    name: str(c.name) ?? (fullName || undefined),
    businessName: str(c.businessName),
    phone: str(c.phone),
    email: str(c.email),
    kycTier: toTier(c.kycStatus ?? c.kycTier ?? c.kyc_tier),
  }
}
