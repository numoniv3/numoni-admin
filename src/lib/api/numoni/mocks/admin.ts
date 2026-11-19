// ── nuMoni Control Tower fixtures ───────────────────────────────────────────
// Served by `admin.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import {
  type Account, type AccountingMonth, type AdminRaffle, type AdminRewardProgram,
  type AgeRangeShare, type AutoRefund, type BrandCardCount, type CampaignMixSlice, type Dispute,
  EXPLORER_AGE_BANDS, EXPLORER_INDUSTRIES, EXPLORER_LOCATIONS, EXPLORER_SEGMENTS, EXPLORER_SOURCES,
  type ExplorerCustomer, type JournalEntry, type MerchantSettlement, type MerchantVolumePoint, type PlatformAccount,
  type Payout, type RailBatch, type RailGroup, type RailSales, type ReturnFrequencyBucket,
  type TreasuryBankAccount, type TreasuryLedger, type UnmatchedBankLine, type WalletCheck,
  type WalletDriftPoint, type WalletSide,
} from '../types/admin'
import { nigerianNames } from './platform'

export const chartOfAccounts: Account[] = [
  // Assets
  { code: '1001', name: 'GTBank — Operations', cls: 'Asset', balance: 412_800_000, normal: 'Debit' },
  { code: '1002', name: 'Paystack — Collections', cls: 'Asset', balance: 96_200_000, normal: 'Debit' },
  { code: '1003', name: 'Zenith — Settlement (Payonus)', cls: 'Asset', balance: 2_960_000_000, normal: 'Debit' },
  { code: '1004', name: 'Wema — Reserve', cls: 'Asset', balance: 850_000_000, normal: 'Debit' },
  { code: '1100', name: 'Accounts receivable (brands)', cls: 'Asset', balance: 24_600_000, normal: 'Debit' },
  { code: '1200', name: 'POS terminals & equipment', cls: 'Asset', balance: 18_400_000, normal: 'Debit' },
  // Liabilities
  { code: '2001', name: 'Point pool liability (PPL)', cls: 'Liability', balance: 2_840_000_000, normal: 'Credit' },
  { code: '2002', name: 'Merchant settlements payable', cls: 'Liability', balance: 41_200_000, normal: 'Credit' },
  { code: '2003', name: 'Reseller commissions payable', cls: 'Liability', balance: 5_600_000, normal: 'Credit' },
  { code: '2100', name: 'PAYE & WHT payable', cls: 'Liability', balance: 8_900_000, normal: 'Credit' },
  // Equity
  { code: '3001', name: 'Share capital', cls: 'Equity', balance: 50_000_000, normal: 'Credit' },
  { code: '3002', name: 'Retained earnings (pre-closing)', cls: 'Equity', balance: 1_390_300_000, normal: 'Credit' },
  // Revenue
  { code: '4001', name: 'Spread revenue (sell-rate margin)', cls: 'Revenue', balance: 44_300_000, normal: 'Credit' },
  { code: '4002', name: 'Campaign fees (3% of budgets)', cls: 'Revenue', balance: 24_400_000, normal: 'Credit' },
  { code: '4003', name: 'White-label licences', cls: 'Revenue', balance: 14_200_000, normal: 'Credit' },
  { code: '4004', name: 'Storefront subscriptions', cls: 'Revenue', balance: 7_300_000, normal: 'Credit' },
  { code: '4005', name: 'Checkout & service fees', cls: 'Revenue', balance: 6_200_000, normal: 'Credit' },
  // COGS
  { code: '5001', name: 'Reward points cost (redemptions)', cls: 'COGS', balance: 26_800_000, normal: 'Debit' },
  { code: '5002', name: 'Interchange & NIP fees', cls: 'COGS', balance: 6_400_000, normal: 'Debit' },
  { code: '5003', name: 'SMS / OTP delivery (Termii, Brevo)', cls: 'COGS', balance: 2_900_000, normal: 'Debit' },
  { code: '5004', name: 'KYC verification (VerifyMe, Prembly)', cls: 'COGS', balance: 1_700_000, normal: 'Debit' },
  // Expenses
  { code: '6001', name: 'Payroll & benefits', cls: 'Expense', balance: 18_900_000, normal: 'Debit' },
  { code: '6002', name: 'Marketing & growth', cls: 'Expense', balance: 6_200_000, normal: 'Debit' },
  { code: '6003', name: 'Cloud & infrastructure', cls: 'Expense', balance: 4_100_000, normal: 'Debit' },
  { code: '6004', name: 'Office & operations', cls: 'Expense', balance: 2_300_000, normal: 'Debit' },
  { code: '6005', name: 'Professional & audit fees', cls: 'Expense', balance: 1_100_000, normal: 'Debit' },
]

