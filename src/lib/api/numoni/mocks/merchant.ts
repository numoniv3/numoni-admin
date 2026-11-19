// ── Merchant Reward OS fixtures (Charles Store) ────────────────────────────
// Served by `merchant.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import {
  type AgeRangeCount, type AuditEntry, type BankAccount, type CardOrder, type Catalog, type Category,
  type Coupon, type FrequencyBucketCount, type GiftItem, type IssuedCard, type LedgerEntry,
  type MarketingMessage, type MerchantCampaign, type MerchantCustomer, type MerchantProduct,
  type MerchantReview, type MerchantTxn, type MonthlyCustomerCount, type MonthlyNewCustomers,
  type ProductPatronage, type Raffle, type RaffleEntry, type RewardProgram, type SalesPoint,
  type Storefront, TEAM_PERMISSIONS, type TeamMember, type Terminal, type WeeklyCampaignPerformance,
} from '../types/merchant'

export const merchantPrograms: RewardProgram[] = [
  {
    id: 'RWP-101',
    name: 'Welcome Club',
    currency: 'NGN',
    trigger: 'first_time',
    rules: [{ id: 'r1', target: 200, rewardKind: 'Points', rewardValue: '500 pts' }],
    status: 'Active',
    created: 'Sep 10, 2026 · 9:14am',
  },
  {
    id: 'RWP-102',
    name: 'Every-5th-Visit Treat',
    currency: 'NGN',
    trigger: 'frequency',
    rules: [
      { id: 'r1', target: 5, rewardKind: 'Gift', rewardValue: 'Free Fresh Bread' },
      { id: 'r2', target: 10, rewardKind: 'Coupon', rewardValue: '₦1,000 off' },
    ],
    status: 'Active',
    created: 'Sep 14, 2026 · 11:02am',
  },
  {
    id: 'RWP-103',
    name: 'Big Basket Bonus',
    currency: 'NGN',
    trigger: 'value',
    rules: [{ id: 'r1', target: 20000, rewardKind: 'Raffle Draw', rewardValue: '2 raffle tickets' }],
    status: 'Paused',
    created: 'Sep 20, 2026 · 4:48pm',
  },
]

export const merchantCampaigns: MerchantCampaign[] = [
  {
    id: 'CMP-401',
    name: 'October New-Customer Drive',
    description: 'Push first-time walk-ins to pay with nuMoni points.',
    start: '2026-10-01',
    end: '2026-10-31',
    programIds: ['RWP-101'],
    status: 'Active',
    created: 'Sep 28, 2026 · 10:32am',
  },
  {
    id: 'CMP-402',
    name: 'Loyalty Fridays',
    start: '2026-09-04',
    end: '2026-09-25',
    programIds: ['RWP-102', 'RWP-103'],
    status: 'Inactive',
    created: 'Sep 02, 2026 · 3:15pm',
  },
]

export const merchantGifts: GiftItem[] = [
  { id: 'GFT-1', name: 'Free Fresh Bread', description: 'One loaf of agege bread, redeemable same day.', hue: 32, price: 1200, qtyPerCustomer: 1, created: 'Sep 14, 2026' },
  { id: 'GFT-2', name: 'Milo 500g Tin', description: 'Branded gift tin from the breakfast shelf.', hue: 145, price: 4100, qtyPerCustomer: 1, created: 'Sep 18, 2026' },
]

export const merchantRaffles: Raffle[] = [
  {
    id: 'RFL-1',
    name: 'October Mega Draw',
    description: 'Monthly draw for loyal shoppers — winner announced on Instagram Live.',
    prize: 'Milo 500g Tin',
    prizeGiftId: 'GFT-2',
    howToPlay: 'Earn 2 raffle tickets for every ₦20,000 basket paid with nuMoni points. Tickets accumulate all month — the more tickets, the higher your chance. One winner is drawn at random on Nov 1 and announced on Instagram Live.',
    ticketPrice: 500,
    ticketsAvailable: 400,
    qtyPerCustomer: 5,
    validUntil: '2026-10-31',
    status: 'Active',
    created: 'Sep 21, 2026',
  },
]

