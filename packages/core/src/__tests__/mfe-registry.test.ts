import { beforeEach, describe, expect, it } from "vitest";
import { MfeRegistry } from "../mfe-registry";

describe("MfeRegistry", () => {
  let registry: MfeRegistry;

  beforeEach(() => {
    registry = new MfeRegistry();
  });

  it("should register and retrieve microfrontend manifests", () => {
    registry.register({
      id: "dashboard",
      name: "Costa Dashboard",
      scope: "mfe_dashboard",
      module: "./DashboardApp",
      url: "http://localhost:5001/assets/remoteEntry.js",
    });

    const mfe = registry.get("dashboard");
    expect(mfe).toBeDefined();
    expect(mfe?.name).toBe("Costa Dashboard");
    expect(mfe?.status).toBe("registered");
  });

  it("should update status and list all remotes", () => {
    registry.registerMany([
      {
        id: "dashboard",
        name: "Dashboard",
        scope: "mfe_dashboard",
        module: "./App",
        url: "http://localhost:5001/remoteEntry.js",
      },
      {
        id: "settings",
        name: "Settings",
        scope: "mfe_settings",
        module: "./App",
        url: "http://localhost:5002/remoteEntry.js",
      },
    ]);

    expect(registry.getAll()).toHaveLength(2);

    registry.setStatus("dashboard", "loaded");
    expect(registry.get("dashboard")?.status).toBe("loaded");
  });

  it("should return false on health check when remote is unreachable", async () => {
    registry.register({
      id: "unreachable",
      name: "Unreachable MFE",
      scope: "unreachable",
      module: "./App",
      url: "http://127.0.0.1:9999/remoteEntry.js",
    });

    const isHealthy = await registry.healthCheck("unreachable", 500);
    expect(isHealthy).toBe(false);
    expect(registry.get("unreachable")?.status).toBe("error");
  });
});