export const journalEntries: JournalEntry[] = [
  { id: 'JE-1042', date: 'Oct 10, 2026', memo: 'Point redemptions settled — week 41', debit: '2001 · Point pool liability', credit: '1003 · Zenith — Settlement', amount: 18_420_000, status: 'Posted', by: 'system · cut-off' },
  { id: 'JE-1041', date: 'Oct 10, 2026', memo: 'Spread revenue recognition — week 41', debit: '1001 · GTBank — Operations', credit: '4001 · Spread revenue', amount: 4_210_000, status: 'Posted', by: 'system · NERW' },
  { id: 'JE-1040', date: 'Oct 09, 2026', memo: 'Sabo Foods campaign fee (3% escrow)', debit: '1001 · GTBank — Operations', credit: '4002 · Campaign fees', amount: 2_310_000, status: 'Posted', by: 'Amara E.' },
  { id: 'JE-1039', date: 'Oct 09, 2026', memo: 'NIP & interchange fees — Payonus file', debit: '5002 · Interchange & NIP fees', credit: '1003 · Zenith — Settlement', amount: 642_000, status: 'Posted', by: 'system · recon' },
  { id: 'JE-1038', date: 'Oct 08, 2026', memo: 'Payroll — October (Net)', debit: '6001 · Payroll & benefits', credit: '1001 · GTBank — Operations', amount: 6_300_000, status: 'Posted', by: 'Amara E.' },
  { id: 'JE-1037', date: 'Oct 08, 2026', memo: 'PAYE & WHT accrual — October', debit: '6001 · Payroll & benefits', credit: '2100 · PAYE & WHT payable', amount: 1_480_000, status: 'Posted', by: 'Amara E.' },
  { id: 'JE-1036', date: 'Oct 07, 2026', memo: 'Chicken Republic white-label licence Q4', debit: '1100 · Accounts receivable', credit: '4003 · White-label licences', amount: 3_550_000, status: 'Posted', by: 'Tobi A.' },
  { id: 'JE-1035', date: 'Oct 07, 2026', memo: 'AWS + Cloudflare — October', debit: '6003 · Cloud & infrastructure', credit: '1001 · GTBank — Operations', amount: 1_340_000, status: 'Posted', by: 'Tobi A.' },
  { id: 'JE-1034', date: 'Oct 06, 2026', memo: 'Termii SMS — September settlement', debit: '5003 · SMS / OTP delivery', credit: '1001 · GTBank — Operations', amount: 724_000, status: 'Posted', by: 'system · recon' },
  { id: 'JE-1033', date: 'Oct 06, 2026', memo: 'Reseller commissions — week 40 accrual', debit: '6002 · Marketing & growth', credit: '2003 · Reseller commissions payable', amount: 1_900_000, status: 'Pending', by: 'system · weekly' },
]

// ── Trends ───────────────────────────────────────────────────────────────────
export const accountingMonthTrend: AccountingMonth[] = [
  { m: 'May', revenue: 41.2, costs: 33.5, profit: 7.7 },
  { m: 'Jun', revenue: 52.8, costs: 38.9, profit: 13.9 },
  { m: 'Jul', revenue: 63.5, costs: 44.2, profit: 19.3 },
  { m: 'Aug', revenue: 71.9, costs: 49.8, profit: 22.1 },
  { m: 'Sep', revenue: 84.6, costs: 58.4, profit: 26.2 },
  { m: 'Oct', revenue: 96.4, costs: 69.8, profit: 26.6 },
]

