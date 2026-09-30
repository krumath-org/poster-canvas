import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildHtmlToImageOptions,
  clearFontEmbedCSSCache,
  POSTER_FONT_CHECK_SPECS,
  preparePosterDomForExport,
  waitForPosterFonts,
} from "../../../public/sandbox/exportHelpers.js";

describe("html-to-image capture options", () => {
  afterEach(() => {
    clearFontEmbedCSSCache();
    vi.unstubAllGlobals();
  });

  it("exposes Kantumruy + IBM Plex check specs including weight 900", () => {
    expect(POSTER_FONT_CHECK_SPECS.some((s: string) => s.includes("Kantumruy Pro"))).toBe(true);
    expect(POSTER_FONT_CHECK_SPECS.some((s: string) => s.includes("900"))).toBe(true);
    expect(POSTER_FONT_CHECK_SPECS.some((s: string) => s.includes("IBM Plex Sans"))).toBe(true);
  });

  it("buildHtmlToImageOptions uses manual embed CSS and disables cacheBust", async () => {
    const fakeB64 = btoa("fake-font-bytes");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        arrayBuffer: async () => Uint8Array.from(fakeB64, () => 0).buffer,
      }),
    );
    // Provide a minimal location for URL resolution in Node/jsdom
    if (typeof location === "undefined") {
      vi.stubGlobal("location", { href: "http://localhost/poster-canvas/sandbox/index.html" });
    }

    const lib = { getFontEmbedCSS: vi.fn() };
    const node = { offsetWidth: 1080, offsetHeight: 1350 };

    const a = await buildHtmlToImageOptions(lib, node, { pixelRatio: 3 });
    const b = await buildHtmlToImageOptions(lib, node, { pixelRatio: 4 });

    expect(lib.getFontEmbedCSS).not.toHaveBeenCalled();
    expect(a.fontEmbedCSS).toContain("Kantumruy Pro");
    expect(a.fontEmbedCSS).toContain("data:");
    expect(a.cacheBust).toBe(false);
    expect(a.skipFonts).toBe(false);
    expect(a.preferredFontFormat).toBeUndefined();
    expect(a.pixelRatio).toBe(3);
    expect(b.fontEmbedCSS).toBe(a.fontEmbedCSS);
  });

  it("waitForPosterFonts no-ops without document.fonts", async () => {
    await expect(waitForPosterFonts({ timeoutMs: 10 })).resolves.toBeUndefined();
  });

  it("preparePosterDomForExport keeps Kantumruy in the font-mono stack", () => {
    const root = document.createElement("div");
    root.id = "poster-root";
    document.body.appendChild(root);

    const restore = preparePosterDomForExport(root);
    const style = document.querySelector("style[data-poster-export-fonts]");
    expect(style).toBeTruthy();
    const css = style?.textContent ?? "";
    expect(css).toMatch(/\.font-mono/);
    expect(css).toContain("Kantumruy Pro");
    expect(css).toMatch(/font-mono[\s\S]*Kantumruy Pro[\s\S]*monospace/);

    restore();
    expect(document.querySelector("style[data-poster-export-fonts]")).toBeNull();
    root.remove();
  });
});
