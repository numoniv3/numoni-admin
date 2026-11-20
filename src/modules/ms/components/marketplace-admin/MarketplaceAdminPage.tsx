'use client'

import { SectionTitle } from '@/components/ui/kit'
import { PageTabs } from '@/modules/ms/components/shared/bits'
import { BannersTab, SettingsTab, TaxonomyTab } from './AdminCatalog'
import { AuditTab, DashboardTab, FinanceTab, OwnersTab, ReportsTab, SalesTab, StoresTab } from './AdminLists'

/** Admin → Marketplace MS: dashboard, sales, stores, owners, reports, finance, banners, taxonomy, settings, audit log. */
export function MarketplaceAdminPage() {
  return (
    <div>
      <SectionTitle title="Marketplace" sub="Every store, sale and payout on the nuMoni marketplace (Marketplace MS)." />
      <PageTabs tabs={[
        { id: 'dashboard', label: 'Dashboard', content: <DashboardTab /> },
        { id: 'sales', label: 'Sales', content: <SalesTab /> },
        { id: 'stores', label: 'Stores', content: <StoresTab /> },
        { id: 'owners', label: 'Store owners', content: <OwnersTab /> },
        { id: 'reports', label: 'Reports', content: <ReportsTab /> },
        { id: 'finance', label: 'Finance', content: <FinanceTab /> },
        { id: 'banners', label: 'Hero banners', content: <BannersTab /> },
        { id: 'taxonomy', label: 'Taxonomy', content: <TaxonomyTab /> },
        { id: 'settings', label: 'Settings', content: <SettingsTab /> },
        { id: 'audit', label: 'Audit log', content: <AuditTab /> },
      ]} />
    </div>
  )
}