export const merchantRaffleEntries: RaffleEntry[] = [
  { id: 'REN-1', raffleId: 'RFL-1', customer: 'Chidinma O.', customerId: 'CUS-8841', tickets: 38, winner: false, joinedAt: 'Oct 1, 2026' },
  { id: 'REN-2', raffleId: 'RFL-1', customer: 'Ngozi E.', customerId: 'CUS-2291', tickets: 31, winner: false, joinedAt: 'Oct 2, 2026' },
  { id: 'REN-3', raffleId: 'RFL-1', customer: 'Fatima B.', customerId: 'CUS-6612', tickets: 22, winner: false, joinedAt: 'Oct 3, 2026' },
  { id: 'REN-4', raffleId: 'RFL-1', customer: 'Blessing U.', customerId: 'CUS-1023', tickets: 14, winner: false, joinedAt: 'Oct 4, 2026' },
  { id: 'REN-5', raffleId: 'RFL-1', customer: 'Tunde W.', customerId: 'CUS-5590', tickets: 11, winner: false, joinedAt: 'Oct 5, 2026' },
  { id: 'REN-6', raffleId: 'RFL-1', customer: 'Emeka A.', customerId: 'CUS-7730', tickets: 8, winner: false, joinedAt: 'Oct 5, 2026' },
  { id: 'REN-7', raffleId: 'RFL-1', customer: 'Adaeze N.', customerId: 'CUS-4417', tickets: 6, winner: false, joinedAt: 'Oct 6, 2026' },
  { id: 'REN-8', raffleId: 'RFL-1', customer: 'Segun K.', customerId: 'CUS-3302', tickets: 4, winner: false, joinedAt: 'Oct 6, 2026' },
]

export const merchantCoupons: Coupon[] = [
  { id: 'CPN-1', code: 'CHARLES-XK42', mode: 'Bulk', discountType: 'Percentage', value: 10, maxCap: 2000, expiry: '2026-11-30', usesPerCode: 1, limitPerUser: 1, total: 200, used: 61, status: 'Active' },
  { id: 'CPN-2', code: 'BREAD-1000', mode: 'Single', discountType: 'Fixed', value: 1000, expiry: '2026-10-15', usesPerCode: 3, limitPerUser: 1, total: 1, used: 1, status: 'Active' },
]

export const merchantCatalogs: Catalog[] = [
  { id: 'CAT-1', name: 'Main Store' },
  { id: 'CAT-2', name: 'Fresh & Bakery' },
]

export const merchantCategories: Category[] = [
  { id: 'CTG-1', name: 'Breakfast', catalogId: 'CAT-1' },
  { id: 'CTG-2', name: 'Noodles & Pasta', catalogId: 'CAT-1' },
  { id: 'CTG-3', name: 'Dairy', catalogId: 'CAT-1' },
  { id: 'CTG-4', name: 'Bakery', catalogId: 'CAT-2' },
  { id: 'CTG-5', name: 'Beverages', catalogId: 'CAT-2' },
]

export const merchantProducts: MerchantProduct[] = [
  {
    id: 'PRD-101', name: 'Golden Morn 900g', categoryId: 'CTG-1', price: 7200, currency: 'NGN',
    description: 'Maize & soya breakfast cereal, family size.', hues: [38, 145], sku: 'GM-900-001',
    discount: 7, variants: ['900g'], specs: [{ k: 'Weight', v: '900g' }, { k: 'Brand', v: 'Nestlé' }],
    rewardProgramId: 'RWP-102', published: true, stock: 42,
  },
  {
    id: 'PRD-102', name: 'Indomie Chicken ×40', categoryId: 'CTG-2', price: 6800, currency: 'NGN',
    description: 'Carton of 40 chicken flavour noodles.', hues: [10], sku: 'IND-CHX-40',
    discount: 0, variants: ['Chicken', 'Pepper Chicken'], specs: [{ k: 'Pack', v: '40 × 70g' }],
    published: true, stock: 120,
  },
  {
    id: 'PRD-103', name: 'Peak Milk 400g', categoryId: 'CTG-3', price: 3400, currency: 'NGN',
    description: 'Filled evaporated milk powder tin.', hues: [210], sku: 'PKM-400-001',
    discount: 10, variants: ['400g', '900g'], specs: [{ k: 'Weight', v: '400g' }],
    expiry: '2027-03-01', rewardProgramId: 'RWP-101', published: true, stock: 8,
  },
  {
    id: 'PRD-104', name: 'Fresh Bread (daily)', categoryId: 'CTG-4', price: 1200, currency: 'NGN',
    description: 'Baked every morning — soft agege loaf.', hues: [28], sku: 'BRD-DLY-M',
    discount: 0, variants: ['Medium', 'Large'], specs: [{ k: 'Shelf life', v: '2 days' }],
    published: false, stock: 'Infinite',
  },
  {
    id: 'PRD-105', name: 'Milo 500g', categoryId: 'CTG-5', price: 4100, currency: 'NGN',
    description: 'Chocolate malt drink refill pack.', hues: [120, 40], sku: 'ML-500-002',
    discount: 5, variants: ['500g'], specs: [{ k: 'Weight', v: '500g' }],
    rewardProgramId: 'RWP-102', published: true, stock: 66,
  },
]

