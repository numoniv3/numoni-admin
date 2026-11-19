// ── Platform-wide fixtures (merchants, customers, campaigns, catalogue, ledger) ──
// Read by several experiences through `platform.api.ts` and `admin.api.ts`.
import type {
  AttributionPoint, AuditLogEntry, Campaign, Customer, CustomerSegment, KycCase, Merchant,
  NearbyOfferSummary, PricingService, Product, RailPartner, ResellerSummary, Txn,
} from '../types/platform'

export const merchants: Merchant[] = [
  { id: 'MCH-001', name: 'Chicken Republic — Lekki', type: 'Retail', services: ['POS QR', 'Storefront', 'V2 Brand Wallet'], location: 'Lekki Phase 1, Lagos', joined: '2024-02-11', transactions: 48210, impressions: 912000, customers: 18450, bestSeller: 'Refuel Max + Chips', status: 'Active', gmv: 218_400_000, rewardLiability: 4_120_000, tier: 3, owner: 'Adaeze Okonkwo', phone: '+234 803 555 0142', model: 'V2' },
  { id: 'MCH-002', name: 'Tantalizers — Ikeja', type: 'Retail', services: ['POS QR', 'V1 Global Reward'], location: 'Ikeja GRA, Lagos', joined: '2024-03-02', transactions: 31020, impressions: 540000, customers: 12100, bestSeller: 'Tantalizer Chicken Pie', status: 'Active', gmv: 142_700_000, rewardLiability: 2_810_000, tier: 2, owner: 'Babatunde Fashola', phone: '+234 705 221 8874', model: 'V1' },
  { id: 'MCH-003', name: 'Charles Store', type: 'Retail', services: ['POS QR', 'Storefront', 'V3 Discounts'], location: 'Wuse II, Abuja', joined: '2024-01-19', transactions: 27440, impressions: 388000, customers: 9860, bestSeller: 'Golden Morn 900g', status: 'Active', gmv: 96_300_000, rewardLiability: 1_940_000, tier: 2, owner: 'Charles Eze', phone: '+234 812 440 9021', model: 'V3' },
  { id: 'MCH-004', name: 'MedPlus Pharmacy — VI', type: 'Retail', services: ['POS QR', 'V1 Global Reward'], location: 'Victoria Island, Lagos', joined: '2024-05-08', transactions: 19870, impressions: 265000, customers: 7410, bestSeller: 'Vitamin C 1000mg', status: 'Active', gmv: 88_150_000, rewardLiability: 1_220_000, tier: 2, owner: 'Dr. Funmi Adebayo', phone: '+234 909 118 3345', model: 'V1' },
  { id: 'MCH-005', name: 'Sabo Foods Ltd', type: 'FMCG', services: ['Campaigns', 'Reward Pools'], location: 'Apapa, Lagos', joined: '2024-04-14', transactions: 12100, impressions: 720000, customers: 30100, bestSeller: 'Sabo Tomato Paste 400g', status: 'Active', gmv: 64_800_000, rewardLiability: 3_600_000, tier: 3, owner: 'Alhaji Musa Sabo', phone: '+234 806 772 5510', model: 'V3' },
  { id: 'MCH-006', name: 'KwikMart Online', type: 'Online Seller', services: ['Storefront', 'Checkout Rail'], location: 'Yaba, Lagos', joined: '2024-06-21', transactions: 15430, impressions: 418000, customers: 6230, bestSeller: 'Ankara Throw Pillow', status: 'Active', gmv: 52_400_000, rewardLiability: 890_000, tier: 1, owner: 'Chiamaka Nwosu', phone: '+234 701 334 9982', model: 'V3' },
  { id: 'MCH-007', name: 'Emzor Wellness', type: 'Brand', services: ['Campaigns', 'Segment Grants'], location: 'Isolo, Lagos', joined: '2024-02-27', transactions: 9840, impressions: 615000, customers: 22800, bestSeller: 'Emzor Paracetamol', status: 'Active', gmv: 47_900_000, rewardLiability: 2_150_000, tier: 3, owner: 'Ngozi Emeka', phone: '+234 815 660 1287', model: 'V2' },
  { id: 'MCH-008', name: 'Port Harcourt Wines', type: 'Importer', services: ['POS QR', 'Storefront'], location: 'GRA, Port Harcourt', joined: '2024-07-03', transactions: 6210, impressions: 142000, customers: 3120, bestSeller: 'Four Cousins Sweet Red', status: 'Active', gmv: 39_200_000, rewardLiability: 640_000, tier: 1, owner: 'Sotonye Briggs', phone: '+234 908 441 2763', model: 'V1' },
  { id: 'MCH-009', name: 'PayCell Fintech', type: 'Fintech', services: ['Widget/API', 'Closed Ecosystem'], location: 'Ikoyi, Lagos', joined: '2024-03-30', transactions: 41200, impressions: 980000, customers: 56400, bestSeller: 'Wallet Top-up Rail', status: 'Active', gmv: 188_600_000, rewardLiability: 5_400_000, tier: 3, owner: 'Damilola Oyekan', phone: '+234 802 919 4456', model: 'V1' },
  { id: 'MCH-010', name: 'Mama Put Express', type: 'Retail', services: ['POS QR'], location: 'Surulere, Lagos', joined: '2024-08-15', transactions: 8410, impressions: 96000, customers: 4180, bestSeller: 'Jollof + Turkey', status: 'Pending KYC', gmv: 21_700_000, rewardLiability: 410_000, tier: 1, owner: 'Iya Basira', phone: '+234 706 883 2210', model: 'V1' },
  { id: 'MCH-011', name: 'Slot — Computer Village', type: 'Retail', services: ['POS QR', 'V2 Brand Wallet'], location: 'Ikeja, Lagos', joined: '2024-01-05', transactions: 22760, impressions: 502000, customers: 11240, bestSeller: 'Redmi Note 13', status: 'Active', gmv: 204_500_000, rewardLiability: 3_300_000, tier: 3, owner: 'Nnamdi Kalu', phone: '+234 811 205 7734', model: 'V2' },
  { id: 'MCH-012', name: 'Zobo & Co.', type: 'Online Seller', services: ['Storefront'], location: 'Lekki, Lagos', joined: '2024-09-01', transactions: 3120, impressions: 88000, customers: 1940, bestSeller: 'Zobo Concentrate 1L', status: 'Onboarding', gmv: 8_900_000, rewardLiability: 120_000, tier: 1, owner: 'Teniola Akindele', phone: '+234 703 552 6619', model: 'V3' },
]

