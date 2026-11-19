// ── Brand / FMCG console fixtures (Sabo Foods) ──────────────────────────────
// Served by `brand.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type {
  BrandCampaign, BrandCoupon, BrandCustomer, BrandCustomerActivity, BrandGift, BrandPool, BrandRaffle,
  BrandRewardProgram, BrandSku, BrandWalletTxn, CityCustomerCount, PoolLedgerEntry,
} from '../types/brand'

const sku = (id: string, name: string, price: number, benefitType: BrandSku['benefitType'], benefitValue: number, bundleQty: number, hue: number): BrandSku =>
  ({ id, name, price, benefitType, benefitValue, bundleQty, hue })

const brandSkus = [
  sku('SKU-01', 'Sabo Tomato Paste 400g', 820, 'cash_per_unit', 5, 1, 12),
  sku('SKU-02', 'Sabo Curry Powder 100g', 450, 'points', 100, 1, 42),
  sku('SKU-03', 'Sabo Jollof Mix 750g', 1250, 'cash_per_bundle', 10, 3, 95),
  sku('SKU-04', 'Sabo Stew Base 250g', 610, 'raffle', 1, 1, 150),
]

export const brandCampaigns: BrandCampaign[] = [
  {
    id: 'BCMP-501', name: 'Sabo Jollof Season', type: 'SKU', status: 'Active',
    locations: ['Lagos', 'Ibadan'],
    skus: brandSkus.slice(0, 3),
    rewardProgramIds: ['BRP-01'],
    budget: 15_000_000, spent: 6_720_000,
    durationType: 'Fixed window', startDate: '2026-09-01', endDate: '2026-10-31',
    redemptions: 48_210, attributedSales: 84_600_000, newCustomers: 3_412,
    created: 'Aug 28, 2026', submittedAt: 'Aug 28, 2026 · 10:12am',
  },
  {
    id: 'BCMP-502', name: 'Lekki ₦2,000 grant', type: 'Segment', status: 'Active',
    locations: ['Lekki, Lagos'],
    skus: [],
    segment: 'Deal Hunters', segmentCount: 10_000, grantAmount: 2_000, unlockCondition: 'Spend ₦10,000 at any merchant in Lekki',
    rewardProgramIds: ['BRP-02'],
    budget: 20_000_000, spent: 14_400_000,
    durationType: 'Day count', dayCount: 60,
    redemptions: 7_204, attributedSales: 61_200_000, newCustomers: 1_890,
    created: 'Sep 5, 2026', submittedAt: 'Sep 5, 2026 · 9:41am',
  },
  {
    id: 'BCMP-503', name: 'Curry Powder push — Q4', type: 'SKU', status: 'In review',
    locations: ['Nationwide'],
    skus: [brandSkus[1], brandSkus[3]],
    rewardProgramIds: [],
    budget: 8_000_000, spent: 0,
    durationType: 'Ongoing',
    redemptions: 0, attributedSales: 0, newCustomers: 0,
    created: 'Oct 4, 2026', submittedAt: 'Oct 4, 2026 · 3:22pm',
  },
  {
    id: 'BCMP-504', name: 'Back-to-school stew bundle', type: 'SKU', status: 'Completed',
    locations: ['Lagos', 'Abuja FCT'],
    skus: [brandSkus[0], brandSkus[2]],
    rewardProgramIds: ['BRP-01'],
    budget: 5_000_000, spent: 5_000_000,
    durationType: 'Fixed window', startDate: '2026-08-20', endDate: '2026-09-20',
    redemptions: 21_340, attributedSales: 22_800_000, newCustomers: 1_204,
    created: 'Aug 15, 2026', submittedAt: 'Aug 15, 2026 · 11:03am',
  },
]

export const brandRewardPrograms: BrandRewardProgram[] = [
  { id: 'BRP-01', name: 'Verified purchase bonus', trigger: 'Reward Per Purchase', rules: [{ target: '1 verified SKU', reward: 'benefit per SKU config' }], status: 'Active', created: 'Aug 20, 2026' },
  { id: 'BRP-02', name: 'Spend-threshold grant', trigger: 'Value Of Purchase', rules: [{ target: '₦10,000 in Lekki', reward: '₦2,000 grant' }], status: 'Active', created: 'Sep 5, 2026' },
]

export const brandGifts: BrandGift[] = [
  { id: 'BGF-01', name: 'Sabo Apron (branded)', stock: 500, value: 3_500, hue: 28, status: 'Active', created: 'Sep 2, 2026' },
  { id: 'BGF-02', name: 'Recipe booklet + spice tin', stock: 1200, value: 1_800, hue: 95, status: 'Active', created: 'Sep 2, 2026' },
]

