# Auth Coding Standards

## Authentication Provider

This app uses **Clerk** for all authentication. Do NOT use any other auth library or roll custom auth.

## Protecting Routes

Use Clerk's `clerkMiddleware` (in `proxy.ts`) to protect routes. Define public routes explicitly; all others are protected by default.

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

## Accessing the Current User

### Server Components / Route Handlers

Use `auth()` or `currentUser()` from `@clerk/nextjs/server`. Both are async — always `await` them.

```ts
import { auth, currentUser } from "@clerk/nextjs/server";

// Get just the userId (lightweight)
const { userId } = await auth();

// Get the full user object
const user = await currentUser();
```

### Client Components

Use the `useUser` or `useAuth` hooks from `@clerk/nextjs`.

```ts
import { useUser, useAuth } from "@clerk/nextjs";

const { user, isLoaded } = useUser();
const { userId, isSignedIn } = useAuth();
```

## UI Components

Use Clerk's pre-built components for all sign-in/sign-up/user-profile UI. Do NOT build custom auth forms.

```tsx
import { SignIn, SignUp, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

// Toggle content based on auth state
<SignedIn><UserButton /></SignedIn>
<SignedOut><SignInButton /></SignedOut>
```

## User ID in the Database

Always use Clerk's `userId` (a string like `user_abc123`) as the foreign key when associating records with a user. Never store passwords or sensitive auth data.

## Environment Variables

Clerk requires these variables in `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Optional redirect config:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Root Layout

The root layout must wrap the app in `<ClerkProvider>`.

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```