export const treasuryBankAccounts: TreasuryBankAccount[] = [
  { bank: 'GTBank', account: '0123 •• 8890', purpose: 'Operations', book: 412_800_000, statement: 412_842_000, lastRecon: 'Today · 06:00' },
  { bank: 'Paystack', account: 'COL-2210', purpose: 'Collections (T+1)', book: 96_200_000, statement: 100_400_000, lastRecon: 'Today · 06:00' },
  { bank: 'Zenith', account: '1017 •• 4521', purpose: 'Settlement — Payonus', book: 2_960_000_000, statement: 2_960_000_000, lastRecon: 'Today · 06:00' },
  { bank: 'Wema', account: '0225 •• 1176', purpose: 'Reserve (CBN ratio)', book: 850_000_000, statement: 850_000_000, lastRecon: 'Today · 06:00' },
]

export const unmatchedBankLines: UnmatchedBankLine[] = [
  { id: 'UM-01', desc: 'Deposit in transit — Paystack T+1 sweep', amount: 4_200_000, side: 'Bank > Book', age: '14h' },
  { id: 'UM-02', desc: 'Outstanding settlement — MedPlus batch SET-0927-004', amount: 740_460, side: 'Book > Bank', age: '1d' },
  { id: 'UM-03', desc: 'GTBank SMS charge not booked', amount: 42_000, side: 'Bank > Book', age: '2d' },
]

// ── Wallet reconciliation (points are money — they must always balance) ──────
export const walletSides: WalletSide[] = [
  { name: 'Customer global wallets', balance: 1_428_600_000, ledger: 'PPL · 2001', count: '128,400 wallets' },
  { name: 'Brand wallets (white-label)', balance: 842_300_000, ledger: 'PPL · 2001', count: '41,820 wallets' },
  { name: 'Reward cards loaded', balance: 384_200_000, ledger: 'PPL · 2001', count: '96,400 cards' },
  { name: 'Coupons & raffle value held', balance: 124_900_000, ledger: 'PPL · 2001', count: '187,000 coupons + raffle entries' },
  { name: 'Gift balances in transit', balance: 60_000_000, ledger: 'PPL · 2001', count: '8,140 gifts' },
]

 // = 2,840,000,000 = PPL balance

export const walletDrift: WalletDriftPoint[] = [
  { d: 'Sep 27', v: 0 }, { d: 'Sep 28', v: 0 }, { d: 'Sep 29', v: -4200 }, { d: 'Sep 30', v: 0 },
  { d: 'Oct 1', v: 0 }, { d: 'Oct 2', v: 12500 }, { d: 'Oct 3', v: 0 }, { d: 'Oct 4', v: 0 },
  { d: 'Oct 5', v: -8300 }, { d: 'Oct 6', v: 0 }, { d: 'Oct 7', v: 0 }, { d: 'Oct 8', v: 6100 },
  { d: 'Oct 9', v: 0 }, { d: 'Oct 10', v: 0 },
]

export const walletChecks: WalletCheck[] = [
  { name: 'Negative-balance wallets', result: '0 found', detail: 'No wallet can go below zero — invariant enforced at write time', ok: true },
  { name: 'Orphan points (minted, no wallet)', result: '₦18,400 flagged', detail: 'Failed callback on 2 mints — queued for auto-reversal tonight', ok: false },
  { name: 'Unreconciled redemptions > 24h', result: '2 · ₦74,000', detail: 'Awaiting Payonus confirmation file', ok: false },
  { name: 'Duplicate mint events', result: '0 found', detail: 'Idempotency keys on every mint — no doubles this month', ok: true },
  { name: 'Expired points not swept', result: '₦1.2M pending', detail: 'Expiry sweep runs at cut-off — releases PPL back to revenue', ok: false },
]

export const platformAdmins: PlatformAccount[] = [
  { universalId: 'usr_adm01', userType: 'ADMIN', name: 'Adaeze Okoro', email: 'superadmin@numoni.io', phone: '08000000001', role: 'owner', accountStatus: 'ACTIVE', kycTier: 3, createdAt: '2026-01-04T08:00:00Z' },
  { universalId: 'usr_adm02', userType: 'ADMIN', name: 'Tobi Adeleke', email: 'ops.tobi@numoni.io', phone: '08000000002', role: 'super_admin', accountStatus: 'ACTIVE', kycTier: 3, createdAt: '2026-02-11T10:30:00Z' },
  { universalId: 'usr_adm03', userType: 'ADMIN', name: 'Amara Eze', email: 'finance.amara@numoni.io', phone: '08000000003', role: 'admin', accountStatus: 'ACTIVE', kycTier: 3, createdAt: '2026-03-02T12:00:00Z' },
  { universalId: 'usr_adm04', userType: 'ADMIN', name: 'Kelechi Obi', email: 'support.k@numoni.io', phone: '08000000004', role: 'admin', accountStatus: 'SUSPENDED', kycTier: 3, createdAt: '2026-05-19T09:45:00Z' },
  { universalId: 'usr_adm05', userType: 'ADMIN', name: 'Yusuf Bello', email: 'audit.yusuf@numoni.io', phone: '08000000005', role: 'admin', accountStatus: 'PENDING', kycTier: 1, createdAt: '2026-10-28T15:20:00Z' },
]

