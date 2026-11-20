import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { apiErrorMessage } from '@/lib/api/numoni/errors'
import { ensureOptIn, useSessionUser, type OptInService } from './ms-opt-in'

/*
 * Thin wrappers every microservice screen uses, so each endpoint is one line:
 * a read is `useMsQuery(key, fn)`, a write is `useMsAction(fn, { … })`.
 * `optIn` runs that service's opt-in once before the first call.
 */

export function useMsQuery<T>(key: readonly unknown[], fn: () => Promise<T>, opts: { enabled?: boolean; optIn?: OptInService } = {}) {
  const user = useSessionUser()
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      if (opts.optIn) await ensureOptIn(opts.optIn, user).catch(() => undefined)
      return fn()
    },
    enabled: opts.enabled ?? true,
    placeholderData: keepPreviousData,
  })
}

interface ActionOptions<A, R> {
  /** Toast on success; a function can name the record. */
  success?: string | ((result: R, args: A) => string)
  /** Toast title on failure; the Gateway's message is the description. */
  error: string
  /** Query keys (prefixes) to refetch afterwards. */
  invalidate?: readonly (readonly unknown[])[]
  optIn?: OptInService
  onSuccess?: (result: R, args: A) => void
}

export function useMsAction<A, R>(fn: (args: A) => Promise<R>, o: ActionOptions<A, R>) {
  const user = useSessionUser()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (args: A) => {
      if (o.optIn) await ensureOptIn(o.optIn, user)
      return fn(args)
    },
    onSuccess: (result, args) => {
      for (const key of o.invalidate ?? []) void queryClient.invalidateQueries({ queryKey: key })
      if (o.success) toast.success(typeof o.success === 'function' ? o.success(result, args) : o.success)
      o.onSuccess?.(result, args)
    },
    onError: (e) => toast.error(o.error, { description: apiErrorMessage(e) }),
  })
}
