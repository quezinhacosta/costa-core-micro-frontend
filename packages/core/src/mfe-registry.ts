import { eventBus } from "./event-bus";
import type { MfeManifest } from "./types";

export class MfeRegistry {
  private remotes: Map<string, MfeManifest> = new Map();

  register(manifest: MfeManifest): void {
    const existing = this.remotes.get(manifest.id);
    this.remotes.set(manifest.id, {
      ...manifest,
      status: existing?.status ?? "registered",
    });
  }

  registerMany(manifests: MfeManifest[]): void {
    for (const manifest of manifests) {
      this.register(manifest);
    }
  }

  get(id: string): MfeManifest | undefined {
    return this.remotes.get(id);
  }

  getAll(): MfeManifest[] {
    return Array.from(this.remotes.values());
  }

  setStatus(id: string, status: MfeManifest["status"]): void {
    const manifest = this.remotes.get(id);
    if (manifest) {
      manifest.status = status;
      this.remotes.set(id, { ...manifest });
    }
  }

  async healthCheck(id: string, timeoutMs = 3000): Promise<boolean> {
    const manifest = this.remotes.get(id);
    if (!manifest) return false;

    if (typeof fetch === "undefined") {
      return true;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(manifest.url, {
        method: "HEAD",
        signal: controller.signal,
        mode: "no-cors",
      });
      clearTimeout(timeoutId);

      const isHealthy = response.ok || response.type === "opaque" || response.status < 400;
      this.setStatus(id, isHealthy ? "registered" : "error");
      return isHealthy;
    } catch {
      this.setStatus(id, "error");
      eventBus.emit("mfe:error", {
        mfeId: id,
        error: `Health check failed for remote ${id} at ${manifest.url}`,
        timestamp: Date.now(),
      });
      return false;
    }
  }

  clear(): void {
    this.remotes.clear();
  }
}

export const mfeRegistry = new MfeRegistry();
