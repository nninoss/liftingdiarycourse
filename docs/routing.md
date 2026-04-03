# Routing Coding Standards

## Rule: All app routes live under `/dashboard`

Every page in this app (beyond the public landing/auth pages) must be nested under the `/dashboard` route. Do NOT create top-level routes for app features.

```
app/
  page.tsx              ✅ public landing page
  sign-in/page.tsx      ✅ public auth page
  sign-up/page.tsx      ✅ public auth page
  dashboard/
    page.tsx            ✅ main dashboard
    workout/
      [workoutId]/
        page.tsx        ✅ sub-page under dashboard
```

```
app/
  workouts/page.tsx     ❌ wrong — must be under /dashboard
  profile/page.tsx      ❌ wrong — must be under /dashboard
```

## Rule: All `/dashboard` routes are protected

Every route under `/dashboard` must be accessible only to authenticated users. This is enforced at the middleware level — do NOT add per-page auth checks.

## Rule: Route protection is done in `proxy.ts` (middleware)

Use Clerk's `clerkMiddleware` in `proxy.ts` to protect all non-public routes. Define public routes explicitly; everything else (including all `/dashboard/**`) is protected by default.

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export const proxy = clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

> This project uses Next.js 16 — middleware is defined in `proxy.ts` with a `proxy` export, NOT `middleware.ts` with a `middleware` export. The `edge` runtime is NOT supported; use the default `nodejs` runtime.

## Rule: Never use per-page auth guards

Do NOT call `auth.protect()` or redirect manually inside individual page components. All protection is centralized in `proxy.ts`.

```ts
// ❌ wrong — do not do this in a page
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in"); // ❌ unnecessary — middleware handles this
}
```

## Summary

| Concern | Rule |
|---|---|
| App feature routes | Must be nested under `/dashboard` |
| Route protection | Handled in `proxy.ts` via `clerkMiddleware` |
| Per-page auth guards | Never — middleware is the single source of truth |
| Middleware file | `proxy.ts` with `proxy` export (not `middleware.ts`) |
| Runtime | `nodejs` only — `edge` is not supported |
