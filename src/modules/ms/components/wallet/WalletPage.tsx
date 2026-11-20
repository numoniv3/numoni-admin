'use client'

import { SectionTitle } from '@/components/ui/kit'
import { WalletPanel } from './WalletPanel'

/** The console's wallet page (merchant, brand, enterprise, reseller). */
export function WalletPage() {
  return (
    <div>
      <SectionTitle title="Wallet & Settlement" sub="Your nuMoni wallet — fund it by bank transfer, get paid by QR, and withdraw to your bank." />
      <WalletPanel />
    </div>
  )
}
