// ── Merchant till (counter app) domain types ─────────────────────────────────

export type TillRail = 'QR' | 'POS'

export interface TillHistoryRow { id: string; pos: string; rail: TillRail; customer: string; amount: number; time: string; status: string }

export interface TillStaffMember {
  name: string
  role: string
  perms: string
}

export interface DailyTotal {
  d: string
  v: number
}
