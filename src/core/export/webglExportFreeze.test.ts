import { describe, expect, it } from "vitest";
import {
  applyCanvasFreezeSwap,
  createFreezeImage,
  restoreFreezeSwaps,
  WEBGL_DEBUG_SELECTORS,
} from "./webglExportFreeze";

describe("webglExportFreeze", () => {
  it("exposes debug selectors for leva / theatre", () => {
    expect(WEBGL_DEBUG_SELECTORS.some((s) => s.includes("leva"))).toBe(true);
    expect(WEBGL_DEBUG_SELECTORS.some((s) => s.includes("theatre"))).toBe(true);
  });

  it("swaps canvas for img and restores", () => {
    const root = document.createElement("div");
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 16;
    canvas.style.display = "block";
    root.appendChild(canvas);
    document.body.appendChild(root);

    const img = createFreezeImage(document, canvas, "data:image/png;base64,abc");
    const swap = applyCanvasFreezeSwap(canvas, img);

    expect(canvas.style.display).toBe("none");
    expect(root.querySelector("img[data-poster-webgl-freeze]")).toBe(img);

    restoreFreezeSwaps([swap]);
    expect(canvas.style.display).toBe("block");
    expect(root.querySelector("img[data-poster-webgl-freeze]")).toBeNull();

    root.remove();
  });
});
