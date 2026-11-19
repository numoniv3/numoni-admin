import { type Campaign } from '@/lib/api/numoni/types/platform'

export const tone: Record<Campaign['status'], 'green' | 'orange' | 'red' | 'neutral' | 'purple'> = {
  Live: 'green', Paused: 'orange', Draft: 'neutral', Ended: 'neutral', 'Pending Approval': 'purple',
}
