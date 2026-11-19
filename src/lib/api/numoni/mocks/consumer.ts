// ── Consumer app fixtures (the signed-in customer) ──────────────────────────
// Served by `consumer.api.ts` while API mocking is on. Shapes follow specs/numoni.json.
import type {
  ActivityItem, Address, BrandWallet, CardExpense, NearbyOffer, Notice, Order, PromoBanner, SupportFaq,
  WalkInBrand,
} from '../types/consumer'

export const consumerActivity: ActivityItem[] = [
  { id: 'a1', title: 'Chicken Republic — Lekki', sub: 'POS QR · Refuel Max + Chips', pts: -4500, kind: 'spend', time: 'Yesterday 1:24pm', before: 14890, after: 10390, rail: 'Offline', location: 'Chicken Republic, Admiralty Way, Lekki Phase 1', fee: 0, reward: 225, program: 'Lunch Rush 2× Points — spend 12pm–3pm, get 5% back into your Chicken Republic wallet (merchant-funded)', ref: 'NM-9F2K41XQ' },
  { id: 'a2', title: 'Reward earned', sub: 'Chicken Republic wallet · 5% back', pts: 225, kind: 'earn', time: 'Yesterday 1:24pm', before: 10390, after: 10390, rail: 'Offline', location: 'Chicken Republic, Admiralty Way, Lekki Phase 1', fee: 0, program: 'Lunch Rush 2× Points — 5% back into brand wallet', ref: 'NM-9F2K42XQ' },
  { id: 'a3', title: 'Wallet funding', sub: 'Bank transfer · GTBank ••4521', pts: 10500, kind: 'fund', time: 'Sep 25 · 9:02am', before: 4390, after: 14890, rail: 'Online', fee: 0, ref: 'NM-8E1C77XQ' },
  { id: 'a4', title: 'Charles Store', sub: 'Storefront · Golden Morn 900g', pts: -7200, kind: 'spend', time: 'Sep 24 · 6:41pm', before: 11590, after: 4390, rail: 'Online', fee: 0, reward: 144, program: 'First-timer Welcome 5% — 2% back on groceries', ref: 'NM-7D0B31XQ' },
  { id: 'a5', title: 'MedPlus Pharmacy — VI', sub: 'POS QR · Vitamin C 1000mg', pts: -6500, kind: 'spend', time: 'Sep 22 · 11:15am', before: 18090, after: 11590, rail: 'Offline', location: 'MedPlus Pharmacy, Adeola Odeku St, Victoria Island', fee: 0, ref: 'NM-6C9A20XQ' },
  { id: 'a6', title: 'Sabo Foods store', sub: 'Checkout rail · Tomato Paste ×12', pts: -9800, kind: 'spend', time: 'Sep 20 · 4:02pm', before: 27890, after: 18090, rail: 'Online', fee: 50, reward: 490, program: 'Sabo Jollof Season — verified SKU purchase grant (brand-funded)', ref: 'NM-5B8Z19XQ' },
  { id: 'a7', title: 'Tantalizers — Ikeja', sub: 'POS QR · Chicken Pie + Puff Puff', pts: -3100, kind: 'spend', time: 'Sep 18 · 12:40pm', before: 30990, after: 27890, rail: 'Offline', location: 'Tantalizers, Oba Akran Ave, Ikeja', fee: 0, reward: 93, program: 'Win-back Wednesdays — 3% back for returning customers', ref: 'NM-4A7Y88XQ' },
  { id: 'a8', title: 'Wallet funding', sub: 'Bank transfer · Payonus MFB', pts: 21000, kind: 'fund', time: 'Sep 16 · 8:11am', before: 9990, after: 30990, rail: 'Online', fee: 0, ref: 'NM-3Z6X54XQ' },
  { id: 'a9', title: 'Received from Emeka A.', sub: 'Point transfer · P2P', pts: 2500, kind: 'receive', time: 'Sep 14 · 7:55pm', before: 7490, after: 9990, rail: 'Online', fee: 10, ref: 'NM-2Y5W02XQ' },
  { id: 'a10', title: 'Wallet funding', sub: 'Bank transfer · GTBank ••4521', pts: 7700, kind: 'fund', time: 'Sep 12 · 10:30am', before: 0, after: 7490, rail: 'Online', fee: 0, ref: 'NM-1X4V61XQ' },
]