export const merchantBanks: BankAccount[] = [
  { id: 'BNK-1', bank: 'GTBank', accountNo: '0123••4521', accountName: 'Charles Enterprises Ltd', primary: true },
  { id: 'BNK-2', bank: 'Access Bank', accountNo: '0690••8890', accountName: 'Charles Enterprises Ltd', primary: false },
]

export const merchantTerminals: Terminal[] = [
  { id: 'POS-01', name: 'Front counter', location: 'Wuse II, Abuja', bankId: 'BNK-1', txns: 184, today: 284_500, active: true },
  { id: 'POS-02', name: 'Back counter', location: 'Wuse II, Abuja', bankId: 'BNK-1', txns: 96, today: 142_800, active: true },
  { id: 'POS-03', name: 'Market stall', location: 'Wuse Market', bankId: 'BNK-2', txns: 61, today: 88_200, active: true },
]

export const merchantLedger: LedgerEntry[] = [
  { id: 'LED-01', date: 'Oct 6 · 2:41pm', day: '2026-10-06', description: 'POS QR payment — Ngozi E.', ref: 'TXN-88412', direction: 'credit', status: 'Completed', method: 'POS QR · POS-01', amount: 7200, balance: 428_300 },
  { id: 'LED-02', date: 'Oct 6 · 1:18pm', day: '2026-10-06', description: 'Storefront order — Chidinma O.', ref: 'TXN-88409', direction: 'credit', status: 'Completed', method: 'Storefront', amount: 7200, balance: 421_100 },
  { id: 'LED-03', date: 'Oct 6 · 12:00pm', day: '2026-10-06', description: 'Reward liability provision (2%)', ref: 'PRV-0921', direction: 'debit', status: 'Completed', method: 'Auto-provision', amount: 8_422, balance: 413_900 },
  { id: 'LED-04', date: 'Oct 6 · 9:30am', day: '2026-10-06', description: 'POS QR payment — Emeka A. (reversed)', ref: 'TXN-88381', direction: 'debit', status: 'Reversed', method: 'POS QR · POS-01', amount: 18_500, balance: 422_322 },
  { id: 'LED-05', date: 'Oct 5 · 11:59pm', day: '2026-10-05', description: 'T+1 settlement to GTBank ••4521', ref: 'SET-0926', direction: 'debit', status: 'Pending', method: 'Bank payout', amount: 396_100, balance: 440_822 },
  { id: 'LED-06', date: 'Oct 5 · 6:12pm', day: '2026-10-05', description: 'Storefront order — Blessing U.', ref: 'TXN-88355', direction: 'credit', status: 'Completed', method: 'Storefront', amount: 12_500, balance: 836_922 },
  { id: 'LED-07', date: 'Oct 5 · 3:04pm', day: '2026-10-05', description: 'Coupon redemption — CHARLES-XK42', ref: 'CPN-U881', direction: 'debit', status: 'Completed', method: 'Coupon', amount: 720, balance: 824_422 },
  { id: 'LED-08', date: 'Oct 5 · 11:20am', day: '2026-10-05', description: 'POS QR payment — Fatima B.', ref: 'TXN-88321', direction: 'credit', status: 'Completed', method: 'POS QR · POS-02', amount: 3_400, balance: 825_142 },
  { id: 'LED-09', date: 'Oct 4 · 11:59pm', day: '2026-10-04', description: 'T+1 settlement to GTBank ••4521', ref: 'SET-0925', direction: 'debit', status: 'Completed', method: 'Bank payout', amount: 412_750, balance: 821_742 },
  { id: 'LED-10', date: 'Oct 4 · 4:47pm', day: '2026-10-04', description: 'Storefront subscription (October)', ref: 'SUB-1004', direction: 'debit', status: 'Completed', method: 'Subscription', amount: 5_000, balance: 1_234_492 },
]