export const platformAccounts: PlatformAccount[] = [
  { universalId: 'usr_c81f2a', userType: 'CUSTOMER', name: 'Chidinma Okafor', phone: '08035550142', email: 'chidinma@mail.ng', accountStatus: 'ACTIVE', kycTier: 2, limits: { payin: 200_000, payout: 100_000 }, createdAt: '2026-06-14T11:02:00Z' },
  { universalId: 'usr_c19be4', userType: 'CUSTOMER', name: 'Ibrahim Musa', phone: '08061234567', accountStatus: 'ACTIVE', kycTier: 1, limits: { payin: 50_000, payout: 20_000 }, createdAt: '2026-09-03T08:41:00Z' },
  { universalId: 'usr_c4d0a7', userType: 'CUSTOMER', name: 'Grace Bassey', phone: '08099887766', accountStatus: 'SUSPENDED', kycTier: 1, limits: { payin: 50_000, payout: 20_000 }, createdAt: '2026-07-21T16:10:00Z' },
  { universalId: 'usr_m2a91c', userType: 'SME_MERCHANT', name: 'Charles Store', phone: '08124409021', email: 'charles@charlesstore.ng', role: 'owner', accountStatus: 'ACTIVE', kycTier: 2, limits: { payin: 5_000_000, payout: 2_000_000 }, createdAt: '2026-03-18T09:00:00Z' },
  { universalId: 'usr_m7e3f0', userType: 'SME_MERCHANT', name: 'Mama Put Kitchen', phone: '08023344556', email: 'hello@mamaput.ng', role: 'owner', accountStatus: 'PENDING', kycTier: 1, limits: { payin: 500_000, payout: 200_000 }, createdAt: '2026-10-30T13:25:00Z' },
  { universalId: 'usr_f5b2d8', userType: 'FINTECH_MERCHANT', name: 'PayLite NG', phone: '08023456789', email: 'ops@paylite.ng', role: 'owner', accountStatus: 'ACTIVE', kycTier: 3, limits: { payin: 50_000_000, payout: 20_000_000 }, createdAt: '2026-02-07T10:15:00Z' },
  { universalId: 'usr_b0c6e1', userType: 'BRAND_MERCHANT', name: 'Sunrise Beverages', phone: '08055501234', email: 'trade@sunrise.ng', role: 'owner', accountStatus: 'ACTIVE', kycTier: 3, limits: { payin: 20_000_000, payout: 10_000_000 }, createdAt: '2026-01-29T14:00:00Z' },
  { universalId: 'usr_r3a8d2', userType: 'RESELLER', name: 'Lagos Channel Partners', phone: '08077770000', email: 'ops@lagoschannel.ng', role: 'owner', accountStatus: 'ACTIVE', kycTier: 2, limits: { payin: 2_000_000, payout: 1_000_000 }, createdAt: '2026-04-09T07:50:00Z' },
  { universalId: 'usr_e9d4b6', userType: 'ENTERPRISE_MERCHANT', name: 'Konga Retail', phone: '08012340000', email: 'loyalty@konga.ng', role: 'owner', accountStatus: 'CLOSED', kycTier: 2, limits: { payin: 10_000_000, payout: 5_000_000 }, createdAt: '2026-05-05T12:30:00Z' },
  ...platformAdmins,
]

