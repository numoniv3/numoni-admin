import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getFunding, startFunding } from '@/lib/api/numoni/consumer.api'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { numoniKeys } from '@/lib/api/numoni/query-keys'
import type { Funding } from '@/lib/api/numoni/types/consumer'

/*
 * Customer Buy Points (`/consumer/funding`): start a purchase, then poll its
 * status — the Gateway re-checks the payment on every read while it's pending.
 */

const POLL_MS = 5_000
const settled = (f?: Funding) => !!f && (f.status === 'completed' || f.status === 'cancelled' || f.status === 'needs_recon')

/** `POST /consumer/funding` — one `idempotencyKey` per attempt so a double tap can't create two orders. */
export function useStartFunding() {
  return useMutation({
    mutationFn: ({ amount, idempotencyKey }: { amount: string; idempotencyKey: string }) => startFunding(amount, idempotencyKey),
    onError: (e) => toast.error('Couldn’t start the purchase', { description: apiErrorMessage(e) }),
  })
}

/** `GET /consumer/funding/{id}`, every 5 s until the purchase completes, is cancelled or needs review. */
export function useFundingStatus(id: string | null, initial?: Funding) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: numoniKeys.consumer.funding(id ?? ''),
    queryFn: async () => {
      const f = await getFunding(id!)
      // Points landed: refresh the balance, wallet and activity everywhere.
      if (f.status === 'completed') {
        void queryClient.invalidateQueries({ queryKey: numoniKeys.consumer.all })
        void queryClient.invalidateQueries({ queryKey: numoniKeys.wallet.all })
      }
      return f
    },
    enabled: !!id,
    initialData: initial,
    initialDataUpdatedAt: 0,
    refetchInterval: (q) => (settled(q.state.data) ? false : POLL_MS),
  })
}