export const merchantMessages: MarketingMessage[] = [
  { id: 'MSG-1', channel: 'SMS', title: 'Weekend 7% off push', body: 'Charles Store: 7% off Golden Morn this weekend when you pay with nuMoni points. Show this SMS at the till.', audience: 'All customers', recipients: 9860, status: 'Sent', created: 'Sep 26, 2026', sentAt: 'Sep 26, 2026 · 4:00pm', delivered: 9702, opened: 4120 },
  { id: 'MSG-2', channel: 'Email', title: 'October Mega Draw announcement', body: 'Hi {name},\n\nEvery ₦20,000 basket this month earns you 2 raffle tickets in our October Mega Draw. Winner announced live on Instagram on Nov 1.\n\nShop now at Charles Store — pay with nuMoni points.', audience: 'Power Spenders', recipients: 1840, status: 'Sent', created: 'Sep 29, 2026', sentAt: 'Sep 29, 2026 · 9:00am', delivered: 1831, opened: 759 },
  { id: 'MSG-3', channel: 'SMS', title: 'Win-back dormant customers', body: 'We miss you at Charles Store! Here is ₦500 off your next visit — pay with nuMoni to claim.', audience: 'Dormant 30d+', recipients: 620, status: 'Draft', created: 'Oct 4, 2026' },
  { id: 'MSG-4', channel: 'Email', title: 'New stock: Peak Milk restocked', body: 'Hi {name},\n\nPeak Milk 400g is back on the shelf — and still earns you Welcome Club points when you pay with nuMoni.\n\nSee you soon,\nCharles Store', audience: 'Weekly Regulars', recipients: 3350, status: 'Scheduled', created: 'Oct 5, 2026', scheduledFor: '2026-10-08T09:00' },
  { id: 'MSG-5', channel: 'SMS', title: 'Friday flash — double points', body: 'This Friday only: double Welcome Club points on every purchase at Charles Store. Pay with nuMoni!', audience: 'All customers', recipients: 9860, status: 'Scheduled', created: 'Oct 6, 2026', scheduledFor: '2026-10-10T08:00' },
]

export const merchantStorefronts: Storefront[] = [
  { id: 'STR-1', name: 'Charles Store — Wuse II', slug: 'charles-store', tagline: 'Groceries, fresh bread & everyday essentials', location: 'Wuse II, Abuja', color: '#02DC4D', live: true, showRatings: true, showCampaignBanner: true, gridDensity: 'Comfortable', visits: 18420, orders: 3210, created: 'Sep 02, 2026' },
  { id: 'STR-2', name: 'Charles Fresh — Market stall', slug: 'charles-fresh', tagline: 'Daily bread, milk & breakfast deals', location: 'Wuse Market, Abuja', color: '#E8A33D', live: false, showRatings: false, showCampaignBanner: true, gridDensity: 'Compact', visits: 2140, orders: 186, created: 'Oct 01, 2026' },
]

