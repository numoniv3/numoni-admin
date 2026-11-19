// ── Customer Brand App fixtures (Chicken Republic customer, Chidinma) ────────
// Served by `brand-app.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type { BrandAppActivity, BrandAppCoupon, BrandAppNotice } from '../types/brand-app'

export const brandAppAccount = { name: 'Chidinma Okafor', balance: 24_850, pts: 3_410 }

export const brandAppActivity: BrandAppActivity[] = [
  { id: 'A-1', kind: 'payment', title: 'Paid at Wuse II outlet', detail: 'POS-03 · Refuel Max combo', amount: -4_500, pts: 225, time: 'Today · 1:42pm', ref: 'PAY-CR9F2K41', location: 'Wuse II, Abuja', fee: 0, before: 29_350, after: 24_850, program: '5% back on every order' },
  { id: 'A-2', kind: 'reward', title: '5% reward landed', detail: 'Wallet funding bonus', pts: 1_000, time: 'Today · 11:02am', ref: 'RWD-CR8841' },
  { id: 'A-3', kind: 'funding', title: 'Wallet funded', detail: 'GTBank ••2210 · NIP transfer', amount: 20_000, time: 'Today · 11:01am', ref: 'FND-CR88412', fee: 0, before: 9_350, after: 29_350 },
  { id: 'A-4', kind: 'coupon', title: 'Coupon earned', detail: 'CR-XK42 · every 5th visit reward', time: 'Oct 5 · 6:12pm', ref: 'RWD-CR8802', program: 'Every-5th-Visit Treat' },
  { id: 'A-5', kind: 'payment', title: 'Paid at Lekki outlet', detail: 'POS-01 · Chicken & chips', amount: -6_800, pts: 340, time: 'Oct 5 · 6:10pm', ref: 'PAY-CR9F2K38', location: 'Lekki Phase 1, Lagos', fee: 0, before: 16_150, after: 9_350, program: '5% back on every order' },
  { id: 'A-6', kind: 'payment', title: 'Paid at Ikeja outlet', detail: 'POS-02 · Full Chicken Platter', amount: -15_500, pts: 775, time: 'Oct 3 · 8:04pm', ref: 'PAY-CR9F2J02', location: 'Ikeja GRA, Lagos', fee: 0, before: 31_650, after: 16_150, program: '5% back on every order' },
  { id: 'A-7', kind: 'funding', title: 'Wallet funded', detail: 'Access Bank ••8890 · NIP transfer', amount: 30_000, time: 'Oct 1 · 9:20am', ref: 'FND-CR87961', fee: 0, before: 1_650, after: 31_650 },
  { id: 'A-8', kind: 'coupon', title: 'Coupon earned', detail: 'CR-BREAD-1000 · Welcome Club', time: 'Sep 30 · 12:40pm', ref: 'RWD-CR8710', program: 'Welcome Club' },
]

export const brandAppNotices: BrandAppNotice[] = [
  { id: 'N-1', title: '+225 pts landed', body: 'Your 5% reward from Wuse II outlet just hit your CR Wallet.', time: '1:42pm', kind: 'reward', read: false },
  { id: 'N-2', title: 'Weekend: double points', body: 'This Saturday & Sunday, every payment at any outlet earns 10% back instead of 5%.', time: '9:00am', kind: 'promo', read: false },
  { id: 'N-3', title: 'New coupon: 10% off', body: 'CR-XK42 added to your coupons — valid on any combo till Nov 30.', time: 'Oct 5', kind: 'reward', read: true },
  { id: 'N-4', title: 'New sign-in on this device', body: 'Your CR Wallet was opened on a new device in Abuja. If this wasn\'t you, lock your card.', time: 'Oct 4', kind: 'security', read: true },
]

export const brandAppCoupons: BrandAppCoupon[] = [
  { id: 'C-1', code: 'CR-XK42', title: '10% off any combo', value: '10% off', source: 'Every-5th-Visit Treat', expiry: 'Nov 30, 2026', used: false },
  { id: 'C-2', code: 'CR-BREAD-1000', title: '₦1,000 off Refuel Max', value: '₦1,000 off', source: 'Welcome Club', expiry: 'Oct 31, 2026', used: false },
  { id: 'C-3', code: 'CR-WKND-7', title: '7% off weekend orders', value: '7% off', source: 'Weekend push campaign', expiry: 'Oct 12, 2026', used: false },
  { id: 'C-4', code: 'CR-SEP-500', title: '₦500 off September treat', value: '₦500 off', source: 'Win-back campaign', expiry: 'Sep 30, 2026', used: true },
]