export const adminRewardPrograms: AdminRewardProgram[] = [
  { id: 'RWD-01', name: '2× Points on every meal', owner: 'Chicken Republic — Lekki', ownerKind: 'Merchant', type: 'Points', issued: 4_820_000, redeemed: 2_890_000, cost: 2_890_000, revenue: 18_400_000, active: true },
  { id: 'RWD-02', name: '₦500 off a carton coupon', owner: 'Sabo Foods Ltd', ownerKind: 'Brand', type: 'Coupon', issued: 84_200, redeemed: 51_800, cost: 6_720_000, revenue: 84_100_000, active: true },
  { id: 'RWD-03', name: 'Welcome 5% wallet credit', owner: 'Charles Store', ownerKind: 'Merchant', type: 'Points', issued: 412_000, redeemed: 98_000, cost: 88_000, revenue: 1_240_000, active: true },
  { id: 'RWD-04', name: 'Birthday double points', owner: 'Slot — Computer Village', ownerKind: 'Merchant', type: 'Points', issued: 690_000, redeemed: 240_000, cost: 240_000, revenue: 4_100_000, active: false },
  { id: 'RWD-05', name: 'Cashback Fridays', owner: 'PayCell Technologies', ownerKind: 'Fintech', type: 'Coupon', issued: 28_400, redeemed: 17_900, cost: 2_150_000, revenue: 31_600_000, active: true },
  { id: 'RWD-06', name: 'Weekend cart voucher', owner: 'KwikMart Online', ownerKind: 'Merchant', type: 'Coupon', issued: 12_600, redeemed: 3_140, cost: 412_000, revenue: 3_980_000, active: true },
  { id: 'RWD-07', name: 'Campus rush instant win', owner: 'Dufil Prima Foods', ownerKind: 'Brand', type: 'Raffle', issued: 148_000, redeemed: 96_200, cost: 4_800_000, revenue: 41_200_000, active: true },
  { id: 'RWD-08', name: 'Gift-a-meal transfers', owner: 'Tantalizers — Ikeja', ownerKind: 'Merchant', type: 'Gift', issued: 8_140, redeemed: 5_220, cost: 196_000, revenue: 1_640_000, active: true },
  { id: 'RWD-09', name: 'Importer loyalty rebate', owner: 'Olu & Sons Imports', ownerKind: 'Merchant', type: 'Points', issued: 96_000, redeemed: 22_400, cost: 980_000, revenue: 12_300_000, active: true },
  { id: 'RWD-10', name: 'Health-check reward pack', owner: 'Emzor Wellness', ownerKind: 'Brand', type: 'Gift', issued: 4_220, redeemed: 3_910, cost: 1_420_000, revenue: 9_800_000, active: false },
]

export const adminRaffles: AdminRaffle[] = [
  { id: 'RFL-88', name: 'October Mega Draw', owner: 'nuMoni Platform', tickets: 214_600, prize: '₦5,000,000 cash + 10 Keke Napep', draw: 'Oct 31, 2026', active: true },
  { id: 'RFL-87', name: 'Campus Rush Weekly', owner: 'Dufil Prima Foods', tickets: 96_200, prize: '₦250,000 weekly pot', draw: 'Every Friday', active: true },
  { id: 'RFL-86', name: 'Lekki Shopper Spin', owner: 'Chicken Republic — Lekki', tickets: 41_800, prize: 'Free meals for a year', draw: 'Nov 15, 2026', active: true },
]

// ── Disputes ─────────────────────────────────────────────────────────────────
export const disputes: Dispute[] = [
  { id: 'DSP-221', customer: 'Emeka A.', merchant: 'Slot — Computer Village', issue: 'Debited but merchant says no confirmation', amount: 218000, age: '2h', status: 'Open' },
  { id: 'DSP-220', customer: 'Fatima B.', merchant: 'KwikMart Online', issue: 'Item not received, points not refunded', amount: 12500, age: '6h', status: 'Open' },
  { id: 'DSP-219', customer: 'Tunde W.', merchant: 'Mama Put Express', issue: 'Charged twice for one meal', amount: 7600, age: '1d', status: 'Investigating' },
  { id: 'DSP-218', customer: 'Blessing U.', merchant: 'Zobo & Co.', issue: 'Wrong item delivered', amount: 2500, age: '2d', status: 'Resolved' },
]

export const railGroups: RailGroup[] = [
  { id: 'payments', label: 'Payments & Collections', note: 'NIP / checkout processing', members: ['Payonus'] },
  { id: 'kyc', label: 'KYC & Identity', note: 'BVN / NIN / business verification', members: ['VerifyMe', 'Prembly'] },
  { id: 'messaging', label: 'Messaging', note: 'SMS / OTP / email delivery', members: ['Termii', 'Brevo'] },
  { id: 'utility', label: 'Airtime & Bills', note: 'VTU and bill payments', members: ['Utility Partners'] },
]

