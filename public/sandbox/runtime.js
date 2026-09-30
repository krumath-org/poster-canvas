/**
 * Poster component library available to user code as `@poster/core`.
 * Runs inside the sandboxed preview iframe only.
 */
import React from "https://esm.sh/react@19.2.0";
import { splitMathSegments } from "./splitMathSegments.js";


const h = React.createElement;

const px = (v) => (typeof v === "number" ? `${v}px` : v);

/**
 * Stable export metadata for PSD / data exporters.
 * Author-supplied data-poster-layer* wins over defaults.
 */
function layerAttrs(type, name, rest = {}) {
  const { "data-poster-layer": userLayer, "data-poster-layer-name": userName, ...clean } = rest;
  return {
    ...clean,
    "data-poster-layer": userLayer ?? type,
    "data-poster-layer-name": userName ?? name ?? type,
  };
}

function getKatex() {
  return typeof globalThis !== "undefined" ? globalThis.katex : undefined;
}

function resolveTexSource(tex, children) {
  if (typeof tex === "string") return tex;
  if (typeof children === "string") return children;
  if (Array.isArray(children) && children.every((c) => typeof c === "string")) {
    return children.join("");
  }
  return "";
}

/**
 * Render TeX/KaTeX to HTML. Prefer `<Math tex="..." />` or `$...$` inside `<Text>`.
 * Aliases: Latex, KaTeX.
 * Local name avoids shadowing the built-in Math object used by charts (cos/sin/max/…).
 */
function MathComponent({
  tex,
  children,
  display = false,
  macros,
  color,
  size,
  className = "",
  style = {},
  throwOnError = false,
}) {
  const expr = resolveTexSource(tex, children);
  const katex = getKatex();
  const tag = display ? "div" : "span";
  const baseStyle = {
    color,
    display: display ? "block" : "inline-block",
    ...(size != null ? { fontSize: px(size) } : {}),
    ...style,
  };

  const mathLayer = layerAttrs(display ? "block-math" : "math", display ? "BlockMath" : "Math");

  if (!katex || typeof katex.renderToString !== "function") {
    return h(
      tag,
      {
        className,
        style: { ...baseStyle, color: color ?? "#b91c1c", fontFamily: "monospace" },
        ...mathLayer,
      },
      expr || "[KaTeX unavailable]",
    );
  }

  try {
    const html = katex.renderToString(expr, {
      displayMode: Boolean(display),
      throwOnError: Boolean(throwOnError),
      output: "html",
      colorIsTextColor: true,
      trust: false,
      minRuleThickness: 0.05,
      macros: macros && typeof macros === "object" ? macros : undefined,
    });
    return h(tag, {
      className,
      style: baseStyle,
      dangerouslySetInnerHTML: { __html: html },
      ...mathLayer,
    });
  } catch (error) {
    return h(
      tag,
      {
        className,
        style: { ...baseStyle, color: "#b91c1c", fontFamily: "monospace", whiteSpace: "pre-wrap" },
        title: String(error?.message ?? error),
        ...mathLayer,
      },
      expr,
    );
  }
}

export { MathComponent as Math };

/** Display-mode math (block). Equivalent to `<Math display size={48} />`. */
export function BlockMath({ size = 48, ...props }) {
  return h(MathComponent, { ...props, size, display: true });
}

export const Latex = MathComponent;
export const KaTeX = MathComponent;

function renderTextWithMath(children) {
  if (typeof children === "string") {
    const segments = splitMathSegments(children);
    if (segments.length === 1 && segments[0].type === "text") {
      return segments[0].value;
    }
    return segments.map((seg, i) => {
      if (seg.type === "text") return seg.value;
      return h(MathComponent, { key: i, tex: seg.value, display: seg.display });
    });
  }

  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === "string") {
        const rendered = renderTextWithMath(child);
        if (Array.isArray(rendered)) {
          return h(React.Fragment, { key: i }, ...rendered);
        }
        return rendered;
      }
      return child;
    });
  }

  return children;
}

export function Poster({
  children,
  background = "#ffffff",
  color = "#111111",
  className = "",
  style = {},
  ...rest
}) {
  return h(
    "div",
    {
      className: `relative w-full h-full flex flex-col overflow-hidden ${className}`,
      style: { background, color, ...style },
      "data-poster-root": "true",
      "data-poster-background": typeof background === "string" ? background : undefined,
      ...layerAttrs("poster", "Poster", rest),
    },
    children,
  );
}

