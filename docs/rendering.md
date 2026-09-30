# Rendering

## Preprocess (parent)

`preprocess()` in `src/core/compiler/preprocess.ts`:

- Removes React imports (sandbox provides `React` plus common hooks as locals)
- Rewrites `@poster/core` → `PosterCore` destructuring
- Rewrites allowlisted 3D packages → `Poster3D.*` (e.g. `@react-three/fiber` → `Poster3D.fiber`)
- Sets `features.r3f` when 3D imports or `Canvas3D` from `@poster/core` are present
- Converts `export default` to `const __default = …`
- Emits diagnostics for unsupported imports or missing poster component

## Sandbox (iframe)

`public/sandbox/main.js`:

1. Receives `{ type: "render", code, width, height, features? }`
2. When `features.r3f`, lazy-loads `public/sandbox/vendor/r3f/poster3d.js` (built via `npm run build:sandbox-r3f`)
3. Compiles with Babel (TSX + classic React runtime) on React 19
4. Executes via `new Function(React, PosterCore, Poster3D, assets)` **inside the iframe only**
5. Renders with React + error boundary; waits for fonts; when R3F, waits for WebGL paint
6. Posts `rendered`, `compile-error`, or `runtime-error` to parent
7. Receives `{ type: "clear" }` to blank the poster (failed Run / empty code)

## Manual Run

`usePreviewRender` updates the preview only when:

- **Run** is clicked (or Cmd/Ctrl+Enter / command palette)
- A project or template is loaded
- The sandbox iframe becomes ready or is reloaded
- Canvas size, assets, or logo slot change

Typing in the editor does **not** auto-render. The Run button highlights when the preview is out of date.

## Preview controls

- **Fit** — scale poster to panel (never upscale past 100%)
- **Zoom** — manual scale 5%–400%
- **Grid** — overlay alignment grid
- **Background** — dark / light / checkerboard
- **Reload** — remount sandbox iframe

On preprocess, compile, or runtime errors, the poster is cleared and diagnostics appear in the StatusBar console (auto-expanded).
