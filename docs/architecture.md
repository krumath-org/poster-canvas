# Architecture

Poster Studio is a client-only React application. User code is **never** evaluated in the main window.

## Layers

| Layer    | Location             | Role                                                 |
| -------- | -------------------- | ---------------------------------------------------- |
| UI       | `src/components/`    | Editor shell, dialogs, toolbars                      |
| State    | `src/stores/`        | Zustand slices: editor, preview, project, ui, export |
| Compiler | `src/core/compiler/` | Pure string preprocess (imports, export default)     |
| Bridge   | `src/core/renderer/` | `postMessage` to sandbox iframe                      |
| Export   | `src/core/export/`   | `PosterExporter` → sandbox export                    |
| Sandbox  | `public/sandbox/`    | Babel compile + React render + html-to-image         |

## Data flow

1. User edits code → `editorStore.code` (marks preview stale; does not auto-render)
2. User clicks **Run** (or loads a project) → `usePreviewRender` runs `preprocess()` in the parent
3. Preprocessed script plus project `assets` / `logoSlot` sent to iframe via `SandboxBridge.render()` — or `clear()` on preprocess failure
4. Sandbox compiles with Babel (`React`, `PosterCore`, `Poster3D`, `assets` in scope), executes in an isolated document, optionally overlays the logo slot, posts diagnostics back
5. `previewStore` holds status, stale flag, and error markers for Monaco + status bar

Logo uploads live on `PosterProject.assets` (data URLs) and are not inlined into the editor buffer.

## 3D (R3F)

- Allowlisted packages are rewritten onto a `Poster3D` namespace and only loaded when preprocess sets `features.r3f`
- Prefer `Canvas3D` from `@poster/core` (forces `preserveDrawingBuffer`, registers canvases for export freeze)
- Build the vendor bundle with `npm run build:sandbox-r3f` (also runs on `predev` / `prebuild`)

## Replaceable services

`configureApp()` in `src/lib/config.ts` injects:

- `ProjectRepository` — default: `LocalProjectRepository` (localStorage)
- `AuthProvider` — default: `MockAuthProvider`
- `apiBaseUrl` — optional future backend

## Security

- Parent app: no `eval` / `new Function` on user code
- Sandbox iframe: controlled environment with fixed `PosterCore` / lazy `Poster3D` modules
- Unsupported imports are stripped with warnings
- 3D allowlist: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/csg`, `@react-spring/three`, `@use-gesture/react`, `maath`, `leva`, `@theatre/core`, `@theatre/r3f`

## State stores

- **editorStore** — code buffer, dirty flag, run nonce
- **previewStore** — zoom, fit, grid, diagnostics, render status
- **projectStore** — active project, CRUD via repository
- **uiStore** — theme, modals, workspace tab
