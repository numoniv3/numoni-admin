import { useState } from 'react'

/**
 * Upload progress for a submit button, so people don't retry or leave while a
 * logo or banner is still going up. Pass `onProgress` to the API call.
 */
export function useUploadProgress() {
  const [fraction, setFraction] = useState<number | null>(null)
  return {
    onProgress: (f: number) => setFraction(f),
    reset: () => setFraction(null),
    /** `idle` when nothing's uploading; otherwise "Uploading… 45%", then "Saving…" while the server finishes. */
    label: (idle: string) => (fraction === null ? idle : fraction < 1 ? `Uploading… ${Math.round(fraction * 100)}%` : 'Saving…'),
    busy: fraction !== null,
  }
}