export function Box({ children, className = "", padding, style = {}, ...rest }) {
  return h(
    "div",
    {
      className,
      style: { padding: px(padding), ...style },
      ...layerAttrs("box", "Box", rest),
    },
    children,
  );
}

export function Text({
  children,
  size = 32,
  weight = 400,
  color,
  align,
  lineHeight = 1.2,
  className = "",
  style = {},
  ...rest
}) {
  return h(
    "div",
    {
      className,
      style: {
        fontSize: px(size),
        fontWeight: weight,
        color,
        textAlign: align,
        lineHeight,
        ...style,
      },
      ...layerAttrs("text", "Text", rest),
    },
    renderTextWithMath(children),
  );
}

export function Image({
  src,
  alt = "",
  width,
  height,
  fit = "cover",
  className = "",
  style = {},
  ...rest
}) {
  return h("img", {
    src,
    alt,
    className,
    style: { width: px(width), height: px(height), objectFit: fit, ...style },
    ...layerAttrs("image", "Image", rest),
  });
}

/** Set by the sandbox controller before each render. */
let posterAssets = {};

export function setPosterAssets(next) {
  posterAssets = next && typeof next === "object" ? next : {};
}

export function getPosterAssets() {
  return posterAssets;
}

/**
 * Inline brand logo for user code. Reads the project asset registry.
 * When present in JSX, the parent skips the automatic corner overlay.
 */
export function Logo({ maxHeight = 64, className = "", style = {}, alt = "Logo", ...rest }) {
  const logo = posterAssets?.logo;
  if (!logo?.dataUrl) return null;
  return h("img", {
    src: logo.dataUrl,
    alt,
    className,
    style: {
      maxHeight: px(maxHeight),
      width: "auto",
      height: "auto",
      objectFit: "contain",
      display: "block",
      ...style,
    },
    ...layerAttrs("logo", "Logo", rest),
  });
}

function cornerStyle(corner, padding) {
  const pad = px(padding);
  const base = { position: "absolute", zIndex: 20, pointerEvents: "none" };
  switch (corner) {
    case "top-right":
      return { ...base, top: pad, right: pad };
    case "bottom-left":
      return { ...base, bottom: pad, left: pad };
    case "bottom-right":
      return { ...base, bottom: pad, right: pad };
    case "top-left":
    default:
      return { ...base, top: pad, left: pad };
  }
}

/** Sandbox-only overlay driven by logoSlot (not typically imported by users). */
export function LogoOverlay({ slot, src }) {
  if (!slot || !src) return null;
  const maxHeight = slot.maxHeight ?? 64;
  const padding = slot.padding ?? 40;
  return h("img", {
    src,
    alt: "",
    "aria-hidden": "true",
    style: {
      ...cornerStyle(slot.corner, padding),
      maxHeight: px(maxHeight),
      width: "auto",
      height: "auto",
      objectFit: "contain",
      display: "block",
    },
    ...layerAttrs("logo", "Logo"),
  });
}

export function Shape({
  width = 200,
  height = 200,
  color = "#000",
  radius = 0,
  className = "",
  style = {},
  ...rest
}) {
  return h("div", {
    className,
    style: {
      width: px(width),
      height: px(height),
      background: color,
      borderRadius: px(radius),
      ...style,
    },
    ...layerAttrs("shape", "Shape", rest),
  });
}

export function Circle({
  size = 200,
  color = "#000",
  className = "",
  children,
  style = {},
  ...rest
}) {
  return h(
    "div",
    {
      className: `flex items-center justify-center ${className}`,
      style: {
        width: px(size),
        height: px(size),
        background: color,
        borderRadius: "9999px",
        ...style,
      },
      ...layerAttrs("circle", "Circle", rest),
    },
    children,
  );
}

export function Line({
  length = 200,
  thickness = 2,
  color = "#000",
  vertical = false,
  className = "",
  style = {},
  ...rest
}) {
  return h("div", {
    className,
    style: {
      width: vertical ? px(thickness) : px(length),
      height: vertical ? px(length) : px(thickness),
      background: color,
      ...style,
    },
    ...layerAttrs("line", "Line", rest),
  });
}

export function Stack({
  children,
  gap = 16,
  direction = "column",
  align,
  justify,
  className = "",
  style = {},
  ...rest
}) {
  return h(
    "div",
    {
      className: `flex ${className}`,
      style: {
        flexDirection: direction,
        gap: px(gap),
        alignItems: align,
        justifyContent: justify,
        ...style,
      },
      ...layerAttrs("stack", "Stack", rest),
    },
    children,
  );
}

