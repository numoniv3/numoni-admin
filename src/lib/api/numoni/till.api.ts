import { NUMONI_ENDPOINTS } from './endpoints'
import { apiGet } from './request'
import { tillDailyTotals, tillHistory, tillStaff } from './mocks/till'
import type { DailyTotal, TillHistoryRow, TillStaffMember } from './types/till'

export interface TillWorkspace {
  staff: TillStaffMember[]
  /** Payments taken per day this week (count). */
  dailyTotals: DailyTotal[]
  history: TillHistoryRow[]
}

/**
 * Cashiers who can sign in to this till, this week's totals and today's history.
 * @endpoint GET /till/workspace
 */
export function getTillWorkspace(): Promise<TillWorkspace> {
  return apiGet(NUMONI_ENDPOINTS.till.workspace, () => ({ staff: tillStaff, dailyTotals: tillDailyTotals, history: tillHistory }))
}
