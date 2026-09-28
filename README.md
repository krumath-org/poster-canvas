# Poster Studio

Design posters with code. Edit TSX in Monaco, click Run to preview in an isolated sandbox, and export to PNG, SVG, PDF, JPG, or WebP.

User poster code never runs in the main application — it is compiled and rendered inside a sandboxed iframe.

## Features

- Monaco editor with TypeScript / TSX support
- Manual Run preview in an isolated sandbox (Cmd/Ctrl+Enter)
- Starter templates and canvas size presets
- Local project storage in DEV (`localStorage`); production cloud codes on KruMath Supabase
- Hard Gate: must sign in on krumath.com to use production
- Export to PNG, SVG, PDF, JPG, and WebP
- First-visit onboarding tour (reopen via Help)
- Command palette and keyboard shortcuts
- Embeddable via injectable auth and storage adapters

## Tech stack

| Layer     | Choice                    |
| --------- | ------------------------- |
| Framework | TanStack Start (React 19) |
| Bundler   | Vite 8                    |
| Styling   | Tailwind CSS 4            |
| Editor    | Monaco                    |
| State     | Zustand                   |
| Tests     | Vitest                    |

## Prerequisites

- Node.js 20+ (recommended)
- npm 10+ (or a compatible package manager)

## Quick start

```bash
# Install dependencies
npm install

# Optional: copy environment variables
cp .env.example .env

# Start the development server
npm run dev
```

Open `http://localhost:5173/poster-canvas` (visiting `/` redirects there).

On first visit, a short guided tour explains the AI-prompt → paste → run workflow. Reopen it anytime from **How to use** in the header (or the command palette: “Show how to use”).

## Configuration

Environment variables are loaded from `.env`. See [`.env.example`](.env.example).

| Variable                 | Description                                                                  |
| ------------------------ | ---------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`      | Optional API base URL for backend integration                                |
| `VITE_BASE_PATH`         | App URL prefix. Defaults to `/poster-canvas`. Set to `/` for root deployment |
| `VITE_SUPABASE_URL`      | Supabase project URL (required for production Hard Gate + cloud codes)       |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon / publishable key                                              |
| `VITE_KRUMATH_ORIGIN`    | Optional local KruMath origin for sign-in / home redirects                   |

## Scripts

| Script              | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start the development server      |
| `npm run build`     | Production build                  |
| `npm run preview`   | Preview the production build      |
| `npm run lint`      | Run ESLint                        |
| `npm run format`    | Format with Prettier              |
| `npm run test`      | Run unit tests (Vitest)           |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

## Creating posters

Export a React component and use `@poster/core` helpers or plain HTML / Tailwind. (`@poster/core` is a **sandbox virtual import** provided by the preview runtime — not an npm workspace package.)

```tsx
import { Poster, Text, Stack } from "@poster/core";

export default function Poster() {
  return (
    <Poster className="bg-neutral-950 text-white p-24">
      <Stack gap={8}>
        <Text size="xl">Hello</Text>
      </Stack>
    </Poster>
  );
}
```

See [docs/poster-api.md](docs/poster-api.md) for the full component library.

## Embedding

Inject your own auth and storage before mounting `<PosterStudio />`:

```tsx
import { configureApp } from "@/lib/config";
import { PosterStudio } from "@/components/layout/PosterStudio";

configureApp({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  authProvider: myAuth,
  projectRepository: myRepo,
});

<PosterStudio />;
```

Details: [docs/integration.md](docs/integration.md).

## Deployment

```bash
npm run build
```

Client assets are written to `dist/client/`.

### Subpath hosting

The app defaults to `/poster-canvas` (e.g. `http://localhost:5173/poster-canvas`). Visiting `/` redirects there in dev/preview.

To host at the site root instead:

1. Set `VITE_BASE_PATH=/` in the environment.
2. Build and deploy `dist/client/`.

When embedding under a custom subpath (still the default `/poster-canvas`):

1. Keep or set `VITE_BASE_PATH=/poster-canvas` in the production environment.
2. Build and deploy `dist/client/` under that path.
3. Configure the host so all routes under `/poster-canvas/*` fall back to `index.html`.

See [docs/integration.md](docs/integration.md#subpath-deployment).

## Project structure

```
src/
├── components/   # UI (editor, preview, layout, dialogs)
├── core/         # Compiler, sandbox bridge, export
├── data/         # Templates and size presets
├── hooks/        # Sandbox bridge, debounced render, shortcuts
├── lib/          # Config, storage, auth adapters
├── routes/       # TanStack Start routes
└── stores/       # Zustand state slices

public/sandbox/   # Isolated preview runtime (Babel + React)
docs/             # Architecture and API documentation
```

## Documentation

| Document                             | Topic                        |
| ------------------------------------ | ---------------------------- |
| [Architecture](docs/architecture.md) | Layers, data flow, security  |
| [Rendering](docs/rendering.md)       | Sandbox preview pipeline     |
| [Exporting](docs/exporting.md)       | Export formats and flow      |
| [Templates](docs/templates.md)       | Starter templates            |
| [Poster API](docs/poster-api.md)     | `@poster/core` components    |
| [Integration](docs/integration.md)   | Embedding and subpath deploy |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Before opening a pull request:

```bash
npm run lint
npm run test
npm run typecheck
```

## License

[MIT](LICENSE)
