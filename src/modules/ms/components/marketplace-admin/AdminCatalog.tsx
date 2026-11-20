'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  useMkAddCategory, useMkAddSubcategories, useMkBanners, useMkCreateBanner, useMkDeleteBanner, useMkRemoveCategory, useMkRemoveSubcategories,
  useMkReplaceIndustryTaxonomy, useMkReplaceTaxonomy, useMkSetIndustries, useMkSetSubscription, useMkSetTags, useMkSettings, useMkSyncSearch,
  useMkTaxonomy, useMkTaxonomyFromPairs, useMkTaxonomyFromTriples, useMkUpdateBanner,
} from '@/modules/ms/api/useMarketplaceAdmin'
import { useTaxonomyReference } from '@/modules/ms/api/useStorefront'
import { ActionForm, ActionSheet, type Field } from '@/modules/ms/components/shared/ActionForm'
import { ConfirmButton, PageTabs, RowButton, useSheet } from '@/modules/ms/components/shared/bits'
import { DataView, listOf } from '@/modules/ms/components/shared/DataView'
import { QueryView } from '@/modules/ms/components/shared/QueryView'
import { ReadCard } from '@/modules/ms/components/shared/ReadCard'

const BANNER: Field[] = [
  { key: 'title', label: 'Title', required: true }, { key: 'subtitle', label: 'Subtitle' },
  { key: 'buttonText', label: 'Button text' }, { key: 'buttonUrl', label: 'Button link' },
  { key: 'category', label: 'Category' }, { key: 'subcategory', label: 'Subcategory' },
  { key: 'sortOrder', label: 'Order', kind: 'number' }, { key: 'isActive', label: 'Live', kind: 'switch' },
  { key: 'image', label: 'Image', kind: 'file', accept: 'image/*' },
]

export function BannersTab() {
  const q = useMkBanners()
  const create = useMkCreateBanner()
  const update = useMkUpdateBanner()
  const remove = useMkDeleteBanner()
  const sheet = useSheet<'new' | 'edit'>()
  return (
    <div>
      <div className="flex justify-end mb-3"><Button onClick={() => sheet.show('new')} className="rounded-full bg-brand text-black hover:bg-brand/90"><Plus className="h-4 w-4 mr-1.5" /> New banner</Button></div>
      <QueryView query={q}>
        {(d) => <DataView data={listOf(d) ?? []} columns={['title', 'subtitle', 'category', 'sortOrder', 'isActive', 'imageUrl']} empty="No banners"
          rowActions={(r) => (<><RowButton onClick={() => sheet.show('edit', r)}>Edit</RowButton><ConfirmButton danger label="Delete" title="Delete this banner?" description="It’s removed from the marketplace homepage." onConfirm={() => remove.mutate(String(r.id))} /></>)} />}
      </QueryView>
      <ActionSheet open={sheet.kind !== null} onOpenChange={sheet.onOpenChange} title={sheet.is('edit') ? 'Edit banner' : 'New banner'}
        fields={sheet.is('new') ? BANNER.map((f) => (f.key === 'image' ? { ...f, required: true } : f)) : BANNER} initial={sheet.target ?? { isActive: true }}
        submitLabel="Save banner" pending={create.isPending || update.isPending}
        onSubmit={(v) => (sheet.is('edit') ? update.mutate({ id: String(sheet.target!.id), body: v as never }, { onSuccess: sheet.close }) : create.mutate(v as never, { onSuccess: sheet.close }))} />
    </div>
  )
}

/** Rows of `a, b[, c]` text → objects. */
const rows = (text: string, keys: string[]) => text.split('\n').map((l) => l.split(',').map((s) => s.trim())).filter((p) => p.length >= keys.length && p.every(Boolean)).map((p) => Object.fromEntries(keys.map((k, i) => [k, p[i]])))

