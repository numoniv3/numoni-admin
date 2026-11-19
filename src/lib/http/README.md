# The API layer

`src/lib/api/numoni/` is the typed client for the nuMoni backend. Components
never call `axiosClient` (or a fixture) directly. They call a React Query hook
in `src/modules/<feature>/api/`, which calls a function from here.

```
src/lib/api/numoni/
  endpoints.ts         every path, grouped by API domain
  envelope.ts          { success, message, data } + pagination shapes
  request.ts           apiGet() — the mock/real switch, and mockResponse()
  query-keys.ts        React Query key factories (one per domain)
  platform.queries.ts  queryOptions for resources several experiences share
  <domain>.api.ts      one async function per endpoint, each tagged @endpoint
  types/<domain>.ts    request/response types — what specs/numoni.json is built from
  mocks/<domain>.ts    fixtures that answer while mocking is on
  index.ts             barrel
```

## Mocking

`API_MODE` in `src/lib/config.ts` decides where each read goes. It's set in
code, not the environment:

| Value | Reads | Sign-in |
|---|---|---|
| `mock` | every endpoint answers from its fixture | mock (OTP `123456`) |
| `partial` (current) | paths in `GATEWAY_ENDPOINTS` (`endpoints.ts`) call the Gateway; the rest stay on fixtures | real |
| `live` | every endpoint calls the Gateway | real |

The Gateway URL is `API_URL` in the same file: `NEXT_PUBLIC_API_URL` if set,
else `https://numoni-gateway-ms.fly.dev`. It's the only environment variable.

A mocked call resolves `structuredClone(fixture())` after `MOCK_LATENCY_MS`
(200 ms). There's no network call, but
everything else behaves like a real response: screens suspend, the loader
shows, and every response is a fresh object. A real call issues
`GET {API_URL}/{path}` and unwraps `data` from the envelope. The
fixture and the real call sit side by side in one function, so swapping
backends is configuration, not a rewrite.

**Live endpoints today** (Gateway v0.7.0), listed in `GATEWAY_ENDPOINTS`
with `{id}` for path parameters:

| Area | Endpoints | Used by |
|---|---|---|
| Workspaces | `admin/overview`, `merchant/workspace`, `merchant/analytics`, `brand/workspace`, `enterprise/workspace`, `reseller/workspace`, `till/workspace`, `consumer/account`, `brand-app/account` | each console's seed / overview |
| Profiles | `GET profiles/{id}`, `PATCH profiles/{id}/user`, `PATCH profiles/{id}/merchant` | business profile cards; consumer & brand-app edit profile + profile quests |
| API keys | `GET credentials/enterprise/{id}`, `POST …/rotate` | Enterprise → Widget & API |
| Team | `POST journey/sub-admin` | merchant & org team invites |
| Uploads | `POST media/upload` | KYC Tier 3 documents |
| Policies | `POST policies/sync` | after sign-in reaches the dashboard, and after a KYC change (`session-effects.ts`) |
| Admin | `admin/admins`, `admin/invite`, `admin/users`, `admin/users/{id}`, `…/status`, `…/limits` | Admins & Roles, Accounts |

Workspace endpoints return the frontend type their `*.api.ts` function
names (the Gateway spec references it as `ApiEnvelope<MerchantWorkspace>`
etc.). The Auth routes document their request DTOs but not their responses,
so their functions read the payload through `parse.ts` — by the DTO field
names, with the common alternatives — and `apiRead` / `apiSend` /
`apiUpload` pass the mock and the real payload through the same parser.
When the Gateway ships another endpoint, add its path to `GATEWAY_ENDPOINTS`.

KYC Tier 2 / 3 (`journey/kyc/tier2|tier3`) go through `/api/auth/*` like the
other journey steps, because the tier lives on the token: `useKycUpgrade`
submits, then `useSession.refresh()` re-reads `/journey/me`, and every screen
reads the tier from the session.

The Gateway builds workspaces from whichever services it has configured, so a
live response can lack sections. `apiGet` fills any key the fixture has but the
response lacks with an empty value of the same shape (`[]`, `0`, `''`, …) and,
in development, logs a `[api] … rendering empty` warning naming them.

A failed read shows a retry screen (`QueryErrorBoundary`, inside every
`ClientBoundary`). Signing out or switching account clears the query cache and
every workspace store (`resetWorkspaceStores`), so one account never sees
another's data.

Fixtures must be plain JSON: no functions, components or class instances.
`structuredClone` throws on those, and a real API couldn't return them anyway.
Presentational bits that rode along with data in the Vite build (icons, Tailwind
classes) are keyed by id in the fixture and mapped in the component; see
`LEDGER_STYLE` in `TreasuryPage` and `BANNER_TONES` in `AdBanners`.

## The contract: `specs/numoni.json`