export const consumerBrandWallets: BrandWallet[] = [
  {
    merchant: 'Chicken Republic', balance: 1250, color: '#E03131', rule: '5% back on every order',
    coupons: [
      { id: 'c1', code: 'CR-10MAX', title: '10% off Refuel Max', value: 'Save up to ₦900', expiry: 'Oct 12', used: false },
      { id: 'c2', code: 'CR-CHIPS', title: 'Free chips with any meal', value: 'Worth ₦800', expiry: 'Sep 30', used: true },
    ],
    history: [
      { id: 'h1', title: 'Refuel Max + Chips', pts: -4500, time: 'Yesterday 1:24pm', location: 'Lekki Phase 1' },
      { id: 'h2', title: '5% reward earned', pts: 225, time: 'Yesterday 1:24pm', location: 'Lekki Phase 1' },
      { id: 'h3', title: 'Spicy ChickWiz ×2', pts: -3600, time: 'Sep 21 · 7:10pm', location: 'Admiralty Way, Lekki' },
      { id: 'h4', title: '5% reward earned', pts: 180, time: 'Sep 21 · 7:10pm', location: 'Admiralty Way, Lekki' },
      { id: 'h5', title: 'Citizens Meal', pts: -2800, time: 'Sep 15 · 1:02pm', location: 'Lekki Phase 1' },
    ],
  },
  {
    merchant: 'Slot', balance: 2180, color: '#0EA5E9', rule: '1% back on devices',
    coupons: [{ id: 'c3', code: 'SL-ACC500', title: '₦500 off accessories', value: 'Min. spend ₦5,000', expiry: 'Nov 1', used: false }],
    history: [
      { id: 'h6', title: 'Redmi Note 13 128GB', pts: -218000, time: 'Sep 8 · 3:22pm', location: 'Computer Village, Ikeja' },
      { id: 'h7', title: '1% reward earned', pts: 2180, time: 'Sep 8 · 3:22pm', location: 'Computer Village, Ikeja' },
    ],
  },
  {
    merchant: 'Tantalizers', balance: 640, color: '#EF4444', rule: '3% back weekdays',
    coupons: [{ id: 'c4', code: 'TT-FREEPIE', title: 'Free chicken pie', value: 'Spend ₦3,000+', expiry: 'Oct 5', used: false }],
    history: [
      { id: 'h8', title: 'Chicken Pie + Puff Puff', pts: -3100, time: 'Sep 18 · 12:40pm', location: 'Oba Akran, Ikeja' },
      { id: 'h9', title: '3% reward earned', pts: 93, time: 'Sep 18 · 12:40pm', location: 'Oba Akran, Ikeja' },
      { id: 'h10', title: 'Tantalizer Jollof', pts: -2200, time: 'Sep 9 · 2:18pm', location: 'Ikeja GRA' },
    ],
  },
  {
    merchant: 'Charles Store', balance: 480, color: '#7C5CBF', rule: '2% back on groceries',
    coupons: [],
    history: [
      { id: 'h11', title: 'Golden Morn 900g', pts: -7200, time: 'Sep 24 · 6:41pm', location: 'Wuse II, Abuja (storefront)' },
      { id: 'h12', title: '2% reward earned', pts: 144, time: 'Sep 24 · 6:41pm', location: 'Wuse II, Abuja (storefront)' },
    ],
  },
]

export const consumerNotices: Notice[] = [
  { id: 'n1', title: 'You earned 225 pt', body: 'Chicken Republic lunch rush reward landed in your brand wallet.', time: '1h ago', kind: 'reward', read: false },
  { id: 'n2', title: 'Order ORD-7814 is on the way', body: 'Emeka is 8 mins away — Refuel Max + Chips.', time: '2h ago', kind: 'order', read: false },
  { id: 'n3', title: 'New grant near you', body: 'Emzor Wellness: spend ₦10,000 at any Lekki pharmacy, get ₦2,000 back.', time: '5h ago', kind: 'promo', read: false },
  { id: 'n4', title: '5% funding bonus this weekend', body: 'Fund your Global Wallet and get 5% extra points instantly.', time: 'Yesterday', kind: 'promo', read: true },
  { id: 'n5', title: 'New sign-in on Chrome · Windows', body: 'Lagos, Nigeria · If this wasn\'t you, reset your PIN.', time: 'Sep 25', kind: 'security', read: true },
  { id: 'n6', title: 'KYC Tier 2 approved', body: 'Your daily limit is now ₦500,000.', time: 'Sep 24', kind: 'security', read: true },
]

