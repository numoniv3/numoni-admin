'use client'

import type { CSSProperties, ReactNode } from 'react'

/** PDFs and photos — what the KYC document slots accept. */
export const DOCUMENT_TYPES = 'application/pdf,image/jpeg,image/png,image/webp'

/**
 * A document slot: renders `children` as the clickable tile and opens the file
 * picker on click. `onPick` gets the chosen file.
 */
export function DocumentInput({ onPick, className, style, children, accept = DOCUMENT_TYPES }: {
  onPick: (file: File) => void
  className?: string
  style?: CSSProperties
  children: ReactNode
  accept?: string
}) {
  return (
    <label className={className} style={style}>
      {children}
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
    </label>
  )
}