export const treasuryLedgers: TreasuryLedger[] = [
  { id: 'nerw', name: 'NERW — nuMoni Expense-Revenue Wallet', balance: 412_800_000, note: 'Platform revenue & operating float' },
  { id: 'pool-minted', name: 'Point Pool Ledger — minted', balance: 2_840_000_000, note: 'All live points ≈ ₦2.84B liability' },
  { id: 'pool-burned', name: 'Point Pool Ledger — burned', balance: 2_214_000_000, note: 'Redeemed & retired points' },
  { id: 'bank-treasury', name: 'Bank treasury (Payonus)', balance: 2_959_300_000, note: 'Cash backing · coverage 104.2%' },
]

export const autoRefunds: AutoRefund[] = [
  { id: 'ARF-118', txn: 'TXN-9F2K02', amount: 2500, reason: 'POS timeout — no merchant confirm', time: '5h ago' },
  { id: 'ARF-117', txn: 'TXN-9F1J88', amount: 7200, reason: 'Duplicate debit on storefront', time: 'Yesterday' },
  { id: 'ARF-116', txn: 'TXN-9F1H42', amount: 1500, reason: 'Customer dispute upheld', time: 'Yesterday' },
]

export const railBatches: RailBatch[] = [
  { id: 'SET-0927-POS', rail: 'POS QR', window: 'Sep 27 · 00:00–24:00', txns: 18_412, gross: 96_400_000, fees: 964_000, net: 95_436_000, status: 'Paid' },
  { id: 'SET-0927-STR', rail: 'Storefront', window: 'Sep 27 · 00:00–24:00', txns: 6_204, gross: 54_800_000, fees: 685_000, net: 54_115_000, status: 'Processing' },
  { id: 'SET-0927-CHK', rail: 'Checkout', window: 'Sep 27 · 00:00–24:00', txns: 3_910, gross: 38_200_000, fees: 573_000, net: 37_627_000, status: 'Queued' },
  { id: 'SET-0927-CRD', rail: 'Reward Card', window: 'Sep 27 · 00:00–24:00', txns: 1_188, gross: 12_900_000, fees: 129_000, net: 12_771_000, status: 'Held' },
  { id: 'SET-0927-API', rail: 'Widget / API', window: 'Sep 26 · 00:00–24:00', txns: 9_420, gross: 21_500_000, fees: 322_500, net: 21_177_500, status: 'Failed' },
]

export const scheduledPayouts: Payout[] = [
  { id: 'PAY-7710', merchant: 'Chicken Republic — Lekki', bank: 'GTBank', account: '012••••842', amount: 12_840_000, status: 'Sent' },
  { id: 'PAY-7711', merchant: 'Slot — Computer Village', bank: 'Access Bank', account: '069••••155', amount: 9_610_000, status: 'Scheduled' },
  { id: 'PAY-7712', merchant: 'Tantalizers — Ikeja', bank: 'Zenith Bank', account: '101••••908', amount: 7_220_000, status: 'Scheduled' },
  { id: 'PAY-7713', merchant: 'Sabo Foods Ltd', bank: 'UBA', account: '208••••441', amount: 5_480_000, status: 'Held' },
  { id: 'PAY-7714', merchant: 'PayCell Fintech', bank: 'Kuda MFB', account: '300••••772', amount: 4_910_000, status: 'Scheduled' },
  { id: 'PAY-7715', merchant: 'Mama Put Express', bank: 'Opay', account: '811••••063', amount: 1_240_000, status: 'Scheduled' },
]

export const salesByRail: RailSales[] = [
  { rail: 'POS QR', value: 96.4, color: '#02DC4D' },
  { rail: 'Storefront', value: 54.8, color: '#0EA5E9' },
  { rail: 'Checkout', value: 38.2, color: '#7C5CBF' },
  { rail: 'Widget / API', value: 21.5, color: '#E8A33D' },
  { rail: 'Reward Card', value: 12.9, color: '#EF4444' },
]

export const customerAgeRanges: AgeRangeShare[] = [
  { range: '18–24', pct: 22 },
  { range: '25–34', pct: 38 },
  { range: '35–44', pct: 21 },
  { range: '45–54', pct: 12 },
  { range: '55+', pct: 7 },
]

