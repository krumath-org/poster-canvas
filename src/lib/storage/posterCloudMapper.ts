import type { PosterLogoSlot, PosterProject, ProjectRepository } from "@/core/types";

/** Pure mapping helpers — unit-tested without a live Supabase client. */

export type PosterCanvasDbRow = {
  id: string;
  user_id: string;
  name: string;
  code: string;
  width: number;
  height: number;
  logo_slot: PosterLogoSlot | null;
  created_at: string;
  updated_at: string;
};

export function rowToProject(row: PosterCanvasDbRow): PosterProject {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    width: row.width,
    height: row.height,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    assets: {},
    logoSlot: row.logo_slot ?? null,
  };
}

/** Persist codes + small metadata only — never exports or logo dataUrls. */
export function projectToCloudRow(
  project: PosterProject,
  userId: string,
): PosterCanvasDbRow {
  return {
    id: project.id,
    user_id: userId,
    name: project.name,
    code: project.code,
    width: project.width,
    height: project.height,
    logo_slot: project.logoSlot ?? null,
    created_at: project.createdAt,
    updated_at: project.updatedAt,
  };
}

export type { ProjectRepository };
