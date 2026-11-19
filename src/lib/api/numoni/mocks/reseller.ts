// ── Reseller portal fixtures (Lagos West Partners) ──────────────────────────
// Served by `reseller.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type { BatchTxn, ResellerBusiness, ResellerWalletTxn, SettlementBatch } from '../types/reseller'

export const resellerBusinesses: ResellerBusiness[] = [
  { id: 'MCH-101', name: 'Mama Put Express', owner: 'Nkechi Obi', phone: '+234 803 555 2214', email: 'owner@mamaputexpress.ng', type: 'Food & Beverage', location: 'Surulere, Lagos', joined: 'Aug 15, 2026', status: 'Active', volume: 21_700_000, txns: 4812, customers: 1290, pointsIssued: 4_340_000, lastActive: 'Today · 1:12pm', password: 'nuM-8842-XK', bounty: 20_000, commissionPct: 0.3 },
  { id: 'MCH-102', name: 'Zobo & Co.', owner: 'Zainab Bello', phone: '+234 905 555 8830', email: 'zainab@zoboandco.ng', type: 'Food & Beverage', location: 'Lekki, Lagos', joined: 'Sep 1, 2026', status: 'Active', volume: 8_900_000, txns: 2104, customers: 640, pointsIssued: 1_780_000, lastActive: 'Today · 11:40am', password: 'nuM-2210-QA', bounty: 20_000, commissionPct: 0.3 },
  { id: 'MCH-103', name: 'Grills In & Out', owner: 'Tunde Adeyemi', phone: '+234 701 555 4521', email: 'tunde@grillsinout.ng', type: 'Food & Beverage', location: 'Yaba, Lagos', joined: 'Sep 12, 2026', status: 'Pending activation', volume: 0, txns: 0, customers: 0, pointsIssued: 0, lastActive: 'Never', password: 'nuM-5591-TZ', bounty: 20_000, commissionPct: 0.35 },
  { id: 'MCH-104', name: 'Adeola Fabrics', owner: 'Adeola Johnson', phone: '+234 812 555 9087', email: 'adeola@adeolafabrics.ng', type: 'Retail', location: 'Balogun, Lagos', joined: 'Sep 18, 2026', status: 'Active', volume: 4_200_000, txns: 986, customers: 410, pointsIssued: 840_000, lastActive: 'Yesterday · 4:03pm', password: 'nuM-7734-BM', bounty: 25_000, commissionPct: 0.4 },
  { id: 'MCH-105', name: 'Chop Life Kitchen', owner: 'Emeka Nwosu', phone: '+234 706 555 3312', email: 'emeka@choplifekitchen.ng', type: 'Food & Beverage', location: 'Festac, Lagos', joined: 'Sep 24, 2026', status: 'Active', volume: 6_100_000, txns: 1455, customers: 522, pointsIssued: 1_220_000, lastActive: 'Today · 9:26am', password: 'nuM-3108-CD', bounty: 20_000, commissionPct: 0.3 },
]

export const resellerWalletTxns: ResellerWalletTxn[] = [
  { id: 'WTX-2201', date: 'Sep 26, 2026 · 11:59pm', day: '2026-09-26', description: 'Commission — settlement batch SET-2026-0926', ref: 'SET-2026-0926', direction: 'credit', status: 'Completed', method: 'Settlement', amount: 812_400, balance: 2_440_000, batchId: 'SET-2026-0926' },
  { id: 'WTX-2198', date: 'Sep 26, 2026 · 2:14pm', day: '2026-09-26', description: 'Activation bounty — Adeola Fabrics', ref: 'BNY-8841', direction: 'credit', status: 'Completed', method: 'Bounty', amount: 25_000, balance: 1_627_600 },
  { id: 'WTX-2187', date: 'Sep 25, 2026 · 11:59pm', day: '2026-09-25', description: 'Commission — settlement batch SET-2026-0925', ref: 'SET-2026-0925', direction: 'credit', status: 'Completed', method: 'Settlement', amount: 764_200, balance: 1_602_600, batchId: 'SET-2026-0925' },
  { id: 'WTX-2190', date: 'Sep 25, 2026 · 4:02pm', day: '2026-09-25', description: 'Withdrawal to GTBank ••7788', ref: 'NIP-55521', direction: 'debit', status: 'Completed', method: 'Bank transfer', amount: -1_500_000, balance: 838_400 },
  { id: 'WTX-2180', date: 'Sep 24, 2026 · 11:59pm', day: '2026-09-24', description: 'Commission — settlement batch SET-2026-0924', ref: 'SET-2026-0924', direction: 'credit', status: 'Completed', method: 'Settlement', amount: 798_100, balance: 2_338_400, batchId: 'SET-2026-0924' },
  { id: 'WTX-2174', date: 'Sep 24, 2026 · 10:31am', day: '2026-09-24', description: 'Activation bounty — Chop Life Kitchen', ref: 'BNY-8790', direction: 'credit', status: 'Completed', method: 'Bounty', amount: 20_000, balance: 1_540_300 },
  { id: 'WTX-2165', date: 'Sep 23, 2026 · 11:59pm', day: '2026-09-23', description: 'Commission — settlement batch SET-2026-0923', ref: 'SET-2026-0923', direction: 'credit', status: 'Completed', method: 'Settlement', amount: 701_800, balance: 1_520_300, batchId: 'SET-2026-0923' },
  { id: 'WTX-2151', date: 'Sep 22, 2026 · 11:59pm', day: '2026-09-22', description: 'Commission — settlement batch SET-2026-0922', ref: 'SET-2026-0922', direction: 'credit', status: 'Pending', method: 'Settlement', amount: 725_600, balance: 818_500, batchId: 'SET-2026-0922' },
  { id: 'WTX-2158', date: 'Sep 22, 2026 · 1:20pm', day: '2026-09-22', description: 'Withdrawal to GTBank ••7788', ref: 'NIP-54987', direction: 'debit', status: 'Completed', method: 'Bank transfer', amount: -2_000_000, balance: 92_900 },
  { id: 'WTX-2144', date: 'Sep 21, 2026 · 9:12am', day: '2026-09-21', description: 'Wallet funding — Payonus MFB ••8830', ref: 'FND-44120', direction: 'credit', status: 'Completed', method: 'Bank transfer', amount: 500_000, balance: 2_092_900 },
]

