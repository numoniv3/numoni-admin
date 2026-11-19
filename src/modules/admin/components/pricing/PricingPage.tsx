'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { SectionTitle } from '@/components/ui/kit'
import { Button } from '@/components/ui/button'
import { ServicePricingCard } from '@/modules/admin/components/pricing/ServicePricingCard'
import { LiveExampleCard } from '@/modules/admin/components/pricing/LiveExampleCard'
import { RewardTiersCard } from '@/modules/admin/components/pricing/RewardTiersCard'
import { ConversionRatesCard } from '@/modules/admin/components/pricing/ConversionRatesCard'

export function PricingPage() {
  const [sellRate, setSellRate] = useState(0.92)
  const [v1Tier, setV1Tier] = useState(5)

  return (
    <div>
      <SectionTitle
        title="Pricing & Rates"
        sub="Conversion rates, V1 reward tiers, and per-service pricing — every change hits the audit log."
        right={
          <Button onClick={() => toast.success('Pricing published', { description: 'Rates live across all rails · audit entry written' })} className="rounded-full bg-brand text-black hover:bg-brand/90 font-semibold">
            <Save className="h-4 w-4 mr-1.5" /> Publish changes
          </Button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Conversion rates */}
        <ConversionRatesCard sellRate={sellRate} setSellRate={setSellRate} />

        {/* V1 tiers */}
        <RewardTiersCard setV1Tier={setV1Tier} v1Tier={v1Tier} />

        {/* Live example */}
        <LiveExampleCard sellRate={sellRate} v1Tier={v1Tier} />
      </div>

      {/* Service pricing configurator */}
      <ServicePricingCard />
    </div>
  )
}