export const customers: Customer[] = [
  { id: 'CUS-8841', alias: 'Chidinma O.', segment: 'Power Spender', kyc: 3, balance: 48200, brandWallets: 6, lifetime: 912000, lastActive: '2m ago', location: 'Lekki, Lagos', status: 'Active' },
  { id: 'CUS-7730', alias: 'Emeka A.', segment: 'Weekly Regular', kyc: 2, balance: 12450, brandWallets: 3, lifetime: 284000, lastActive: '18m ago', location: 'Ikeja, Lagos', status: 'Active' },
  { id: 'CUS-6612', alias: 'Fatima B.', segment: 'Deal Hunter', kyc: 2, balance: 8120, brandWallets: 5, lifetime: 196000, lastActive: '1h ago', location: 'Wuse, Abuja', status: 'Active' },
  { id: 'CUS-5590', alias: 'Tunde W.', segment: 'Weekend Buyer', kyc: 1, balance: 3200, brandWallets: 1, lifetime: 64000, lastActive: '3h ago', location: 'Surulere, Lagos', status: 'Active' },
  { id: 'CUS-4418', alias: 'Aisha M.', segment: 'Power Spender', kyc: 3, balance: 61900, brandWallets: 8, lifetime: 1240000, lastActive: '6h ago', location: 'GRA, Port Harcourt', status: 'Active' },
  { id: 'CUS-3302', alias: 'Segun K.', segment: 'Dormant 30d+', kyc: 1, balance: 450, brandWallets: 2, lifetime: 41200, lastActive: '34d ago', location: 'Yaba, Lagos', status: 'Dormant' },
  { id: 'CUS-2291', alias: 'Ngozi E.', segment: 'Weekly Regular', kyc: 2, balance: 15300, brandWallets: 4, lifetime: 388000, lastActive: '22m ago', location: 'Enugu', status: 'Active' },
  { id: 'CUS-1184', alias: 'Ibrahim S.', segment: 'New This Week', kyc: 1, balance: 5250, brandWallets: 1, lifetime: 5250, lastActive: '9m ago', location: 'Kano', status: 'New' },
  { id: 'CUS-1023', alias: 'Blessing U.', segment: 'Deal Hunter', kyc: 2, balance: 9840, brandWallets: 3, lifetime: 142000, lastActive: '47m ago', location: 'Ajah, Lagos', status: 'Active' },
  { id: 'CUS-0912', alias: 'Kunle D.', segment: 'Dormant 30d+', kyc: 1, balance: 120, brandWallets: 0, lifetime: 18500, lastActive: '51d ago', location: 'Ibadan', status: 'Dormant' },
]

