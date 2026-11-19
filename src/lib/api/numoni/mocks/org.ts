// ── Organisation console fixtures: Lagos West Partners (reseller), Sabo Foods
// (brand) and Chicken Republic (enterprise). Served by `org.api.ts`.
import type {
  OrgCardOrder, OrgComplianceUsage, OrgId, OrgIssuedCard, OrgProfile, OrgTeamMember, OrgUnit,
} from '../types/org'

interface OrgFixture {
  /** Short trading name shown on compliance and reward-card screens. */
  displayName: string
  profile: OrgProfile
  units: OrgUnit[]
  team: OrgTeamMember[]
  usage: OrgComplianceUsage
}

export const orgs: Record<OrgId, OrgFixture> = {
  reseller: {
    displayName: 'Lagos West Partners',
    profile: {
      name: 'Lagos West Partners',
      what: 'distribution',
      phone: '+234 901 555 2210',
      email: 'yetunde@lagoswest.ng',
      address: '14 Bode Thomas Street, Surulere',
      location: 'lw',
      whatOptions: [['distribution', 'Distribution & agency'], ['retail', 'Retail & groceries'], ['food', 'Food & restaurant'], ['services', 'Services']],
      locationOptions: [['lw', 'Lagos West'], ['le', 'Lagos East'], ['fct', 'FCT Abuja']],
    },
    units: [
      { id: 'RG-LW', name: 'Lagos West', location: 'Surulere hub' },
      { id: 'RG-LE', name: 'Lagos East', location: 'Lekki hub' },
      { id: 'RG-FCT', name: 'FCT Abuja', location: 'Wuse II hub' },
    ],
    team: [
      { id: 'TM-1', name: 'Yetunde Alabi', phone: '+234 901 555 2210', role: 'Owner', permissions: ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards', 'Manage team', 'Export data'], status: 'Active', added: 'Mar 2025' },
      { id: 'TM-2', name: 'Seun A.', phone: '+234 810 442 9087', role: 'Manager', unitId: 'RG-LW', permissions: ['View transactions', 'Manage rewards'], status: 'Active', added: 'May 2025' },
      { id: 'TM-3', name: 'Amara O.', phone: '+234 705 331 6620', role: 'Analyst', unitId: 'RG-LE', permissions: ['View transactions', 'Export data'], status: 'Active', added: 'Feb 2026' },
      { id: 'TM-4', name: 'Ibrahim K.', phone: '+234 803 990 1274', role: 'Cashier', permissions: ['Process sales'], status: 'Invited', added: 'Oct 2026' },
    ],
    usage: { customers: 38, txnsMonth: 1_240_000, largestWithdrawal: 88_000 },
  },
  brand: {
    displayName: 'Sabo Foods',
    profile: {
      name: 'Sabo Foods Ltd',
      what: 'fmcg',
      phone: '+234 700 555 0180',
      email: 'trade@sabofoods.ng',
      address: 'Plot 7, Agbara Industrial Estate, Ogun',
      location: 'lagos',
      whatOptions: [['fmcg', 'FMCG manufacturer'], ['beverages', 'Beverages'], ['personal-care', 'Personal care'], ['retail', 'Retail chain']],
      locationOptions: [['lagos', 'Lagos'], ['ogun', 'Ogun'], ['abuja', 'FCT Abuja'], ['kano', 'Kano']],
    },
    units: [
      { id: 'CMP-JOLLOF', name: 'Sabo Jollof Season', location: 'National' },
      { id: 'CMP-NOODLES', name: 'Sabo Instant Noodles', location: 'North + West' },
      { id: 'CMP-OIL', name: 'Sabo Pure Oil', location: 'Lagos pilot' },
    ],
    team: [
      { id: 'TM-1', name: 'Olayide Sanni', phone: '+234 700 555 0180', role: 'Owner', permissions: ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards', 'Manage team', 'Export data'], status: 'Active', added: 'Jan 2025' },
      { id: 'TM-2', name: 'Ngozi E.', phone: '+234 812 300 4451', role: 'Manager', unitId: 'CMP-JOLLOF', permissions: ['View transactions', 'Manage rewards', 'Export data'], status: 'Active', added: 'Mar 2025' },
      { id: 'TM-3', name: 'Danladi M.', phone: '+234 905 211 7783', role: 'Analyst', unitId: 'CMP-NOODLES', permissions: ['View transactions', 'Export data'], status: 'Active', added: 'Aug 2025' },
    ],
    usage: { customers: 4210, txnsMonth: 18_400_000, largestWithdrawal: 4_200_000 },
  },
  enterprise: {
    displayName: 'Chicken Republic',
    profile: {
      name: 'Chicken Republic',
      what: 'qsr',
      phone: '+234 800 200 4455',
      email: 'digital@chicken-republic.com',
      address: '114B Ilupeju Industrial Avenue, Lagos',
      location: 'lagos',
      whatOptions: [['qsr', 'Quick-service restaurant'], ['retail-chain', 'Retail chain'], ['fintech', 'Fintech / embedded finance'], ['telco', 'Telco & digital']],
      locationOptions: [['lagos', 'Lagos (HQ)'], ['abuja', 'FCT Abuja'], ['ph', 'Port Harcourt'], ['kano', 'Kano']],
    },
    units: [
      { id: 'WUSE', name: 'Wuse II', location: 'Abuja · FCT' },
      { id: 'LEKKI', name: 'Lekki Phase 1', location: 'Lagos' },
      { id: 'IKEJA', name: 'Ikeja GRA', location: 'Lagos' },
    ],
    team: [
      { id: 'TM-1', name: 'Deji Akande', phone: '+234 800 200 4455', role: 'Owner', permissions: ['Process sales', 'Issue refunds', 'View transactions', 'Manage rewards', 'Manage team', 'Export data'], status: 'Active', added: 'Jan 2024' },
      { id: 'TM-2', name: 'Halima Y.', phone: '+234 701 448 2290', role: 'Manager', unitId: 'WUSE', permissions: ['View transactions', 'Manage rewards'], status: 'Active', added: 'Jun 2024' },
      { id: 'TM-3', name: 'Tobi A.', phone: '+234 909 112 8804', role: 'Analyst', unitId: 'LEKKI', permissions: ['View transactions', 'Export data'], status: 'Active', added: 'Jan 2026' },
    ],
    usage: { customers: 42180, txnsMonth: 96_400_000, largestWithdrawal: 4_800_000 },
  },
}

/** Reward-card print orders; design file names carry the organisation's name. */
export function orgCardOrders(orgName: string): OrgCardOrder[] {
  const slug = orgName.toLowerCase().replace(/\s+/g, '-')
  return [
    { id: 'CRO-101', design: `${slug}-card-v2.png`, quantity: 200, unitPrice: 850, total: 170_000, status: 'Delivered', created: 'Sep 08, 2026' },
    { id: 'CRO-102', design: `${slug}-festive.png`, quantity: 100, unitPrice: 850, total: 85_000, status: 'In production', created: 'Oct 02, 2026' },
  ]
}

/** The cards issued to customers — the same five holders for every organisation. */
export function orgIssuedCards(prefix: string): OrgIssuedCard[] {
  const holders = [['Chidinma O.', 'CUS-8841', 41, 388_400, 'Active'], ['Ngozi E.', 'CUS-2291', 34, 291_700, 'Active'], ['Fatima B.', 'CUS-6612', 12, 96_200, 'Frozen'], ['Blessing U.', 'CUS-1023', 9, 61_800, 'Active'], ['Emeka A.', 'CUS-7730', 5, 44_100, 'Active']] as const
  return holders.map(([holder, customerId, txns, totalSpent, status], i) => ({
    id: `${prefix}-${i + 1}`,
    serial: `5399 12•• •••• ${4102 - i * 1024}`,
    holder, customerId, status: status as 'Active' | 'Frozen', txns, totalSpent,
    lastUsed: ['Oct 6, 2026 · 1:18pm', 'Oct 6, 2026 · 2:41pm', 'Sep 28, 2026 · 4:02pm', 'Oct 5, 2026 · 6:12pm', 'Oct 3, 2026 · 8:41pm'][i],
    issuedOn: 'Aug 14, 2026',
  }))
}
