import { describe, expect, it } from "vitest";
import type { User } from "@supabase/supabase-js";

import { clientPlayableAuthState, isPlayableUser, serverPlayableAuthState } from "./authUser";

function user(overrides: Record<string, unknown> = {}): User {
  return { id: "user-1", is_anonymous: false, ...overrides } as unknown as User;
}

describe("isPlayableUser", () => {
  it("rejects a missing session", () => {
    expect(isPlayableUser(null)).toBe(false);
  });

  it("rejects an anonymous KruMath guest", () => {
    expect(isPlayableUser(user({ is_anonymous: true }))).toBe(false);
  });

  it("accepts a signed-in account", () => {
    expect(isPlayableUser(user())).toBe(true);
  });
});

describe("clientPlayableAuthState", () => {
  it("reports a signed-in account as authenticated", () => {
    expect(clientPlayableAuthState(user())).toEqual({
      status: "authenticated",
      userId: "user-1",
    });
  });

  // The browser reads the shared session cookie, so "no session" is final here.
  it("reports a missing session as unauthenticated", () => {
    expect(clientPlayableAuthState(null)).toEqual({ status: "unauthenticated" });
  });

  it("reports an anonymous session as unauthenticated", () => {
    expect(clientPlayableAuthState(user({ is_anonymous: true }))).toEqual({
      status: "unauthenticated",
    });
  });
});

describe("serverPlayableAuthState", () => {
  // Regression guard for the production outage: the Worker can see no user on a fresh
  // navigation even when a session exists, so it must not conclude that the player is
  // signed out and bounce them to /sign-in.
  it("reports a missing cookie session as unknown, never unauthenticated", () => {
    expect(serverPlayableAuthState(null)).toEqual({ status: "unknown" });
  });

  it("reports an anonymous cookie session as unknown", () => {
    expect(serverPlayableAuthState(user({ is_anonymous: true }))).toEqual({ status: "unknown" });
  });

  it("still vouches for a genuine cookie session", () => {
    expect(serverPlayableAuthState(user())).toEqual({
      status: "authenticated",
      userId: "user-1",
    });
  });
});