export const campaigns: Campaign[] = [
  { id: 'CMP-301', name: 'Lunch Rush 2× Points', owner: 'Chicken Republic — Lekki', ownerType: 'Merchant', merchantType: 'QSR / Restaurant', goal: 'Increase frequency', trigger: 'Purchase 12pm–3pm', budget: 2_000_000, spent: 1_284_000, sales: 18_400_000, status: 'Live', window: 'Sep 1 – Sep 30', model: 'V2' },
  { id: 'CMP-302', name: 'Sabo Jollof Season', owner: 'Sabo Foods Ltd', ownerType: 'Brand', merchantType: 'FMCG', goal: 'SKU movement', trigger: 'Verified SKU purchase', budget: 15_000_000, spent: 6_720_000, sales: 84_100_000, status: 'Live', window: 'Aug 15 – Oct 15', model: 'V3' },
  { id: 'CMP-303', name: 'Win-back Wednesdays', owner: 'Tantalizers — Ikeja', ownerType: 'Merchant', merchantType: 'QSR / Restaurant', goal: 'Reduce churn', trigger: 'Dormancy 21 days', budget: 800_000, spent: 412_000, sales: 3_980_000, status: 'Live', window: 'Sep 1 – Nov 30', model: 'V1' },
  { id: 'CMP-304', name: 'Lekki ₦2k Segment Grant', owner: 'Emzor Wellness', ownerType: 'Brand', merchantType: 'Pharmacy / Health', goal: 'Segment activation', trigger: 'Spend ₦10,000 in Lekki', budget: 20_000_000, spent: 20_000_000, sales: 122_000_000, status: 'Ended', window: 'Jul 1 – Aug 31', model: 'V2' },
  { id: 'CMP-305', name: 'First-timer Welcome 5%', owner: 'Charles Store', ownerType: 'Merchant', merchantType: 'Retail', goal: 'Acquire new customers', trigger: 'First transaction', budget: 500_000, spent: 88_000, sales: 1_240_000, status: 'Live', window: 'Sep 10 – Dec 31', model: 'V1' },
  { id: 'CMP-306', name: 'Weekend Cart Booster', owner: 'KwikMart Online', ownerType: 'Merchant', merchantType: 'Online Seller', goal: 'Increase average order', trigger: 'Cart ≥ ₦25,000 (Sat–Sun)', budget: 1_200_000, spent: 0, sales: 0, status: 'Pending Approval', window: 'Oct 1 – Dec 24', model: 'V3' },
  { id: 'CMP-307', name: 'Birthday Double Points', owner: 'Slot — Computer Village', ownerType: 'Merchant', merchantType: 'Electronics', goal: 'Loyalty & delight', trigger: 'Birthday ±3 days', budget: 900_000, spent: 240_000, sales: 4_100_000, status: 'Paused', window: 'Jun 1 – Dec 31', model: 'V2' },
  { id: 'CMP-308', name: 'PayCell Cashback Fridays', owner: 'PayCell Technologies', ownerType: 'Brand', merchantType: 'Fintech', goal: 'Wallet top-ups', trigger: 'Fund wallet ≥ ₦20,000 on Friday', budget: 6_000_000, spent: 2_150_000, sales: 31_600_000, status: 'Live', window: 'Sep 5 – Nov 28', model: 'V2' },
  { id: 'CMP-309', name: 'Apapa Importers Boost', owner: 'Olu & Sons Imports', ownerType: 'Merchant', merchantType: 'Importer', goal: 'B2B order volume', trigger: 'Invoice ≥ ₦500,000', budget: 4_500_000, spent: 980_000, sales: 12_300_000, status: 'Live', window: 'Sep 20 – Dec 20', model: 'V2' },
  { id: 'CMP-310', name: 'Indomie Campus Rush', owner: 'Dufil Prima Foods', ownerType: 'Brand', merchantType: 'FMCG', goal: 'Campus penetration', trigger: 'Verified SKU + campus location', budget: 12_000_000, spent: 4_800_000, sales: 41_200_000, status: 'Live', window: 'Oct 1 – Dec 15', model: 'V3' },
]

