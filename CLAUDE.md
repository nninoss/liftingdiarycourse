# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack, default)
npm run build    # Production build (Turbopack, default)
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test runner is configured.

## Next.js 16 — Key Breaking Changes

This project uses **Next.js 16.2.2** with **React 19.2.4**. Many conventions differ from older Next.js versions:

- **Turbopack is the default** for both `dev` and `build`. Use `--webpack` to opt out. Custom webpack config will break builds.
- **All Request APIs are async-only**: `cookies()`, `headers()`, `draftMode()`, and `params`/`searchParams` in pages, layouts, and route handlers must be `await`ed — synchronous access was removed.
- **`middleware` → `proxy`**: The `middleware.ts` filename and export are deprecated. Rename to `proxy.ts` and export a `proxy` function. The `edge` runtime is NOT supported in `proxy` (nodejs only).
- **`next build` no longer runs the linter** — run it separately via `npm run lint`.
- **PPR**: `experimental.ppr` is removed; use `cacheComponents: true` in `next.config.ts` instead.
- **Caching APIs stabilized**: Use `cacheLife`, `cacheTag` (no `unstable_` prefix). New APIs: `updateTag`, `refresh` from `next/cache`.
- **`experimental.turbopack`** moved to top-level `turbopack` in `next.config.ts`.
- Run `npx next typegen` to generate `PageProps`, `LayoutProps`, `RouteContext` type helpers for async params/searchParams.

## Architecture

Standard Next.js App Router project (no `src/` directory):

- `app/` — routes, layouts, pages (App Router)
- `app/layout.tsx` — root layout with Geist fonts and Tailwind base classes
- `app/page.tsx` — home page
- `public/` — static assets served from `/`

Styling: **Tailwind CSS v4** via `@tailwindcss/postcss` (PostCSS plugin — config in `postcss.config.mjs`, not the legacy `tailwind.config.js` pattern).
