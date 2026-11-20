/*
 * Phone numbers are handled in international (E.164) format everywhere:
 * `+2348035550142`. The Gateway accepts it and stores numbers that way.
 */

/** Dialling codes offered by `PhoneInput`. Nigeria first — it's the default. */
export const COUNTRIES = [
  { iso: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' },
  { iso: 'GH', name: 'Ghana', dial: '233', flag: '🇬🇭' },
  { iso: 'KE', name: 'Kenya', dial: '254', flag: '🇰🇪' },
  { iso: 'ZA', name: 'South Africa', dial: '27', flag: '🇿🇦' },
  { iso: 'CI', name: 'Côte d’Ivoire', dial: '225', flag: '🇨🇮' },
  { iso: 'SN', name: 'Senegal', dial: '221', flag: '🇸🇳' },
  { iso: 'CM', name: 'Cameroon', dial: '237', flag: '🇨🇲' },
  { iso: 'RW', name: 'Rwanda', dial: '250', flag: '🇷🇼' },
  { iso: 'UG', name: 'Uganda', dial: '256', flag: '🇺🇬' },
  { iso: 'TZ', name: 'Tanzania', dial: '255', flag: '🇹🇿' },
  { iso: 'EG', name: 'Egypt', dial: '20', flag: '🇪🇬' },
  { iso: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
  { iso: 'US', name: 'United States / Canada', dial: '1', flag: '🇺🇸' },
  { iso: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
] as const

export type Country = (typeof COUNTRIES)[number]
export const DEFAULT_COUNTRY: Country = COUNTRIES[0]

/** The country a number's dialling code belongs to (longest code first). */
export function countryOf(e164: string): Country | undefined {
  const digits = e164.replace(/\D/g, '')
  return [...COUNTRIES].sort((a, b) => b.dial.length - a.dial.length).find((c) => digits.startsWith(c.dial))
}

/**
 * Any way a person types a number → E.164 (`+2348035550142`), or `''` when
 * there are no digits. Accepts `+234 803…`, `00234…`, `234…`, and a local
 * number (`0803…` / `803…`) in `country` (default Nigeria).
 */
export function toE164(input: string, country: Country = DEFAULT_COUNTRY): string {
  const trimmed = input.trim()
  let digits = trimmed.replace(/\D/g, '')
  if (!digits) return ''
  if (trimmed.startsWith('+')) return `+${digits}`
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  if (digits.startsWith(country.dial) && digits.length > country.dial.length + 6) return `+${digits}`
  if (digits.startsWith('0')) digits = digits.slice(1)
  return `+${country.dial}${digits}`
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

/** A plausible international number: 8–15 digits with a known or any code; Nigerian mobiles must be +234 + 10 digits. */
export function isPhone(v: string): boolean {
  if (isEmail(v)) return false
  const e = toE164(v)
  const digits = e.slice(1)
  if (digits.startsWith('234')) return /^234[789]\d{9}$/.test(digits)
  return digits.length >= 8 && digits.length <= 15
}

/** `+2348035550142` → `+234 803 555 0142` for display; other countries grouped after their code. */
export function displayPhone(phone: string): string {
  const e = toE164(phone)
  if (!e) return phone
  const c = countryOf(e)
  if (!c) return e
  const n = e.slice(1 + c.dial.length)
  const groups = n.length > 6 ? [n.slice(0, 3), n.slice(3, 6), n.slice(6)] : [n]
  return `+${c.dial} ${groups.join(' ')}`
}

/** @deprecated The Gateway takes E.164 — use `toE164`. `+2348035550142` → `08035550142`. */
export function toLocalPhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('234')) return '0' + digits.slice(3)
  if (digits.length === 10 && !digits.startsWith('0')) return '0' + digits
  return digits
}

/** Phone or email, as the Gateway's login body expects it — phones in E.164. */
export function toIdentifier(input: string): { phone: string } | { email: string } {
  return isEmail(input) ? { email: input.trim().toLowerCase() } : { phone: toE164(input) }
}
