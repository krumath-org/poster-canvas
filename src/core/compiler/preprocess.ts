import type { Diagnostic } from "@/core/types";

export interface PreprocessFeatures {
  r3f: boolean;
}

export interface PreprocessResult {
  code: string;
  diagnostics: Diagnostic[];
  features: PreprocessFeatures;
}

const IMPORT_RE = /^[ \t]*import\s+([\s\S]*?)\s*from\s*["']([^"']+)["'];?[ \t]*$/gm;
const BARE_IMPORT_RE = /^[ \t]*import\s*["']([^"']+)["'];?[ \t]*$/gm;
const REACT_MODULES = new Set(["react", "react-dom", "react-dom/client", "react/jsx-runtime"]);
const CORE_MODULES = new Set(["@poster/core", "poster-studio", "@/core/poster", "./poster"]);

/** Sandbox Poster3D namespace keys for allowlisted 3D packages. */
const R3F_MODULES: Record<string, string> = {
  three: "THREE",
  "@react-three/fiber": "fiber",
  "@react-three/drei": "drei",
  "@react-three/postprocessing": "postprocessing",
  "@react-three/csg": "csg",
  "@react-spring/three": "spring",
  "@use-gesture/react": "gesture",
  maath: "maath",
  leva: "leva",
  "@theatre/core": "theatre",
  "@theatre/r3f": "theatreR3f",
};

const MAATH_SUBPATH_RE = /^maath\//;

function lineOf(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function resolveR3fBinding(module: string): string | null {
  if (R3F_MODULES[module]) return R3F_MODULES[module];
  // Common maath subpaths → root namespace (bundle exports the package entry).
  if (MAATH_SUBPATH_RE.test(module)) return "maath";
  return null;
}

/**
 * Rewrite `import … from "mod"` into Poster3D / PosterCore locals.
 * Supports default, namespace (* as), and named imports.
 */
function rewriteImportClause(clause: string, bindingExpr: string): string {
  const trimmed = clause.trim();
  const parts: string[] = [];

  // import * as Name
  const ns = trimmed.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)$/);
  if (ns) {
    return `const ${ns[1]} = ${bindingExpr};`;
  }

  // import Default
  // import Default, { a, b }
  // import { a, b }
  // import { a as b }
  const defaultAndNamed = trimmed.match(
    /^([A-Za-z_$][\w$]*)\s*,\s*\{([\s\S]*)\}$/,
  );
  if (defaultAndNamed) {
    parts.push(`const ${defaultAndNamed[1]} = ${bindingExpr};`);
    parts.push(`const {${defaultAndNamed[2]}} = ${bindingExpr};`);
    return parts.join("\n");
  }

  const namedOnly = trimmed.match(/^\{([\s\S]*)\}$/);
  if (namedOnly) {
    return `const {${namedOnly[1]}} = ${bindingExpr};`;
  }

  const defaultOnly = trimmed.match(/^([A-Za-z_$][\w$]*)$/);
  if (defaultOnly) {
    return `const ${defaultOnly[1]} = ${bindingExpr};`;
  }

  // Fallback: treat whole clause as named destructure target expression
  return `const ${trimmed} = ${bindingExpr};`;
}

function coreImportIncludesCanvas3D(clause: string): boolean {
  return /\bCanvas3D\b/.test(clause);
}

