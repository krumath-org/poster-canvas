# Exporting

Export runs in the preview sandbox (browser). Raster formats use [html-to-image](https://github.com/bubkoo/html-to-image); PDF uses [jsPDF](https://github.com/parallax/jsPDF); SVG uses [dom2svg](https://www.npmjs.com/package/dom2svg); PSD uses [ag-psd](https://github.com/Agamnentzar/ag-psd); PPTX uses [PptxGenJS](https://gitbrent.github.io/PptxGenJS/); XLSX uses SheetJS.

## Fonts (WYSIWYG)

Poster body fonts (**IBM Plex Sans**, **Kantumruy Pro**) are **same-origin** WOFF2 files under `public/sandbox/vendor/fonts/` (see `poster-fonts.css`). This matches the KaTeX vendor pattern and avoids Google Fonts unicode-range / re-fetch drift during export.

Before each raster capture the sandbox:

1. Calls `waitForPosterFonts()` (`fonts.load` with Khmer + Latin samples, then `fonts.check`)
2. Builds options via `buildHtmlToImageOptions()` with a **session-cached** `fontEmbedCSS` from `html-to-image.getFontEmbedCSS(..., { preferredFontFormat: 'woff2' })`
3. Sets `cacheBust: false` so same-origin font URLs are not rewritten with query strings

PNG / JPG / WebP / PDF / PSD / PPTX all share these options so Khmer metrics match the live preview.

## WebGL / 3D capture

html-to-image cannot read WebGL buffers. Before every DOM capture the sandbox:

1. Hides leva / Theatre studio debug chrome
2. Advances registered R3F canvases once
3. Snapshots each WebGL canvas with `toDataURL` into a temporary `<img>`, hides the live canvas
4. Runs the existing capture path
5. Restores canvases and debug UI in `finally`

Use `Canvas3D` from `@poster/core` so `preserveDrawingBuffer` is on and canvases register for freeze. **3D is always rasterized** in exports (including SVG — the GL frame becomes an embedded bitmap, not editable meshes).

## Formats

| Group    | Format           | Notes                                                                                |
| -------- | ---------------- | ------------------------------------------------------------------------------------ |
| Image    | PNG / JPG / WebP | Raster at adaptive scale (see below)                                                 |
| Vector   | SVG              | Illustrator-compatible (no `foreignObject`); canonical vector                        |
| Vector   | EPS              | From full-page RGB raster of the poster (unsupported vectors never silently dropped) |
| Editable | PSD              | Layered bitmap layers via `capturePosterLayers()`                                    |
| Editable | PPTX             | One custom-sized slide, full-bleed raster (`px / 96` inches)                         |
| Document | PDF              | JPEG-embedded page, size-banded ~3–5 MB                                              |
| Data     | CSV / XLSX       | `Metric` / `Table` extraction only; fails if none                                    |

## Quality & scale

- Default raster scale **3** (`DEFAULT_EXPORT_SCALE`); PDF starts at **4**.
- **Adaptive cap:** `max(width,height) × scale ≤ MAX_EXPORT_EDGE_PX` (**8192**). Memory-safety guard for A3/A4 @ 300 dpi — not an absolute OOM guarantee.
- PNG/JPG/WebP may scale up toward **6** (after cap) if under 3 MB.
- PDF scales within 3–5 MB band.
- SVG / CSV / XLSX ignore raster scale loops.
- EPS / PSD / PPTX use the effective raster scale for the artboard.

Constants: `src/core/export/exportDefaults.ts` (mirrored in `public/sandbox/exportHelpers.js`). Capture option builders live only in `exportHelpers.js` (`buildHtmlToImageOptions`, `waitForPosterFonts`).

## Layered PSD

1. `@poster/core` sets `data-poster-layer*` (see [poster-api.md](./poster-api.md)).
2. `capturePosterLayers()` returns bottom-to-top: Background → Content (unmarked, holes for marked) → marked layers (DOM order) → Logo.
3. Assembled with `ag-psd`.

## Architecture

UI → `SandboxExporter` → sandbox `export` message → `export-done` / `export-failed`. Timeout **120s**.

```typescript
interface PosterExporter {
  export(request: ExportRequest): Promise<ExportResult>;
}
```

## Download

`downloadData()` supports text (SVG/EPS/CSV) and large binary data-URLs (PSD/PPTX/XLSX) via Blob object URLs.

## UI

- Toolbar **Export** menu grouped: Image / Vector / Editable / Document / Data
- Command palette: matching Export · * groups
