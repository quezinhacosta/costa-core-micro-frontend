import { eventBus } from "./event-bus";
import type { CostaTheme } from "./types";

export class ThemeManager {
  private currentTheme: CostaTheme = "light";
  private listeners: Set<(theme: CostaTheme) => void> = new Set();
  private storageKey = "costa-theme";

  constructor(defaultTheme: CostaTheme = "light") {
    this.currentTheme = defaultTheme;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved === "light" || saved === "dark") {
          this.currentTheme = saved;
        } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
          this.currentTheme = "dark";
        }
      } catch {
        // Ignore local storage errors in restricted contexts
      }
      this.applyTheme(this.currentTheme);
    }
  }

  getTheme(): CostaTheme {
    return this.currentTheme;
  }

  setTheme(theme: CostaTheme): void {
    if (this.currentTheme === theme) return;
    this.currentTheme = theme;
    this.applyTheme(theme);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch {
        // Ignore local storage errors
      }
    }

    eventBus.emit("theme:change", { theme });
    for (const listener of Array.from(this.listeners)) {
      listener(theme);
    }
  }

  toggleTheme(): CostaTheme {
    const next = this.currentTheme === "light" ? "dark" : "light";
    this.setTheme(next);
    return next;
  }

  subscribe(listener: (theme: CostaTheme) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private applyTheme(theme: CostaTheme): void {
    if (typeof document !== "undefined" && document.documentElement) {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }
}

export const themeManager = new ThemeManager();
