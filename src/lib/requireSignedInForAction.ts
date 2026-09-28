import { createClientOnlyFn } from "@tanstack/react-start";

import { isPlayableUser } from "@/lib/authUser";
import { publicAppPath, signInUrl } from "@/lib/krumathUrls";

/**
 * Defense-in-depth for Export / Add Logo after the Hard Gate.
 * Returns true when the action may proceed; false after redirecting to sign-in.
 * Skipped in DEV so local editing stays frictionless.
 */
export const requireSignedInForAction = createClientOnlyFn(async (): Promise<boolean> => {
  if (import.meta.env.DEV) return true;

  const { getBrowserUser } = await import("@/lib/supabase.client");
  const user = await getBrowserUser();
  if (!isPlayableUser(user)) {
    window.location.assign(signInUrl(publicAppPath("/")));
    return false;
  }
  return true;
});
