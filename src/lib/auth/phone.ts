/** `+234 803 555 0142` / `2348035550142` / `8035550142` → `08035550142`, the Gateway's format. */
export function toLocalPhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('234')) return '0' + digits.slice(3)
  if (digits.length === 10 && !digits.startsWith('0')) return '0' + digits
  return digits
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export const isPhone = (v: string) => toLocalPhone(v).length >= 11

/** `08035550142` → `+234 803 555 0142` for display. */
export function displayPhone(phone: string): string {
  const local = toLocalPhone(phone)
  if (local.length !== 11) return phone
  const n = local.slice(1)
  return `+234 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`
}

/** Phone or email, as the Gateway's login body expects it. */
export function toIdentifier(input: string): { phone: string } | { email: string } {
  return isEmail(input) ? { email: input.trim().toLowerCase() } : { phone: toLocalPhone(input) }
}