/** True when the buffer looks like TSX/JS poster code rather than raw math. */
export function looksLikePosterProgram(source: string): boolean {
  const s = source.trim();
  if (!s) return false;
  if (/^\s*import\s+/m.test(s)) return true;
  if (/\bexport\s+default\b/.test(s)) return true;
  if (/\bfunction\s+Poster\b/.test(s)) return true;
  if (/<\s*Poster[\s/>]/.test(s)) return true;
  if (/\b(const|let|var)\s+[A-Za-z_$][\w$]*\s*=/.test(s)) return true;
  if (/\bfunction\s+[A-Za-z_$][\w$]*\s*\(/.test(s)) return true;
  if (/\breturn\s*[\(<]/.test(s)) return true;
  if (/<[A-Za-z][\w.]*[\s/>]/.test(s) && /<\/[A-Za-z]/.test(s)) return true;
  return false;
}

/** Non-program buffer that we can auto-wrap as KaTeX. */
export function isMathOnlyInput(source: string): boolean {
  const s = source.trim();
  if (!s) return false;
  if (looksLikePosterProgram(s)) return false;
  return true;
}

function hasMathDelimiters(source: string): boolean {
  return /\$|\\\(|\\\[/.test(source);
}

/**
 * Build a sandbox-ready poster that renders raw TeX / delimited math.
 * Emits React.createElement so we do not need a second JSX pass for the wrapper.
 */
export function wrapMathOnlyPoster(mathSource: string): string {
  const payload = JSON.stringify(mathSource);
  const posterProps = `{ className: "box-border flex h-full w-full items-center justify-center bg-white p-24 text-slate-900" }`;

  // Do not name this function Poster — a named function expression would
  // shadow PosterCore.Poster and recurse until the preview hangs.
  if (hasMathDelimiters(mathSource)) {
    return [
      `const __default = function MathOnlyPoster() {`,
      `  return React.createElement(`,
      `    PosterCore.Poster,`,
      `    ${posterProps},`,
      `    React.createElement(PosterCore.Text, { size: 64, align: "center" }, ${payload})`,
      `  );`,
      `};`,
    ].join("\n");
  }

  return [
    `const __default = function MathOnlyPoster() {`,
    `  return React.createElement(`,
    `    PosterCore.Poster,`,
    `    ${posterProps},`,
    `    React.createElement(PosterCore.BlockMath, { tex: ${payload}, size: 72 })`,
    `  );`,
    `};`,
  ].join("\n");
}

/**
 * Rewrites user source into a self-contained script body that the sandbox can
 * safely compile and execute. No user code is evaluated here — this is pure
 * string transformation, so it is cheap and testable.
 *
 * Also supports math-only mode: if the buffer is plain TeX / `$...$` (no poster
 * component), it is auto-wrapped into a minimal KaTeX poster.
 */
export function preprocess(source: string): PreprocessResult {
  const diagnostics: Diagnostic[] = [];
  const features: PreprocessFeatures = { r3f: false };
  const trimmed = source.trim();

  if (trimmed && isMathOnlyInput(trimmed)) {
    diagnostics.push({
      severity: "warning",
      kind: "preprocess",
      message:
        "Math-only input detected — wrapped into a poster automatically. For full layouts, use `export default function Poster() { ... }`.",
    });
    return { code: wrapMathOnlyPoster(trimmed), diagnostics, features };
  }

  let code = source.replace(BARE_IMPORT_RE, (match, module: string) => {
    if (module.endsWith(".css")) return "";
    if (resolveR3fBinding(module)) {
      features.r3f = true;
      return "";
    }
    diagnostics.push({
      severity: "warning",
      kind: "preprocess",
      message: `Import of "${module}" is not available in the sandbox and was ignored.`,
    });
    return "";
  });

  code = code.replace(IMPORT_RE, (match, clause: string, module: string, offset: number) => {
    // React is provided by the sandbox (`React` + common hooks as locals).
    // Drop the import so we do not emit a second `const { useRef } = …` that
    // would collide with those locals.
    if (REACT_MODULES.has(module)) return "";

    if (CORE_MODULES.has(module)) {
      if (coreImportIncludesCanvas3D(clause)) {
        features.r3f = true;
      }
      const named = clause.match(/\{([\s\S]*?)\}/);
      if (named) return `const {${named[1]}} = PosterCore;`;
      const def = clause.trim().split(",")[0]?.trim();
      return def ? `const ${def} = PosterCore;` : "";
    }

    const r3fKey = resolveR3fBinding(module);
    if (r3fKey) {
      features.r3f = true;
      if (MAATH_SUBPATH_RE.test(module) && module !== "maath") {
        diagnostics.push({
          severity: "warning",
          kind: "preprocess",
          message: `Import from "${module}" is mapped to the maath package root (Poster3D.maath). Prefer \`import { … } from "maath"\`.`,
          line: lineOf(source, offset),
        });
      }
      return rewriteImportClause(clause, `Poster3D.${r3fKey}`);
    }

    diagnostics.push({
      severity: "warning",
      kind: "preprocess",
      message: `Import of "${module}" is not available in the sandbox and was ignored.`,
      line: lineOf(source, offset),
    });
    return "";
  });

  // export default <fn|class|expr>  ->  const __default = ...
  code = code
    .replace(/export\s+default\s+function\s*\(/g, "const __default = function (")
    .replace(/export\s+default\s+function\s+([A-Za-z0-9_$]+)/g, "const __default = function $1")
    .replace(/export\s+default\s+class\s+([A-Za-z0-9_$]+)/g, "const __default = class $1")
    .replace(/export\s+default\s+/g, "const __default = ");

  // Remaining named exports are meaningless in the sandbox scope.
  code = code.replace(/^[ \t]*export\s+(const|let|var|function|class)\b/gm, "$1");

  if (!/__default\s*=/.test(code) && !/function\s+Poster\b/.test(code)) {
    diagnostics.push({
      severity: "error",
      kind: "preprocess",
      message:
        "No poster component found. Add `export default function Poster() { ... }` to your code, or type plain LaTeX / `$x^2$` for math-only mode.",
    });
  }

  return { code, diagnostics, features };
}
