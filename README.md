# nuMoni Control Tower

nuMoni Control Tower (head-office admin). One of the nuMoni frontend apps; each is its own Next.js project and
deployment, sharing the same structure and API client.

```bash
npm install
npm run dev        # http://localhost:4308  →  /admin
npm run build && npm start
npm run typecheck && npm run lint
```

Node 20.9+. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 3.4 +
shadcn/ui · TanStack Query 5 · Zustand.

## Configuration

Everything is in `src/lib/config.ts`:

- `API_MODE` — `partial` (default): endpoints the Gateway serves (`GATEWAY_ENDPOINTS`
  in `src/lib/api/numoni/endpoints.ts`) go to it, the rest answer from fixtures in
  `src/lib/api/numoni/mocks/`. `mock` runs fully offline; `live` sends everything.
- `API_URL` — the nuMoni Gateway. `NEXT_PUBLIC_API_URL` overrides it; it's the only
  environment variable and is optional (defaults to `https://numoni-gateway-ms.fly.dev`).
- `APP_URLS` — where the other nuMoni apps are deployed, for "wrong account" links.

On Vercel: import this repo as its own project. No environment variables are
required. Add this app's domain to the Gateway's CORS allowlist.

## API

`src/lib/api/numoni/` is the typed client for the whole nuMoni Gateway
(`specs/numoni.json`, v0.8.0): auth journey, profiles, credentials, admin accounts,
workspaces, Wallet MS, Point MS, Reward MS, Card MS, Compliance MS, Create-App MS
and Marketplace MS. See `src/lib/http/README.md` for how calls,
fixtures, auth and sessions work.

`.claude/skills/numoni-conventions/SKILL.md` has the code conventions.
