/**
 * Sandbox controller.
 *
 * The parent app never evaluates user code. It sends preprocessed source here
 * and this isolated document compiles (Babel) and executes it, reporting
 * diagnostics back over postMessage.
 */
import React from "https://esm.sh/react@19.2.0";
import * as ReactNS from "https://esm.sh/react@19.2.0";
import * as ReactDOM from "https://esm.sh/react-dom@19.2.0";
import * as ReactDOMClient from "https://esm.sh/react-dom@19.2.0/client";
import { createRoot } from "https://esm.sh/react-dom@19.2.0/client";
import * as JsxRuntime from "https://esm.sh/react@19.2.0/jsx-runtime";
import * as JsxDevRuntime from "https://esm.sh/react@19.2.0/jsx-dev-runtime";
import * as Babel from "https://esm.sh/@babel/standalone@7.26.4";
import * as PosterCore from "./runtime.js";
import {
  arrayBufferToBase64,
  buildHtmlToImageOptions,
  buildLayerPlan,
  buildSectionedCsv,
  clampExportScale,
  collectTopLevelMarked,
  CONTAINER_LAYER_TYPES,
  detectSolidBackground,
  exportScaleForFormat,
  fillSolidCanvas,
  hasPosterData,
  isRasterExportFormat,
  LOSSY_EXPORT_QUALITY,
  MAX_EXPORT_SCALE,
  MAX_PDF_EXPORT_BYTES,
  MAX_PDF_EXPORT_SCALE,
  MIN_EXPORT_BYTES,
  MIN_PDF_EXPORT_BYTES,
  PDF_EXPORT_QUALITY,
  PPTX_PX_PER_INCH,
  preparePosterDomForExport,
  sanitizeIllustratorSvg,
  scanDomForLayers,
  scrapePosterData,
  waitForPosterFonts,
} from "./exportHelpers.js";
import {
  freezeWebGLCanvasesForExport,
  hideDebugOverlays,
  waitForWebGLReady,
} from "./webglExportFreeze.js";

/** @type {null | Record<string, unknown>} */
let poster3dModule = null;
let poster3dLoadPromise = null;

const REACT_CDN = "https://esm.sh/react@19.2.0";
const REACT_DOM_CDN = "https://esm.sh/react-dom@19.2.0";

function cjsExport(mod) {
  return mod?.default ?? mod;
}

/**
 * CJS chunks inside poster3d.js call require("react") or require(CDN URL).
 * Map both bare ids and remapped esm.sh paths to the shared ESM React instance.
 */
function installReactRequireShim() {
  const react = cjsExport(ReactNS);
  const reactDom = cjsExport(ReactDOM);
  const reactDomClient = cjsExport(ReactDOMClient);
  const jsxRuntime = cjsExport(JsxRuntime);
  const jsxDevRuntime = cjsExport(JsxDevRuntime);
  const table = {
    react,
    "react/jsx-runtime": jsxRuntime,
    "react/jsx-dev-runtime": jsxDevRuntime,
    "react-dom": reactDom,
    "react-dom/client": reactDomClient,
    [REACT_CDN]: react,
    [`${REACT_CDN}/jsx-runtime`]: jsxRuntime,
    [`${REACT_CDN}/jsx-dev-runtime`]: jsxDevRuntime,
    [REACT_DOM_CDN]: reactDom,
    [`${REACT_DOM_CDN}/client`]: reactDomClient,
  };
  const previous = typeof globalThis.require === "function" ? globalThis.require : null;
  globalThis.require = (id) => {
    if (Object.prototype.hasOwnProperty.call(table, id)) {
      return table[id];
    }
    if (previous) return previous(id);
    throw new Error(`Sandbox require: unhandled module "${id}"`);
  };
}

