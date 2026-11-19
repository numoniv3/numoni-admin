

export const fmtNaira = (n: number, decimals = 2) =>
  '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

export const fmtNairaCompact = (n: number) => {
  if (Math.abs(n) >= 1e9) return '₦' + (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return '₦' + (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return '₦' + (n / 1e3).toFixed(1) + 'K'
  return fmtNaira(n, 0)
}

export const fmtPts = (n: number) => n.toLocaleString('en-NG') + ' pt'

export const fmtNum = (n: number) => n.toLocaleString('en-NG')

export const fmtCompact = (n: number) => {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(n)
}

export const ptsToNaira = (pts: number) => fmtNaira(pts, 0)

export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()

export const timeAgo = (mins: number) => {
  if (mins < 60) return `${mins}m ago`
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`
  return `${Math.floor(mins / 1440)}d ago`
}
