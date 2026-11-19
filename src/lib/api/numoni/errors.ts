import { isAxiosError } from 'axios'

/**
 * A failed call's message for a toast or error screen: the Gateway's own
 * (`ApiErrorDto.message`, which can be a list of validation errors) when it
 * sent one, else the error's.
 */
export function apiErrorMessage(error: unknown): string {
  const message: unknown = isAxiosError(error) ? error.response?.data?.message : undefined
  if (Array.isArray(message)) return message.join('. ')
  if (typeof message === 'string' && message) return message
  if (isAxiosError(error) && !error.response) return 'No connection — check your network and try again'
  return error instanceof Error && error.message ? error.message : 'Something went wrong — try again'
}
