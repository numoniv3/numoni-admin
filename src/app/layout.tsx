import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { AppProviders } from '@/lib/providers/app-providers'
import './globals.css'

// Self-hosted by next/font. Tailwind and globals.css name the families
// directly ("Inter", "Space Grotesk") rather than via these CSS variables, so
// glyphs Inter lacks (→ and friends) fall through to system-ui exactly as they
// did with the Google Fonts <link> — next/font's variable would route them to
// its size-adjusted Arial fallback instead.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: "nuMoni Control Tower",
  description: "nuMoni Control Tower (head-office admin).",
  icons: { icon: '/numoni-logo.png' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