const batchTxns = (batch: string, rows: [string, string, number, number, string][]): BatchTxn[] =>
  rows.map(([businessId, business, volume, pct, time], i) => ({
    id: `${batch}-T${i + 1}`,
    businessId,
    business,
    ref: `TXN-88${410 - i * 7}`,
    volume,
    commissionPct: pct,
    commission: Math.round(volume * (pct / 100)),
    time,
  }))

export const resellerSettlementBatches: SettlementBatch[] = [
  {
    id: 'SET-2026-0926', date: 'Sep 26, 2026', day: '2026-09-26', merchants: 29, txnCount: 1194, gross: 826_400, fee: 14_000, net: 812_400, status: 'Settled',
    txns: batchTxns('SET-2026-0926', [
      ['MCH-101', 'Mama Put Express', 2_140_000, 0.3, '11:58pm'],
      ['MCH-102', 'Zobo & Co.', 986_000, 0.3, '11:58pm'],
      ['MCH-105', 'Chop Life Kitchen', 812_000, 0.3, '11:58pm'],
      ['MCH-104', 'Adeola Fabrics', 512_000, 0.4, '11:58pm'],
      ['MCH-118', 'Iya Basira Foods', 448_000, 0.3, '11:58pm'],
      ['MCH-122', 'De-Choice Supermart', 391_000, 0.35, '11:58pm'],
      ['MCH-131', 'Korede Phones', 287_000, 0.3, '11:58pm'],
    ]),
  },
  {
    id: 'SET-2026-0925', date: 'Sep 25, 2026', day: '2026-09-25', merchants: 29, txnCount: 1162, gross: 777_900, fee: 13_700, net: 764_200, status: 'Settled',
    txns: batchTxns('SET-2026-0925', [
      ['MCH-101', 'Mama Put Express', 2_012_000, 0.3, '11:58pm'],
      ['MCH-105', 'Chop Life Kitchen', 844_000, 0.3, '11:58pm'],
      ['MCH-102', 'Zobo & Co.', 901_000, 0.3, '11:58pm'],
      ['MCH-104', 'Adeola Fabrics', 476_000, 0.4, '11:58pm'],
      ['MCH-118', 'Iya Basira Foods', 402_000, 0.3, '11:58pm'],
    ]),
  },
  {
    id: 'SET-2026-0924', date: 'Sep 24, 2026', day: '2026-09-24', merchants: 28, txnCount: 1180, gross: 812_300, fee: 14_200, net: 798_100, status: 'Settled',
    txns: batchTxns('SET-2026-0924', [
      ['MCH-101', 'Mama Put Express', 2_088_000, 0.3, '11:58pm'],
      ['MCH-102', 'Zobo & Co.', 934_000, 0.3, '11:58pm'],
      ['MCH-104', 'Adeola Fabrics', 501_000, 0.4, '11:58pm'],
      ['MCH-131', 'Korede Phones', 322_000, 0.3, '11:58pm'],
    ]),
  },
  {
    id: 'SET-2026-0923', date: 'Sep 23, 2026', day: '2026-09-23', merchants: 28, txnCount: 1091, gross: 715_000, fee: 13_200, net: 701_800, status: 'Settled',
    txns: batchTxns('SET-2026-0923', [
      ['MCH-101', 'Mama Put Express', 1_908_000, 0.3, '11:58pm'],
      ['MCH-105', 'Chop Life Kitchen', 766_000, 0.3, '11:58pm'],
      ['MCH-102', 'Zobo & Co.', 812_000, 0.3, '11:58pm'],
    ]),
  },
  {
    id: 'SET-2026-0922', date: 'Sep 22, 2026', day: '2026-09-22', merchants: 28, txnCount: 1055, gross: 738_800, fee: 13_200, net: 725_600, status: 'Processing',
    txns: batchTxns('SET-2026-0922', [
      ['MCH-101', 'Mama Put Express', 1_977_000, 0.3, '11:58pm'],
      ['MCH-104', 'Adeola Fabrics', 489_000, 0.4, '11:58pm'],
      ['MCH-118', 'Iya Basira Foods', 366_000, 0.3, '11:58pm'],
    ]),
  },
]
