---
name: numoni-conventions
description: Architecture, file layout, data-access and styling conventions for the nuMoni frontend (Next.js 16 App Router, React 19, Tailwind 3.4, shadcn/ui, TanStack Query, Zustand). Read before adding or changing any route, page, module, API call, fixture or store in this repo.
---

# nuMoni frontend conventions

Modelled on the `avc-super-admin` console's layout. If a request conflicts
with something here, follow the request but flag the conflict. Don't silently
deviate from either.

## File layout

```
src/
  app/
    layout.tsx  page.tsx  globals.css
    (dashboards)/<experience>/layout.tsx   renders the experience's <XShell>
    (dashboards)/<experience>/<slug>/page.tsx
    (devices)/{app,till,brandapp}/page.tsx phone-frame apps
  modules/<feature>/
    components/<area>/   one folder per page/feature area (accounting/, wallet/, shell/…)
      <X>Page.tsx        the route's page — composes sections, holds shared page state
      <Section>Card.tsx  one file per visual section / tab / sheet / wizard step
      use-<x>-form.ts    form state hooks (fields + reset/openAdd/openEdit)
      <helper>.ts        constants/helpers shared by files in the folder
    api/          use<Feature>Queries.ts — React Query hooks (+ workspace queryOptions)
    lib/          feature helpers used across areas
    nav-items.ts  sidebar — single source of truth for that console's nav
    types.ts      feature-only types
    index.ts      shell + pages + nav
  components/layout/  DashShell, PhoneFrame, ClientBoundary, FrozenRouter, PageLoader, ThemeToggle, Logo
  components/ui/      shadcn primitives (vendored) + kit.tsx, form-sheet.tsx, export-csv-button.tsx, count-up.tsx
  lib/api/numoni/     typed API client — see src/lib/http/README.md
  lib/providers/      AppProviders → ThemeProvider, QueryProvider, Toaster
  store/              Zustand stores + hydration.tsx (HydrationGate)
```

**A route file is a binding, nothing more:**

```tsx
import { TreasuryPage } from '@/modules/admin'

export const metadata = { title: 'Treasury & Settlement · nuMoni Admin' }

export default function Page() {
  return <TreasuryPage />
}
```

Dynamic segments await `params` (Next 16) and pass plain props:
`app/(dashboards)/admin/merchants/[id]/page.tsx` → `<Merchant360Page id={id} />`.

**Modules map to experiences**, plus `org-admin` for the Compliance / Reward
Cards / Settings screens the reseller, brand and enterprise consoles share. Those
take an `orgId` and fetch their own data, so the same component serves three
consoles.

## Single responsibility — keep components small

- **A page composes; it doesn't implement.** `<X>Page.tsx` holds the page's
  shared state (filters, selected record, which sheet is open) and lays out
  section components. Every card, tab panel, table, sheet and wizard step is its
  own file in the page's folder. Aim for < ~150 lines per file and shallow JSX —
  if a block nests more than a few levels or carries its own heading, extract it.
- **State lives in the lowest component that uses it.** A section owns the
  state, derived values and queries only it reads (e.g. `ActivityHeatMapCard`
  owns its toggles; `TeamAuditTrailCard` calls `useAdminAuditLogQuery` itself).
  Only lift state when siblings share it. Don't move `useState` into a component
  that unmounts (a tab panel behind `tab === …`) if the value must survive
  switching away — keep it in the page instead.
- **Create/edit forms use a hook** (`use-raffle-form.ts`): fields, `editingId`,
  `open`, `reset`, `openAdd`, `openEdit(record)`. The table gets `onEdit`, the
  sheet gets `form` — never a dozen individual setters.
- **Helpers shared by files in a folder** go in a small kebab-case `.ts` file
  there (`chart-tooltip.ts`, `tier-limits.ts`), not in whichever component
  happened to own them first.

## Data access

- **Never import a fixture into a component.** Data flows endpoint → type →
  fixture → `<domain>.api.ts` (with `@endpoint`) → `use<X>Query` → component.
- Reads use `useSuspenseQuery`, so `data` is always defined. The dashboard shell
  and `PhoneFrame` wrap content in `ClientBoundary` (client-only render +
  Suspense + `PageLoader`). A phone app whose top-level component reads data
  needs a page-level `ClientBoundary` too (see `/till`, `/app`).
- Resources more than one experience reads (merchants, customers, campaigns,
  products, transactions, nearby offers) live in `platform.queries.ts` so they
  share one cache entry.
- Query keys come from `numoniKeys` in `query-keys.ts`. Don't inline key arrays.
- **Editable consoles** load one workspace endpoint and seed their store with
  `<HydrationGate useStore={…} query={…Query}>`. Stores start empty, expose
  `hydrated` + `hydrate(seed)`, and keep session edits in their actions. Don't
  put seed data back into a store file.
