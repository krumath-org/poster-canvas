import type { ServerResponse } from "node:http";
import type { Connect, Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const DEFAULT_BASE_PATH = "/poster-canvas";

/**
 * Vite requires `base` to end with `/`. Rewrite `/poster-canvas` → `/poster-canvas/`
 * so the address bar can stay without a trailing slash, and redirect `/` there.
 */
function redirectRootToBase(basePath: string): Plugin {
  const withSlash = `${basePath}/`;

  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    const raw = req.url ?? "";
    const qIndex = raw.indexOf("?");
    const pathname = qIndex >= 0 ? raw.slice(0, qIndex) : raw;
    const qs = qIndex >= 0 ? raw.slice(qIndex) : "";

    if (pathname === "/" || pathname === "") {
      redirect(res, `${basePath}${qs}`);
      return;
    }

    // Internal rewrite only — keeps the browser URL without a trailing slash
    if (pathname === basePath) {
      const rewritten = `${withSlash}${qs}`;
      req.url = rewritten;
      // TanStack Start / Connect may use originalUrl for redirects
      (req as Connect.IncomingMessage & { originalUrl?: string }).originalUrl = rewritten;
    }

    next();
  };

  return {
    name: "redirect-root-to-base",
    enforce: "pre",
    configureServer(server) {
      // After Vite installs internals, prepend so we run first
      return () => {
        server.middlewares.stack.unshift({
          route: "",
          handle: middleware,
        });
      };
    },
    configurePreviewServer(server) {
      return () => {
        server.middlewares.stack.unshift({
          route: "",
          handle: middleware,
        });
      };
    },
  };
}

function redirect(res: ServerResponse, location: string): void {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const rawBase = env["VITE_BASE_PATH"] || process.env["VITE_BASE_PATH"] || DEFAULT_BASE_PATH;
  const basePath = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");
  const envDefine = Object.fromEntries(
    Object.entries(env).map(([key, value]) => [`import.meta.env.${key}`, JSON.stringify(value)]),
  );
  envDefine["import.meta.env.VITE_BASE_PATH"] = JSON.stringify(basePath || "/");

  return {
    base: basePath ? `${basePath}/` : "/",
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "d3-geo",
      ],
      ignoreOutdatedRequests: true,
    },
    server: {
      host: "::",
      port: 5173,
      watch: {
        // Large font binaries lock on Windows and crash Vite's FSWatcher (EBUSY).
        ignored: [
          "**/public/sandbox/vendor/fonts/**",
          "**/public/sandbox/vendor/r3f/**",
          "**/dist-sandbox-r3f/**",
        ],
      },
    },
    plugins: [
      ...(basePath ? [redirectRootToBase(basePath)] : []),
      ...(mode === "development"
        ? [
            devtools({
              logging: false,
              eventBusConfig: { enabled: false },
              enhancedLogs: { enabled: false },
              consolePiping: { enabled: false },
              removeDevtoolsOnBuild: false,
              injectSource: { enabled: true },
            }),
          ]
        : []),
      tailwindcss(),
      tsconfigPaths({ projects: ["./tsconfig.json"] }),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        server: { entry: "server" },
      }),
      nitro({
        preset: "cloudflare-module",
        baseURL: basePath ? `${basePath}/` : "/",
      }),
      react(),
    ],
  };
});