export function Grid({ children, columns = 2, gap = 16, className = "", style = {}, ...rest }) {
  return h(
    "div",
    {
      className,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: px(gap),
        ...style,
      },
      ...layerAttrs("grid", "Grid", rest),
    },
    children,
  );
}

export function Divider({ color = "#e5e7eb", thickness = 2, className = "", style = {}, ...rest }) {
  return h("div", {
    className,
    style: { height: px(thickness), background: color, width: "100%", ...style },
    ...layerAttrs("divider", "Divider", rest),
  });
}

export function Badge({
  children,
  color = "#111",
  background = "#f3f4f6",
  className = "",
  style = {},
  ...rest
}) {
  return h(
    "span",
    {
      className: `inline-flex items-center self-start tracking-[0.2em] ${className}`,
      style: {
        background,
        color,
        padding: "10px 22px",
        borderRadius: 6,
        fontSize: 24,
        fontWeight: 600,
        ...style,
      },
      ...layerAttrs("badge", "Badge", rest),
    },
    children,
  );
}

export function Button({
  children,
  background = "#111",
  color = "#fff",
  className = "",
  style = {},
  ...rest
}) {
  return h(
    "span",
    {
      className: `inline-flex items-center self-start ${className}`,
      style: {
        background,
        color,
        padding: "22px 44px",
        borderRadius: 8,
        fontSize: 32,
        fontWeight: 600,
        ...style,
      },
      ...layerAttrs("button", "Button", rest),
    },
    children,
  );
}

export function Icon({
  name = "star",
  size = 48,
  color = "currentColor",
  className = "",
  ...rest
}) {
  const paths = {
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z",
    check: "M20 6L9 17l-5-5",
    arrow: "M5 12h14M13 6l6 6-6 6",
    heart:
      "M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 000-7.8z",
    bolt: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  };
  return h(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      ...layerAttrs("icon", "Icon", rest),
    },
    h("path", { d: paths[name] ?? paths.star }),
  );
}

export function QRCode({
  value = "",
  size = 200,
  color = "#000",
  background = "#fff",
  className = "",
  ...rest
}) {
  // Deterministic decorative matrix — not a scannable QR code (see docs/poster-api.md).
  const cells = 21;
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 2147483647;
  const rects = [];
  let seed = hash || 12345;
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const corner = (x < 7 && y < 7) || (x > cells - 8 && y < 7) || (x < 7 && y > cells - 8);
      const on = corner
        ? x % 6 === 0 || y % 6 === 0 || (x > 1 && x < 5 && y > 1 && y < 5)
        : seed % 100 < 45;
      if (on) rects.push(h("rect", { key: `${x}-${y}`, x, y, width: 1, height: 1, fill: color }));
    }
  }
  return h(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: `0 0 ${cells} ${cells}`,
      shapeRendering: "crispEdges",
      ...layerAttrs("qrcode", "QRCode", rest),
    },
    h("rect", { width: cells, height: cells, fill: background }),
    rects,
  );
}

/* ---------------------------------- charts --------------------------------- */

export function BarChart({
  data = [],
  labels = [],
  height = 300,
  color = "#111",
  gap = 12,
  className = "",
  ...rest
}) {
  const max = Math.max(...data, 1);
  return h(
    "div",
    {
      className,
      style: { height: px(height), display: "flex", alignItems: "flex-end", gap: px(gap) },
      ...layerAttrs("bar-chart", "BarChart", rest),
    },
    data.map((value, i) =>
      h(
        "div",
        {
          key: i,
          style: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            height: "100%",
          },
        },
        h("div", {
          style: { height: `${(value / max) * 100}%`, background: color, borderRadius: 4 },
        }),
        labels[i]
          ? h(
              "div",
              { style: { marginTop: 10, fontSize: 22, opacity: 0.7, textAlign: "center" } },
              labels[i],
            )
          : null,
      ),
    ),
  );
}

