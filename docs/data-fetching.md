# Data Fetching

## Rule: Server Components Only

**ALL data fetching in this app MUST be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`app/api/...`)
- Client components (`"use client"`)
- `useEffect` + `fetch`
- SWR, React Query, or any client-side data fetching library

There are no exceptions to this rule.

## Rule: Drizzle ORM via `/data` Helper Functions

**ALL database queries MUST go through helper functions in the `/data` directory.**

- Helper functions use Drizzle ORM — do NOT write raw SQL
- Server components call these helpers directly (they are async server-side functions)
- No query logic belongs in the component itself

### Example structure

```
/data
  workouts.ts     ← query helpers for workouts
  exercises.ts    ← query helpers for exercises
```

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// app/dashboard/page.tsx  (Server Component)
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

## Rule: Users Can Only Access Their Own Data

**Every query helper MUST scope results to the authenticated user.**

- Always accept `userId` as a parameter and filter by it in the Drizzle `where` clause
- Never expose a helper that returns data for all users
- Never derive the user inside the helper — pass it in from the server component, which reads it from the session

This prevents horizontal privilege escalation: a logged-in user must never be able to read, modify, or delete another user's records.

### Correct

```ts
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Wrong — never do this

```ts
// Missing userId filter — returns ALL users' data
export async function getAllWorkouts() {
  return db.select().from(workouts);
}
```

## Summary

| Concern | Rule |
|---|---|
| Where to fetch data | Server Components only |
| How to query the DB | Drizzle ORM helper in `/data` |
| Raw SQL | Never |
| Route handlers for data | Never |
| Client-side fetching | Never |
| Data scoping | Always filter by authenticated `userId` |
