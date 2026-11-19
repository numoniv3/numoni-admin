// ── Enterprise & Fintech console fixtures (Chicken Republic) ─────────────────
// Served by `enterprise.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type { FundingRedemptionPoint, OutletVolume } from '../types/enterprise'
import type {
  Coupon, GiftItem, LedgerEntry, MerchantCampaign, MerchantTxn, Raffle, RewardProgram,
} from '../types/merchant'

export const enterprisePrograms: RewardProgram[] = [
  { id: 'ERP-01', name: '5% back on every order', currency: 'NGN', trigger: 'per_purchase', rules: [{ id: 'r1', target: 100, rewardKind: 'Points', rewardValue: '5 pts per ₦100' }], status: 'Active', created: 'Aug 12, 2026 · 10:00am' },
  { id: 'ERP-02', name: 'First app order bonus', currency: 'NGN', trigger: 'first_time', rules: [{ id: 'r1', target: 500, rewardKind: 'Points', rewardValue: '1,000 pts' }], status: 'Active', created: 'Aug 12, 2026 · 10:05am' },
  { id: 'ERP-03', name: 'Every-5th-Visit Treat', currency: 'NGN', trigger: 'frequency', rules: [{ id: 'r1', target: 5, rewardKind: 'Coupon', rewardValue: '10% off any combo' }], status: 'Active', created: 'Sep 2, 2026 · 2:20pm' },
  { id: 'ERP-04', name: 'Big Basket raffle', currency: 'NGN', trigger: 'value', rules: [{ id: 'r1', target: 15000, rewardKind: 'Raffle Draw', rewardValue: '2 tickets · Detty December Draw' }], status: 'Paused', created: 'Sep 18, 2026 · 11:41am' },
]

export const enterpriseCampaigns: MerchantCampaign[] = [
  { id: 'ECMP-301', name: 'October App Adoption Drive', description: 'Push walk-ins to download the CR app and pay from their CR Wallet.', start: '2026-10-01', end: '2026-10-31', programIds: ['ERP-02', 'ERP-01'], status: 'Active', created: 'Sep 26, 2026 · 9:12am' },
  { id: 'ECMP-302', name: 'Loyalty Fridays', description: 'Double points every Friday across all outlets.', start: '2026-09-04', end: '2026-10-30', programIds: ['ERP-01', 'ERP-03'], status: 'Active', created: 'Sep 01, 2026 · 3:15pm' },
  { id: 'ECMP-303', name: 'Detty December Draw', description: '₦15,000+ baskets earn raffle tickets all December.', start: '2026-12-01', end: '2026-12-26', programIds: ['ERP-04'], status: 'Inactive', created: 'Oct 3, 2026 · 1:48pm' },
]

export const enterpriseGifts: GiftItem[] = [
  { id: 'EGF-1', name: 'Free chicken piece', description: 'One spicy chicken piece, redeemable same day at any outlet.', hue: 18, price: 1500, qtyPerCustomer: 1, created: 'Sep 2, 2026' },
  { id: 'EGF-2', name: 'Branded water bottle', description: 'CR insulated bottle from the merch shelf.', hue: 200, price: 6500, qtyPerCustomer: 1, created: 'Sep 20, 2026' },
]

export const enterpriseRaffles: Raffle[] = [
  { id: 'ERF-1', name: 'Detty December Draw', description: 'Monthly draw — winners announced on Instagram Live.', prize: '₦500,000 cash × 10 winners', howToPlay: 'Earn 1 ticket for every ₦15,000 basket paid from your CR Wallet in December. 10 winners drawn at random on Dec 26.', ticketPrice: 0, ticketsAvailable: 50_000, qtyPerCustomer: 20, validUntil: '2026-12-26', status: 'Active', created: 'Oct 3, 2026' },
]

export const enterpriseCoupons: Coupon[] = [
  { id: 'ECP-1', code: 'CR-XK42', mode: 'Bulk', discountType: 'Percentage', value: 10, maxCap: 2000, expiry: '2026-11-30', usesPerCode: 1, limitPerUser: 1, total: 20_000, used: 12_614, status: 'Active' },
  { id: 'ECP-2', code: 'CR-WKND-7', mode: 'Bulk', discountType: 'Percentage', value: 7, maxCap: 1500, expiry: '2026-10-12', usesPerCode: 2, limitPerUser: 2, total: 5_000, used: 4_402, status: 'Active' },
  { id: 'ECP-3', code: 'CR-SEP-500', mode: 'CSV Import', discountType: 'Fixed', value: 500, expiry: '2026-09-30', usesPerCode: 1, limitPerUser: 1, total: 8_000, used: 8_000, status: 'Exhausted' },
]

