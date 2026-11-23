import { describe, expect, it, vi } from "vitest";
import { CostaEventBus } from "../event-bus";

describe("CostaEventBus", () => {
  it("should register and trigger local event listeners", () => {
    const bus = new CostaEventBus();
    const handler = vi.fn();

    const unsubscribe = bus.on("theme:change", handler);
    bus.emit("theme:change", { theme: "dark" });

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith({ theme: "dark" });

    unsubscribe();
    bus.emit("theme:change", { theme: "light" });
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should support multiple listeners and removal via off", () => {
    const bus = new CostaEventBus();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    bus.on("mfe:navigation", handler1);
    bus.on("mfe:navigation", handler2);

    bus.emit("mfe:navigation", { path: "/dashboard" });
    expect(handler1).toHaveBeenCalledWith({ path: "/dashboard" });
    expect(handler2).toHaveBeenCalledWith({ path: "/dashboard" });

    bus.off("mfe:navigation", handler1);
    bus.emit("mfe:navigation", { path: "/settings" });
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(2);
  });

  it("should isolate errors in listeners and continue notifying other subscribers", () => {
    const bus = new CostaEventBus();
    const faultyHandler = vi.fn(() => {
      throw new Error("Explosion");
    });
    const goodHandler = vi.fn();

    bus.on("mfe:ready", faultyHandler);
    bus.on("mfe:ready", goodHandler);

    bus.emit("mfe:ready", { mfeId: "dashboard" });
    expect(faultyHandler).toHaveBeenCalled();
    expect(goodHandler).toHaveBeenCalledWith({ mfeId: "dashboard" });
  });
});
