import { eventBus } from "./event-bus";
import type { CostaUser } from "./types";

export class SessionStore {
  private currentUser: CostaUser | null = null;
  private listeners: Set<(user: CostaUser | null) => void> = new Set();
  private storageKey = "costa-session";

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem(this.storageKey);
        if (stored) {
          this.currentUser = JSON.parse(stored);
        }
      } catch {
        this.currentUser = null;
      }
    }
  }

  getUser(): CostaUser | null {
    return this.currentUser;
  }

  setUser(user: CostaUser | null): void {
    this.currentUser = user;

    if (typeof window !== "undefined") {
      try {
        if (user) {
          sessionStorage.setItem(this.storageKey, JSON.stringify(user));
        } else {
          sessionStorage.removeItem(this.storageKey);
        }
      } catch {
        // Ignore session storage errors
      }
    }

    eventBus.emit("session:change", { user });
    for (const listener of Array.from(this.listeners)) {
      listener(user);
    }
  }

  subscribe(listener: (user: CostaUser | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const sessionStore = new SessionStore();
