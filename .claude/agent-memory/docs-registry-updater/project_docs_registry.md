---
name: Docs Registry History
description: Tracks additions to the CLAUDE.md documentation list over time, including when each file was registered.
type: project
---

The CLAUDE.md docs list lives under the "IMPORTANT: Docs-First Rule" section. Each entry uses the format `- /docs/filename.md`.

Registered files (in order of appearance as of 2026-04-02):
1. /docs/ui.md — original
2. /docs/data-fetching.md — original
3. /docs/data-mutations.md — original
4. /docs/auth.md — original
5. /docs/server-components.md — original
6. /docs/routing.md — added 2026-04-02

**Why:** The docs-first rule requires all docs to be listed in CLAUDE.md so Claude Code knows to consult them before writing code.
**How to apply:** When a new file appears in /docs, append it to the list after /docs/server-components.md (or the current last entry).
