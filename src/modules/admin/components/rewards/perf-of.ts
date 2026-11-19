import type { AdminRewardProgram as RewardProgram } from '@/lib/api/numoni/types/admin'

export const perfOf = (r: RewardProgram) => {
  const rate = r.issued > 0 ? r.redeemed / r.issued : 0
  return rate >= 0.5 ? 'Performing' : 'Less performing'
}
