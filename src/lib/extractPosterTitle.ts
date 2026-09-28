/** Max length for auto-suggested project names. */
export const MAX_POSTER_TITLE_LENGTH = 60;

/** Prefer Text components at least this large as a title fallback. */
const MIN_TEXT_TITLE_SIZE = 48;

/**
 * Turn a JSX fragment into plain display text suitable for a project name.
 * Returns null when nothing usable remains.
 */
export function normalizeJsxText(raw: string): string | null {
  let text = raw
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  text = text.replace(/\s+/g, " ").trim();
  if (!text) return null;

  if (text.length > MAX_POSTER_TITLE_LENGTH) {
    text = `${text.slice(0, MAX_POSTER_TITLE_LENGTH).trimEnd()}…`;
  }
  return text;
}

function firstMatchInner(code: string, pattern: RegExp): string | null {
  const match = pattern.exec(code);
  if (!match?.[1]) return null;
  return normalizeJsxText(match[1]);
}

/**
 * Deterministic title from poster TSX (no AI).
 * Priority: Headline layer → first h1 → first large Text.
 */
export function extractPosterTitle(code: string): string | null {
  const fromHeadline = firstMatchInner(
    code,
    /data-poster-layer-name=["']Headline["'][^>]*>([\s\S]*?)<\/[a-zA-Z0-9]+>/i,
  );
  if (fromHeadline) return fromHeadline;

  const fromH1 = firstMatchInner(code, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  if (fromH1) return fromH1;

  const textRe = /<Text\b([^>]*)>([\s\S]*?)<\/Text>/gi;
  let textMatch: RegExpExecArray | null;
  while ((textMatch = textRe.exec(code)) !== null) {
    const attrs = textMatch[1] ?? "";
    const sizeMatch = /\bsize=\{(\d+)\}/.exec(attrs);
    const size = sizeMatch ? Number(sizeMatch[1]) : 0;
    if (size < MIN_TEXT_TITLE_SIZE) continue;
    const title = normalizeJsxText(textMatch[2] ?? "");
    if (title) return title;
  }

  return null;
}
