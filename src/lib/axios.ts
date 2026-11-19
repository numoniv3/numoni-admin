import axios, { isAxiosError } from 'axios'
import { API_URL } from '@/lib/config'
import { getAccessToken, useSession } from '@/store/use-session-store'

/**
 * The one HTTP client every `*.api.ts` function goes through for endpoints that
 * aren't mocked — see `API_MODE` in `src/lib/config.ts`.
 */
export const axiosClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// The session token is held in memory by the session store (its durable copy
// is an httpOnly cookie the browser can't read) — never in localStorage.
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A token the Gateway rejects is spent — drop the session so the app's gate
// shows its sign-in screen.
axiosClient.interceptors.response.use(undefined, (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401 && getAccessToken()) void useSession.getState().signOut()
  return Promise.reject(error)
})
