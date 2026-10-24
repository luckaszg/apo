# apo

Website for [@apo.py_](https://www.instagram.com/apo.py_/): portfolio, store and custom order requests. See [SPEC.md](SPEC.md) for the product spec.

**Stack:** Astro + React + Tailwind, running on Cloudflare Workers, with D1 (SQLite via Drizzle) for data and R2 for files.

## Local development

Requires Node 22+.

```sh
npm install                 # also generates worker-configuration.d.ts (Cloudflare binding types)
npm run db:migrate:local    # create the local D1 database
npm run dev                 # http://localhost:4321
```

`npm run dev` runs inside the real Workers runtime (workerd), with local D1 and R2 stored in `.wrangler/`. To start fresh, delete `.wrangler/` and re-run the migration. `GET /api/health` checks that the bindings work.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm test` | Unit tests (Vitest) |
| `npm run check` | Type-check `.astro` and `.ts` files |
| `npm run build` | Production build into `dist/` |
| `npm run db:generate` | Create a SQL migration after editing `src/db/schema.ts` |
| `npm run db:migrate:local` / `db:migrate:remote` | Apply migrations to local / production D1 |
| `npm run generate-types` | Regenerate binding types after editing `wrangler.jsonc` |
| `npm run deploy` | Build and deploy to Cloudflare |

## Changing the database

1. Edit `src/db/schema.ts`.
2. `npm run db:generate`: writes a new file in `migrations/`. Review it.
3. `npm run db:migrate:local`, then test.
4. Before deploying: `npm run db:migrate:remote`.

## Project layout

```
src/
  pages/        routes (file = URL); pages/api/ = server endpoints
  layouts/      page shells
  db/           Drizzle schema + getDb()
  lib/          plain TS business logic (RUC, money, orders, WhatsApp), with tests
  styles/       Tailwind entry
migrations/     SQL migrations applied by wrangler
wrangler.jsonc  Cloudflare config (D1, R2 bindings)
```

Cloudflare bindings (`env.DB`, `env.BUCKET`) are imported with `import { env } from 'cloudflare:workers'`.

## First deploy (one time)

```sh
npx wrangler login
npx wrangler d1 create apo           # copy the database_id into wrangler.jsonc
npx wrangler r2 bucket create apo-files
npm run db:migrate:remote
npm run deploy
```

Then, in the Cloudflare dashboard, protect `/admin*` with **Zero Trust → Access** (email one-time PIN).
