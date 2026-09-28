import type { PosterProject, ProjectRepository } from "@/core/types";
import { getBrowserUser, getSupabaseBrowserClient } from "@/lib/supabase.client";
import {
  projectToCloudRow,
  rowToProject,
  type PosterCanvasDbRow,
} from "@/lib/storage/posterCloudMapper";

const TABLE = "poster_canvas_projects";

async function requireUserId(): Promise<string> {
  const user = await getBrowserUser();
  if (!user || user.is_anonymous) {
    throw new Error("Sign in required to save projects");
  }
  return user.id;
}

/**
 * Cloud persistence for signed-in KruMath users (Hard Gate production path).
 * `.client.ts` so SSR import-protection never pulls `supabase.client` into the server bundle.
 */
export class SupabaseProjectRepository implements ProjectRepository {
  async getProjects(): Promise<PosterProject[]> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseBrowserClient()
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as PosterCanvasDbRow[]).map(rowToProject);
  }

  async getProject(id: string): Promise<PosterProject | null> {
    const userId = await requireUserId();
    const { data, error } = await getSupabaseBrowserClient()
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToProject(data as PosterCanvasDbRow) : null;
  }

  async createProject(project: PosterProject): Promise<PosterProject> {
    const userId = await requireUserId();
    const row = projectToCloudRow(project, userId);
    const { data, error } = await getSupabaseBrowserClient()
      .from(TABLE)
      .insert(row)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToProject(data as PosterCanvasDbRow);
  }

  async updateProject(project: PosterProject): Promise<PosterProject> {
    const userId = await requireUserId();
    const row = projectToCloudRow(project, userId);
    const { data, error } = await getSupabaseBrowserClient()
      .from(TABLE)
      .upsert(row, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return rowToProject(data as PosterCanvasDbRow);
  }

  async deleteProject(id: string): Promise<void> {
    const userId = await requireUserId();
    const { error } = await getSupabaseBrowserClient()
      .from(TABLE)
      .delete()
      .eq("user_id", userId)
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
}