`npm run api:spec` regenerates `specs/numoni.json` (OpenAPI 3.1, JSON)
from this folder. Every exported function with an `@endpoint METHOD /path` JSDoc
tag becomes an operation, and its `Promise<T>` return type becomes the response
schema, wrapped in `ApiEnvelope`. Hand the YAML to the backend team. It's
generated, so never edit it by hand. Two API types with the same name fail the
generation, because schemas are keyed by name.

## Authentication

Sign-in follows the Gateway's `Authentication - Journey` contract
(`specs/numoni.json`): passwordless OTP, a fat JWT, and a `nextStep` that
decides the next screen (`OTP`/`LOGIN_OTP` → `NAME` → `PIN` / `PROFILE` →
`DASHBOARD`).

```
src/lib/auth/
  types.ts  personas.ts  claims.ts  phone.ts   shared by browser and server
  actions.ts        the journey endpoints the browser may reach, + AUTH_MOCKING
  client.ts         authClient — fetches /api/auth/* (never the Gateway directly)
  server/gateway.ts calls the Gateway and normalises its responses
  server/mock.ts    the offline journey (OTP 123456, demo accounts per persona)
  server/session.ts runAuthAction / readSession / respond (sets the cookie)
src/app/api/auth/[action]/route.ts   POST signup | signup-otp | verify | login |
                                     profile-customer | profile-business | pin |
                                     pin-verify | lock | kyc-tier2 | kyc-tier3
src/app/api/auth/session/route.ts    GET (→ /journey/me) · DELETE (sign out)
src/store/use-session-store.ts       { user, nextStep, accessToken } for every app
src/modules/auth/                    useAuthFlow, DashboardAuthGate, sign-in screens
```

- **The token never touches `localStorage`.** The route handlers keep it in an
  httpOnly `numoni_session` cookie and hand the browser an in-memory copy, which
  `axiosClient` attaches as `Authorization: Bearer`. Data calls go straight to
  the Gateway; only auth goes through Next.js. A 401 from the Gateway signs the
  user out.
- **`universalId` comes from the cookie.** Endpoints that need one get it
  injected server-side; whatever the browser sends is dropped.
- **Personas** (`personas.ts`) say which `userType` each app admits and which
  one it signs up as. Dashboards wrap their shell in `<DashboardAuthGate persona>`;
  the phone apps (`/app`, `/brandapp`, `/till`) gate inside their frame. A
  signed-in user of the wrong type sees a "wrong account" screen.
- **Mocking:** auth is mocked only when `API_MODE` is `mock`; `partial` and
  `live` sign in against the real Gateway at `API_URL` (`src/lib/config.ts`).
  The mock keeps pending signups in server memory, so it only works on a
  single long-running server (`npm run dev` / `npm start`), not on Vercel.
- The Gateway documents the success fields but not their nesting;
  `fromGateway()` reads them at the top level or under `data`, and reads the
  user's claims from the JWT (`userID`, `user_type`, `user_role`, `kycStatus`).

## Reads vs writes

Reads are React Query (`useSuspenseQuery`). Experiences whose screens edit data
(merchant, reseller, brand, enterprise, consumer, brand app) load a
**workspace** endpoint once and seed a Zustand store from it through
`HydrationGate` (`src/store/hydration.tsx`). From then on the store's actions
simulate the writes for the session, exactly as the Vite build did. Each action
stands for an endpoint the backend still has to provide:

| Store | Actions that become write endpoints |
|---|---|
| `useMerchant` | programs, campaigns, gifts, raffles (+ `drawRaffleWinner`), coupons, catalogs, categories, products (+ `togglePublish`), banks, terminals, marketing messages (`send`/`schedule`), storefronts, team, card orders, card freeze, `fundWallet`, `withdrawWallet` |
| `useBrand` | campaigns, reward programs, gifts, raffles, coupons, pools |
| `useReseller` | `addBusiness`, `updateBusiness`, `regeneratePassword`, `withdraw` |
| `useEnterprise` | programs, campaigns, gifts, raffles, coupons |
| `useConsumer` | `fund`, `spend`, `placeOrder`, `redeemCoupon`, `addAddress`, `activateCard`, `freezeCard` |
| `useBrandApp` | `fund`, `pay`, `redeemCoupon` |

When a write endpoint exists, replace the store action with a `useMutation` in
the module's `api/` folder. It should call a new function in `<domain>.api.ts`,
toast on both outcomes, and invalidate every query key the write affects.

## Adding an endpoint

1. Add the path to `NUMONI_ENDPOINTS` in `endpoints.ts`.
2. Add or reuse the response type in `types/<domain>.ts`.
3. Add the fixture to `mocks/<domain>.ts`.
4. Add the function to `<domain>.api.ts`. Give it a one-line JSDoc summary and an
   `@endpoint GET /path/{param}` tag, and return `apiGet(path, () => fixture)`.
5. Add a key to `query-keys.ts` and a `use<X>Query` hook in the module's `api/`.
6. `npm run api:spec`, then commit the regenerated `specs/numoni.json`.
