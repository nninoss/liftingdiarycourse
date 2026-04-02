# UI Coding Standards

## Component Library

**ALL UI components must use shadcn/ui exclusively.**

- Do NOT create custom components under any circumstances
- Do NOT use other component libraries (MUI, Chakra, Radix primitives directly, etc.)
- Do NOT write bespoke styled divs/spans as component abstractions
- Every UI element must map to an existing shadcn/ui component
- If a shadcn/ui component does not yet exist in the project, install it via `npx shadcn@latest add <component>`

## Date Formatting

All date formatting must use **date-fns**.

Dates must be displayed in the following format: `do MMMM yyyy`

Example output: `2nd April 2026`

```ts
import { format } from "date-fns";

format(date, "do MMMM yyyy"); // "2nd April 2026"
```

Never use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting approach.
