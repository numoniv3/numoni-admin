import { MOCK_LATENCY_MS } from '@/lib/config'
import { MOCK_OTP, type AuthAction } from '../actions'
import { decodeJwt, encodeJwtPart, toSessionUser } from '../claims'
import { PERSONAS, PERSONA_IDS, isBusinessType, type Persona } from '../personas'
import type { NextStep, UserType } from '../types'
import { errorOutcome, type AuthOutcome } from './gateway'

/**
 * A stand-in for the Gateway's journey endpoints while auth mocking is on.
 * It follows the documented rules — OTP → Tier 1 → NAME → PIN → DASHBOARD for
 * customers, PROFILE until a business name exists for merchants — and issues
 * unsigned tokens with the same claim names, so every screen runs the real
 * code path. OTP is always `123456`.
 *
 * Signing in with a number the mock hasn't seen provisions a finished demo
 * account of the app's type, so each console can be opened without signing up.
 */

interface MockUser {
  universalId: string
  userType: UserType
  role?: string
  name?: string
  businessName?: string
  phone?: string
  email?: string
  pin?: string
  biometric?: boolean
  kycTier?: 1 | 2 | 3
}

type Body = Record<string, unknown>

// On globalThis so the registry survives dev-server module reloads.
const store = ((globalThis as { __numoniMockAuth?: MockStore }).__numoniMockAuth ??= {
  users: new Map(),
  keys: new Map(),
  pending: new Map(),
})

interface MockStore {
  users: Map<string, MockUser>
  /** phone / email → universalId */
  keys: Map<string, string>
  /** phone → signup body awaiting OTP */
  pending: Map<string, Body>
}

const DEMO: Record<UserType, Pick<MockUser, 'name' | 'businessName' | 'email'>> = {
  CUSTOMER: { name: 'Chidinma Okafor' },
  SME_MERCHANT: { name: 'Charles Obi', businessName: 'Charles Store', email: 'charles@charlesstore.ng' },
  FINTECH_MERCHANT: { name: 'Tolu Ade', businessName: 'PayLite NG', email: 'ops@paylite.ng' },
  ENTERPRISE_MERCHANT: { name: 'Tolu Ade', businessName: 'PayLite NG', email: 'ops@paylite.ng' },
  BRAND_MERCHANT: { name: 'Ngozi Eze', businessName: 'Sunrise Beverages', email: 'trade@sunrise.ng' },
  RESELLER: { name: 'Bayo Lawal', businessName: 'Lagos Channel Partners', email: 'ops@lagoschannel.ng' },
  ADMIN: { name: 'Platform Owner', email: 'owner@numoni.ng' },
}

const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const newId = () => 'usr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16)
const delay = () => new Promise((r) => setTimeout(r, MOCK_LATENCY_MS))

function nextStepFor(u: MockUser): NextStep {
  if (u.userType === 'ADMIN') return 'DASHBOARD'
  if (isBusinessType(u.userType)) return u.businessName ? 'DASHBOARD' : 'PROFILE'
  if (!u.name) return 'NAME'
  return u.pin ? 'DASHBOARD' : 'PIN'
}

function tokenFor(u: MockUser): string {
  const claims = {
    userID: u.universalId,
    user_type: u.userType,
    user_role: u.role,
    kycStatus: `T${u.kycTier ?? 1}`,
    name: u.name,
    businessName: u.businessName,
    phone: u.phone,
    email: u.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
    mock: { pin: u.pin, biometric: u.biometric },
  }
  return `${encodeJwtPart({ alg: 'none', typ: 'JWT' })}.${encodeJwtPart(claims)}.mock`
}

function save(u: MockUser) {
  store.users.set(u.universalId, u)
  if (u.phone) store.keys.set(u.phone, u.universalId)
  if (u.email) store.keys.set(u.email.toLowerCase(), u.universalId)
}

/** The account behind a token — the registry, or the token itself after a dev-server restart. */
function userFromToken(token?: string): MockUser | null {
  const claims = token ? decodeJwt(token) : null
  if (!claims) return null
  const id = s(claims.userID)
  const known = store.users.get(id)
  if (known) return known
  const base = toSessionUser(claims)
  if (!base) return null
  const extra = (claims.mock ?? {}) as { pin?: string; biometric?: boolean }
  const u: MockUser = { ...base, pin: extra.pin, biometric: extra.biometric, kycTier: base.kycTier }
  save(u)
  return u
}

const signedIn = (u: MockUser, status = 201): AuthOutcome => {
  const token = tokenFor(u)
  const claims = decodeJwt(token) ?? {}
  return { status, token, body: { user: toSessionUser(claims), nextStep: nextStepFor(u), requiresOtp: false } }
}

function signup(b: Body): AuthOutcome {
  const userType = s(b.userType) as UserType
  const phone = s(b.phone)
  const signupTypes = [...new Set(PERSONA_IDS.map((p) => PERSONAS[p].signupAs).filter(Boolean))]
  if (!signupTypes.includes(userType)) return errorOutcome(400, ['userType must be one of ' + signupTypes.join(', ')], 'Bad Request')
  if (phone.length < 7) return errorOutcome(400, ['phone must be longer than or equal to 7 characters'], 'Bad Request')
  if (isBusinessType(userType) && (!s(b.businessName) || !s(b.email))) {
    return errorOutcome(400, ['businessName and email are required for business accounts'], 'Bad Request')
  }
  if (store.keys.has(phone)) return errorOutcome(409, 'An account with this phone number already exists', 'Conflict')
  store.pending.set(phone, b)
  return { status: 201, body: { user: null, nextStep: 'OTP', requiresOtp: true, devOtp: MOCK_OTP } }
}

