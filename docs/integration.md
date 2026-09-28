# Integration

Poster Studio mounts under **krumath.com/poster-canvas** as a Hard-gated KruMath project (same pattern as maze-rank / quick-brain-racer).

## KruMath Hard Gate (`/poster-canvas`)

The studio does **not** load for unsigned or anonymous visitors. Production flow:

```text
Open /poster-canvas
  → requirePlayableUser + AuthGate
  → playable non-anonymous session → studio
  → else → /sign-in?returnUrl=/poster-canvas
```

- **Session:** same Supabase project as KruMath. Browser reads the shared **localStorage** key (`sb-<ref>-auth-token`) via `createClient` — the same storage `apps/web` writes. Do **not** use a cookie-backed browser client for the gate (that cannot see the main-site session).
- **SSR:** Worker cookies are opportunistic only. Missing cookies → auth status `unknown`; AuthGate finishes in the browser. Never treat missing cookies as signed-out (production outage regression in sibling games).
- **DEV:** Hard Gate is skipped (`import.meta.env.DEV`) so local editing works without a krumath.com session.
- **Deploy:** Cloudflare Worker via Nitro (`npm run deploy`). Route `krumath.com/poster-canvas*` to the `poster-canvas` Worker (more specific than the main `krumath` Worker).

Reference implementations: `maze-rank`, `quick-brain-racer` (`AuthGate` + `requirePlayableUser` + localStorage client).

**Security note:** The Hard Gate UX is client-resolved against shared localStorage/session. Database access is still protected by Supabase RLS. Do not treat the client gate alone as authorization for secrets or `service_role`.

### Account / Profile

Header Account menu shows the signed-in name/email and **Log out** (shared `supabase.auth.signOut()`). After logout, the Hard Gate redirects to sign-in. Home / Support / GitHub remain available.

### Cloud code storage + autosave

Signed-in projects persist to KruMath Supabase table `poster_canvas_projects`:

| Stored | Not stored |
|--------|------------|
| `id`, `user_id`, `name`, `code`, `width`, `height`, `logo_slot` JSON, timestamps | Export files (PNG/PDF/…), logo `dataUrl` binaries, preview captures |

- RLS: `auth.uid() = user_id` for SELECT/INSERT/UPDATE/DELETE (`authenticated` role only).
- SQL: [`supabase/migrations/20260928140000_poster_canvas_projects.sql`](../supabase/migrations/20260928140000_poster_canvas_projects.sql)
- Autosave: **2.5s debounce** after the last change while dirty; skips identical payloads; StatusBar shows Saving / Saved / Save failed. Manual Save flushes immediately.
- DEV uses `localStorage` (`LocalProjectRepository`). Production uses `SupabaseProjectRepository`.

### Operator checklist

```text
[ ] Apply supabase/migrations/20260928140000_poster_canvas_projects.sql on KruMath Supabase
[ ] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set at build time (same project as KruMath)
[ ] npm run deploy → Worker name poster-canvas
[ ] Cloudflare route: krumath.com/poster-canvas* → poster-canvas
[ ] Smoke: unsigned → /sign-in?returnUrl=/poster-canvas
[ ] Smoke: signed-in → studio; Account shows user; Export works
[ ] Smoke: edit → wait ≥2.5s → reload restores code from Supabase
[ ] Smoke: logout from Account → sign-in again; /home also signed out
[ ] Smoke: DB rows are text code only (no large base64 exports/logos)
[ ] Assets load from /poster-canvas/assets/...
[ ] Home card on krumath.com/home links to /poster-canvas (edit KruMath monorepo separately)
```

### Handoff (integration §20)

```text
Project name: Poster Studio / poster-canvas
Project slug: poster-canvas
GitHub: https://github.com/sokna492-km/poster-canvas
Cloudflare Worker name: poster-canvas
Production URL: https://krumath.com/poster-canvas
Authentication model: Hard
Supabase project: Existing KruMath Supabase
Required environment variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_BASE_PATH=/poster-canvas
Required database tables/policies: poster_canvas_projects + RLS (auth.uid = user_id)
Cloudflare route: krumath.com/poster-canvas*
```

### KruMath home card (operator — separate PR)

In `apps/web/src/components/dashboard/GameSection.tsx`, add a card with `href: '/poster-canvas'` (same pattern as `RACER_HREF`). Do this **after** the Worker route works so the link is not dead.

## Configuration

```typescript
import { configureApp } from "@/lib/config";

configureApp({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  authProvider: {
    async getCurrentUser() {
      /* ... */
    },
    async login() {
      /* ... */
    },
    async logout() {
      /* ... */
    },
  },
  projectRepository: {
    async getProjects() {
      /* ... */
    },
    async getProject(id) {
      /* ... */
    },
    async createProject(p) {
      /* ... */
    },
    async updateProject(p) {
      /* ... */
    },
    async deleteProject(id) {
      /* ... */
    },
  },
});
```

Call `configureApp()` once before rendering `<PosterStudio />`. Defaults: DEV → local repository; production → Supabase codes repository.

## Project model

```typescript
interface PosterProject {
  id: string;
  name: string;
  code: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
  assets?: { logo?: { dataUrl: string; fileName: string; mimeType: string } };
  logoSlot?: {
    corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    maxHeight: number;
    padding: number;
  } | null;
}
```

Cloud rows map to the same fields except `assets` (logo binaries stay session-only in the browser).

## Environment

| Variable                 | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`      | Optional API base for future backend calls                                   |
| `VITE_BASE_PATH`         | App URL prefix. Defaults to `/poster-canvas`. Set to `/` for root deployment |
| `VITE_SUPABASE_URL`      | Same as KruMath `NEXT_PUBLIC_SUPABASE_URL` (required for production gate)    |
| `VITE_SUPABASE_ANON_KEY` | Same as KruMath `NEXT_PUBLIC_SUPABASE_ANON_KEY`                              |
| `VITE_KRUMATH_ORIGIN`    | Optional local KruMath origin for sign-in / home redirects                   |

See `.env.example`.

## Subpath deployment

Poster Studio defaults to `/poster-canvas` (e.g. `https://krumath.com/poster-canvas` or `http://localhost:5173/poster-canvas`):

1. Keep or set `VITE_BASE_PATH=/poster-canvas` (this is the default; see `.env.example`).
2. Prefer `npm run deploy` (Nitro Cloudflare Worker) for production on krumath.com.
3. For static hosting instead: `npm run build` and serve client output under that path with SPA fallback for `/poster-canvas/*`.

For root hosting, set `VITE_BASE_PATH=/` before building.
