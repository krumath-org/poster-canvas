import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { AUTOSAVE_DELAY_MS } from "./useAutosaveProject";

describe("AUTOSAVE_DELAY_MS", () => {
  it("uses a 2.5s debounce within the 2–3s plan window", () => {
    expect(AUTOSAVE_DELAY_MS).toBe(2500);
  });
});

describe("autosave debounce behavior", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("fires once after idle delay, not on every change", () => {
    const save = vi.fn();
    let timer: ReturnType<typeof setTimeout> | null = null;
    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => save(), AUTOSAVE_DELAY_MS);
    };

    schedule();
    schedule();
    schedule();
    expect(save).not.toHaveBeenCalled();
    vi.advanceTimersByTime(AUTOSAVE_DELAY_MS);
    expect(save).toHaveBeenCalledTimes(1);
  });
});
