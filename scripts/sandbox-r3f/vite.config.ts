import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(configDir, "../..");

const REACT_CDN = "https://esm.sh/react@19.2.0";
const REACT_DOM_CDN = "https://esm.sh/react-dom@19.2.0";

/**
 * Builds the same-origin Poster3D vendor ESM for the sandbox iframe.
 * React stays external (CDN URLs via output.paths) so it matches main.js / runtime.js.
 * CJS `__require("react"|"https://esm.sh/...")` is satisfied by the sandbox require shim.
 */
export default defineConfig({
  // Avoid recursion when outDir lives under the default public/ folder.
  publicDir: false,
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    lib: {
      entry: path.join(configDir, "entry.js"),
      name: "Poster3D",
      formats: ["es"],
      fileName: () => "poster3d.js",
    },
    outDir: path.join(projectRoot, "dist-sandbox-r3f"),
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/client",
      ],
      output: {
        paths: {
          react: REACT_CDN,
          "react-dom": REACT_DOM_CDN,
          "react/jsx-runtime": `${REACT_CDN}/jsx-runtime`,
          "react/jsx-dev-runtime": `${REACT_CDN}/jsx-dev-runtime`,
          "react-dom/client": `${REACT_DOM_CDN}/client`,
        },
      },
    },
  },
  resolve: {
    dedupe: ["react", "react-dom", "three"],
  },
});