export const returnFrequencyBuckets: ReturnFrequencyBucket[] = [
  { bucket: '1 visit', pct: 18, color: '#64748B' },
  { bucket: '2–3', pct: 34, color: '#0EA5E9' },
  { bucket: '4–6', pct: 26, color: '#02DC4D' },
  { bucket: '7–10', pct: 14, color: '#E8A33D' },
  { bucket: '10+', pct: 8, color: '#7C5CBF' },
]

export const campaignMix: CampaignMixSlice[] = [
  { name: 'Frequency', value: 32, color: '#02DC4D' },
  { name: 'Acquisition', value: 27, color: '#0EA5E9' },
  { name: 'SKU movement', value: 18, color: '#7C5CBF' },
  { name: 'Win-back', value: 15, color: '#E8A33D' },
  { name: 'Loyalty & delight', value: 8, color: '#EF4444' },
]

export const cardsByBrand: BrandCardCount[] = [
  { brand: 'Chicken Rep.', cards: 28400 },
  { brand: 'PayCell', cards: 22100 },
  { brand: 'Sabo Foods', cards: 14900 },
  { brand: 'Slot', cards: 11200 },
  { brand: 'Emzor', cards: 7610 },
]

export const merchantVolumeTrend: MerchantVolumePoint[] = [
  { d: 'Apr', v: 12 }, { d: 'May', v: 19 }, { d: 'Jun', v: 24 },
  { d: 'Jul', v: 31 }, { d: 'Aug', v: 38 }, { d: 'Sep', v: 46 },
]

export const merchantSettlements: MerchantSettlement[] = [
  { id: 'SET-0927', date: 'Sep 27', amount: 1_842_000, status: 'Pending' },
  { id: 'SET-0926', date: 'Sep 26', amount: 1_690_400, status: 'Paid' },
  { id: 'SET-0925', date: 'Sep 25', amount: 1_528_800, status: 'Paid' },
  { id: 'SET-0924', date: 'Sep 24', amount: 1_712_300, status: 'Paid' },
]

// deterministic pseudo-random for stable demo data
const explorerRnd = (seed: number) => {
  const x = Math.sin(seed * 91.7 + 47.3) * 43758.5453
  return x - Math.floor(x)
}

const explorerPick = <T,>(arr: T[], seed: number) => arr[Math.floor(explorerRnd(seed) * arr.length) % arr.length]

export const explorerCustomers: ExplorerCustomer[] = Array.from({ length: 56 }, (_, i) => {
  const first = explorerPick(nigerianNames, i + 1)
  const last = explorerPick(['O.', 'A.', 'E.', 'K.', 'M.', 'S.', 'U.', 'B.', 'N.', 'I.'], i + 17)
  const segment = explorerPick(EXPLORER_SEGMENTS, i + 29)
  const kyc = (1 + Math.floor(explorerRnd(i + 41) * 3)) as 1 | 2 | 3
  const lifetime = Math.round((4_000 + explorerRnd(i + 53) * 1_180_000) * (segment === 'Power Spender' ? 2.4 : segment === 'Dormant 30d+' ? 0.2 : 1))
  return {
    id: `CUS-${(9000 - i * 37).toString().padStart(4, '0')}`,
    alias: `${first} ${last}`,
    age: explorerPick(EXPLORER_AGE_BANDS, i + 3),
    gender: explorerRnd(i + 5) > 0.48 ? 'Female' : 'Male',
    location: explorerPick(EXPLORER_LOCATIONS, i + 7),
    source: explorerPick([...EXPLORER_SOURCES], i + 11),
    industry: explorerPick(EXPLORER_INDUSTRIES, i + 13),
    segment,
    kyc,
    lifetime,
    visits: Math.max(0, Math.round(explorerRnd(i + 61) * 18 * (segment === 'Dormant 30d+' ? 0.05 : segment === 'Power Spender' ? 1.6 : 1))),
    cards: Math.floor(explorerRnd(i + 67) * 4),
    lastActive: segment === 'Dormant 30d+' ? `${30 + Math.floor(explorerRnd(i + 71) * 40)}d ago` : `${Math.floor(explorerRnd(i + 71) * 23) + 1}h ago`,
    status: segment === 'Dormant 30d+' ? 'Dormant' : segment === 'New This Week' ? 'New' : 'Active',
  }
})
