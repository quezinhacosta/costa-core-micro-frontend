import { describe, expect, it, vi } from "vitest";
import { ThemeManager } from "../theme-manager";

describe("ThemeManager", () => {
  it("should initialize with default light theme", () => {
    const tm = new ThemeManager("light");
    expect(tm.getTheme()).toBe("light");
  });

  it("should toggle theme and notify subscribers", () => {
    const tm = new ThemeManager("light");
    const subscriber = vi.fn();

    const unsubscribe = tm.subscribe(subscriber);
    const next = tm.toggleTheme();

    expect(next).toBe("dark");
    expect(tm.getTheme()).toBe("dark");
    expect(subscriber).toHaveBeenCalledWith("dark");

    unsubscribe();
    tm.toggleTheme();
    expect(subscriber).toHaveBeenCalledTimes(1);
  });

  it("should set theme explicitly", () => {
    const tm = new ThemeManager("light");
    tm.setTheme("dark");
    expect(tm.getTheme()).toBe("dark");
  });
});
