// ── Merchant Till fixtures (Charles Store counter) ──────────────────────────
// Served by `till.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type { DailyTotal, TillHistoryRow, TillStaffMember } from '../types/till'

export const tillStaff: TillStaffMember[] = [
  { name: 'Charles Eze', role: 'Owner', perms: 'Everything' },
  { name: 'Adaeze N.', role: 'Cashier', perms: 'Accept payments only' },
  { name: 'Emeka O.', role: 'Cashier', perms: 'Accept payments only' },
]

export const tillDailyTotals: DailyTotal[] = [
  { d: 'Mon', v: 184 }, { d: 'Tue', v: 162 }, { d: 'Wed', v: 210 },
  { d: 'Thu', v: 244 }, { d: 'Fri', v: 312 }, { d: 'Sat', v: 428 }, { d: 'Sun', v: 286 },
]

export const tillHistory: TillHistoryRow[] = [
  { id: 'TL-1042', pos: 'POS-01', rail: 'POS', customer: 'Chidinma O. · Card ••4521', amount: 4500, time: '2:12pm', status: 'Synced' },
  { id: 'TL-1041', pos: 'POS-01', rail: 'QR', customer: 'Emeka A. · Global Wallet', amount: 12500, time: '1:48pm', status: 'Synced' },
  { id: 'TL-1040', pos: 'POS-03', rail: 'POS', customer: 'Fatima B. · Card ••8834', amount: 3800, time: '1:02pm', status: 'Synced' },
  { id: 'TL-1039', pos: 'POS-01', rail: 'QR', customer: 'Tunde W. · Global Wallet', amount: 7200, time: '12:20pm', status: 'Synced' },
  { id: 'TL-1038', pos: 'POS-02', rail: 'POS', customer: 'Aisha M. · Card ••2201', amount: 9800, time: '11:31am', status: 'Synced' },
  { id: 'TL-1037', pos: 'POS-02', rail: 'QR', customer: 'Ngozi E. · Brand Wallet', amount: 6150, time: '10:58am', status: 'Synced' },
  { id: 'TL-1036', pos: 'POS-03', rail: 'QR', customer: 'Blessing U. · Global Wallet', amount: 2400, time: '10:14am', status: 'Synced' },
]
