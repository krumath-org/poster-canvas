import { describe, expect, it } from "vitest";
import { extractPosterTitle, normalizeJsxText } from "./extractPosterTitle";

describe("normalizeJsxText", () => {
  it("collapses whitespace and strips tags", () => {
    expect(normalizeJsxText("  Hello   <span>World</span>  ")).toBe("Hello World");
  });

  it("turns br into space and drops expressions", () => {
    expect(normalizeJsxText("Line<br />two {item.text}")).toBe("Line two");
  });

  it("returns null for expression-only content", () => {
    expect(normalizeJsxText("{title}")).toBeNull();
  });
});

describe("extractPosterTitle", () => {
  it("prefers Headline layer over a later h1", () => {
    const code = `
      <div data-poster-layer-name="Headline">
        រៀននៅសាលា <br />
        <span>អនុវត្តនៅលើ KruMath</span>
      </div>
      <h1>Ignored</h1>
    `;
    expect(extractPosterTitle(code)).toBe("រៀននៅសាលា អនុវត្តនៅលើ KruMath");
  });

  it("falls back to the first h1", () => {
    const code = `
      <h1 className="text-[74px] font-black">
        Learn at school <br />
        <span>Practice on KruMath</span>
      </h1>
    `;
    expect(extractPosterTitle(code)).toBe("Learn at school Practice on KruMath");
  });

  it("falls back to a large Text size", () => {
    const code = `
      <Text size={28} color="#38bdf8">Eyebrow</Text>
      <Text size={72} weight={700} className="mt-4">
        KaTeX Math Lab
      </Text>
    `;
    expect(extractPosterTitle(code)).toBe("KaTeX Math Lab");
  });

  it("returns null when nothing usable is found", () => {
    expect(extractPosterTitle("export default function Poster() { return null; }")).toBeNull();
    expect(extractPosterTitle("<Text size={32}>Too small</Text>")).toBeNull();
    expect(extractPosterTitle("<h1>{dynamicTitle}</h1>")).toBeNull();
  });

  it("truncates long titles", () => {
    const long = "A".repeat(80);
    const title = extractPosterTitle(`<h1>${long}</h1>`);
    expect(title).not.toBeNull();
    expect(title!.length).toBeLessThanOrEqual(61);
    expect(title!.endsWith("…")).toBe(true);
  });
});
