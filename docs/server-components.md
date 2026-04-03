# Server Components Coding Standards

## Rule: Always `await` params and searchParams

**`params` and `searchParams` in pages and layouts are Promises — they MUST be awaited.**

This project uses Next.js 16, where all dynamic route params and search params are async. Accessing them synchronously will throw a runtime error.

### Correct

```tsx
export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  // ...
}
```

```tsx
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  // ...
}
```

### Wrong — never do this

```tsx
// params is a Promise — destructuring without await will give you undefined
export default async function WorkoutPage({
  params: { workoutId },
}: {
  params: { workoutId: string };
}) {
  // ❌ runtime error — params was not awaited
}
```

## Rule: Server Components must be `async`

Every server component that fetches data or reads params/searchParams MUST be declared with `async`. There are no synchronous server components that access route context.

```tsx
// ✅ correct
export default async function Page({ params }: { params: Promise<{ id: string }> }) {}

// ❌ wrong — can't await params without async
export default function Page({ params }: { params: Promise<{ id: string }> }) {}
```

## Rule: Type params as `Promise<{ ... }>`

Always type `params` and `searchParams` props as `Promise<{ ... }>`, not as plain objects.

```tsx
// ✅ correct
{ params }: { params: Promise<{ workoutId: string }> }

// ❌ wrong — the old Next.js 14 style, will not work in Next.js 16
{ params }: { params: { workoutId: string } }
```

## Summary

| Concern | Rule |
|---|---|
| Accessing `params` | Always `await` — it is a `Promise` |
| Accessing `searchParams` | Always `await` — it is a `Promise` |
| Param prop type | `Promise<{ key: string }>` — never a plain object |
| Server components accessing route context | Must be `async` functions |