export function LineChart({
  data = [],
  height = 300,
  color = "#111",
  strokeWidth = 4,
  fill = true,
  className = "",
  ...rest
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const points = data.map((v, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * 100 : 0;
    const y = 100 - ((v - min) / span) * 100;
    return `${x},${y}`;
  });
  return h(
    "svg",
    {
      className,
      width: "100%",
      height,
      viewBox: "0 0 100 100",
      preserveAspectRatio: "none",
      ...layerAttrs("line-chart", "LineChart", rest),
    },
    fill && points.length
      ? h("polygon", { points: `0,100 ${points.join(" ")} 100,100`, fill: color, opacity: 0.18 })
      : null,
    h("polyline", {
      points: points.join(" "),
      fill: "none",
      stroke: color,
      strokeWidth: strokeWidth / 4,
      vectorEffect: "non-scaling-stroke",
    }),
  );
}

export function PieChart({ data = [], size = 260, className = "", ...rest }) {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0) || 1;
  let angle = -Math.PI / 2;
  const r = 50;
  const slices = data.map((d, i) => {
    const share = (d.value || 0) / total;
    const end = angle + share * Math.PI * 2;
    const large = share > 0.5 ? 1 : 0;
    const x1 = 50 + r * Math.cos(angle);
    const y1 = 50 + r * Math.sin(angle);
    const x2 = 50 + r * Math.cos(end);
    const y2 = 50 + r * Math.sin(end);
    angle = end;
    return h("path", {
      key: i,
      d: `M50,50 L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`,
      fill: d.color || `hsl(${(i * 67) % 360} 70% 55%)`,
    });
  });
  return h(
    "svg",
    {
      className,
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      ...layerAttrs("pie-chart", "PieChart", rest),
    },
    slices,
  );
}

export function Progress({
  label,
  value = 0,
  color = "#111",
  background = "#e5e7eb",
  className = "",
  ...rest
}) {
  return h(
    "div",
    { className, ...layerAttrs("progress", "Progress", rest) },
    label
      ? h(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: 28,
              marginBottom: 10,
            },
          },
          h("span", null, label),
          h("span", null, `${value}%`),
        )
      : null,
    h(
      "div",
      { style: { height: 18, background, borderRadius: 999, overflow: "hidden" } },
      h("div", {
        style: {
          width: `${Math.min(Math.max(value, 0), 100)}%`,
          height: "100%",
          background: color,
        },
      }),
    ),
  );
}

export function Metric({ label, value, delta, className = "", ...rest }) {
  const metricJson = JSON.stringify({
    label: label ?? "",
    value: value ?? "",
    delta: delta ?? "",
  });
  return h(
    "div",
    {
      className,
      style: { border: "2px solid rgba(0,0,0,0.08)", borderRadius: 10, padding: 28 },
      "data-poster-metric": metricJson,
      ...layerAttrs("metric", typeof label === "string" && label ? label : "Metric", rest),
    },
    h("div", { style: { fontSize: 26, opacity: 0.6 } }, label),
    h("div", { style: { fontSize: 68, fontWeight: 700, lineHeight: 1.1 } }, value),
    delta ? h("div", { style: { fontSize: 26, opacity: 0.7 } }, delta) : null,
  );
}

export function Table({ columns = [], rows = [], fontSize = 28, className = "", ...rest }) {
  const tableJson = JSON.stringify({ columns, rows });
  return h(
    "table",
    {
      className,
      style: { width: "100%", borderCollapse: "collapse", fontSize },
      "data-poster-table": tableJson,
      ...layerAttrs("table", "Table", rest),
    },
    h(
      "thead",
      null,
      h(
        "tr",
        null,
        columns.map((c, i) =>
          h(
            "th",
            {
              key: i,
              style: {
                textAlign: "left",
                padding: "0.5em 0",
                borderBottom: "3px solid currentColor",
                opacity: 0.7,
              },
            },
            c,
          ),
        ),
      ),
    ),
    h(
      "tbody",
      null,
      rows.map((row, ri) =>
        h(
          "tr",
          { key: ri },
          row.map((cell, ci) =>
            h(
              "td",
              {
                key: ci,
                style: { padding: "0.5em 0", borderBottom: "1px solid rgba(0,0,0,0.12)" },
              },
              cell,
            ),
          ),
        ),
      ),
    ),
  );
}

/**
 * Export-safe R3F Canvas. The real implementation is installed on
 * `globalThis.__posterCanvas3D` when the Poster3D vendor bundle loads.
 */
export function Canvas3D(props) {
  const Impl = typeof globalThis !== "undefined" ? globalThis.__posterCanvas3D : null;
  if (typeof Impl === "function") {
    return h(Impl, props);
  }
  throw new Error(
    "Canvas3D requires the 3D runtime. Import Canvas3D from @poster/core (or use @react-three/fiber) and Run again.",
  );
}
