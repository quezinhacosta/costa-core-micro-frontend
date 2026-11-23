import type { CostaEventMap } from "./types";

export type EventCallback<T = unknown> = (payload: T) => void;

export class CostaEventBus<TEvents extends Record<string, unknown> = CostaEventMap> {
  private listeners: Map<keyof TEvents, Set<EventCallback>> = new Map();
  private broadcastChannel: BroadcastChannel | null = null;
  private channelName: string;

  constructor(channelName = "costa-mfe-bus") {
    this.channelName = channelName;
    if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
      try {
        this.broadcastChannel = new BroadcastChannel(channelName);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && typeof event.data === "object" && "type" in event.data) {
            const { type, payload } = event.data;
            this.notifyLocal(type as keyof TEvents, payload as TEvents[keyof TEvents], false);
          }
        };
      } catch {
        this.broadcastChannel = null;
      }
    }
  }

  on<K extends keyof TEvents>(event: K, handler: EventCallback<TEvents[K]>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler as EventCallback);

    return () => this.off(event, handler);
  }

  off<K extends keyof TEvents>(event: K, handler: EventCallback<TEvents[K]>): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler as EventCallback);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit<K extends keyof TEvents>(
    event: K,
    payload: TEvents[K],
    options: { broadcast?: boolean; domEvent?: boolean } = { broadcast: true, domEvent: true },
  ): void {
    // 1. Notify local subscribers in current memory
    this.notifyLocal(event, payload, true);

    // 2. Dispatch DOM CustomEvent for decoupled listeners
    if (
      options.domEvent !== false &&
      typeof window !== "undefined" &&
      typeof window.dispatchEvent === "function"
    ) {
      try {
        const customEvent = new CustomEvent(`costa:${String(event)}`, {
          detail: payload,
          bubbles: true,
          composed: true,
        });
        window.dispatchEvent(customEvent);
      } catch {
        // Silently handle if window dispatch fails
      }
    }

    // 3. Broadcast across tabs/contexts via BroadcastChannel
    if (options.broadcast !== false && this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({
          type: event,
          payload,
          timestamp: Date.now(),
        });
      } catch {
        // Fallback gracefully if broadcast fails
      }
    }
  }

  private notifyLocal<K extends keyof TEvents>(
    event: K,
    payload: TEvents[K],
    _isOrigin: boolean,
  ): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      for (const handler of Array.from(handlers)) {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[CostaEventBus] Error in handler for "${String(event)}":`, err);
        }
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }

  destroy(): void {
    this.clear();
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}

// Alias to satisfy prompt naming variation ("CostalEventBus / CostaEventBus")
export const CostalEventBus = CostaEventBus;
export const eventBus = new CostaEventBus();