export const brandRaffles: BrandRaffle[] = [
  { id: 'BRF-01', name: 'December Mega Draw', prize: '₦1,000,000 cash × 5 winners', drawDate: '2026-12-20', entries: 34_210, ticketCost: '1 ticket per SKU', status: 'Active', created: 'Sep 10, 2026' },
]

export const brandCoupons: BrandCoupon[] = [
  { id: 'BCP-01', name: '10% off Sabo bundle', discountType: 'Percentage', value: 10, maxCap: 500, codes: 5_000, redeemed: 2_814, expiry: '2026-11-30', status: 'Active', created: 'Sep 12, 2026' },
]

export const brandPools: BrandPool[] = [
  { id: 'POL-01', name: 'Main sponsored pool', balance: 8_280_000, funded: 35_000_000, campaigns: ['Sabo Jollof Season', 'Lekki ₦2,000 grant'], status: 'Active', created: 'Aug 20, 2026' },
  { id: 'POL-02', name: 'Q4 activation pool', balance: 12_000_000, funded: 12_000_000, campaigns: ['Curry Powder push — Q4'], status: 'Paused', created: 'Oct 1, 2026' },
]

export const brandPoolLedger: PoolLedgerEntry[] = [
  { id: 'DD-2214', poolId: 'POL-01', description: 'Draw-down — Sabo Jollof Season', direction: 'debit', amount: -6_720_000, balance: 8_280_000, date: 'Sep 26, 2026 · 11:40am', authorizedBy: 'Auto · budget escrow' },
  { id: 'TOP-2210', poolId: 'POL-01', description: 'Pool top-up', direction: 'credit', amount: 15_000_000, balance: 15_000_000, date: 'Sep 1, 2026 · 9:02am', authorizedBy: 'Adaeze M. (Finance)' },
  { id: 'DD-2198', poolId: 'POL-01', description: 'Draw-down — Lekki ₦2,000 grant', direction: 'debit', amount: -20_000_000, balance: 0, date: 'Aug 28, 2026 · 3:15pm', authorizedBy: 'Auto · budget escrow' },
  { id: 'TOP-2195', poolId: 'POL-02', description: 'Initial funding', direction: 'credit', amount: 12_000_000, balance: 12_000_000, date: 'Oct 1, 2026 · 10:20am', authorizedBy: 'Adaeze M. (Finance)' },
]

export const brandWalletTxns: BrandWalletTxn[] = [
  { id: 'BWX-0112', date: 'Oct 4, 2026 · 3:22pm', day: '2026-10-04', description: 'Escrow reserve — Curry Powder push — Q4', ref: 'ESC-5021', direction: 'debit', status: 'Pending', method: 'Escrow', amount: -8_000_000, balance: 22_280_000 },
  { id: 'BWX-0108', date: 'Oct 1, 2026 · 10:20am', day: '2026-10-01', description: 'Wallet funding — Wema Bank ••4477', ref: 'FND-88412', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 30_000_000, balance: 30_280_000 },
  { id: 'BWX-0101', date: 'Sep 26, 2026 · 11:40am', day: '2026-09-26', description: 'Reward spend — Sabo Jollof Season (week 4)', ref: 'SPD-2214', direction: 'debit', status: 'Completed', method: 'Reward spend', amount: -1_240_000, balance: 280_000 },
  { id: 'BWX-0096', date: 'Sep 5, 2026 · 9:41am', day: '2026-09-05', description: 'Escrow reserve — Lekki ₦2,000 grant', ref: 'ESC-4987', direction: 'debit', status: 'Completed', method: 'Escrow', amount: -20_000_000, balance: 1_520_000 },
  { id: 'BWX-0091', date: 'Sep 1, 2026 · 9:02am', day: '2026-09-01', description: 'Wallet funding — GTBank ••2210', ref: 'FND-87961', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 21_520_000, balance: 21_520_000 },
  { id: 'BWX-0085', date: 'Aug 28, 2026 · 10:12am', day: '2026-08-28', description: 'Escrow reserve — Sabo Jollof Season', ref: 'ESC-4901', direction: 'debit', status: 'Completed', method: 'Escrow', amount: -15_000_000, balance: 0 },
  { id: 'BWX-0079', date: 'Aug 20, 2026 · 8:30am', day: '2026-08-20', description: 'Initial wallet funding — Zenith Bank ••8841', ref: 'FND-87100', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 15_000_000, balance: 15_000_000 },
]

const act = (date: string, action: string, detail: string, amount?: number): BrandCustomerActivity => ({ date, action, detail, amount })