export const products: Product[] = [
  { id: 'PRD-01', name: 'Refuel Max + Chips', category: 'Meals', price: 4500, merchant: 'Chicken Republic — Lekki', discount: 20, stock: 'Infinite', tag: 'Featured', rating: 4.7, sold: 12400 },
  { id: 'PRD-02', name: 'Tantalizer Chicken Pie', category: 'Meals', price: 1800, merchant: 'Tantalizers — Ikeja', discount: 10, stock: 'Infinite', rating: 4.5, sold: 9800 },
  { id: 'PRD-03', name: 'Golden Morn 900g', category: 'Groceries', price: 7200, merchant: 'Charles Store', discount: 7, stock: 42, tag: 'Low stock', rating: 4.8, sold: 3100 },
  { id: 'PRD-04', name: 'Sabo Tomato Paste 400g ×12', category: 'Groceries', price: 9800, merchant: 'Sabo Foods Ltd', discount: 15, stock: 240, tag: 'V3 Deal', rating: 4.6, sold: 26000 },
  { id: 'PRD-05', name: 'Vitamin C 1000mg ×60', category: 'Pharmacy', price: 6500, merchant: 'MedPlus Pharmacy — VI', stock: 118, rating: 4.9, sold: 1800 },
  { id: 'PRD-06', name: 'Ankara Throw Pillow', category: 'Home', price: 12500, merchant: 'KwikMart Online', discount: 25, stock: 17, tag: 'Handmade', rating: 4.4, sold: 640 },
  { id: 'PRD-07', name: 'Four Cousins Sweet Red 75cl', category: 'Drinks', price: 9800, merchant: 'Port Harcourt Wines', stock: 86, rating: 4.6, sold: 920 },
  { id: 'PRD-08', name: 'Redmi Note 13 128GB', category: 'Electronics', price: 218000, merchant: 'Slot — Computer Village', discount: 7, stock: 9, tag: 'Hot', rating: 4.7, sold: 410 },
  { id: 'PRD-09', name: 'Zobo Concentrate 1L', category: 'Drinks', price: 2500, merchant: 'Zobo & Co.', discount: 12, stock: 150, rating: 4.8, sold: 2200 },
  { id: 'PRD-10', name: 'Jollof + Turkey (Regular)', category: 'Meals', price: 3800, merchant: 'Mama Put Express', stock: 'Infinite', rating: 4.9, sold: 15300 },
  { id: 'PRD-11', name: 'Emzor Paracetamol ×96', category: 'Pharmacy', price: 3200, merchant: 'Emzor Wellness', discount: 8, stock: 500, rating: 4.8, sold: 41000 },
  { id: 'PRD-12', name: 'Puff Puff Dozen', category: 'Meals', price: 1500, merchant: 'Tantalizers — Ikeja', discount: 20, stock: 'Infinite', tag: 'Featured', rating: 4.6, sold: 21000 },
]