- Fixtures are plain JSON. Map icons and Tailwind classes in the component by an
  id or tone field (`LEDGER_STYLE`, `BANNER_TONES`).
- `specs/numoni.json` is the nuMoni Gateway's own OpenAPI spec. Refresh it from
  `https://numoni-gateway-ms.fly.dev/docs/swagger.json`; never generate it from the client.

## Tables — always `DataTable`

Every list is `<DataTable>` (`components/ui/data-table.tsx`, headless TanStack
Table v9). Never hand-write a `<table>`.

```tsx
<div className="card-surface overflow-x-auto">
  <DataTable
    className="w-full text-sm min-w-[860px]"
    data={rows}
    getRowId={(t) => t.id}
    rowClassName="border-b last:border-0 hover:bg-accent/40 cursor-pointer transition-colors"
    onRowClick={(t) => setDetail(t.id)}
    columns={[
      { id: 'amount', header: 'Amount', meta: { cellClassName: 'tnum font-semibold' }, cell: ({ row: { original: t } }) => fmtNaira(t.amount, 0) },
      { id: 'actions', header: '', meta: { stopRowClick: true }, cell: ({ row: { original: t } }) => <RowActions txn={t} /> },
    ]}
  />
</div>
```

- Defaults are the app's standard table: header row `border-b text-left`,
  header cells `label-caps font-semibold px-4 py-3`, cells `px-4 py-3`, rows
  `border-b last:border-0`. Pass `headerRowClassName` / `headerCellClassName` /
  `cellClassName` / `rowClassName` only where a screen differs. Card-style
  consoles (reseller, brand) use `headerRowClassName="border-b text-left label-caps"`
  `headerCellClassName="px-4 py-3 font-medium"`.
- Column `meta`: `cellClassName` (string, or `(row, index) => string` for
  state-dependent colour) is appended to the base; `ownCellClassName` replaces
  it; `headerClassName` is appended to the header cell; `stopRowClick` keeps
  action buttons from triggering `onRowClick`.
- `rowMotion={(i) => ({ initial, animate, transition })}` for animated rows,
  `emptyState` + `emptyCellClassName` for the in-table empty row,
  `showHeader={false}` for key/value tables, `afterRows` for totals rows.
- The wrapper (`card-surface overflow-x-auto`, …) stays outside the table — or
  pass `wrapperClassName`.

## Shells & navigation

- Each dashboard is `DashShell` with `base` + `items` from its `nav-items.ts`,
  wrapped in `<DashboardAuthGate persona="…">` (`@/modules/auth`) so it only
  renders for a signed-in account of the right type. Auth state lives in
  `useSession` — never put login flags in a feature store. See
  `src/lib/http/README.md` → *Authentication*.
  Adding a destination = one entry there + one `page.tsx`.
- Navigate with `next/link` (`href`) or `useRouter().push`. There is no
  react-router.
- `DashShell` keeps the old fade/slide page transition using `FrozenRouter`.
  Don't remove it without replacing the exit animation.
- This project is one nuMoni app; `/` redirects to its home. Other apps are
  separate projects, linked only through `APP_URLS` in `src/lib/config.ts`.

## Styling

- Tailwind **3.4** (`tailwind.config.js`) with tokens in `src/app/globals.css`
  (`--brand`, `--orange`, `--purple`, shadcn set, light + `.dark`). Use
  `text-brand`, `bg-orangeb`, `card-surface`, `label-caps`, `tnum`. No raw hex
  for brand colours.
- Fonts come from `next/font` (Inter, Space Grotesk). Tailwind and `.font-display`
  name the families directly. Don't switch them to the `--font-*` variables:
  that routes missing glyphs (→) to next/font's Arial fallback and changes the
  rendering.
- shadcn files in `components/ui/` are vendored. Compose them, don't edit them.
- Every create/edit/preview flow opens in a right-side `FormSheet`.
- Money/number formatting: `src/lib/format.ts` (`fmtNaira`, `fmtNairaCompact`, `fmtNum`).

## Verification before calling something done

1. `npm run typecheck`: must be clean. Missing `PageProps`/`LayoutProps` means
   route types are stale. Run `npx next typegen`.
2. `npm run lint`: 0 errors. The remaining warnings are inherited React
   Compiler findings (set-state-in-effect, purity, static-components). Don't add
   new ones.
3. Load the route in a browser. The server HTML of data screens is only the
   shell plus a loader, so `curl` alone proves nothing. Check the console for
   errors.
4. `npm run build` must succeed.

## Next.js 16

Read `AGENTS.md`. Async `params`/`searchParams`/`cookies()`, `proxy` instead of
`middleware`, Turbopack by default. Check `node_modules/next/dist/docs/` before
assuming an older API.
