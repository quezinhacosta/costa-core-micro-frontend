import { eventBus } from "@costa/core";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("costa-mfe-boundary")
export class CostaMfeBoundary extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      box-sizing: border-box;
      font-family: var(--costa-font-sans, system-ui, sans-serif);
    }

    .fallback-card {
      border: 1px dashed var(--costa-danger, #ef4444);
      background: var(--costa-surface, #ffffff);
      border-radius: var(--costa-radius-md, 0.5rem);
      padding: var(--costa-space-6, 1.5rem);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--costa-space-3, 0.75rem);
      box-shadow: var(--costa-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.05));
    }

    .icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: var(--costa-radius-full, 9999px);
      background: rgba(239, 68, 68, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--costa-danger, #ef4444);
      font-size: 1.5rem;
    }

    .fallback-title {
      font-size: var(--costa-font-size-base, 1rem);
      font-weight: 600;
      color: var(--costa-text, #0f172a);
      margin: 0;
    }

    .fallback-msg {
      font-size: var(--costa-font-size-sm, 0.875rem);
      color: var(--costa-text-muted, #64748b);
      margin: 0;
      max-width: 400px;
    }

    .retry-btn {
      background: var(--costa-primary, #2563eb);
      color: var(--costa-primary-contrast, #ffffff);
      border: none;
      border-radius: var(--costa-radius-sm, 0.25rem);
      padding: 0.5rem 1rem;
      font-size: var(--costa-font-size-sm, 0.875rem);
      font-weight: 500;
      cursor: pointer;
      transition: background var(--costa-transition-fast, 150ms ease);
    }

    .retry-btn:hover {
      background: var(--costa-primary-hover, #1d4ed8);
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--costa-space-6, 1.5rem);
      color: var(--costa-text-muted, #64748b);
      font-size: var(--costa-font-size-sm, 0.875rem);
      gap: var(--costa-space-2, 0.5rem);
    }
  `;

  @property({ type: String, attribute: "mfe-id" })
  mfeId = "remote-mfe";

  @property({ type: Boolean, attribute: "has-error" })
  hasError = false;

  @property({ type: String, attribute: "error-message" })
  errorMessage = "";

  @property({ type: Number, attribute: "timeout-ms" })
  timeoutMs = 8000;

  @state()
  private isLoading = false;

  private timeoutTimer: ReturnType<typeof setTimeout> | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.startTimeoutWatch();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.clearTimeoutWatch();
  }

  private startTimeoutWatch() {
    if (this.timeoutMs > 0 && !this.hasError) {
      this.clearTimeoutWatch();
      this.timeoutTimer = setTimeout(() => {
        if (!this.hasError) {
          this.triggerError(
            `Tempo limite excedido ao carregar o microfrontend (${this.timeoutMs}ms).`,
          );
        }
      }, this.timeoutMs);
    }
  }

  private clearTimeoutWatch() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
  }

  public triggerError(message: string) {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
    this.clearTimeoutWatch();

    // Telemetria no @costa/core
    eventBus.emit("mfe:error", {
      mfeId: this.mfeId,
      error: message,
      timestamp: Date.now(),
    });

    this.dispatchEvent(
      new CustomEvent("costa-mfe:error", {
        detail: { mfeId: this.mfeId, error: message },
        bubbles: true,
        composed: true,
      }),
    );
  }

  public markReady() {
    this.clearTimeoutWatch();
    this.hasError = false;
    this.isLoading = false;
    eventBus.emit("mfe:ready", { mfeId: this.mfeId });
  }

  public retry() {
    this.hasError = false;
    this.errorMessage = "";
    this.isLoading = true;
    this.startTimeoutWatch();

    this.dispatchEvent(
      new CustomEvent("costa-mfe:retry", {
        detail: { mfeId: this.mfeId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    if (this.hasError) {
      return html`
        <div class="fallback-card" part="fallback-card">
          <div class="icon-wrapper" part="icon">⚠️</div>
          <h4 class="fallback-title" part="title">Falha no Microfrontend: ${this.mfeId}</h4>
          <p class="fallback-msg" part="message">
            ${this.errorMessage || "Não foi possível inicializar este módulo remoto com segurança."}
          </p>
          <button class="retry-btn" part="retry-button" @click="${this.retry}">
            Tentar Novamente
          </button>
        </div>
      `;
    }

    return html`
      <div part="container">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "costa-mfe-boundary": CostaMfeBoundary;
  }
}
