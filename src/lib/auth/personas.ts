import { APP, APP_URLS } from '@/lib/config'
import type { UserType } from './types'

/** Every app that signs a user in. */
export type Persona = 'consumer' | 'brandapp' | 'merchant' | 'till' | 'brand' | 'enterprise' | 'reseller' | 'admin'

interface PersonaConfig {
  /** Shown on the sign-in screen. */
  label: string
  home: string
  /** Account types allowed into this app. */
  userTypes: UserType[]
  /** `userType` sent on signup — absent where accounts aren't self-service. */
  signupAs?: UserType
}

export const PERSONAS: Record<Persona, PersonaConfig> = {
  consumer: { label: 'Consumer app', home: '/app', userTypes: ['CUSTOMER'], signupAs: 'CUSTOMER' },
  brandapp: { label: 'Customer brand app', home: '/brandapp', userTypes: ['CUSTOMER'], signupAs: 'CUSTOMER' },
  merchant: { label: 'Merchant', home: '/merchant', userTypes: ['SME_MERCHANT'], signupAs: 'SME_MERCHANT' },
  till: { label: 'Merchant till', home: '/till', userTypes: ['SME_MERCHANT'] },
  brand: { label: 'Brand console', home: '/brand', userTypes: ['BRAND_MERCHANT'], signupAs: 'BRAND_MERCHANT' },
  enterprise: { label: 'Enterprise & Fintech', home: '/enterprise', userTypes: ['FINTECH_MERCHANT', 'ENTERPRISE_MERCHANT'], signupAs: 'FINTECH_MERCHANT' },
  reseller: { label: 'Reseller', home: '/reseller', userTypes: ['RESELLER'], signupAs: 'RESELLER' },
  admin: { label: 'Control Tower', home: '/admin', userTypes: ['ADMIN'] },
}

export const PERSONA_IDS = Object.keys(PERSONAS) as Persona[]

export const USER_TYPE_LABEL: Record<UserType, string> = {
  CUSTOMER: 'Customer',
  SME_MERCHANT: 'Merchant',
  FINTECH_MERCHANT: 'Fintech merchant',
  BRAND_MERCHANT: 'Brand',
  ENTERPRISE_MERCHANT: 'Enterprise merchant',
  RESELLER: 'Reseller',
  ADMIN: 'Platform admin',
}

/** Business accounts sign up with a business name + email (Gateway rule). */
export const isBusinessType = (t: UserType) => t !== 'CUSTOMER' && t !== 'ADMIN'

export const canEnter = (persona: Persona, userType: UserType) => PERSONAS[persona].userTypes.includes(userType)

/**
 * Where a user type should go: this app's home when it admits them, else the
 * deployed URL of the first app that does (`APP_URLS`), else `null`.
 */
export function homeFor(userType: UserType): string | null {
  if (canEnter(APP, userType)) return PERSONAS[APP].home
  const other = PERSONA_IDS.find((id) => PERSONAS[id].userTypes.includes(userType))
  return (other && APP_URLS[other]) || null
}