async function ensurePoster3D() {
  if (poster3dModule) return poster3dModule;
  if (!poster3dLoadPromise) {
    // Deps in poster3d.js may touch process.env; the iframe has no Node process.
    if (typeof globalThis.process === "undefined") {
      globalThis.process = { env: { NODE_ENV: "production" } };
    }
    installReactRequireShim();
    poster3dLoadPromise = import("./vendor/r3f/poster3d.js")
      .then((mod) => {
        const ns = mod.Poster3D ?? mod.default ?? mod;
        poster3dModule = ns;
        if (ns?.Canvas3D) {
          globalThis.__posterCanvas3D = ns.Canvas3D;
        }
        return ns;
      })
      .catch((error) => {
        poster3dLoadPromise = null;
        throw error;
      });
  }
  return poster3dLoadPromise;
}

const rootEl = document.getElementById("poster-root");
rootEl.innerHTML = "";
const reactRoot = createRoot(rootEl);

let currentAssets = {};
let currentLogoSlot = null;

function vendorUrl(path) {
  return new URL(path, import.meta.url).href;
}

function loadStylesheet(href) {
  if ([...document.querySelectorAll("link[rel='stylesheet']")].some((l) => l.href === href)) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if ([...document.scripts].some((s) => s.src === src)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

/** Ensure KaTeX + mhchem exist even if a cached index.html omitted the script tags. */
async function ensureKatex() {
  loadStylesheet(vendorUrl("./vendor/katex/katex.min.css"));
  if (typeof globalThis.katex?.renderToString !== "function") {
    await loadScript(vendorUrl("./vendor/katex/katex.min.js"));
  }
  if (!globalThis.__posterMhchemLoaded) {
    await loadScript(vendorUrl("./vendor/katex/mhchem.min.js"));
    globalThis.__posterMhchemLoaded = true;
  }
}

function send(message) {
  parent.postMessage({ source: "poster-sandbox", ...message }, "*");
}

function toDiagnostic(error, kind) {
  const message = String(error?.message ?? error);
  const loc = error?.loc;
  const match = /\((\d+):(\d+)\)/.exec(message);
  return {
    severity: "error",
    kind,
    message: message.replace(/^.*?:\s*/, "").split("\n")[0] || message,
    line: loc?.line ?? (match ? Number(match[1]) : undefined),
    column: loc?.column ?? (match ? Number(match[2]) : undefined),
  };
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    send({ type: "runtime-error", diagnostic: toDiagnostic(error, "runtime") });
  }
  render() {
    if (this.state.error) return null;
    return this.props.children;
  }
}

function setSize(width, height) {
  rootEl.style.width = `${width}px`;
  rootEl.style.height = `${height}px`;
}

function compile(code, assets, Poster3D) {
  const output = Babel.transform(code, {
    filename: "poster.tsx",
    presets: [["react", { runtime: "classic" }], "typescript"],
    sourceType: "script",
  });
  // Preprocess strips `import … from "react"`, so expose common hooks/helpers as
  // locals. Poster code can use `useRef` / `useState` without React.useRef.
  const body = `const {
  useState, useEffect, useLayoutEffect, useMemo, useCallback, useRef,
  useReducer, useContext, useId, useImperativeHandle, useDeferredValue,
  useTransition, useSyncExternalStore, Fragment, createElement, createContext,
  forwardRef, memo, lazy, Suspense, Children, cloneElement, isValidElement,
} = React;
${output.code}
;return typeof __default !== "undefined" ? __default : (typeof Poster !== "undefined" ? Poster : null);`;
  // eslint-disable-next-line no-new-func -- intentional: sandboxed document only
  const factory = new Function("React", "PosterCore", "Poster3D", "assets", body);
  return factory(React, PosterCore, Poster3D ?? {}, assets);
}

function clearPreview() {
  reactRoot.render(null);
}

async function render(payload) {
  setSize(payload.width, payload.height);
  currentAssets = payload.assets && typeof payload.assets === "object" ? payload.assets : {};
  currentLogoSlot = payload.logoSlot ?? null;
  PosterCore.setPosterAssets(currentAssets);

  const needsR3f = Boolean(payload.features?.r3f);
  let Poster3D = {};
  if (needsR3f) {
    try {
      Poster3D = await ensurePoster3D();
    } catch (error) {
      clearPreview();
      send({
        type: "compile-error",
        diagnostic: {
          severity: "error",
          kind: "compile",
          message: `Failed to load 3D runtime: ${String(error?.message ?? error)}`,
        },
      });
      return;
    }
  }

  let Component;
  try {
    Component = compile(payload.code, currentAssets, Poster3D);
  } catch (error) {
    clearPreview();
    send({
      type: "compile-error",
      diagnostic: toDiagnostic(error, "compile"),
    });
    return;
  }
  if (typeof Component !== "function") {
    clearPreview();
    send({
      type: "compile-error",
      diagnostic: {
        severity: "error",
        kind: "compile",
        message: "The default export is not a React component function.",
      },
    });
    return;
  }
  try {
    const overlay =
      currentLogoSlot && currentAssets.logo?.dataUrl
        ? React.createElement(PosterCore.LogoOverlay, {
            slot: currentLogoSlot,
            src: currentAssets.logo.dataUrl,
          })
        : null;
    reactRoot.render(
      React.createElement(
        ErrorBoundary,
        { key: Date.now() },
        React.createElement(
          "div",
          { className: "relative w-full h-full" },
          React.createElement(Component),
          overlay,
        ),
      ),
    );
    // Wait for poster + KaTeX webfonts so preview/export aren't missing glyphs.
    await Promise.race([
      waitForPosterFonts({ timeoutMs: 8000 }),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    if (needsR3f) {
      await waitForWebGLReady(4000);
    }
    send({ type: "rendered" });
  } catch (error) {
    clearPreview();
    send({ type: "runtime-error", diagnostic: toDiagnostic(error, "runtime") });
  }
}

async function loadHtmlToImage() {
  return import("https://esm.sh/html-to-image@1.11.13");
}

/** Keep in sync with src/core/export/dataUrlBytes.ts */
function dataUrlByteLength(dataUrl) {
  const i = dataUrl.indexOf(",");
  if (i < 0) return dataUrl.length;
  const header = dataUrl.slice(0, i);
  const payload = dataUrl.slice(i + 1);
  if (/;base64/i.test(header)) {
    const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
    return Math.max(0, Math.floor((payload.length * 3) / 4) - padding);
  }
  try {
    return decodeURIComponent(payload).length;
  } catch {
    return payload.length;
  }
}

function hideElements(els, hidden) {
  const prev = [];
  for (const el of els) {
    prev.push({ el, visibility: el.style.visibility });
    el.style.visibility = hidden ? "hidden" : el.style.visibility;
  }
  return () => {
    for (const { el, visibility } of prev) el.style.visibility = visibility;
  };
}

async function captureCanonicalSvg() {
  const w = rootEl.offsetWidth;
  const h = rootEl.offsetHeight;
  const mod = await import("https://esm.sh/dom2svg@1.0.12");
  const elementToSVG = mod.elementToSVG || mod.default?.elementToSVG;
  const inlineResources = mod.inlineResources || mod.default?.inlineResources;
  if (typeof elementToSVG !== "function") {
    throw new Error("dom2svg.elementToSVG unavailable");
  }
  const svgDocument = elementToSVG(rootEl);
  if (typeof inlineResources === "function") {
    await inlineResources(svgDocument.documentElement);
  }
  const raw = new XMLSerializer().serializeToString(svgDocument);
  const cleaned = sanitizeIllustratorSvg(raw, w, h);
  if (/<foreignObject\b/i.test(cleaned)) {
    throw new Error("SVG export still contains foreignObject; Illustrator-incompatible");
  }
  return cleaned;
}

/**
 * capturePosterLayers — returns bottom-to-top compositing order.
 * Content uses holes model (marked+logo hidden). Logo always last.
 */
async function capturePosterLayers(lib, scale) {
  const w = rootEl.offsetWidth;
  const h = rootEl.offsetHeight;
  const options = await buildHtmlToImageOptions(lib, rootEl, {
    pixelRatio: scale,
    width: w,
    height: h,
  });

  let marked = collectTopLevelMarked(rootEl);
  const bg = detectSolidBackground(rootEl);

  // DOM auto-scan fallback: when no @poster/core markers exist, scan the visible DOM
  // for text-bearing elements and images so PSD and PPTX still get structure.
  if (marked.length === 0) {
    marked = scanDomForLayers(rootEl);
  }
  const markedEls = marked.map((m) => m.el).filter(Boolean);

  // Probe whether unmarked content exists
  let hasContent = true;
  {
    const restore = hideElements(markedEls, true);
    try {
      const probe = await lib.toCanvas(rootEl, { ...options, pixelRatio: 1 });
      const ctx = probe.getContext("2d");
      const sample = ctx.getImageData(0, 0, Math.min(8, probe.width), Math.min(8, probe.height));
      hasContent = sample.data.some((v, i) => i % 4 !== 3 && v < 250) || marked.length === 0;
      // If only background remains, still keep content when no marked layers
      if (marked.length === 0) hasContent = true;
      else {
        // Prefer always including content layer when unmarked pixels exist
        hasContent = true;
        const full = ctx.getImageData(0, 0, probe.width, probe.height).data;
        let opaque = 0;
        for (let i = 3; i < full.length; i += 4) {
          if (full[i] > 8) opaque += 1;
        }
        hasContent = opaque > probe.width * probe.height * 0.001;
      }
    } finally {
      restore();
    }
  }

  const plan = buildLayerPlan({
    hasBackground: Boolean(bg),
    backgroundName: "Background",
    hasContent,
    marked,
  });

  const layers = [];
  for (const item of plan) {
    if (item.isBackground && bg) {
      const canvas = fillSolidCanvas(w, h, bg, scale);
      layers.push({
        id: item.id,
        name: item.name,
        type: item.type,
        left: 0,
        top: 0,
        width: w,
        height: h,
        canvas,
        zIndex: item.order,
      });
      continue;
    }

    if (item.isContent) {
      const restore = hideElements(markedEls, true);
      try {
        const canvas = await lib.toCanvas(rootEl, options);
        layers.push({
          id: item.id,
          name: item.name,
          type: item.type,
          left: 0,
          top: 0,
          width: w,
          height: h,
          canvas,
          zIndex: item.order,
        });
      } finally {
        restore();
      }
      continue;
    }

    if (item.el) {
      const others = markedEls.filter((el) => el !== item.el);
      const restore = hideElements(others, true);
      // Also hide unmarked content for isolated layer? No — capture full root with
      // only this layer visible among marked; unmarked still shows. For true isolate,
      // hide everything except the target by cloning approach: hide all children except path.
      // Pragmatic: hide other marked; for logo hide content too via opacity on non-target.
      try {
        const rootRect = rootEl.getBoundingClientRect();
        const rect = item.el.getBoundingClientRect();
        const canvas = await lib.toCanvas(
          item.el,
          await buildHtmlToImageOptions(lib, rootEl, { pixelRatio: scale }),
        );
        layers.push({
          id: item.id,
          name: item.name,
          type: item.type,
          left: Math.round(rect.left - rootRect.left),
          top: Math.round(rect.top - rootRect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          canvas,
          zIndex: item.order,
        });
      } finally {
        restore();
      }
    }
  }

  return layers;
}

async function buildPsdDataUrl(lib, scale) {
  const layers = await capturePosterLayers(lib, scale);
  const agPsd = await import("https://esm.sh/ag-psd@28.0.0");
  if (typeof agPsd.initializeCanvas === "function") {
    agPsd.initializeCanvas((width, height) => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      return c;
    });
  }
  try {
    await import("https://esm.sh/ag-psd@28.0.0/initialize-canvas");
  } catch {
    /* browser canvas init via initializeCanvas above */
  }
  const writePsd = agPsd.writePsd || agPsd.default?.writePsd;
  if (typeof writePsd !== "function") throw new Error("ag-psd writePsd unavailable");
  const w = rootEl.offsetWidth;
  const h = rootEl.offsetHeight;
  const children = layers.map((layer) => {
    const canvas = layer.canvas;
    const left = Math.round(layer.left * scale);
    const top = Math.round(layer.top * scale);
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return {
      name: layer.name,
      left,
      top,
      right: left + canvas.width,
      bottom: top + canvas.height,
      blendMode: "normal",
      opacity: 1,
      imageData,
      canvas,
    };
  });
  const composite = document.createElement("canvas");
  composite.width = Math.round(w * scale);
  composite.height = Math.round(h * scale);
  const ctx = composite.getContext("2d");
  for (const layer of layers) {
    ctx.drawImage(layer.canvas, Math.round(layer.left * scale), Math.round(layer.top * scale));
  }
  const buffer = writePsd(
    {
      width: composite.width,
      height: composite.height,
      children,
      canvas: composite,
    },
    { generateThumbnail: true, noBackground: true },
  );
  const b64 = arrayBufferToBase64(buffer);
  return {
    data: `data:image/vnd.adobe.photoshop;base64,${b64}`,
    mimeType: "image/vnd.adobe.photoshop",
  };
}

function cssColorToHex(color) {
  const m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(color || "");
  if (!m) return "000000";
  const hex = (n) => Math.max(0, Math.min(255, Math.round(Number(n)))).toString(16).padStart(2, "0");
  return `${hex(m[1])}${hex(m[2])}${hex(m[3])}`;
}

async function buildPptxDataUrl(lib, scale) {
  const mod = await import("https://esm.sh/pptxgenjs@3.12.0");
  const PptxGenJS = mod.default || mod;
  const cssW = rootEl.offsetWidth;
  const cssH = rootEl.offsetHeight;
  const wIn = cssW / PPTX_PX_PER_INCH;
  const hIn = cssH / PPTX_PX_PER_INCH;
  let marked = collectTopLevelMarked(rootEl);
  // DOM auto-scan fallback for raw-HTML posters with no @poster/core markers
  if (marked.length === 0) {
    marked = scanDomForLayers(rootEl);
  }
  const bg = detectSolidBackground(rootEl);
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: "POSTER", width: wIn, height: hIn });
  pptx.layout = "POSTER";
  const slide = pptx.addSlide();
  if (bg) {
    const hex = cssColorToHex(bg.startsWith("#") ? null : bg);
    slide.background = { color: bg.startsWith("#") ? bg.replace("#", "") : hex };
  }
  const rootRect = rootEl.getBoundingClientRect();
  if (marked.length === 0) {
    // No layer markers — full-bleed JPEG raster fallback.
    const canvas = await lib.toCanvas(
      rootEl,
      await buildHtmlToImageOptions(lib, rootEl, {
        pixelRatio: scale,
        width: cssW,
        height: cssH,
        backgroundColor: "#ffffff",
      }),
    );
    slide.addImage({
      data: canvas.toDataURL("image/jpeg", LOSSY_EXPORT_QUALITY),
      x: 0,
      y: 0,
      w: wIn,
      h: hIn,
    });
  } else {
    // Render the poster background (gradient, decorative elements) with marked layers
    // temporarily hidden so they appear only as editable native objects, not doubled.
    const markedEls = marked.map((m) => m.el).filter(Boolean);
    const restoreBg = hideElements(markedEls, true);
    let bgCanvas;
    try {
      bgCanvas = await lib.toCanvas(
        rootEl,
        await buildHtmlToImageOptions(lib, rootEl, {
          pixelRatio: scale,
          width: cssW,
          height: cssH,
          backgroundColor: "#ffffff",
        }),
      );
    } finally {
      restoreBg();
    }
    slide.addImage({
      data: bgCanvas.toDataURL("image/jpeg", LOSSY_EXPORT_QUALITY),
      x: 0,
      y: 0,
      w: wIn,
      h: hIn,
    });
    for (const item of marked) {
      if (!item.el) continue;
      const rect = item.el.getBoundingClientRect();
      const x = (rect.left - rootRect.left) / PPTX_PX_PER_INCH;
      const y = (rect.top - rootRect.top) / PPTX_PX_PER_INCH;
      const w = Math.max(rect.width / PPTX_PX_PER_INCH, 0.05);
      const h = Math.max(rect.height / PPTX_PX_PER_INCH, 0.05);
      const style = getComputedStyle(item.el);
      const textTypes = new Set(["text", "metric", "badge", "button", "math", "block-math"]);
      if (textTypes.has(item.type)) {
        const fontSizePx = parseFloat(style.fontSize) || 16;
        slide.addText(item.el.innerText || item.name, {
          x,
          y,
          w,
          h,
          fontSize: fontSizePx * 0.75,
          color: cssColorToHex(style.color),
          bold: Number(style.fontWeight) >= 600,
          align: style.textAlign === "center" ? "center" : style.textAlign === "right" ? "right" : "left",
          valign: "top",
          margin: 0,
        });
      } else if (item.el.tagName === "IMG") {
        const src = item.el.currentSrc || item.el.src || "";
        if (src.startsWith("data:")) {
          slide.addImage({ data: src, x, y, w, h });
        } else {
          const canvas = await lib.toCanvas(
            item.el,
            await buildHtmlToImageOptions(lib, rootEl, { pixelRatio: scale }),
          );
          slide.addImage({ data: canvas.toDataURL("image/png"), x, y, w, h });
        }
      } else {
        const canvas = await lib.toCanvas(
          item.el,
          await buildHtmlToImageOptions(lib, rootEl, { pixelRatio: scale }),
        );
        slide.addImage({ data: canvas.toDataURL("image/png"), x, y, w, h });
      }
    }
  }
  const b64 = await pptx.write({ outputType: "base64" });
  return {
    data: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${b64}`,
    mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };
}


async function buildDataExports(format) {
  const data = scrapePosterData(rootEl);
  if (!hasPosterData(data)) {
    throw new Error("No table or metric data to export");
  }
  if (format === "csv") {
    return { data: buildSectionedCsv(data), mimeType: "text/csv;charset=utf-8" };
  }
  const XLSX = await import("https://esm.sh/xlsx@0.18.5");
  const wb = XLSX.utils.book_new();
  if (data.metrics.length) {
    const aoa = [
      ["label", "value", "delta"],
      ...data.metrics.map((m) => [m.label, m.value, m.delta]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "Metrics");
  }
  data.tables.forEach((table, i) => {
    const name = (table.name || `Table${i + 1}`).slice(0, 31);
    const aoa = [table.columns, ...table.rows];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name || `Table${i + 1}`);
  });
  const b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
  return {
    data: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${b64}`,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
}

async function captureExport(lib, format, scale) {
  await waitForPosterFonts({ timeoutMs: 10_000 });
  const restoreFonts = preparePosterDomForExport(rootEl);
  const restoreDebug = hideDebugOverlays(document);
  const restoreWebGL = freezeWebGLCanvasesForExport(rootEl);

  try {
    const options = await buildHtmlToImageOptions(lib, rootEl, {
      pixelRatio: scale,
      width: rootEl.offsetWidth,
      height: rootEl.offsetHeight,
    });

    if (format === "png") {
      const data = await lib.toPng(rootEl, options);
      return { data, mimeType: "image/png" };
    }
    if (format === "jpg") {
      return {
        data: await lib.toJpeg(rootEl, {
          ...options,
          quality: LOSSY_EXPORT_QUALITY,
          backgroundColor: "#ffffff",
        }),
        mimeType: "image/jpeg",
      };
    }
    if (format === "webp") {
      const canvas = await lib.toCanvas(rootEl, options);
      return {
        data: canvas.toDataURL("image/webp", LOSSY_EXPORT_QUALITY),
        mimeType: "image/webp",
      };
    }
    if (format === "svg") {
      return { data: await captureCanonicalSvg(), mimeType: "image/svg+xml" };
    }
    if (format === "pdf") {
      const jpeg = await lib.toJpeg(rootEl, {
        ...options,
        quality: PDF_EXPORT_QUALITY,
        backgroundColor: "#ffffff",
      });
      const { jsPDF } = await import("https://esm.sh/jspdf@2.5.2");
      const w = rootEl.offsetWidth;
      const h = rootEl.offsetHeight;
      const pdf = new jsPDF({
        orientation: w > h ? "landscape" : "portrait",
        unit: "px",
        format: [w, h],
      });
      pdf.addImage(jpeg, "JPEG", 0, 0, w, h);
      return { data: pdf.output("datauristring"), mimeType: "application/pdf" };
    }
    if (format === "psd") {
      return buildPsdDataUrl(lib, scale);
    }
    if (format === "pptx") {
      return buildPptxDataUrl(lib, scale);
    }
    if (format === "csv" || format === "xlsx") {
      return buildDataExports(format);
    }
    throw new Error(`Unsupported format: ${format}`);
  } finally {
    try {
      restoreWebGL();
    } catch {
      /* ignore */
    }
    try {
      restoreDebug();
    } catch {
      /* ignore */
    }
    restoreFonts();
  }
}

async function runExport(payload) {
  const { format, requestId } = payload;
  const w = rootEl.offsetWidth;
  const h = rootEl.offsetHeight;
  let scale = clampExportScale(payload.scale ?? exportScaleForFormat(format), w, h);
  try {
    if (format === "csv" || format === "xlsx") {
      const result = await captureExport(null, format, 1);
      send({
        type: "export-done",
        requestId,
        format,
        data: result.data,
        mimeType: result.mimeType,
      });
      return;
    }

    if (format === "svg") {
      const result = await captureExport(null, format, 1);
      send({
        type: "export-done",
        requestId,
        format,
        data: result.data,
        mimeType: result.mimeType,
      });
      return;
    }

    const lib = await loadHtmlToImage();
    let result = await captureExport(lib, format, scale);
    const maxScale = clampExportScale(
      format === "pdf" ? MAX_PDF_EXPORT_SCALE : MAX_EXPORT_SCALE,
      w,
      h,
    );

    if (isRasterExportFormat(format)) {
      while (dataUrlByteLength(result.data) < MIN_EXPORT_BYTES && scale < maxScale) {
        scale += 1;
        result = await captureExport(lib, format, scale);
      }
    }

    if (format === "pdf") {
      while (dataUrlByteLength(result.data) < MIN_PDF_EXPORT_BYTES && scale < maxScale) {
        scale += 1;
        result = await captureExport(lib, format, scale);
      }
      while (dataUrlByteLength(result.data) > MAX_PDF_EXPORT_BYTES && scale > 1) {
        scale -= 1;
        result = await captureExport(lib, format, scale);
      }
    }

    send({
      type: "export-done",
      requestId,
      format,
      data: result.data,
      mimeType: result.mimeType,
    });
  } catch (error) {
    send({ type: "export-failed", requestId, message: String(error?.message ?? error) });
  }
}

window.addEventListener("message", (event) => {
  const payload = event.data;
  if (!payload || payload.target !== "poster-sandbox") return;
  if (payload.type === "render") void render(payload);
  if (payload.type === "clear") clearPreview();
  if (payload.type === "export") void runExport(payload);
});

window.addEventListener("error", (event) => {
  send({
    type: "runtime-error",
    diagnostic: toDiagnostic(event.error ?? event.message, "runtime"),
  });
});
window.addEventListener("unhandledrejection", (event) => {
  send({ type: "runtime-error", diagnostic: toDiagnostic(event.reason, "runtime") });
});

void ensureKatex()
  .catch((error) => {
    console.error("KaTeX failed to load", error);
  })
  .finally(() => {
    send({ type: "sandbox-ready" });
  });
