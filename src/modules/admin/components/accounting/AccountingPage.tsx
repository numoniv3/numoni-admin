'use client'

import { useState } from 'react'
import {
  Plus
} from 'lucide-react'
import { SectionTitle } from '@/components/ui/kit'
import { ExportCsvButton } from '@/components/ui/export-csv-button'
import { Button } from '@/components/ui/button'
import { useAdminAccountingQuery } from '../../api/useAdminQueries'
import { JournalEntrySheet } from '@/modules/admin/components/accounting/JournalEntrySheet'
import { WalletReconciliationTab } from '@/modules/admin/components/accounting/WalletReconciliationTab'
import { BankReconciliationTab } from '@/modules/admin/components/accounting/BankReconciliationTab'
import { FinancialStatementsTab } from '@/modules/admin/components/accounting/FinancialStatementsTab'
import { JournalTab } from '@/modules/admin/components/accounting/JournalTab'
import { ChartOfAccountsTab } from '@/modules/admin/components/accounting/ChartOfAccountsTab'
import { AccountingOverviewTab } from '@/modules/admin/components/accounting/AccountingOverviewTab'

type Tab = 'overview' | 'chart' | 'journal' | 'statements' | 'bank' | 'wallet'

export function AccountingPage() {
  const { data: { chartOfAccounts: CHART, journalEntries: JOURNAL_SEED, monthTrend: MONTH_TREND, bankAccounts: BANKS, unmatched: UNMATCHED_SEED, walletSides: WALLET_SIDES, walletDrift: WALLET_DRIFT, walletChecks: WALLET_CHECKS } } = useAdminAccountingQuery()
  const [tab, setTab] = useState<Tab>('overview')
  const [journal, setJournal] = useState(JOURNAL_SEED)
  const [unmatched, setUnmatched] = useState(UNMATCHED_SEED)
  const [jeOpen, setJeOpen] = useState(false)

  const revenue = CHART.filter((a) => a.cls === 'Revenue').reduce((s, a) => s + a.balance, 0)
  const cogs = CHART.filter((a) => a.cls === 'COGS').reduce((s, a) => s + a.balance, 0)
  const opex = CHART.filter((a) => a.cls === 'Expense').reduce((s, a) => s + a.balance, 0)
  const gross = revenue - cogs
  const net = gross - opex
  const assets = CHART.filter((a) => a.cls === 'Asset').reduce((s, a) => s + a.balance, 0)
  const liabilities = CHART.filter((a) => a.cls === 'Liability').reduce((s, a) => s + a.balance, 0)
  const equity = CHART.filter((a) => a.cls === 'Equity').reduce((s, a) => s + a.balance, 0)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'chart', label: 'Chart of accounts' },
    { id: 'journal', label: 'Journal entries' },
    { id: 'statements', label: 'Financial statements' },
    { id: 'bank', label: 'Bank & reconciliation' },
    { id: 'wallet', label: 'Wallet reconciliation' },
  ]

  return (
    <div>
      <SectionTitle
        title="Accounting"
        sub="Double-entry books — every point, payout and fee lands here. Assets always equal liabilities + equity."
        right={
          <div className="flex items-center gap-2">
            <ExportCsvButton
              filename={`numoni-trial-balance-oct-2026`}
              headers={['Code', 'Account', 'Class', 'Normal balance', 'Balance (₦)']}
              rows={CHART.map((a) => [a.code, a.name, a.cls, a.normal, a.balance])}
            />
            <Button size="sm" onClick={() => setJeOpen(true)} className="bg-brand text-black hover:bg-brand/90 font-bold"><Plus className="h-4 w-4 mr-1.5" /> Journal entry</Button>
          </div>
        }
      />

      <div className="flex gap-1.5 mb-5 rounded-full border p-1 w-fit flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-full px-4 h-8 text-xs font-bold transition-colors ${tab === t.id ? 'bg-brand text-black' : 'text-muted-foreground hover:text-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <AccountingOverviewTab assets={assets} cogs={cogs} equity={equity} gross={gross} liabilities={liabilities} monthTrend={MONTH_TREND} net={net} opex={opex} revenue={revenue} />
      )}

      {/* ── CHART OF ACCOUNTS ── */}
      {tab === 'chart' && (
        <ChartOfAccountsTab accounts={CHART} />
      )}

      {/* ── JOURNAL ENTRIES ── */}
      {tab === 'journal' && (
        <JournalTab journal={journal} />
      )}

      {/* ── FINANCIAL STATEMENTS ── */}
      {tab === 'statements' && (
        <FinancialStatementsTab accounts={CHART} assets={assets} equity={equity} gross={gross} liabilities={liabilities} net={net} revenue={revenue} />
      )}

      {/* ── BANK & RECONCILIATION ── */}
      {tab === 'bank' && (
        <BankReconciliationTab bankAccounts={BANKS} setUnmatched={setUnmatched} unmatched={unmatched} />
      )}

      {/* ── WALLET RECONCILIATION ── */}
      {tab === 'wallet' && <WalletReconciliationTab accounts={CHART} walletChecks={WALLET_CHECKS} walletDrift={WALLET_DRIFT} walletSides={WALLET_SIDES} />}

      {/* ── NEW JOURNAL ENTRY ── */}
      <JournalEntrySheet accounts={CHART} jeOpen={jeOpen} setJeOpen={setJeOpen} setJournal={setJournal} />
    </div>
  )
}