function verify(b: Body): AuthOutcome {
  const phone = s(b.phone)
  const pending = store.pending.get(phone)
  if (!pending) return errorOutcome(404, 'No pending signup for this phone number', 'Not Found')
  if (s(b.code) !== MOCK_OTP) return errorOutcome(401, 'Invalid or expired OTP', 'Unauthorized')
  store.pending.delete(phone)
  const name = s(pending.name) || [s(pending.firstName), s(pending.lastName)].filter(Boolean).join(' ')
  const u: MockUser = {
    universalId: newId(),
    userType: s(pending.userType) as UserType,
    phone,
    email: s(pending.email) || undefined,
    name: name || undefined,
    businessName: s(pending.businessName) || undefined,
  }
  save(u)
  return signedIn(u)
}

function login(b: Body, persona: Persona): AuthOutcome {
  const email = s(b.email).toLowerCase()
  const phone = s(b.phone)
  const key = email || phone
  if (!key) return errorOutcome(400, ['phone or email is required'], 'Bad Request')
  if (!s(b.code)) return { status: 201, body: { user: null, nextStep: 'LOGIN_OTP', requiresOtp: true, devOtp: MOCK_OTP } }
  if (s(b.code) !== MOCK_OTP) return errorOutcome(401, 'Invalid or expired OTP', 'Unauthorized')

  const id = store.keys.get(key)
  const existing = id ? store.users.get(id) : undefined
  if (existing) return signedIn(existing)

  const userType = PERSONAS[persona].userTypes[0]
  const demo: MockUser = {
    universalId: newId(),
    userType,
    role: userType === 'ADMIN' ? 'super_admin' : 'owner',
    ...DEMO[userType],
    phone: phone || undefined,
    email: email || DEMO[userType].email,
    pin: userType === 'CUSTOMER' ? '1234' : undefined,
    biometric: userType === 'CUSTOMER',
  }
  save(demo)
  return signedIn(demo)
}

export async function mockAuthAction(action: AuthAction, b: Body, persona: Persona, token?: string): Promise<AuthOutcome> {
  await delay()
  if (action === 'signup') return signup(b)
  if (action === 'signup-otp') {
    return store.pending.has(s(b.phone))
      ? { status: 201, body: { user: null, nextStep: 'OTP', requiresOtp: true, devOtp: MOCK_OTP } }
      : errorOutcome(404, 'No pending signup for this phone number', 'Not Found')
  }
  if (action === 'verify') return verify(b)
  if (action === 'login') return login(b, persona)

  const u = userFromToken(token)
  if (!u) return errorOutcome(401, 'Missing or invalid fat JWT', 'Unauthorized')

  if (action === 'profile-customer') {
    const name = s(b.name) || [s(b.firstName), s(b.lastName)].filter(Boolean).join(' ')
    if (name) u.name = name
    if (s(b.email)) u.email = s(b.email)
  } else if (action === 'profile-business') {
    if (s(b.businessName)) u.businessName = s(b.businessName)
    if (s(b.email)) u.email = s(b.email)
  } else if (action === 'pin') {
    if (!/^\d{4,6}$/.test(s(b.pin))) return errorOutcome(400, ['pin must be 4–6 digits'], 'Bad Request')
    u.pin = s(b.pin)
    if (typeof b.biometricEnabled === 'boolean') u.biometric = b.biometricEnabled
  } else if (action === 'pin-verify') {
    if (!u.pin || s(b.pin) !== u.pin) return errorOutcome(401, 'Invalid PIN', 'Unauthorized')
    return { status: 201, body: { user: null, nextStep: null, requiresOtp: false, valid: true } }
  } else if (action === 'lock') {
    if (typeof b.biometricEnabled === 'boolean') u.biometric = b.biometricEnabled
  } else if (action === 'kyc-tier2') {
    if (!s(b.nin) && !s(b.bvn) && !s(b.rc)) return errorOutcome(400, ['nin, bvn or rc is required'], 'Bad Request')
    if (b.applyTier !== false) u.kycTier = Math.max(u.kycTier ?? 1, 2) as 2 | 3
  } else if (action === 'kyc-tier3') {
    if (!s(b.bankStatementRef) && !s(b.addressProofRef) && !s(b.directorIdRef)) return errorOutcome(400, ['a document ref is required'], 'Bad Request')
    if (b.applyTier !== false) u.kycTier = 3
  }
  save(u)
  return signedIn(u, action === 'lock' ? 200 : 201)
}

/** `GET /journey/me` stand-in. */
export async function mockSession(token?: string): Promise<AuthOutcome> {
  const u = userFromToken(token)
  return u ? signedIn(u, 200) : { status: 200, token: null, body: { user: null, nextStep: null, requiresOtp: false } }
}