export const consumerCardExpenses: CardExpense[] = [
  { id: 'ce1', merchant: 'Chicken Republic — Lekki', pts: -4500, time: 'Yesterday 1:24pm', status: 'Approved' },
  { id: 'ce2', merchant: 'MedPlus Pharmacy — VI', pts: -6500, time: 'Sep 22 · 11:15am', status: 'Approved' },
  { id: 'ce3', merchant: 'Tantalizers — Ikeja', pts: -3100, time: 'Sep 18 · 12:40pm', status: 'Approved' },
  { id: 'ce4', merchant: 'Unknown merchant · online', pts: -15200, time: 'Sep 17 · 2:03am', status: 'Declined' },
  { id: 'ce5', merchant: 'Charles Store', pts: -7200, time: 'Sep 14 · 6:41pm', status: 'Approved' },
]

export const consumerOrders: Order[] = [
  {
    id: 'ORD-7814', merchant: 'Chicken Republic — Lekki',
    items: [{ name: 'Refuel Max + Chips', qty: 1, price: 3600 }, { name: 'ChickWiz', qty: 1, price: 1900 }],
    subtotal: 5500, deliveryFee: 800, total: 6300, payWith: 'Global Wallet',
    address: 'Home — 12 Admiralty Way, Lekki Phase 1', stage: 2, placedAt: 'Today · 1:02pm', eta: '25–35 min', rider: 'Emeka O. · +234 810 442 7781',
  },
  {
    id: 'ORD-7702', merchant: 'Charles Store',
    items: [{ name: 'Golden Morn 900g', qty: 2, price: 6700 }],
    subtotal: 13400, deliveryFee: 1200, total: 14600, payWith: 'Global Wallet',
    address: 'Office — 4 Amino Kano Cres, Wuse II, Abuja', stage: 4, placedAt: 'Sep 24 · 5:30pm', eta: 'Delivered 6:12pm', rider: 'Blessing T. · +234 705 881 2234',
  },
]

export const consumerBalance: number = 10390

export const consumerArea: string = 'Lekki Phase 1, Lagos'

export const consumerRaffleTickets: number = 3

export const consumerAddresses: Address[] = [
    { id: 'ad1', label: 'Home', line: '12 Admiralty Way, Lekki Phase 1, Lagos' },
    { id: 'ad2', label: 'Office', line: '4 Amino Kano Crescent, Wuse II, Abuja' },
  ]

// ── In-app advert banners (overlapping, swipeable) ───────────────────────────
export const consumerPromoBanners: PromoBanner[] = [
  { id: 'ad1', tag: 'WEEKEND BOOST', title: 'Fund ₦10,000 — get 5% back instantly', sub: 'Points land the moment your transfer confirms', tone: 'emerald' },
  { id: 'ad2', tag: 'BRAND GRANT', title: 'Sabo Jollof Season — ₦500 off a carton', sub: 'Buy Sabo Tomato Paste ×12 at any partner store', tone: 'amber' },
  { id: 'ad3', tag: 'REFER & EARN', title: 'Invite a friend, you both get 500 pt', sub: 'No cap — every verified signup pays out', tone: 'violet' },
]

export const consumerWalkInBrands: WalkInBrand[] = [
  { name: 'Chicken Republic', area: 'Lekki Phase 1, Lagos', dist: '1.2 km', color: '#E03131', rule: '5% back on every order' },
  { name: 'Tantalizers', area: 'Ikeja GRA, Lagos', dist: '3.8 km', color: '#EF4444', rule: '3% back weekdays' },
  { name: 'Slot', area: 'Computer Village, Ikeja', dist: '4.4 km', color: '#0EA5E9', rule: '1% back on devices' },
  { name: 'MedPlus Pharmacy', area: 'Victoria Island, Lagos', dist: '2.6 km', color: '#10B981', rule: '2% back on wellness' },
  { name: 'Charles Store', area: 'Wuse II, Abuja', dist: '5.1 km', color: '#7C5CBF', rule: '2% back on groceries' },
  { name: 'Mama Put Express', area: 'Surulere, Lagos', dist: '6.9 km', color: '#E8A33D', rule: '1% back on meals' },
]

