import type { AppConfig, AuthProvider, ProjectRepository } from "@/core/types";
import { LocalProjectRepository } from "@/lib/storage/localProjectRepository";
import { SupabaseProjectRepository } from "@/lib/storage/supabaseProjectRepository";
import { MockAuthProvider } from "@/lib/auth/mockAuthProvider";

/**
 * Single place where the app's replaceable services are resolved.
 * Embedders (e.g. krumath.com) call `configureApp({ ... })` once before
 * mounting <PosterStudio /> to inject their own implementations.
 *
 * Production Hard Gate users use Supabase cloud codes; DEV uses localStorage.
 */
let config: Required<Pick<AppConfig, "authProvider" | "projectRepository">> & AppConfig = {
  authProvider: new MockAuthProvider(),
  projectRepository: import.meta.env.DEV
    ? new LocalProjectRepository()
    : new SupabaseProjectRepository(),
};

export function configureApp(next: AppConfig): void {
  config = { ...config, ...next };
}

export function getProjectRepository(): ProjectRepository {
  return config.projectRepository;
}

export function getAuthProvider(): AuthProvider {
  return config.authProvider;
}
