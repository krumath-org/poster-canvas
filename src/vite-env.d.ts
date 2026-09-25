/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_KRUMATH_ORIGIN?: string;
  readonly VITE_BASE_PATH?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*exportHelpers.js" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const buildHtmlToImageOptions: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const clearFontEmbedCSSCache: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const POSTER_FONT_CHECK_SPECS: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const waitForPosterFonts: any;
}