export const enterpriseTxns: MerchantTxn[] = [
  { id: 'ETX-55210', customer: 'Chidinma O.', customerId: 'CUS-8841', product: 'Refuel Max combo', productHue: 18, qty: 1, amount: 4_500, fee: 45, reward: '225 pts · 5% back', rail: 'POS QR', terminal: 'Wuse II · POS-03', timestamp: 'Oct 6, 2026 · 2:41pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-CR9F2K41', sessionRef: 'SSN-CR77120' },
  { id: 'ETX-55204', customer: 'Ngozi E.', customerId: 'CUS-2291', product: 'Chicken & chips', productHue: 28, qty: 2, amount: 6_800, fee: 68, reward: '340 pts · 5% back', rail: 'POS QR', terminal: 'Lekki · POS-01', timestamp: 'Oct 6, 2026 · 1:18pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-CR9F2K38', sessionRef: 'SSN-CR77102' },
  { id: 'ETX-55198', customer: 'Fatima B.', customerId: 'CUS-6612', product: 'Full Chicken Platter', productHue: 10, qty: 1, amount: 15_500, fee: 155, reward: '2 tickets · Detty December', rail: 'POS QR', terminal: 'Ikeja · POS-02', timestamp: 'Oct 6, 2026 · 12:02pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-CR9F2K02', sessionRef: 'SSN-CR77088' },
  { id: 'ETX-55190', customer: 'Tunde W.', customerId: 'CUS-5590', product: 'Refuel Max combo', productHue: 18, qty: 1, amount: 4_500, fee: 45, reward: '—', rail: 'Storefront', timestamp: 'Oct 6, 2026 · 11:44am', day: '2026-10-06', status: 'Pending', payRef: 'PAY-CR9F2J97', sessionRef: 'SSN-CR77061' },
  { id: 'ETX-55184', customer: 'Emeka A.', customerId: 'CUS-7730', product: 'Chicken Republic jollof ×4', productHue: 42, qty: 4, amount: 12_000, fee: 120, reward: '600 pts · 5% back', rail: 'POS QR', terminal: 'Wuse II · POS-01', timestamp: 'Oct 6, 2026 · 10:15am', day: '2026-10-06', status: 'Success', payRef: 'PAY-CR9F2J90', sessionRef: 'SSN-CR77040' },
  { id: 'ETX-55177', customer: 'Blessing U.', customerId: 'CUS-1023', product: 'Peppered chicken ×6', productHue: 5, qty: 6, amount: 9_000, fee: 90, reward: '10% coupon · every 5th visit', rail: 'POS QR', terminal: 'Surulere · POS-01', timestamp: 'Oct 6, 2026 · 9:30am', day: '2026-10-06', status: 'Failed', payRef: 'PAY-CR9F2J81', sessionRef: 'SSN-CR77012' },
]

export const enterpriseLedger: LedgerEntry[] = [
  { id: 'EWL-01', date: 'Oct 6 · 2:41pm', day: '2026-10-06', description: 'App wallet spend — Chidinma O. (Wuse II)', ref: 'ETX-55210', direction: 'credit', status: 'Completed', method: 'CR Wallet · POS QR', amount: 4_500, balance: 18_420_300 },
  { id: 'EWL-02', date: 'Oct 6 · 1:02pm', day: '2026-10-06', description: 'Customer wallet funding inflow (aggregate)', ref: 'FND-CR88412', direction: 'credit', status: 'Completed', method: 'NIBSS NIP · 214 transfers', amount: 2_840_000, balance: 18_415_800 },
  { id: 'EWL-03', date: 'Oct 6 · 12:00pm', day: '2026-10-06', description: 'Reward liability provision (2%)', ref: 'PRV-CR0921', direction: 'debit', status: 'Completed', method: 'Auto-provision', amount: 412_000, balance: 15_575_800 },
  { id: 'EWL-04', date: 'Oct 5 · 11:59pm', day: '2026-10-05', description: 'T+1 outlet settlement — 28 outlets', ref: 'SET-CR0926', direction: 'debit', status: 'Pending', method: 'Bank payout · bulk NIP', amount: 9_960_000, balance: 15_987_800 },
  { id: 'EWL-05', date: 'Oct 5 · 6:12pm', day: '2026-10-05', description: 'App wallet spend — Blessing U. (Surulere)', ref: 'ETX-55112', direction: 'credit', status: 'Completed', method: 'CR Wallet · POS QR', amount: 12_500, balance: 25_947_800 },
  { id: 'EWL-06', date: 'Oct 5 · 3:04pm', day: '2026-10-05', description: 'Coupon redemption float — CR-XK42', ref: 'CPN-U881', direction: 'debit', status: 'Completed', method: 'Coupon float', amount: 720_000, balance: 25_935_300 },
  { id: 'EWL-07', date: 'Oct 5 · 11:20am', day: '2026-10-05', description: 'White-label licence (October)', ref: 'LIC-1005', direction: 'debit', status: 'Completed', method: 'Subscription', amount: 208_333, balance: 26_655_300 },
  { id: 'EWL-08', date: 'Oct 4 · 11:59pm', day: '2026-10-04', description: 'T+1 outlet settlement — 28 outlets', ref: 'SET-CR0925', direction: 'debit', status: 'Completed', method: 'Bank payout · bulk NIP', amount: 8_412_750, balance: 26_863_633 },
  { id: 'EWL-09', date: 'Oct 4 · 9:02am', day: '2026-10-04', description: 'Float top-up — GTBank ••4521', ref: 'FND-CR87961', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 35_000_000, balance: 35_276_383 },
  { id: 'EWL-10', date: 'Oct 3 · 8:30am', day: '2026-10-03', description: 'Opening float balance', ref: 'FND-CR87100', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 276_383, balance: 276_383 },
]

// ═══════════════════════════════ OVERVIEW ═══════════════════════════════════

export const enterpriseWeeklySeries: FundingRedemptionPoint[] = [
  { d: 'W1', funded: 22.4, redeemed: 14.1 },
  { d: 'W2', funded: 28.9, redeemed: 18.6 },
  { d: 'W3', funded: 26.2, redeemed: 21.4 },
  { d: 'W4', funded: 34.8, redeemed: 24.9 },
  { d: 'W5', funded: 41.5, redeemed: 30.2 },
  { d: 'W6', funded: 38.7, redeemed: 33.8 },
]

export const enterpriseOutletVolumes: OutletVolume[] = [
  { name: 'Wuse II', volume: 8_420_000 },
  { name: 'Lekki', volume: 7_210_000 },
  { name: 'Ikeja', volume: 6_480_000 },
  { name: 'Surulere', volume: 4_120_000 },
  { name: 'PH GRA', volume: 3_310_000 },
  { name: 'Kano', volume: 1_980_000 },
]
