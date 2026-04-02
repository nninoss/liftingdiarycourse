# Data Mutations

## Rule: Mutations Go Through `/data` Helper Functions

**ALL database mutations (insert, update, delete) MUST go through helper functions in the `/data` directory.**

- Helper functions use Drizzle ORM — do NOT write raw SQL or inline `db` calls in server actions
- No mutation logic belongs outside of `/data`

### Example structure

```
/data
  workouts.ts     ← query + mutation helpers for workouts
  exercises.ts    ← query + mutation helpers for exercises
```

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, userId));
}
```

## Rule: Server Actions Only — Colocated in `actions.ts`

**ALL mutations triggered from the UI MUST be performed via Next.js Server Actions.**

- Server actions MUST live in a file named `actions.ts` colocated with the route that uses them
- Do NOT put server actions in shared files or global locations — colocate them with the page/feature they belong to
- Each `actions.ts` file MUST have `"use server"` at the top

### Example structure

```
app/
  dashboard/
    page.tsx
  workouts/
    actions.ts    ← server actions for the workouts route
    page.tsx
  workouts/[id]/
    actions.ts    ← server actions for the workout detail route
    page.tsx
```

## Rule: Typed Parameters — No `FormData`

**ALL server action parameters MUST be explicitly typed.**

- Do NOT use `FormData` as a parameter type
- Accept typed objects or primitives only
- This keeps actions predictable, type-safe, and easy to validate

### Correct

```ts
export async function createWorkout(userId: string, name: string, date: Date) { ... }
```

### Wrong — never do this

```ts
// FormData is untyped and bypasses validation
export async function createWorkout(formData: FormData) { ... }
```

## Rule: Validate All Arguments with Zod

**EVERY server action MUST validate its arguments using Zod before performing any mutation.**

- Define a Zod schema for each action's input
- Parse and validate at the top of the action body — before calling any `/data` helper
- If validation fails, return an error — do NOT proceed with the mutation

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";
import { auth } from "@/lib/auth";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.coerce.date(),
});

export async function createWorkoutAction(input: { name: string; date: Date }) {
  const session = await auth();

  const parsed = createWorkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  const workout = await createWorkout(session.user.id, parsed.data.name, parsed.data.date);
  return { data: workout };
}
```

## Rule: Users Can Only Mutate Their Own Data

**Every mutation helper MUST scope the operation to the authenticated user.**

- Always pass `userId` to mutation helpers and include it in the Drizzle `where` clause for updates/deletes
- Never trust a client-supplied ID alone — always AND it with the authenticated `userId`
- Derive `userId` from the session in the server action, never accept it as a client parameter

### Correct

```ts
// action resolves userId from session
const session = await auth();
await deleteWorkout(session.user.id, input.workoutId);

// helper enforces ownership in the query
export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}
```

### Wrong — never do this

```ts
// userId supplied by the client — can be spoofed
export async function deleteWorkoutAction(input: { userId: string; workoutId: string }) {
  await deleteWorkout(input.userId, input.workoutId);
}
```

## Rule: No `redirect()` in Server Actions — Redirect Client-Side

**Never call `redirect()` inside a server action.** Redirects must be handled client-side after the server action resolves.

- Server actions must return a result (e.g. `{ data }` or `{ error }`)
- The calling client component is responsible for reading the result and navigating using the Next.js `useRouter` hook

### Correct

```ts
// app/workouts/actions.ts
export async function createWorkoutAction(input: { name: string; date: string }) {
  // ... validate, mutate ...
  return { data: workout };
}
```

```tsx
// app/workouts/_components/new-workout-form.tsx
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();

async function onSubmit(values: FormValues) {
  const result = await createWorkoutAction(values);
  if (result.data) {
    router.push(`/dashboard?date=${result.data.date}`);
  }
}
```

### Wrong — never do this

```ts
// redirect() inside a server action breaks client-side error handling
// and makes navigation logic invisible to the calling component
export async function createWorkoutAction(input: { name: string; date: string }) {
  // ...
  redirect(`/dashboard?date=${workout.date}`); // ❌
}
```

## Summary

| Concern | Rule |
|---|---|
| Where to write DB mutation logic | `/data` helper functions using Drizzle ORM |
| Where to trigger mutations from the UI | Server actions in a colocated `actions.ts` |
| Server action parameter types | Explicit TypeScript types — never `FormData` |
| Input validation | Zod — validate before every mutation |
| User scoping | Always derive `userId` from session; always filter by it |
| Redirects after mutation | Client-side via `useRouter` — never `redirect()` in server actions |
| Raw SQL | Never |
| Inline `db` calls in actions | Never |