export const transactions: Txn[] = [
  { id: 'TXN-9F2K41', customer: 'Chidinma O.', merchant: 'Chicken Republic — Lekki', type: 'Redemption', amount: 4500, points: 4500, rail: 'POS QR', time: '2m ago', status: 'Success' },
  { id: 'TXN-9F2K38', customer: 'Ibrahim S.', merchant: 'nuMoni Wallet', type: 'Funding', amount: 5000, points: 5250, rail: 'Bank Transfer', time: '9m ago', status: 'Success' },
  { id: 'TXN-9F2K35', customer: 'Emeka A.', merchant: 'Slot — Computer Village', type: 'Redemption', amount: 218000, points: 218000, rail: 'POS QR', time: '18m ago', status: 'Success' },
  { id: 'TXN-9F2K31', customer: 'Ngozi E.', merchant: 'Charles Store', type: 'Redemption', amount: 7200, points: 7200, rail: 'Storefront', time: '22m ago', status: 'Success' },
  { id: 'TXN-9F2K29', customer: 'Fatima B.', merchant: 'nuMoni Wallet', type: 'Funding', amount: 20000, points: 21000, rail: 'Checkout Rail', time: '31m ago', status: 'Success' },
  { id: 'TXN-9F2K26', customer: 'Aisha M.', merchant: 'MedPlus Pharmacy — VI', type: 'Redemption', amount: 6500, points: 6500, rail: 'POS QR', time: '44m ago', status: 'Success' },
  { id: 'TXN-9F2K22', customer: 'Blessing U.', merchant: 'KwikMart Online', type: 'Redemption', amount: 12500, points: 12500, rail: 'Storefront', time: '47m ago', status: 'Success' },
  { id: 'TXN-9F2K19', customer: 'Tunde W.', merchant: 'Mama Put Express', type: 'Redemption', amount: 3800, points: 3800, rail: 'POS QR', time: '1h ago', status: 'Success' },
  { id: 'TXN-9F2K15', customer: 'nuMoni Treasury', merchant: 'Tantalizers — Ikeja', type: 'Settlement', amount: 1_842_000, points: 0, rail: 'T+1 Bank Payout', time: '2h ago', status: 'Pending' },
  { id: 'TXN-9F2K11', customer: 'Segun K.', merchant: 'nuMoni Wallet', type: 'Funding', amount: 2000, points: 2050, rail: 'Bank Transfer', time: '3h ago', status: 'Failed' },
  { id: 'TXN-9F2K08', customer: 'Chidinma O.', merchant: 'Chicken Republic — Lekki', type: 'Reward', amount: 0, points: 225, rail: 'V2 Brand Wallet', time: '2m ago', status: 'Success' },
  { id: 'TXN-9F2K02', customer: 'Kunle D.', merchant: 'Zobo & Co.', type: 'Refund', amount: 2500, points: 2500, rail: 'Auto-refund', time: '5h ago', status: 'Reversed' },
]

export const kycQueue: KycCase[] = [
  { id: 'KYC-101', name: 'Mama Put Express', kind: 'Merchant Tier 1', doc: 'CAC Certificate + Utility Bill', submitted: '14m ago', provider: 'Prembly', score: 92 },
  { id: 'KYC-102', name: 'Ibrahim Sadiq', kind: 'Customer Tier 2', doc: 'NIN Slip + Selfie', submitted: '38m ago', provider: 'VerifyMe', score: 88 },
  { id: 'KYC-103', name: 'Zobo & Co.', kind: 'Merchant Tier 1', doc: 'CAC Certificate', submitted: '1h ago', provider: 'Prembly', score: 74 },
  { id: 'KYC-104', name: 'Blessing Udo', kind: 'Customer Tier 3', doc: 'BVN + Bank Statement', submitted: '2h ago', provider: 'VerifyMe', score: 96 },
  { id: 'KYC-105', name: 'Aba Textiles Hub', kind: 'Merchant Tier 2', doc: 'CAC + Director ID', submitted: '3h ago', provider: 'Prembly', score: 61 },
  { id: 'KYC-106', name: 'Chiamaka Nwosu', kind: 'Customer Tier 2', doc: 'NIN Slip', submitted: '3h ago', provider: 'VerifyMe', score: 91 },
  { id: 'KYC-107', name: 'Kano Fresh Produce Ltd', kind: 'Merchant Tier 2', doc: 'CAC + Tax Clearance', submitted: '5h ago', provider: 'Prembly', score: 83 },
  { id: 'KYC-108', name: 'PayCell Technologies', kind: 'Fintech KYB', doc: 'CBN Licence + Board Resolution', submitted: '6h ago', provider: 'Prembly', score: 97 },
  { id: 'KYC-109', name: 'Tobi Adewale', kind: 'Customer Tier 3', doc: 'BVN + Address Proof', submitted: '8h ago', provider: 'VerifyMe', score: 58 },
  { id: 'KYC-110', name: 'Sabo Foods Ltd', kind: 'Brand KYB', doc: 'CAC + SON Certification', submitted: '9h ago', provider: 'Prembly', score: 94 },
  { id: 'KYC-111', name: 'Enugu Traders Union', kind: 'Reseller KYB', doc: 'Cooperative Certificate', submitted: '12h ago', provider: 'Prembly', score: 69 },
  { id: 'KYC-112', name: 'Funke Alabi', kind: 'Customer Tier 2', doc: 'NIN Slip + Selfie', submitted: '14h ago', provider: 'VerifyMe', score: 85 },
]

