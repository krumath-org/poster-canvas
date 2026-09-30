# Poster API (`@poster/core`)

Components are provided inside the sandbox runtime (`public/sandbox/runtime.js`). Import them in your poster code:

```tsx
import { Poster, Box, Text, Stack, Grid } from "@poster/core";
```

## Layout

| Component | Description                                |
| --------- | ------------------------------------------ |
| `Poster`  | Root canvas wrapper                        |
| `Box`     | Generic container                          |
| `Stack`   | Flex column/row stack (`gap`, `direction`) |
| `Grid`    | CSS grid (`cols`, `gap`)                   |
| `Divider` | Horizontal rule                            |

## Typography & media

| Component   | Description                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------- |
| `Text`      | Styled text (`size`, `weight`, `color`); auto-renders `$…$` / `$$…$$` / `\(...\)` / `\[…\]` |
| `Math`      | Inline KaTeX (`tex`, or string `children`; optional `size`)                                 |
| `BlockMath` | Display (block) KaTeX (default `size={48}`)                                                 |
| `Image`     | `<img>` with object-fit helpers                                                             |
| `Logo`      | Brand mark from the project logo asset                                                      |
| `Icon`      | Lucide-style icon placeholder                                                               |
| `Badge`     | Small label chip                                                                            |
| `Button`    | Styled button                                                                               |
| `Canvas3D`  | Export-safe R3F WebGL canvas (`preserveDrawingBuffer`, export freeze registry)              |

`Latex` and `KaTeX` are aliases of `Math`.

### Canvas3D (WebGL)

Prefer `Canvas3D` over raw `@react-three/fiber` `Canvas` so PNG/PDF export captures the GL frame:

```tsx
import { Poster, Text, Canvas3D } from "@poster/core";
import { Environment, Center } from "@react-three/drei";

export default function PosterApp() {
  return (
    <Poster className="relative w-full h-full">
      <div className="absolute inset-0">
        <Canvas3D camera={{ position: [0, 0, 4] }} frameloop="demand">
          <ambientLight intensity={0.6} />
          <Environment preset="city" />
          <Center>
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="#2563EB" />
            </mesh>
          </Center>
        </Canvas3D>
      </div>
      <Text size={48} className="relative z-10 p-12">
        Hello 3D
      </Text>
    </Poster>
  );
}
```

Allowlisted companion imports (rewritten to `Poster3D` in the sandbox): `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-three/csg`, `@react-spring/three`, `@use-gesture/react`, `maath`, `leva`, `@theatre/core`, `@theatre/r3f`. Do not ship leva / Theatre studio UI in the final composition. Author GLB→JSX with the gltfjsx CLI; runtime loading uses `useGLTF` from drei.

### Math (KaTeX)

