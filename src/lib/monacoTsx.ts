import type { Monaco } from "@monaco-editor/react";

/** In-memory model path — the `.tsx` suffix is what enables JSX parsing. */
export const POSTER_EDITOR_PATH = "file:///poster.tsx";

/**
 * Minimal ambient types for the poster sandbox.
 * Full @types/react is too heavy for Monaco's worker; these stop false JSX underlines.
 */
const JSX_AMBIENT = `
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  type Element = any;
  type ElementClass = any;
  type ElementType = any;
  interface ElementChildrenAttribute {
    children: {};
  }
}

declare module "react/jsx-runtime" {
  export function jsx(...args: any[]): any;
  export function jsxs(...args: any[]): any;
  export const Fragment: any;
}

declare module "react/jsx-dev-runtime" {
  export function jsxDEV(...args: any[]): any;
  export const Fragment: any;
}

declare module "react" {
  export type ReactNode = any;
  export type CSSProperties = Record<string, string | number | undefined>;
  export type FC<P = Record<string, unknown>> = (props: P) => any;
  export type RefObject<T> = { current: T | null };
  export type MutableRefObject<T> = { current: T };
  export function createElement(...args: any[]): any;
  export function useState<S = any>(initial?: S | (() => S)): [S, (v: S | ((prev: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useMemo<T>(factory: () => T, deps?: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: any[]): T;
  export function useRef<T = any>(initial?: T | null): MutableRefObject<T | null>;
  export function useReducer(reducer: any, initial: any, init?: any): [any, (action: any) => void];
  export function useContext(context: any): any;
  export function useId(): string;
  export function useImperativeHandle(ref: any, create: () => any, deps?: any[]): void;
  export function useDeferredValue<T>(value: T): T;
  export function useTransition(): [boolean, (cb: () => void) => void];
  export function useSyncExternalStore<T>(subscribe: (onStoreChange: () => void) => () => void, getSnapshot: () => T): T;
  export function createContext<T = any>(defaultValue?: T): any;
  export function forwardRef(render: any): any;
  export function memo(component: any): any;
  export function lazy(factory: any): any;
  export const Suspense: any;
  export const Children: any;
  export function cloneElement(...args: any[]): any;
  export function isValidElement(value: any): boolean;
  export const Fragment: any;
  const React: {
    createElement: (...args: any[]) => any;
    Fragment: any;
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useMemo: typeof useMemo;
    useCallback: typeof useCallback;
  };
  export default React;
}

declare module "@poster/core" {
  export const Poster: any;
  export const Text: any;
  export const Stack: any;
  export const Grid: any;
  export const Badge: any;
  export const Divider: any;
  export const Metric: any;
  export const Progress: any;
  export const Table: any;
  export const BarChart: any;
  export const LineChart: any;
  export const PieChart: any;
  export const Circle: any;
  export const Shape: any;
  export const Button: any;
  export const Logo: any;
  export const Math: any;
  export const BlockMath: any;
  export const Image: any;
  export const Canvas3D: any;
}

declare module "three" {
  const THREE: any;
  export = THREE;
}

declare module "@react-three/fiber" {
  export const Canvas: any;
  export function useFrame(...args: any[]): any;
  export function useThree(...args: any[]): any;
  export function useLoader(...args: any[]): any;
  export function extend(...args: any[]): any;
  export const act: any;
}

declare module "@react-three/drei" {
  export const OrbitControls: any;
  export const Environment: any;
  export const Center: any;
  export const Float: any;
  export const ContactShadows: any;
  export const PresentationControls: any;
  export const Stage: any;
  export const Text: any;
  export const Html: any;
  export function useGLTF(...args: any[]): any;
  export function useTexture(...args: any[]): any;
  const drei: any;
  export default drei;
}

declare module "@react-three/postprocessing" {
  export const EffectComposer: any;
  export const Bloom: any;
  export const Vignette: any;
  export const Noise: any;
  export const DepthOfField: any;
}

declare module "@react-three/csg" {
  export const Geometry: any;
  export const Base: any;
  export const Addition: any;
  export const Subtraction: any;
  export const Intersection: any;
}

declare module "@react-spring/three" {
  export const a: any;
  export const animated: any;
  export function useSpring(...args: any[]): any;
  export function useSprings(...args: any[]): any;
}

declare module "@use-gesture/react" {
  export function useDrag(...args: any[]): any;
  export function useGesture(...args: any[]): any;
  export function usePinch(...args: any[]): any;
}

declare module "maath" {
  export const easing: any;
  export const misc: any;
  export const random: any;
  export const three: any;
}

declare module "leva" {
  export function useControls(...args: any[]): any;
  export function button(...args: any[]): any;
  export const folder: any;
  export const Leva: any;
}

declare module "@theatre/core" {
  export function getProject(...args: any[]): any;
  export function types(...args: any[]): any;
  const theatre: any;
  export default theatre;
}

declare module "@theatre/r3f" {
  export const editable: any;
  export const SheetProvider: any;
  export function useCurrentSheet(...args: any[]): any;
}
`.trim();

const AMBIENT_URI = "file:///poster-ambient.d.ts";
let libsAdded = false;

/**
 * Configure Monaco's TypeScript language service for poster TSX:
 * JSX allowed, automatic runtime, ambient React/@poster stubs so the
 * editor doesn't flood red underlines while the sandbox still owns real checks.
 */
export function configureMonacoForPosterTsx(monaco: Monaco): void {
  const ts = monaco.languages.typescript;

  ts.typescriptDefaults.setCompilerOptions({
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    jsx: ts.JsxEmit.ReactJSX,
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    isolatedModules: true,
    noEmit: true,
    skipLibCheck: true,
    strict: false,
    noUnusedLocals: false,
    noUnusedParameters: false,
  });

  // Syntax catches real parse errors. Semantic stays on but is grounded by
  // ambient stubs — without them, every JSX tag becomes a red underline.
  ts.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: true,
  });

  if (!libsAdded) {
    ts.typescriptDefaults.addExtraLib(JSX_AMBIENT, AMBIENT_URI);
    libsAdded = true;
  }
}
