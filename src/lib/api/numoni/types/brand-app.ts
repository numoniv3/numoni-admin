// ── White-label theme + customer brand-app state ─────────────────────────────
// One merchant (e.g. Chicken Republic) launches its OWN customer app on the
// nuMoni engine. The theme drives both the standalone app (/brandapp) and the
// live preview inside the Enterprise White-label Studio.

export interface WhiteLabelTheme {
  appName: string        // merchant / app name
  titleText: string      // header title shown under the name
  tagline: string        // home subtitle
  logoText: string       // 1–3 letter monogram
  primary: string        // accent colour (buttons, highlights)
  headerBg: string       // app header background
  headerText: string     // text colour on the header
  bodyBg: string         // app body background
  textColor: string      // body text colour
  showCard: boolean
  showCoupons: boolean
  showPoweredBy: boolean
}

// ── Brand-app wallet state ───────────────────────────────────────────────────
// Single brand wallet (₦ + brand points) — NOT the global nuMoni wallet.

export interface BrandAppActivity {
  id: string
  kind: 'payment' | 'funding' | 'reward' | 'coupon'
  title: string
  detail: string
  amount?: number     // ₦, negative = spend
  pts?: number        // brand points earned/burned
  time: string
  ref?: string
  location?: string
  fee?: number
  before?: number
  after?: number
  program?: string
}

export interface BrandAppCoupon {
  id: string
  code: string
  title: string
  value: string       // '₦1,000 off' / '10% off'
  source: string      // which campaign/reward issued it
  expiry: string
  used: boolean
}

export interface BrandAppNotice {
  id: string
  title: string
  body: string
  time: string
  kind: 'reward' | 'promo' | 'security'
  read: boolean
}

/** The customer's brand-wallet account — `GET /brand-app/account`. */
export interface BrandAppWorkspace {
  name: string
  balance: number
  pts: number
  activity: BrandAppActivity[]
  coupons: BrandAppCoupon[]
  notices: BrandAppNotice[]
}