// ── SUPPORT ──────────────────────────────────────────────────────────────────
export const supportFaqs: SupportFaq[] = [
  { q: 'When do my points land after a bank transfer?', a: 'Instantly — the moment Payonus confirms your transfer you\'ll see the 5% bonus animation.' },
  { q: 'Why are brand points locked?', a: 'V2 rewards are funded by each merchant, so they can only be spent back at that merchant.' },
  { q: 'How do I become KYC Tier 3?', a: 'Upload a bank statement and proof of address under Profile → KYC tier. Approval is usually same-day.' },
  { q: 'My card was declined but I have points', a: 'Check Card → status. The system auto-freezes on unusual activity; unfreeze after verifying it was you.' },
]

export const consumerOfferCatalogue: NearbyOffer[] = [
  { id: 'of1', kind: 'deal', title: '20% off Refuel Max + Chips', brand: 'Chicken Republic', color: '#E03131', where: 'Admiralty Way, Lekki Phase 1', area: 'Lekki', dist: '1.2 km', spendReq: 'Buy a Refuel Max meal in-store', reward: '20% off at the till', expiry: 'Oct 12', model: 'V3', desc: 'Walk in, scan the POS QR and the discount applies automatically. Valid all day, every day until expiry.' },
  { id: 'of2', kind: 'grant', title: 'Spend ₦10,000 · get ₦2,000 back', brand: 'Emzor Wellness', color: '#0EA5E9', where: 'Any pharmacy in Lekki', area: 'Lekki', dist: '0.8 km', spendReq: 'Spend ₦10,000 on Emzor products at any partner pharmacy in Lekki', reward: '₦2,000 as points, funded by Emzor', expiry: 'Oct 31', model: 'V2', desc: 'A brand-funded segment grant. Buy any Emzor SKU (Paracetamol, Vitamin C, Wellness teas) and the grant credits automatically on redemption.' },
  { id: 'of3', kind: 'deal', title: '2× points at lunch', brand: 'Tantalizers', color: '#EF4444', where: 'Oba Akran Ave, Ikeja', area: 'Ikeja', dist: '3.8 km', spendReq: 'Pay between 12pm and 3pm', reward: 'Double points into your Tantalizers wallet', expiry: 'Nov 30', model: 'V2', desc: 'Every lunch-hour payment earns 2× the normal brand points. Stack with the free-pie coupon.' },
  { id: 'of4', kind: 'grant', title: '₦500 off Sabo Tomato Paste carton', brand: 'Sabo Foods', color: '#E8A33D', where: 'Charles Store, Wuse II & 14 partner shops', area: 'Wuse', dist: '5.1 km', spendReq: 'Buy Sabo Tomato Paste 400g ×12 at a partner store', reward: '₦500 instant grant at checkout', expiry: 'Oct 15', model: 'V3', desc: 'FMCG campaign: verified SKU purchase triggers an instant grant. Scan the product QR or pay at a partner till.' },
  { id: 'of5', kind: 'deal', title: 'Free chips with any meal', brand: 'Chicken Republic', color: '#E03131', where: 'All Lekki & VI outlets', area: 'Lekki', dist: '1.2 km', spendReq: 'Order any Citizens or Refuel meal', reward: 'Free chips added to your tray', expiry: 'Sep 30', model: 'V1', desc: 'Show your nuMoni QR when paying — chips are added free while stocks last.' },
  { id: 'of6', kind: 'grant', title: 'Weekend ₦1,000 grocery grant', brand: 'Charles Store', color: '#7C5CBF', where: 'Wuse II, Abuja', area: 'Wuse', dist: '5.1 km', spendReq: 'Spend ₦15,000 on groceries, Sat–Sun', reward: '₦1,000 back into your Global Wallet', expiry: 'Dec 31', model: 'V2', desc: 'Weekend carts over ₦15,000 earn a flat grant, every weekend until December.' },
  { id: 'of7', kind: 'deal', title: '7% off Redmi Note 13', brand: 'Slot', color: '#0EA5E9', where: 'Computer Village, Ikeja', area: 'Ikeja', dist: '4.4 km', spendReq: 'Buy any Redmi Note 13 in-store', reward: '7% off + 1% back in points', expiry: 'Oct 20', model: 'V3', desc: 'Device deal at the flagship store. Points earned stay locked to Slot for your next accessory.' },
]
