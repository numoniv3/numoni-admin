/*
 * Wallet settings the spec doesn't pin down. Change them here.
 *
 * - `NAIRA_PER_POINT`: buy-points and settlements take points; the screens
 *   show Naira. Assumed 1 point = ₦1.
 * - `BANK_CODE_FORMAT`: which bank code the payout endpoints expect — the
 *   6-digit NIP institution code or the 3-digit CBN code. Name enquiry always
 *   runs before a payout, so a wrong format fails there, before money moves.
 */

export const NAIRA_PER_POINT = 1
export const BANK_CODE_FORMAT: 'nip' | 'cbn' = 'nip'

export const toNaira = (points: string | number) => Number(points) * NAIRA_PER_POINT
export const toPoints = (naira: number) => (naira / NAIRA_PER_POINT).toFixed(2)

/** Nigerian banks with their NIP institution and CBN codes. */
export const BANKS: { name: string; nip: string; cbn: string }[] = [
  { name: 'Access Bank', nip: '000014', cbn: '044' },
  { name: 'Citibank', nip: '000009', cbn: '023' },
  { name: 'Ecobank', nip: '000010', cbn: '050' },
  { name: 'Fidelity Bank', nip: '000007', cbn: '070' },
  { name: 'First Bank', nip: '000016', cbn: '011' },
  { name: 'FCMB', nip: '000003', cbn: '214' },
  { name: 'Globus Bank', nip: '000027', cbn: '00103' },
  { name: 'GTBank', nip: '000013', cbn: '058' },
  { name: 'Heritage Bank', nip: '000020', cbn: '030' },
  { name: 'Jaiz Bank', nip: '000006', cbn: '301' },
  { name: 'Keystone Bank', nip: '000002', cbn: '082' },
  { name: 'Kuda', nip: '090267', cbn: '50211' },
  { name: 'Moniepoint', nip: '090405', cbn: '50515' },
  { name: 'OPay', nip: '100004', cbn: '999992' },
  { name: 'PalmPay', nip: '100033', cbn: '999991' },
  { name: 'Polaris Bank', nip: '000008', cbn: '076' },
  { name: 'Providus Bank', nip: '000023', cbn: '101' },
  { name: 'Stanbic IBTC', nip: '000012', cbn: '221' },
  { name: 'Standard Chartered', nip: '000021', cbn: '068' },
  { name: 'Sterling Bank', nip: '000001', cbn: '232' },
  { name: 'SunTrust Bank', nip: '000022', cbn: '100' },
  { name: 'Titan Trust Bank', nip: '000025', cbn: '102' },
  { name: 'Union Bank', nip: '000018', cbn: '032' },
  { name: 'UBA', nip: '000004', cbn: '033' },
  { name: 'Unity Bank', nip: '000011', cbn: '215' },
  { name: 'Wema Bank', nip: '000017', cbn: '035' },
  { name: 'Zenith Bank', nip: '000015', cbn: '057' },
]

export const bankCode = (b: { nip: string; cbn: string }) => (BANK_CODE_FORMAT === 'nip' ? b.nip : b.cbn)