function TaxonomyEdit() {
  const add = useMkAddCategory()
  const remove = useMkRemoveCategory()
  const addSubs = useMkAddSubcategories()
  const removeSubs = useMkRemoveSubcategories()
  const replace = useMkReplaceTaxonomy()
  const replaceV2 = useMkReplaceIndustryTaxonomy()
  const pairs = useMkTaxonomyFromPairs()
  const triples = useMkTaxonomyFromTriples()
  const [mode, setMode] = useState<'add' | 'subs' | 'remove' | 'pairs' | 'triples' | 'json' | 'jsonV2'>('add')
  const forms = {
    add: { fields: [{ key: 'name', label: 'Category', required: true }, { key: 'subcategories', label: 'Subcategories', kind: 'list' }] as Field[], label: 'Add category', run: (v: Record<string, unknown>) => add.mutate({ name: String(v.name), subcategories: (v.subcategories as string[]) ?? [] }) },
    subs: { fields: [{ key: 'name', label: 'Category', required: true }, { key: 'subcategories', label: 'Subcategories', kind: 'list', required: true }, { key: 'remove', label: 'Remove instead of add', kind: 'switch' }] as Field[], label: 'Save subcategories', run: (v: Record<string, unknown>) => (v.remove ? removeSubs : addSubs).mutate({ name: String(v.name), subcategories: v.subcategories as string[] }) },
    remove: { fields: [{ key: 'name', label: 'Category to remove', required: true }] as Field[], label: 'Remove category', run: (v: Record<string, unknown>) => remove.mutate(String(v.name)) },
    pairs: { fields: [{ key: 'text', label: 'One “category, subcategory” per line', kind: 'textarea', required: true }] as Field[], label: 'Replace taxonomy from rows', run: (v: Record<string, unknown>) => { const r = rows(String(v.text), ['category', 'subcategory']); if (!r.length) return toast.error('No valid rows'); pairs.mutate(r as never) } },
    triples: { fields: [{ key: 'text', label: 'One “industry, category, subcategory” per line', kind: 'textarea', required: true }] as Field[], label: 'Replace industry taxonomy from rows', run: (v: Record<string, unknown>) => { const r = rows(String(v.text), ['industry', 'category', 'subcategory']); if (!r.length) return toast.error('No valid rows'); triples.mutate(r as never) } },
    json: { fields: [{ key: 'taxonomy', label: 'Taxonomy', kind: 'json', required: true, placeholder: '[{ "name": "Fashion", "subcategories": ["Shoes", "Bags"] }]' }] as Field[], label: 'Replace taxonomy', run: (v: Record<string, unknown>) => replace.mutate(v.taxonomy as never) },
    jsonV2: { fields: [{ key: 'taxonomy', label: 'Industry taxonomy (v2)', kind: 'json', required: true }] as Field[], label: 'Replace industry taxonomy', run: (v: Record<string, unknown>) => replaceV2.mutate(v.taxonomy as unknown[]) },
  }
  const f = forms[mode]
  return (
    <div className="rounded-2xl border p-4 space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(forms) as (keyof typeof forms)[]).map((m) => <button key={m} onClick={() => setMode(m)} className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${mode === m ? 'border-brand bg-brand/10 text-brand' : 'text-muted-foreground'}`}>{forms[m].label}</button>)}
      </div>
      <ActionForm key={mode} fields={f.fields} submitLabel={f.label} onSubmit={(v) => void f.run(v)} />
    </div>
  )
}

export function TaxonomyTab() {
  const t = useMkTaxonomy()
  const pub = useTaxonomyReference()
  return (
    <PageTabs tabs={[
      { id: 'edit', label: 'Edit', content: <TaxonomyEdit /> },
      { id: 'tree', label: 'Categories', content: <ReadCard title="Category tree" query={t.tree} /> },
      { id: 'v2', label: 'Industry tree (v2)', content: <ReadCard title="Industry taxonomy" query={t.v2} /> },
      { id: 'industries', label: 'Industries', content: <ReadCard title="Industries" query={t.industries} /> },
      {
        id: 'public', label: 'What shoppers see', content: (
          <div className="grid lg:grid-cols-3 gap-4">
            <ReadCard title="Categories" query={pub.categories} />
            <ReadCard title="Industries" query={pub.industries} />
            <ReadCard title="Industry tree" query={pub.tree} />
          </div>
        ),
      },
    ]} />
  )
}

export function SettingsTab() {
  const s = useMkSettings()
  const tags = useMkSetTags()
  const industries = useMkSetIndustries()
  const sub = useMkSetSubscription()
  const sync = useMkSyncSearch()
  const names = (d: unknown) => (listOf(d) ?? []).map((r) => String(r.name ?? r.value ?? r.tag ?? '')).filter(Boolean)
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border p-4 space-y-3">
        <ReadCard title="Store subscription" query={s.subscription} />
        <ActionForm fields={[{ key: 'amount', label: 'New amount (₦)', kind: 'number', required: true }]} submitLabel="Save amount" pending={sub.isPending} onSubmit={(v) => sub.mutate(Number(v.amount))} />
      </div>
      <div className="rounded-2xl border p-4 space-y-3">
        <div className="label-caps">Search index</div>
        <p className="text-xs text-muted-foreground">Re-sends every product to Meilisearch.</p>
        <ConfirmButton label="Sync products" title="Sync every product to search?" description="Can take a while on a large catalogue." onConfirm={() => sync.mutate(undefined)} />
      </div>
      <QueryView query={s.tags}>{(d) => <div className="rounded-2xl border p-4"><ActionForm fields={[{ key: 'tags', label: 'Store tags', kind: 'list', wide: true }]} initial={{ tags: names(d) }} submitLabel="Save tags" pending={tags.isPending} onSubmit={(v) => tags.mutate((v.tags as string[]) ?? [])} /></div>}</QueryView>
      <QueryView query={s.industries}>{(d) => <div className="rounded-2xl border p-4"><ActionForm fields={[{ key: 'industries', label: 'Store industries', kind: 'list', wide: true }]} initial={{ industries: names(d) }} submitLabel="Save industries" pending={industries.isPending} onSubmit={(v) => industries.mutate((v.industries as string[]) ?? [])} /></div>}</QueryView>
    </div>
  )
}