export const auditLog: AuditLogEntry[] = [
  { id: 'AUD-9921', actor: 'superadmin@numoni.io', action: 'pricing.update', target: 'PosQrPayment · sell rate 0.92 → 0.93', time: '12m ago', diff: { before: '0.92', after: '0.93' } },
  { id: 'AUD-9920', actor: 'ops.tobi@numoni.io', action: 'kyc.approve', target: 'KYC-104 · Blessing Udo · Tier 3', time: '26m ago', diff: { before: 'pending', after: 'approved' } },
  { id: 'AUD-9919', actor: 'finance.amara@numoni.io', action: 'settlement.run', target: 'Batch SET-2026-0927 · 84 merchants', time: '1h ago', diff: { before: 'queued', after: 'executed' } },
  { id: 'AUD-9918', actor: 'superadmin@numoni.io', action: 'routing.split', target: 'Termii 70% / Brevo 30% (SMS)', time: '2h ago', diff: { before: 'single: Termii', after: 'split 70/30' } },
  { id: 'AUD-9917', actor: 'ops.tobi@numoni.io', action: 'merchant.suspend', target: 'MCH-014 · Grills In & Out', time: '4h ago', diff: { before: 'active', after: 'suspended' } },
  { id: 'AUD-9916', actor: 'system', action: 'cutoff.complete', target: 'Books closed 24:00 · checksum OK', time: 'Yesterday', diff: { before: 'open', after: 'closed' } },
  { id: 'AUD-9915', actor: 'finance.amara@numoni.io', action: 'refund.auto', target: 'TXN-9F2K02 · ₦2,500', time: 'Yesterday', diff: { before: 'success', after: 'reversed' } },
  { id: 'AUD-9914', actor: 'superadmin@numoni.io', action: 'flags.enable', target: 'customer_to_merchant toggle · NG', time: '2d ago', diff: { before: 'off', after: 'on' } },
]

export const resellers: ResellerSummary[] = [
  { id: 'RSL-01', name: 'Lagos West Partners', contact: 'Yetunde Alabi', region: 'Lagos West', merchants: 34, active: 29, volume: 84_200_000, commission: 2_940_000, status: 'Settled' },
  { id: 'RSL-02', name: 'Abuja Central Agency', contact: 'Suleiman Garba', region: 'FCT Abuja', merchants: 21, active: 17, volume: 46_800_000, commission: 1_610_000, status: 'Settled' },
  { id: 'RSL-03', name: 'PHC Trade Links', contact: 'Preye Amachree', region: 'Port Harcourt', merchants: 12, active: 9, volume: 22_400_000, commission: 780_000, status: 'Pending' },
  { id: 'RSL-04', name: 'Kano North Reps', contact: 'Balarabe Musa', region: 'Kano', merchants: 8, active: 5, volume: 9_100_000, commission: 312_000, status: 'Pending' },
]