export const merchantTxns: MerchantTxn[] = [
  { id: 'TXN-88412', customer: 'Ngozi E.', customerId: 'CUS-2291', product: 'Golden Morn 900g', productHue: 38, qty: 1, amount: 7200, fee: 72, reward: '500 pts · Welcome Club', rail: 'POS QR', terminal: 'POS-01', timestamp: 'Oct 6, 2026 · 2:41pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-9F2K41', sessionRef: 'SSN-77120' },
  { id: 'TXN-88409', customer: 'Chidinma O.', customerId: 'CUS-8841', product: 'Golden Morn 900g', productHue: 38, qty: 1, amount: 7200, fee: 72, reward: '—', rail: 'Storefront', timestamp: 'Oct 6, 2026 · 1:18pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-9F2K38', sessionRef: 'SSN-77102' },
  { id: 'TXN-88402', customer: 'Fatima B.', customerId: 'CUS-6612', product: 'Peak Milk 400g', productHue: 210, qty: 1, amount: 3400, fee: 34, reward: '500 pts · Welcome Club', rail: 'POS QR', terminal: 'POS-02', timestamp: 'Oct 6, 2026 · 12:02pm', day: '2026-10-06', status: 'Success', payRef: 'PAY-9F2K02', sessionRef: 'SSN-77088' },
  { id: 'TXN-88397', customer: 'Blessing U.', customerId: 'CUS-1023', product: 'Indomie Chicken ×40', productHue: 10, qty: 1, amount: 6800, fee: 68, reward: '—', rail: 'Storefront', timestamp: 'Oct 6, 2026 · 11:44am', day: '2026-10-06', status: 'Success', payRef: 'PAY-9F2J97', sessionRef: 'SSN-77061' },
  { id: 'TXN-88390', customer: 'Tunde W.', customerId: 'CUS-5590', product: 'Fresh Bread (daily)', productHue: 28, qty: 2, amount: 1200, fee: 12, reward: 'Free Fresh Bread (every 5th visit)', rail: 'POS QR', terminal: 'POS-03', timestamp: 'Oct 6, 2026 · 10:15am', day: '2026-10-06', status: 'Pending', payRef: 'PAY-9F2J90', sessionRef: 'SSN-77040' },
  { id: 'TXN-88381', customer: 'Emeka A.', customerId: 'CUS-7730', product: 'Milo 500g', productHue: 120, qty: 3, amount: 18500, fee: 185, reward: '2 raffle tickets · Big Basket Bonus', rail: 'POS QR', terminal: 'POS-01', timestamp: 'Oct 6, 2026 · 9:30am', day: '2026-10-06', status: 'Failed', payRef: 'PAY-9F2J81', sessionRef: 'SSN-77012' },
  { id: 'TXN-88370', customer: 'Ngozi E.', customerId: 'CUS-2291', product: 'Milo 500g', productHue: 120, qty: 2, amount: 8200, fee: 82, reward: '—', rail: 'Storefront', timestamp: 'Oct 5, 2026 · 7:22pm', day: '2026-10-05', status: 'Success', payRef: 'PAY-9F2J55', sessionRef: 'SSN-76988' },
  { id: 'TXN-88355', customer: 'Blessing U.', customerId: 'CUS-1023', product: 'Golden Morn 900g', productHue: 38, qty: 1, amount: 7200, fee: 72, reward: '500 pts · Welcome Club', rail: 'Storefront', timestamp: 'Oct 5, 2026 · 6:12pm', day: '2026-10-05', status: 'Success', payRef: 'PAY-9F2J40', sessionRef: 'SSN-76971' },
  { id: 'TXN-88344', customer: 'Adaeze N.', customerId: 'CUS-4417', product: 'Indomie Chicken ×40', productHue: 10, qty: 2, amount: 13600, fee: 136, reward: '2 raffle tickets · Big Basket Bonus', rail: 'POS QR', terminal: 'POS-02', timestamp: 'Oct 5, 2026 · 3:18pm', day: '2026-10-05', status: 'Success', payRef: 'PAY-9F2J21', sessionRef: 'SSN-76944' },
  { id: 'TXN-88321', customer: 'Fatima B.', customerId: 'CUS-6612', product: 'Peak Milk 400g', productHue: 210, qty: 1, amount: 3400, fee: 34, reward: '—', rail: 'POS QR', terminal: 'POS-02', timestamp: 'Oct 5, 2026 · 11:20am', day: '2026-10-05', status: 'Success', payRef: 'PAY-9F2I98', sessionRef: 'SSN-76910' },
  { id: 'TXN-88290', customer: 'Chidinma O.', customerId: 'CUS-8841', product: 'Golden Morn 900g', productHue: 38, qty: 3, amount: 21600, fee: 216, reward: '2 raffle tickets · Big Basket Bonus', rail: 'POS QR', terminal: 'POS-01', timestamp: 'Oct 4, 2026 · 5:02pm', day: '2026-10-04', status: 'Success', payRef: 'PAY-9F2I60', sessionRef: 'SSN-76877' },
  { id: 'TXN-88271', customer: 'Tunde W.', customerId: 'CUS-5590', product: 'Fresh Bread (daily)', productHue: 28, qty: 1, amount: 1200, fee: 12, reward: '—', rail: 'POS QR', terminal: 'POS-03', timestamp: 'Oct 4, 2026 · 9:14am', day: '2026-10-04', status: 'Success', payRef: 'PAY-9F2I31', sessionRef: 'SSN-76840' },
  { id: 'TXN-88244', customer: 'Emeka A.', customerId: 'CUS-7730', product: 'Milo 500g', productHue: 120, qty: 1, amount: 4100, fee: 41, reward: '500 pts · Welcome Club', rail: 'Storefront', timestamp: 'Oct 3, 2026 · 8:41pm', day: '2026-10-03', status: 'Success', payRef: 'PAY-9F2H99', sessionRef: 'SSN-76802' },
  { id: 'TXN-88220', customer: 'Segun K.', customerId: 'CUS-3302', product: 'Indomie Chicken ×40', productHue: 10, qty: 1, amount: 6800, fee: 68, reward: '—', rail: 'POS QR', terminal: 'POS-01', timestamp: 'Oct 2, 2026 · 1:37pm', day: '2026-10-02', status: 'Success', payRef: 'PAY-9F2H64', sessionRef: 'SSN-76770' },
  { id: 'TXN-88190', customer: 'Adaeze N.', customerId: 'CUS-4417', product: 'Peak Milk 400g', productHue: 210, qty: 2, amount: 6800, fee: 68, reward: '—', rail: 'Storefront', timestamp: 'Oct 1, 2026 · 10:05am', day: '2026-10-01', status: 'Success', payRef: 'PAY-9F2H20', sessionRef: 'SSN-76721' },
]

