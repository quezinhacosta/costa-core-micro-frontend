import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("costa-hello")
export class CostaHello extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--costa-font-sans, system-ui, sans-serif);
      color: var(--costa-text, #0f172a);
    }

    .card {
      background: var(--costa-surface, #ffffff);
      border: 1px solid var(--costa-border, #e2e8f0);
      border-radius: var(--costa-radius-md, 0.5rem);
      padding: var(--costa-space-4, 1rem);
      box-shadow: var(--costa-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.05));
      display: flex;
      flex-direction: column;
      gap: var(--costa-space-2, 0.5rem);
      transition: all var(--costa-transition-normal, 200ms ease);
    }

    .card:hover {
      box-shadow: var(--costa-shadow-md, 0 4px 6px rgb(0 0 0 / 0.1));
      border-color: var(--costa-border-focus, #3b82f6);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--costa-space-3, 0.75rem);
    }

    .title {
      font-size: var(--costa-font-size-lg, 1.125rem);
      font-weight: 600;
      margin: 0;
      color: var(--costa-text, #0f172a);
    }

    .badge {
      background: var(--costa-surface-hover, #f1f5f9);
      color: var(--costa-primary, #2563eb);
      font-size: var(--costa-font-size-xs, 0.75rem);
      font-family: var(--costa-font-mono, monospace);
      font-weight: 600;
      padding: 0.15rem 0.5rem;
      border-radius: var(--costa-radius-full, 9999px);
      border: 1px solid var(--costa-border, #e2e8f0);
    }

    .description {
      font-size: var(--costa-font-size-sm, 0.875rem);
      color: var(--costa-text-muted, #64748b);
      margin: 0;
    }

    .action-btn {
      align-self: flex-start;
      margin-top: var(--costa-space-2, 0.5rem);
      background: var(--costa-primary, #2563eb);
      color: var(--costa-primary-contrast, #ffffff);
      border: none;
      border-radius: var(--costa-radius-sm, 0.25rem);
      padding: 0.4rem 0.8rem;
      font-size: var(--costa-font-size-sm, 0.875rem);
      font-weight: 500;
      cursor: pointer;
      transition: background var(--costa-transition-fast, 150ms ease);
    }

    .action-btn:hover {
      background: var(--costa-primary-hover, #1d4ed8);
    }
  `;

  @property({ type: String })
  name = "World";

  @property({ type: String })
  badge = "Costa MFE";

  @property({ type: Number })
  clicks = 0;

  private handleClick() {
    this.clicks += 1;
    this.dispatchEvent(
      new CustomEvent("costa-hello:click", {
        detail: { clicks: this.clicks, name: this.name },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="card" part="card">
        <div class="header">
          <h3 class="title" part="title">Olá, ${this.name}!</h3>
          <span class="badge" part="badge">${this.badge}</span>
        </div>
        <p class="description" part="description">
          Web Component agnóstico Lit 3 operando com Design Tokens do Costa Core.
        </p>
        <button class="action-btn" part="button" @click="${this.handleClick}">
          Interagir (${this.clicks})
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "costa-hello": CostaHello;
  }
}
