import { describe, expect, it } from "vitest";
import { isMathOnlyInput, preprocess, wrapMathOnlyPoster } from "./preprocess";

describe("preprocess", () => {
  it("strips react imports and rewrites export default", () => {
    const source = `import React from "react";
export default function Poster() {
  return <div>Hello</div>;
}`;
    const { code, diagnostics } = preprocess(source);
    expect(code).not.toContain("import");
    expect(code).toContain("const __default = function Poster");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
  });

  it("strips named react hook imports without rewriting them", () => {
    // Sandbox injects useRef/useState/etc. as locals; rewriting here would
    // collide with those bindings at runtime.
    const source = `import { useRef, useState } from "react";
export default function Poster() {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  return <div>{n}</div>;
}`;
    const { code, diagnostics } = preprocess(source);
    expect(code).not.toContain("import");
    expect(code).not.toContain("const { useRef, useState } = React");
    expect(code).toContain("useRef(null)");
    expect(code).toContain("useState(0)");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
  });

  it("rewrites @poster/core imports", () => {
    const source = `import { Poster, Text } from "@poster/core";
export default function Poster() {
  return <Poster><Text>Hi</Text></Poster>;
}`;
    const { code } = preprocess(source);
    expect(code).toContain("const { Poster, Text } = PosterCore");
  });

  it("rewrites Math import from @poster/core", () => {
    const source = `import { Math, BlockMath } from "@poster/core";
export default function Poster() {
  return <Math tex="x^2" />;
}`;
    const { code, diagnostics } = preprocess(source);
    expect(code).toContain("const { Math, BlockMath } = PosterCore");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
  });

  it("warns on unsupported imports", () => {
    const source = `import foo from "lodash";
export default function Poster() { return null; }`;
    const { diagnostics } = preprocess(source);
    expect(diagnostics.some((d) => d.kind === "preprocess" && d.severity === "warning")).toBe(true);
  });

  it("errors when no poster component is found for JS snippets", () => {
    const { diagnostics } = preprocess("const x = 1;");
    expect(diagnostics.some((d) => d.severity === "error")).toBe(true);
  });

  it("auto-wraps bare TeX like x^2 into BlockMath poster", () => {
    const { code, diagnostics } = preprocess("x^2");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    expect(diagnostics.some((d) => d.severity === "warning" && /Math-only/.test(d.message))).toBe(
      true,
    );
    expect(code).toContain("PosterCore.BlockMath");
    expect(code).toContain('"x^2"');
    expect(code).toContain("MathOnlyPoster");
    expect(code).not.toContain("function Poster(");
  });

  it("auto-wraps delimited math into Text poster", () => {
    const { code, diagnostics } = preprocess("Solve $x^2$ today");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
    expect(code).toContain("PosterCore.Text");
    expect(code).toContain("Solve $x^2$ today");
    expect(code).not.toContain("BlockMath");
  });

  it("auto-wraps LaTeX commands without delimiters", () => {
    const { code } = preprocess(String.raw`\frac{a}{b}`);
    expect(code).toContain("PosterCore.BlockMath");
    expect(code).toContain(String.raw`\frac{a}{b}`);
  });

  it("does not treat a full Poster as math-only", () => {
    expect(
      isMathOnlyInput(`export default function Poster() {
  return <div>Hi</div>;
}`),
    ).toBe(false);
    const { code } = preprocess(`export default function Poster() {
  return <div>Hi</div>;
}`);
    expect(code).toContain("const __default = function Poster");
    expect(code).not.toContain("BlockMath");
  });

  it("rewrites R3F imports onto Poster3D and sets features.r3f", () => {
    const source = `import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
export default function Poster() { return null; }`;
    const { code, features, diagnostics } = preprocess(source);
    expect(features.r3f).toBe(true);
    expect(code).toContain("const { Canvas, useFrame } = Poster3D.fiber");
    expect(code).toContain("const { OrbitControls } = Poster3D.drei");
    expect(code).toContain("const THREE = Poster3D.THREE");
    expect(diagnostics.filter((d) => d.severity === "error")).toHaveLength(0);
  });

  it("sets features.r3f when Canvas3D is imported from @poster/core", () => {
    const source = `import { Poster, Canvas3D } from "@poster/core";
export default function Poster() { return <Poster><Canvas3D /></Poster>; }`;
    const { code, features } = preprocess(source);
    expect(features.r3f).toBe(true);
    expect(code).toContain("const { Poster, Canvas3D } = PosterCore");
  });

  it("leaves features.r3f false for 2D-only posters", () => {
    const { features } = preprocess(`import { Poster, Text } from "@poster/core";
export default function Poster() { return <Poster><Text>Hi</Text></Poster>; }`);
    expect(features.r3f).toBe(false);
  });
});

describe("wrapMathOnlyPoster", () => {
  it("uses BlockMath for bare tex and Text when delimiters exist", () => {
    expect(wrapMathOnlyPoster("a^2+b^2")).toContain("PosterCore.BlockMath");
    expect(wrapMathOnlyPoster("$a^2$")).toContain("PosterCore.Text");
    expect(wrapMathOnlyPoster("a^2")).not.toMatch(/function Poster\s*\(/);
  });
});
