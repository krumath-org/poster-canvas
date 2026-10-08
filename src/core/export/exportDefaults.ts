import type { ExportFormat } from "@/core/types";

/** Default pixel ratio for raster export (CSS px × scale). */
export const DEFAULT_EXPORT_SCALE = 3;

/** Default pixel ratio for PDF export (JPEG-embedded, size-banded). */
export const DEFAULT_PDF_EXPORT_SCALE = 4;

/** Upper bound when scaling up PNG/JPG/WebP to meet the minimum file size. */
export const MAX_EXPORT_SCALE = 6;

/** Upper bound when scaling up PDF toward the minimum file size. */
export const MAX_PDF_EXPORT_SCALE = 5;

/**
 * Memory-safety guard for large print presets (A3/A4 @ 300dpi).
 * Effective scale must satisfy max(width,height) × scale ≤ this value.
 * Not an absolute guarantee against browser OOM.
 */
export const MAX_EXPORT_EDGE_PX = 8192;

/** Minimum decoded payload size for PNG/JPG/WebP exports. */
export const MIN_EXPORT_BYTES = 3 * 1024 * 1024;

/** Soft floor for PDF exports — scale up until met (or max PDF scale). */
export const MIN_PDF_EXPORT_BYTES = 3 * 1024 * 1024;

/** Soft ceiling for PDF exports — scale down until under (or scale 1). */
export const MAX_PDF_EXPORT_BYTES = 5 * 1024 * 1024;

/** Browser-max quality for JPEG / WebP raster exports. */
export const LOSSY_EXPORT_QUALITY = 1;

/** JPEG quality when embedding raster into PDF (browser max for clarity). */
export const PDF_EXPORT_QUALITY = 1;

/** CSS px → inches for PPTX slide layout (exact aspect). */
export const PPTX_PX_PER_INCH = 96;

/** Physical A4 dimensions for PDF export (300 DPI, portrait). */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_DPI = 300;
export const A4_WIDTH_PX = 2480;  // Math.round(210 / 25.4 * 300)
export const A4_HEIGHT_PX = 3508; // Math.round(297 / 25.4 * 300)

const RASTER_FORMATS = new Set<ExportFormat>(["png", "jpg", "webp", "pdf", "psd", "pptx"]);

export function isRasterExportFormat(format: ExportFormat): boolean {
  return format === "png" || format === "jpg" || format === "webp";
}

export function usesRasterScale(format: ExportFormat): boolean {
  return RASTER_FORMATS.has(format);
}

/**
 * Cap requested scale so the longest edge stays within MAX_EXPORT_EDGE_PX.
 * Always returns at least 1.
 */
export function clampExportScale(
  scale: number,
  posterWidth: number,
  posterHeight: number,
  maxEdgePx = MAX_EXPORT_EDGE_PX,
): number {
  const edge = Math.max(posterWidth, posterHeight, 1);
  const maxScale = Math.max(1, Math.floor(maxEdgePx / edge));
  return Math.min(Math.max(1, Math.floor(scale)), maxScale);
}

/** Starting scale to send for a given export format (before artboard clamp). */
export function exportScaleForFormat(format: ExportFormat): number {
  if (format === "pdf") return DEFAULT_PDF_EXPORT_SCALE;
  if (format === "svg" || format === "csv" || format === "xlsx") return 1;
  return DEFAULT_EXPORT_SCALE;
}

/** Max scale used when size-looping a format. */
export function maxExportScaleForFormat(format: ExportFormat): number {
  if (format === "pdf") return MAX_PDF_EXPORT_SCALE;
  if (isRasterExportFormat(format) || format === "psd" || format === "pptx")
    return MAX_EXPORT_SCALE;
  return 1;
}
