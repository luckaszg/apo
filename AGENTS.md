## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project notes

- Product spec: `SPEC.md`. UI copy is Spanish (es-PY); code and comments in English.
- Cloudflare bindings come from `import { env } from 'cloudflare:workers'` (`env.DB` = D1, `env.BUCKET` = R2). Run `npm run generate-types` after editing `wrangler.jsonc`.
- Money is integer guaraníes; format with `formatGs` from `src/lib/money.ts`.
- Schema changes: edit `src/db/schema.ts` → `npm run db:generate` → `npm run db:migrate:local`.
- Keep business logic in `src/lib/` as plain TS with Vitest tests next to it.
- Before finishing: `npm test`, `npm run check`, `npm run build`.
