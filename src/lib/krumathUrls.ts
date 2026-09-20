const DEFAULT_HOME = "https://krumath.com/home";
const DEFAULT_PRICING = "https://krumath.com/pricing";
const GITHUB_REPO = "https://github.com/sokna492-km/poster-canvas";

function krumathOriginPath(path: string, fallback: string): string {
  const origin = import.meta.env.VITE_KRUMATH_ORIGIN as string | undefined;
  if (origin && origin.length > 0) {
    return `${origin.replace(/\/$/, "")}${path}`;
  }
  return fallback;
}

export function krumathHomeUrl(): string {
  return krumathOriginPath("/home", DEFAULT_HOME);
}

export function krumathPricingUrl(): string {
  return krumathOriginPath("/pricing", DEFAULT_PRICING);
}

export function githubRepoUrl(): string {
  return GITHUB_REPO;
}

/** Public path on krumath.com (Vite `base` + in-app route). */
export function publicAppPath(routerPath: string): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const path = routerPath === "/" ? "" : routerPath.startsWith("/") ? routerPath : `/${routerPath}`;
  return `${base}${path}` || "/";
}

export function signInUrl(returnPath: string): string {
  const path = returnPath.startsWith("/") ? returnPath : `/${returnPath}`;
  const query = `returnUrl=${encodeURIComponent(path)}`;
  const origin = import.meta.env.VITE_KRUMATH_ORIGIN as string | undefined;
  if (origin && origin.length > 0) {
    return `${origin.replace(/\/$/, "")}/sign-in?${query}`;
  }
  return `/sign-in?${query}`;
}