// ── Store ────────────────────────────────────────────────────────────────────
export const merchantTeam: TeamMember[] = [
  { id: 'TM-1', name: 'Charles O.', phone: '+234 812 440 9021', role: 'Owner', permissions: [...TEAM_PERMISSIONS], status: 'Active', added: 'Sep 02, 2026' },
  { id: 'TM-2', name: 'Amina S.', phone: '+234 905 221 4478', role: 'Manager', permissions: ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards'], status: 'Active', added: 'Sep 05, 2026' },
  { id: 'TM-3', name: 'Tobi A.', phone: '+234 703 882 1190', role: 'Cashier', tillId: 'POS-01', permissions: ['Process sales', 'View transactions'], status: 'Active', added: 'Sep 12, 2026' },
  { id: 'TM-4', name: 'Kelechi N.', phone: '+234 810 334 7756', role: 'Cashier', tillId: 'POS-03', permissions: ['Process sales'], status: 'Invited', added: 'Oct 04, 2026' },
]

export const merchantCardOrders: CardOrder[] = [
  { id: 'CRO-101', design: 'charles-store-card-v2.png', quantity: 200, unitPrice: 850, total: 170_000, status: 'Delivered', created: 'Sep 08, 2026' },
  { id: 'CRO-102', design: 'charles-festive-edition.png', quantity: 100, unitPrice: 850, total: 85_000, status: 'In production', created: 'Oct 02, 2026' },
]

export const merchantCards: IssuedCard[] = [
  { id: 'CRD-01', serial: '5399 12•• •••• 4102', holder: 'Chidinma O.', customerId: 'CUS-8841', status: 'Active', txns: 41, totalSpent: 388_400, lastUsed: 'Oct 6, 2026 · 1:18pm', issuedOn: 'Sep 12, 2026' },
  { id: 'CRD-02', serial: '5399 12•• •••• 2278', holder: 'Ngozi E.', customerId: 'CUS-2291', status: 'Active', txns: 34, totalSpent: 291_700, lastUsed: 'Oct 6, 2026 · 2:41pm', issuedOn: 'Sep 14, 2026' },
  { id: 'CRD-03', serial: '5399 12•• •••• 8890', holder: 'Fatima B.', customerId: 'CUS-6612', status: 'Frozen', txns: 12, totalSpent: 96_200, lastUsed: 'Sep 28, 2026 · 4:02pm', issuedOn: 'Sep 20, 2026' },
  { id: 'CRD-04', serial: '5399 12•• •••• 5544', holder: 'Blessing U.', customerId: 'CUS-1023', status: 'Active', txns: 9, totalSpent: 61_800, lastUsed: 'Oct 5, 2026 · 6:12pm', issuedOn: 'Oct 01, 2026' },
  { id: 'CRD-05', serial: '5399 12•• •••• 1023', holder: 'Emeka A.', customerId: 'CUS-7730', status: 'Active', txns: 5, totalSpent: 44_100, lastUsed: 'Oct 3, 2026 · 8:41pm', issuedOn: 'Oct 03, 2026' },
]

export const merchantAudit: AuditEntry[] = [
  { id: 'AUD-1', actor: 'Amina S.', action: 'Issued refund', target: 'TXN-88102 · ₦7,200', time: 'Oct 6, 2026 · 11:02am' },
  { id: 'AUD-2', actor: 'Tobi A.', action: 'Processed sale', target: 'TXN-88412 · Golden Morn 900g', time: 'Oct 6, 2026 · 2:41pm' },
  { id: 'AUD-3', actor: 'Charles O.', action: 'Paused reward program', target: 'Big Basket Bonus', time: 'Oct 5, 2026 · 9:12am' },
  { id: 'AUD-4', actor: 'Amina S.', action: 'Updated settlement bank', target: 'POS-03 → Access Bank', time: 'Oct 4, 2026 · 3:55pm' },
  { id: 'AUD-5', actor: 'Charles O.', action: 'Invited team member', target: 'Kelechi N. · Cashier', time: 'Oct 4, 2026 · 10:20am' },
  { id: 'AUD-6', actor: 'Tobi A.', action: 'Processed sale', target: 'TXN-88390 · Fresh Bread ×2', time: 'Oct 6, 2026 · 10:15am' },
]

export const merchantWeekSales: SalesPoint[] = [
  { d: 'Mon', sales: 412 }, { d: 'Tue', sales: 388 }, { d: 'Wed', sales: 455 },
  { d: 'Thu', sales: 520 }, { d: 'Fri', sales: 690 }, { d: 'Sat', sales: 880 }, { d: 'Sun', sales: 744 },
]

export const merchantMonthTrend: SalesPoint[] = [
  { d: 'Sep 7', sales: 2180 }, { d: 'Sep 14', sales: 2460 }, { d: 'Sep 21', sales: 2310 },
  { d: 'Sep 28', sales: 2790 }, { d: 'Oct 5', sales: 3140 },
]

export const merchantHeatByHour = [40, 55, 30, 70, 90, 100, 85, 60, 45, 75, 95, 80, 50, 35, 65, 88, 92, 78, 55, 42, 68, 82, 96, 72]

export const merchantHeatByWeek = [62, 71, 58, 80, 88, 100, 76, 54, 66, 79, 84, 92, 61, 48, 70, 83, 90, 74, 58, 44, 64, 78, 88, 66]

export const merchantHeatByMonth = [55, 68, 74, 82, 90, 95, 71, 60, 72, 85, 91, 88, 66, 52, 74, 86, 93, 80, 62, 50, 70, 84, 92, 70]

export const merchantOnboardingTrend: MonthlyCustomerCount[] = [
  { m: 'May', customers: 412 }, { m: 'Jun', customers: 538 }, { m: 'Jul', customers: 690 },
  { m: 'Aug', customers: 845 }, { m: 'Sep', customers: 1024 }, { m: 'Oct', customers: 1212 },
]

export const merchantAgeRanges: AgeRangeCount[] = [
  { range: '18–24', customers: 168 }, { range: '25–34', customers: 482 }, { range: '35–44', customers: 336 },
  { range: '45–54', customers: 158 }, { range: '55+', customers: 68 },
]

export const merchantReturnFrequency: FrequencyBucketCount[] = [
  { bucket: '1×', customers: 318 }, { bucket: '2–3×', customers: 402 }, { bucket: '4–6×', customers: 288 },
  { bucket: '7–10×', customers: 142 }, { bucket: '10+×', customers: 62 },
]

export const merchantCampaignPerformance: WeeklyCampaignPerformance[] = [
  { w: 'W1', reach: 3200, converted: 380 }, { w: 'W2', reach: 4100, converted: 512 },
  { w: 'W3', reach: 4800, converted: 690 }, { w: 'W4', reach: 5600, converted: 908 },
]

// ── CUSTOMERS ────────────────────────────────────────────────────────────────
export const merchantCustomers: MerchantCustomer[] = [
  { id: 'CUS-2291', name: 'Ngozi E.', segment: 'Weekly Regular', kyc: 2, phone: '+234 803 ••• 2214', visits: 34, spend: 388_000, pointsEarned: 7_760, pointsRedeemed: 5_200, last: 'Oct 6, 2026 · 2:41pm', fav: 'Golden Morn 900g', joined: 'Mar 2024', age: '25–34' },
  { id: 'CUS-8841', name: 'Chidinma O.', segment: 'Power Spender', kyc: 3, phone: '+234 705 ••• 8830', visits: 21, spend: 912_000, pointsEarned: 18_240, pointsRedeemed: 12_900, last: 'Oct 6, 2026 · 1:18pm', fav: 'Golden Morn 900g', joined: 'Jan 2024', age: '35–44' },
  { id: 'CUS-6612', name: 'Fatima B.', segment: 'Deal Hunter', kyc: 2, phone: '+234 909 ••• 3345', visits: 18, spend: 196_000, pointsEarned: 3_920, pointsRedeemed: 3_100, last: 'Oct 6, 2026 · 12:02pm', fav: 'Peak Milk 400g', joined: 'May 2024', age: '25–34' },
  { id: 'CUS-1023', name: 'Blessing U.', segment: 'Weekly Regular', kyc: 2, phone: '+234 812 ••• 9902', visits: 12, spend: 142_000, pointsEarned: 2_840, pointsRedeemed: 1_200, last: 'Oct 5, 2026 · 6:12pm', fav: 'Indomie Chicken ×40', joined: 'Jun 2024', age: '18–24' },
  { id: 'CUS-3302', name: 'Segun K.', segment: 'Dormant 30d+', kyc: 1, phone: '+234 701 ••• 5521', visits: 6, spend: 41_200, pointsEarned: 824, pointsRedeemed: 0, last: 'Sep 2, 2026 · 11:04am', fav: 'Fresh Bread (daily)', joined: 'Aug 2024', age: '45–54' },
]

export const merchantReviews: MerchantReview[] = [
  { id: 'REV-1', customer: 'CUS-2291', stars: 5, text: 'Golden Morn always fresh. Points make it even better.', replied: false },
  { id: 'REV-2', customer: 'CUS-6612', stars: 4, text: 'Queue was long at lunch but the 7% off was worth it.', replied: true },
]

export const merchantCustomerOnboarding: MonthlyNewCustomers[] = [
  { m: 'May', newCustomers: 412 }, { m: 'Jun', newCustomers: 538 }, { m: 'Jul', newCustomers: 690 },
  { m: 'Aug', newCustomers: 845 }, { m: 'Sep', newCustomers: 1024 }, { m: 'Oct', newCustomers: 1212 },
]

export const merchantPatronageByProduct: ProductPatronage[] = [
  { product: 'Golden Morn 900g', customers: 486, hue: 38 },
  { product: 'Indomie Chicken ×40', customers: 402, hue: 10 },
  { product: 'Peak Milk 400g', customers: 355, hue: 210 },
  { product: 'Fresh Bread (daily)', customers: 298, hue: 28 },
  { product: 'Milo 500g', customers: 241, hue: 120 },
]

export const merchantVisitFrequency: FrequencyBucketCount[] = [
  { bucket: 'Once', customers: 318 }, { bucket: '2–3 visits', customers: 402 }, { bucket: '4–6', customers: 288 },
  { bucket: '7–10', customers: 142 }, { bucket: '10+', customers: 62 },
]

export const merchantAudienceSizes: Record<string, number> = {
  'All customers': 9860,
  'New customers (30d)': 412,
  'Patronize 3+ times / month': 3350,
  'Highest purchasers': 1840,
  'Deal Hunters': 2560,
  'Weekend Buyers': 1380,
  'Dormant 30d+': 620,
  'Single customer': 1,
  'Custom audience': 0,
};