export const brandCustomers: BrandCustomer[] = [
  {
    id: 'CUS-8841', name: 'Chidinma O.', phone: '+234 803 ••• 4418', segment: 'Power Spender', location: 'Lekki, Lagos', joined: 'Mar 2024',
    purchases: 84, totalSpent: 912_000, rewardsEarned: 18_400, redemptions: 26, favSku: 'Sabo Jollof Mix 750g', lastActive: '2m ago',
    activity: [
      act('Oct 6, 2026 · 2:41pm', 'Purchase', 'Sabo Jollof Mix 750g ×3 — Charles Store, Lekki', 3_750),
      act('Oct 6, 2026 · 2:41pm', 'Reward earned', '₦10 bundle benefit ×1 → 100 pts'),
      act('Oct 2, 2026 · 11:20am', 'Redemption', '10% off Sabo bundle coupon used', -500),
      act('Sep 28, 2026 · 5:02pm', 'Purchase', 'Sabo Tomato Paste 400g ×2 — Spar, Lekki', 1_640),
    ],
  },
  {
    id: 'CUS-6612', name: 'Fatima B.', phone: '+234 812 ••• 6612', segment: 'Deal Hunter', location: 'Wuse, Abuja', joined: 'Jun 2024',
    purchases: 52, totalSpent: 196_000, rewardsEarned: 9_850, redemptions: 19, favSku: 'Sabo Tomato Paste 400g', lastActive: '1h ago',
    activity: [
      act('Oct 6, 2026 · 12:02pm', 'Purchase', 'Sabo Tomato Paste 400g ×1 — Charles Store, Wuse', 820),
      act('Oct 6, 2026 · 12:02pm', 'Reward earned', '₦5 per unit → wallet credit'),
      act('Sep 30, 2026 · 9:14am', 'Raffle entry', 'December Mega Draw — 1 ticket'),
    ],
  },
  {
    id: 'CUS-4418', name: 'Aisha M.', phone: '+234 905 ••• 4418', segment: 'Power Spender', location: 'GRA, Port Harcourt', joined: 'Jan 2024',
    purchases: 121, totalSpent: 1_240_000, rewardsEarned: 24_100, redemptions: 41, favSku: 'Sabo Stew Base 250g', lastActive: '6h ago',
    activity: [
      act('Oct 5, 2026 · 7:35pm', 'Purchase', 'Sabo Stew Base 250g ×6 — Everyday Supermarket, GRA', 3_660),
      act('Oct 5, 2026 · 7:35pm', 'Raffle entry', 'December Mega Draw — 6 tickets'),
    ],
  },
  {
    id: 'CUS-2291', name: 'Ngozi E.', phone: '+234 803 ••• 2291', segment: 'Weekly Regular', location: 'Enugu', joined: 'Mar 2024',
    purchases: 67, totalSpent: 388_000, rewardsEarned: 11_200, redemptions: 14, favSku: 'Sabo Jollof Mix 750g', lastActive: '22m ago',
    activity: [
      act('Oct 6, 2026 · 2:41pm', 'Purchase', 'Sabo Jollof Mix 750g ×2 — Roban Stores, Enugu', 2_500),
      act('Oct 1, 2026 · 6:12pm', 'Redemption', 'Gift — Recipe booklet + spice tin'),
    ],
  },
  {
    id: 'CUS-5590', name: 'Tunde W.', phone: '+234 701 ••• 5590', segment: 'Weekend Buyer', location: 'Surulere, Lagos', joined: 'Aug 2025',
    purchases: 18, totalSpent: 64_000, rewardsEarned: 3_200, redemptions: 5, favSku: 'Sabo Curry Powder 100g', lastActive: '3h ago',
    activity: [
      act('Oct 6, 2026 · 10:15am', 'Purchase', 'Sabo Curry Powder 100g ×2 — Mama Put Express, Surulere', 900),
      act('Oct 6, 2026 · 10:15am', 'Reward earned', '200 pts'),
    ],
  },
  {
    id: 'CUS-1184', name: 'Ibrahim S.', phone: '+234 706 ••• 1184', segment: 'New This Week', location: 'Kano', joined: 'Sep 2026',
    purchases: 3, totalSpent: 5_250, rewardsEarned: 420, redemptions: 1, favSku: 'Sabo Tomato Paste 400g', lastActive: '9m ago',
    activity: [
      act('Oct 6, 2026 · 3:44pm', 'Purchase', 'Sabo Tomato Paste 400g ×1 — Sabon Gari Market, Kano', 820),
      act('Oct 3, 2026 · 1:02pm', 'Joined program', 'Via Lekki ₦2,000 grant SMS'),
    ],
  },
]

export const brandCustomersByCity: CityCustomerCount[] = [
  { city: 'Lagos', users: 12_420 },
  { city: 'Abuja FCT', users: 6_810 },
  { city: 'Port Harcourt', users: 3_140 },
  { city: 'Ibadan', users: 2_460 },
  { city: 'Kano', users: 1_920 },
  { city: 'Enugu', users: 1_180 },
  { city: 'Benin City', users: 640 },
]
