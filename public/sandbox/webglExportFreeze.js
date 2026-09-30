/**
 * WebGL export freeze helpers (sandbox).
 * Snapshots WebGL canvases to <img> so html-to-image / dom2svg capture the pixels.
 */

const DEBUG_SELECTORS = [
  "[data-leva-parent]",
  ".leva-c-kWgxhW", // leva root class (defensive)
  "#theatrejs-studio-root",
  "[id^='theatrejs']",
  ".theatre-studio-root",
];

/**
 * @returns {{ entries: Set<any>, readyResolvers: Set<Function>, mounted?: number, readyCount?: number }}
 */
export function getWebGLRegistry() {
  if (typeof globalThis === "undefined") {
    return { entries: new Set(), readyResolvers: new Set() };
  }
  if (!globalThis.__posterWebGL) {
    globalThis.__posterWebGL = {
      entries: new Set(),
      readyResolvers: new Set(),
      mounted: 0,
      readyCount: 0,
    };
  }
  return globalThis.__posterWebGL;
}

export function collectWebGLCanvases(root) {
  const registry = getWebGLRegistry();
  const fromRegistry = [...registry.entries]
    .map((e) => e.canvas)
    .filter((c) => c && c.isConnected);
  const fromDom = root
    ? [...root.querySelectorAll("canvas")].filter((c) => {
        try {
          return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
        } catch {
          return false;
        }
      })
    : [];
  return [...new Set([...fromRegistry, ...fromDom])];
}

export function hideDebugOverlays(root = document) {
  const restored = [];
  for (const sel of DEBUG_SELECTORS) {
    let nodes = [];
    try {
      nodes = [...(root.querySelectorAll?.(sel) ?? [])];
    } catch {
      nodes = [];
    }
    for (const el of nodes) {
      restored.push({ el, display: el.style.display, visibility: el.style.visibility });
      el.style.visibility = "hidden";
      el.style.display = "none";
    }
  }
  return () => {
    for (const { el, display, visibility } of restored) {
      el.style.display = display;
      el.style.visibility = visibility;
    }
  };
}

function forceAdvance(entry) {
  try {
    if (typeof entry?.advance === "function") {
      entry.advance(0);
      return;
    }
    if (typeof entry?.invalidate === "function") {
      entry.invalidate();
    }
  } catch {
    /* ignore */
  }
}

/**
 * Replace WebGL canvases with static PNG <img> clones for DOM capture.
 * @returns {() => void} restore function
 */
export function freezeWebGLCanvasesForExport(root) {
  const registry = getWebGLRegistry();
  for (const entry of registry.entries) {
    forceAdvance(entry);
  }

  const canvases = collectWebGLCanvases(root);
  const swaps = [];

  for (const canvas of canvases) {
    let dataUrl = "";
    try {
      dataUrl = canvas.toDataURL("image/png");
    } catch {
      continue;
    }
    if (!dataUrl || dataUrl === "data:," ) continue;

    const rect = canvas.getBoundingClientRect();
    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "";
    img.setAttribute("data-poster-webgl-freeze", "1");
    img.width = canvas.width;
    img.height = canvas.height;
    const cs = window.getComputedStyle(canvas);
    img.style.cssText = canvas.style.cssText;
    img.style.width = cs.width || `${rect.width}px`;
    img.style.height = cs.height || `${rect.height}px`;
    img.style.display = cs.display === "inline" ? "block" : cs.display || "block";
    img.style.objectFit = "fill";

    const parent = canvas.parentNode;
    if (!parent) continue;
    const prevDisplay = canvas.style.display;
    const prevVisibility = canvas.style.visibility;
    parent.insertBefore(img, canvas);
    canvas.style.display = "none";
    canvas.style.visibility = "hidden";
    swaps.push({ canvas, img, prevDisplay, prevVisibility });
  }

  return () => {
    for (const { canvas, img, prevDisplay, prevVisibility } of swaps) {
      try {
        img.remove();
      } catch {
        /* ignore */
      }
      canvas.style.display = prevDisplay;
      canvas.style.visibility = prevVisibility;
    }
  };
}

/**
 * Wait until Canvas3D registries report at least one ready GL context (or timeout).
 */
export function waitForWebGLReady(timeoutMs = 4000) {
  const registry = getWebGLRegistry();
  if ((registry.readyCount ?? 0) > 0 || registry.entries.size > 0) {
    // Advance once more then resolve on next frames.
    for (const entry of registry.entries) forceAdvance(entry);
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    });
  }

  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      registry.readyResolvers.delete(onReady);
      resolve();
    }, timeoutMs);

    function onReady() {
      clearTimeout(timer);
      registry.readyResolvers.delete(onReady);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve());
      });
    }

    registry.readyResolvers.add(onReady);
  });
}
