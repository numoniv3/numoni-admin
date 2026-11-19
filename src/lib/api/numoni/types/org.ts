// ── Organisation console types (reseller / brand / enterprise) ──────────────

export type OrgId = 'reseller' | 'brand' | 'enterprise'

// ── REWARD CARDS (order + issued tracking) ───────────────────────────────────
export interface OrgCardOrder { id: string; design: string; quantity: number; unitPrice: number; total: number; status: 'Pending' | 'In production' | 'Delivered'; created: string }

export interface OrgIssuedCard { id: string; serial: string; holder: string; customerId: string; status: 'Active' | 'Frozen'; txns: number; totalSpent: number; lastUsed: string; issuedOn: string }

// ── SETTINGS (profile + security + team & access) ────────────────────────────
export interface OrgTeamMember { id: string; name: string; phone: string; role: 'Owner' | 'Manager' | 'Cashier' | 'Analyst'; unitId?: string; permissions: string[]; status: 'Active' | 'Invited'; added: string }

export const ORG_PERMISSIONS = ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards', 'Manage team', 'Export data'] as const

export interface OrgProfile {
  name: string
  what: string
  phone: string
  email: string
  address: string
  location: string
  whatOptions: [string, string][]
  locationOptions: [string, string][]
}

/** A branch, region, outlet or campaign a team member can be scoped to. */
export interface OrgUnit {
  id: string
  name: string
  location?: string
}

export interface OrgComplianceUsage {
  customers: number
  txnsMonth: number
  largestWithdrawal: number
}
