import React, { useEffect, useLayoutEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";

function ensureRegistry() {
  if (typeof globalThis === "undefined") return null;
  if (!globalThis.__posterWebGL) {
    globalThis.__posterWebGL = {
      entries: new Set(),
      readyResolvers: new Set(),
    };
  }
  return globalThis.__posterWebGL;
}

function RegisterGl({ onReady }) {
  const { gl, advance, invalidate } = useThree();
  const registered = useRef(false);

  useLayoutEffect(() => {
    const registry = ensureRegistry();
    if (!registry || registered.current) return;
    registered.current = true;

    const canvas = gl.domElement;
    const entry = {
      canvas,
      advance: typeof advance === "function" ? advance : null,
      invalidate: typeof invalidate === "function" ? invalidate : null,
      gl,
    };
    registry.entries.add(entry);

    // Paint at least one frame so export / "rendered" are not blank.
    try {
      if (entry.advance) entry.advance(0);
      else invalidate?.();
    } catch {
      /* ignore */
    }

    onReady?.();

    return () => {
      registry.entries.delete(entry);
    };
  }, [gl, advance, invalidate, onReady]);

  return null;
}

/**
 * Export-safe R3F Canvas for posters.
 * Forces preserveDrawingBuffer and registers the WebGL canvas for freeze-to-img export.
 */
export function Canvas3D({
  children,
  style,
  className,
  gl: glProp,
  dpr = [1, 2],
  frameloop = "demand",
  ...rest
}) {
  const readySent = useRef(false);

  useEffect(() => {
    const registry = ensureRegistry();
    if (!registry) return;
    // Mark that a Canvas3D mounted (used by waitForWebGLReady).
    registry.mounted = (registry.mounted ?? 0) + 1;
    return () => {
      registry.mounted = Math.max(0, (registry.mounted ?? 1) - 1);
    };
  }, []);

  const mergedGl = {
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
    ...(glProp && typeof glProp === "object" ? glProp : {}),
    preserveDrawingBuffer: true,
  };

  return (
    <Canvas
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      gl={mergedGl}
      dpr={dpr}
      frameloop={frameloop}
      {...rest}
    >
      <RegisterGl
        onReady={() => {
          if (readySent.current) return;
          readySent.current = true;
          const registry = ensureRegistry();
          if (!registry) return;
          registry.readyCount = (registry.readyCount ?? 0) + 1;
          for (const resolve of [...registry.readyResolvers]) {
            try {
              resolve();
            } catch {
              /* ignore */
            }
          }
          registry.readyResolvers.clear();
        }}
      />
      {children}
    </Canvas>
  );
}
