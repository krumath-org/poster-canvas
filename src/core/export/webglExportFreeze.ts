/**
 * Pure helpers mirrored for unit tests (DOM-light).
 * Runtime implementation lives in public/sandbox/webglExportFreeze.js.
 */

export const WEBGL_DEBUG_SELECTORS = [
  "[data-leva-parent]",
  ".leva-c-kWgxhW",
  "#theatrejs-studio-root",
  "[id^='theatrejs']",
  ".theatre-studio-root",
] as const;

export interface FreezeSwap {
  canvas: HTMLCanvasElement;
  img: HTMLImageElement;
  prevDisplay: string;
  prevVisibility: string;
}

/** Build restore callback for canvas↔img swaps (testable without WebGL). */
export function restoreFreezeSwaps(swaps: FreezeSwap[]): void {
  for (const { canvas, img, prevDisplay, prevVisibility } of swaps) {
    try {
      img.remove();
    } catch {
      /* ignore */
    }
    canvas.style.display = prevDisplay;
    canvas.style.visibility = prevVisibility;
  }
}

/** Create an img placeholder for a canvas snapshot (testable). */
export function createFreezeImage(
  documentRef: Document,
  canvas: HTMLCanvasElement,
  dataUrl: string,
): HTMLImageElement {
  const img = documentRef.createElement("img");
  img.src = dataUrl;
  img.alt = "";
  img.setAttribute("data-poster-webgl-freeze", "1");
  img.width = canvas.width;
  img.height = canvas.height;
  img.style.cssText = canvas.style.cssText;
  img.style.display = "block";
  img.style.objectFit = "fill";
  return img;
}

export function applyCanvasFreezeSwap(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
): FreezeSwap {
  const parent = canvas.parentNode;
  if (!parent) {
    throw new Error("Canvas has no parent");
  }
  const prevDisplay = canvas.style.display;
  const prevVisibility = canvas.style.visibility;
  parent.insertBefore(img, canvas);
  canvas.style.display = "none";
  canvas.style.visibility = "hidden";
  return { canvas, img, prevDisplay, prevVisibility };
}