The sandbox vendors [KaTeX](https://katex.org/) (plus mhchem).

#### Math-only mode (just type LaTeX)

You do **not** need a React poster for simple equations. Put TeX in the editor and click **Run**:

```text
x^2
```

```text
$e^{i\pi}+1=0$
```

```text
\frac{a}{b}
```

```text
Solve $x^2 + 1 = 0$ on the quiz
```

- Bare TeX (no `$`) → centered display math
- Text with `$…$` / `$$…$$` / `\(...\)` / `\[…\]` → mixed prose + math
- Full TSX posters still work as before (`export default function Poster() { … }`)

#### Full poster mode

Prefer explicit components for layouts:

```tsx
import { Poster, Text, Math, BlockMath } from "@poster/core";

export default function App() {
  return (
    <Poster className="p-24 bg-white text-slate-900">
      <Text size={48}>
        Inline via Text: $E = mc^2$ and \(\frac{a}
        {b}\)
      </Text>
      <Math tex="e^{i\pi}+1=0" />
      <BlockMath tex={String.raw`\sum_{n=1}^{N} n = \frac{N(N+1)}{2}`} />
      <BlockMath tex={String.raw`\begin{pmatrix}a&b\\c&d\end{pmatrix}`} />
      <Math tex={String.raw`\ce{CO2 + H2O}`} />
    </Poster>
  );
}
```

Prefer `String.raw` template literals (or carefully doubled `\\` in normal strings) so TeX backslashes survive JavaScript string parsing.

**Delimiters** (auto-parsed inside string children of `Text`): `$…$`, `$$…$$`, `\\(…\\)`, `\\[…\\]`. A lone `$` without a closer (e.g. `$50`) stays plain text. Escape a literal dollar with `\\$`.

**Props:** `tex`, `display`, `macros`, `color`, `className`, `style`, `throwOnError` (default `false` — shows red source instead of crashing).

**Limits:** KaTeX covers common math (see [supported functions](https://katex.org/docs/supported.html)), not full LaTeX documents, TikZ, or arbitrary `\usepackage`. Chemistry uses `\ce{…}` via mhchem.

### Brand logo

Upload a logo from the preview toolbar **Logo** control. By default the sandbox overlays it in a corner (`logoSlot`: TL / TR / BL / BR + max height).

For in-layout placement, import `Logo` (or use `assets.logo`):

```tsx
import { Poster, Logo } from "@poster/core";

export default function App() {
  return (
    <Poster>
      <div className="absolute top-10 left-10">
        <Logo maxHeight={48} />
      </div>
      {/* ... */}
    </Poster>
  );
}
```

When `<Logo` appears in your code, the automatic corner overlay is skipped so the mark is not drawn twice. The compile scope also exposes an `assets` object (`assets.logo?.dataUrl`) for custom `<Image src={assets.logo.dataUrl} />` usage.

### Default fonts

The sandbox loads **IBM Plex Sans** (Latin) and **Kantumruy Pro** (Khmer) from **same-origin** WOFF2 files (`public/sandbox/vendor/fonts/`), not Google Fonts. That keeps preview and html-to-image export on identical font bytes (important for Khmer line breaks). Khmer characters use Kantumruy Pro by default unless you set your own `font-family` via `style`, a Tailwind `font-*` class, or a custom `@font-face`.

```tsx
{
  /* Uses default stack (Kantumruy Pro for Khmer) */
}
<Text>សួស្តី · Hello</Text>;

{
  /* Override */
}
<p style={{ fontFamily: '"Noto Sans Khmer", sans-serif' }}>សួស្តី</p>;
```

## Shapes

| Component | Description                |
| --------- | -------------------------- |
| `Shape`   | Rectangle with fill/stroke |
| `Circle`  | Circle/ellipse             |
| `Line`    | SVG line                   |

## Data visualization

| Component   | Description                         |
| ----------- | ----------------------------------- |
| `BarChart`  | Bar chart from `{ label, value }[]` |
| `LineChart` | Line chart                          |
| `PieChart`  | Pie/donut chart                     |
| `Progress`  | Progress bar                        |
| `Metric`    | Large number + label                |
| `Table`     | Simple data table                   |

## Utilities

| Component | Description               |
| --------- | ------------------------- |
| `QRCode`  | Decorative QR placeholder |

Plain HTML elements and Tailwind classes also work inside the poster root.

## Export layer metadata

`@poster/core` components set stable attributes used by PSD / CSV / XLSX export:

| Attribute                | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| `data-poster-root`       | Set on `<Poster>`                            |
| `data-poster-background` | Solid background color string when provided  |
| `data-poster-layer`      | Layer type (`text`, `logo`, `table`, …)      |
| `data-poster-layer-name` | Human-readable layer name                    |
| `data-poster-metric`     | JSON `{ label, value, delta }` on `<Metric>` |
| `data-poster-table`      | JSON `{ columns, rows }` on `<Table>`        |

You can override `data-poster-layer` / `data-poster-layer-name` on any component. Raw HTML posters only get Background + Content + Logo unless you add the same attributes yourself.
