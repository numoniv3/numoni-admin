import type { AccountPolicy, AccountProfiles, ApiCredential } from '../types/account'

/** What `GET /profiles/{universalId}` answers offline — the demo merchant and customer. */
export const accountProfiles: AccountProfiles = {
  user: {
    firstName: 'Chidinma',
    lastName: 'Okafor',
    email: '',
    phone: '08035550142',
    gender: '',
    ageRange: '',
    profession: '',
    incomeRange: '',
  },
  business: {
    businessName: 'Charles Store',
    industry: 'retail',
    phone: '08124409021',
    email: 'charles@charlesstore.ng',
    address: '24 Aminu Kano Crescent, Wuse II',
    state: 'Abuja',
    city: 'Wuse II',
  },
}

export const apiCredentials: ApiCredential[] = [
  { id: 'cred_demo_1', publicKey: 'pk_test_numoni_9f2k41x8b7c2', secretKeyHint: 'sk_test_••••7c2', environment: 'test', createdAt: '2026-10-02T09:14:00Z' },
]

/** `GET /policies/me` offline — a Tier 1 customer. */
export const accountPolicy: AccountPolicy = {
  universalId: 'usr_demo',
  userType: 'CUSTOMER',
  role: 'owner',
  accountStatus: 'ACTIVE',
  kycTier: 1,
  limits: { payin: 50000, payout: 100000 },
  permissions: ['wallet:payin', 'wallet:spend'],
}
