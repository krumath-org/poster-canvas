import { LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithTooltip } from "@/components/ui/tooltip";
import { useKrumathAuth } from "@/hooks/useKrumathAuth";
import { publicAppPath, signInUrl } from "@/lib/krumathUrls";

function displayName(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): string {
  const name = user.user_metadata?.["name"];
  if (typeof name === "string" && name.trim()) return name.trim();
  return user.email ?? "Account";
}

function initial(user: {
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): string {
  const metaName = user.user_metadata?.["name"];
  const fromName = typeof metaName === "string" ? metaName.trim()[0] : undefined;
  return (fromName ?? user.email?.[0] ?? "U").toUpperCase();
}

/**
 * Account / profile control (integration §12).
 * Hard Gate means production users are signed in; Logout clears the shared session.
 */
export function AccountMenu() {
  const { user, loading, signOut } = useKrumathAuth();

  if (loading) {
    return <span className="inline-block h-7 w-7 shrink-0" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <WithTooltip label="Sign in">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          aria-label="Sign in"
          asChild
        >
          <a href={signInUrl(publicAppPath("/"))}>
            <UserRound className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Sign In</span>
          </a>
        </Button>
      </WithTooltip>
    );
  }

  const name = displayName(user);

  return (
    <DropdownMenu>
      <WithTooltip label={name}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs"
            aria-label="Account menu"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
              {initial(user)}
            </span>
            <span className="hidden max-w-[120px] truncate xl:inline">{name}</span>
          </Button>
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="space-y-0.5 font-normal">
          <div className="truncate text-sm font-medium">{name}</div>
          {user.email && <div className="truncate text-xs text-muted-foreground">{user.email}</div>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            void (async () => {
              await signOut();
              window.location.assign(signInUrl(publicAppPath("/")));
            })();
          }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