export const pricingServices: PricingService[] = [
  { service: 'WalletFunding', mode: 'Percent', value: '0.5%', cap: '₦100', country: 'NG' },
  { service: 'PointTransfer', mode: 'Flat', value: '₦10', cap: '—', country: 'NG' },
  { service: 'MerchantPayment', mode: 'Percent', value: '1.0%', cap: '₦1,000', country: 'NG' },
  { service: 'PosQrPayment', mode: 'Range', value: '0.8–1.2%', cap: '₦2,000', country: 'NG' },
  { service: 'CashWithdrawal', mode: 'Flat + %', value: '₦50 + 0.5%', cap: '₦500', country: 'NG' },
  { service: 'LocalUtility', mode: 'Flat', value: '₦100', cap: '—', country: 'NG' },
  { service: 'Storefront', mode: 'Subscription', value: '₦5,000/mo', cap: '—', country: 'NG' },
  { service: 'Marketplace', mode: 'Percent', value: '2.5%', cap: '—', country: 'NG' },
  { service: 'RewardCampaign', mode: 'Percent of budget', value: '3.0%', cap: '—', country: 'NG' },
  { service: 'RewardCard', mode: 'Flat', value: '₦1,500/card', cap: '—', country: 'NG' },
  { service: 'Checkout', mode: 'Percent', value: '1.5%', cap: '₦2,500', country: 'NG' },
  { service: 'WhiteLabelApp', mode: 'Licence', value: '₦2.5M/yr', cap: '—', country: 'NG' },
]

export const segmentData: CustomerSegment[] = [
  { name: 'Power Spenders', value: 18, color: '#02DC4D' },
  { name: 'Weekly Regulars', value: 34, color: '#0EA5E9' },
  { name: 'Deal Hunters', value: 26, color: '#7C5CBF' },
  { name: 'Weekend Buyers', value: 14, color: '#E8A33D' },
  { name: 'Dormant', value: 8, color: '#64748B' },
]

export const attributionSeries: AttributionPoint[] = [
  { d: 'W1', spend: 1.2, sales: 8.4 },
  { d: 'W2', spend: 1.8, sales: 12.1 },
  { d: 'W3', spend: 1.6, sales: 14.8 },
  { d: 'W4', spend: 2.1, sales: 19.2 },
  { d: 'W5', spend: 2.4, sales: 24.6 },
  { d: 'W6', spend: 2.2, sales: 27.9 },
]

export const partners: RailPartner[] = [
  { name: 'Payonus', role: 'Payments / Collections', mode: 'Single partner', health: 99.98, latency: '210ms' },
  { name: 'VerifyMe', role: 'KYC — BVN/NIN', mode: 'Traffic split 60%', health: 99.91, latency: '480ms' },
  { name: 'Prembly', role: 'KYC — Business', mode: 'Traffic split 40%', health: 99.84, latency: '520ms' },
  { name: 'Termii', role: 'SMS / OTP', mode: 'Traffic split 70%', health: 99.99, latency: '180ms' },
  { name: 'Brevo', role: 'Email / SMS fallback', mode: 'Traffic split 30%', health: 99.95, latency: '240ms' },
  { name: 'Utility Partners', role: 'Airtime / Bills', mode: 'Single partner', health: 99.72, latency: '610ms' },
]

export const offers: NearbyOfferSummary[] = [
  { id: 1, title: '20% off Refuel Max', merchant: 'Chicken Republic — Lekki', dist: '1.2 km', model: 'V3' },
  { id: 2, title: '2× points at lunch', merchant: 'Tantalizers — Ikeja', dist: '3.8 km', model: 'V2' },
  { id: 3, title: '₦500 off Golden Morn', merchant: 'Charles Store', dist: '5.1 km', model: 'V3' },
  { id: 4, title: 'Free delivery weekend', merchant: 'KwikMart Online', dist: 'Online', model: 'V1' },
]

export const nigerianNames = ['Adaeze', 'Babatunde', 'Chiamaka', 'Damilola', 'Emeka', 'Fatima', 'Ibrahim', 'Ngozi', 'Olusegun', 'Yetunde']
