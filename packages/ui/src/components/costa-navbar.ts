import { type CostaTheme, themeManager } from "@costa/core";
import { LitElement, css, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("costa-navbar")
export class CostaNavbar extends LitElement {
  static override styles = css`
    :host {
      display: block;
      width: 100%;
      font-family: var(--costa-font-sans, system-ui, sans-serif);
      background: var(--costa-surface, #ffffff);
      border-bottom: 1px solid var(--costa-border, #e2e8f0);
      box-shadow: var(--costa-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.05));
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--costa-space-3, 0.75rem) var(--costa-space-4, 1rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--costa-space-4, 1rem);
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: var(--costa-space-2, 0.5rem);
      font-weight: 700;
      font-size: var(--costa-font-size-lg, 1.125rem);
      color: var(--costa-text, #0f172a);
    }

    .links-section {
      display: flex;
      align-items: center;
      gap: var(--costa-space-4, 1rem);
      flex: 1;
      justify-content: center;
    }

    .actions-section {
      display: flex;
      align-items: center;
      gap: var(--costa-space-2, 0.5rem);
    }

    .theme-toggle {
      background: var(--costa-surface-hover, #f1f5f9);
      border: 1px solid var(--costa-border, #e2e8f0);
      border-radius: var(--costa-radius-md, 0.5rem);
      padding: 0.4rem 0.65rem;
      cursor: pointer;
      color: var(--costa-text, #0f172a);
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      transition: background var(--costa-transition-fast, 150ms ease);
    }

    .theme-toggle:hover {
      border-color: var(--costa-border-focus, #3b82f6);
    }
  `;

  @property({ type: String })
  brand = "Costa Core";

  @state()
  private currentTheme: CostaTheme = "light";

  private unsubscribeTheme: (() => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.currentTheme = themeManager.getTheme();
    this.unsubscribeTheme = themeManager.subscribe((theme) => {
      this.currentTheme = theme;
      this.requestUpdate();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
      this.unsubscribeTheme = null;
    }
  }

  private handleToggleTheme() {
    const next = themeManager.toggleTheme();
    this.currentTheme = next;
    this.dispatchEvent(
      new CustomEvent("costa-navbar:theme-change", {
        detail: { theme: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <nav class="nav-container" part="nav-container">
        <div class="brand-section" part="brand">
          <slot name="brand">${this.brand}</slot>
        </div>
        <div class="links-section" part="nav">
          <slot name="nav"></slot>
        </div>
        <div class="actions-section" part="actions">
          <slot name="actions"></slot>
          <button
            class="theme-toggle"
            part="theme-toggle"
            title="Alternar Tema"
            @click="${this.handleToggleTheme}"
          >
            ${this.currentTheme === "dark" ? "☀️ Claro" : "🌙 Escuro"}
          </button>
        </div>
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "costa-navbar": CostaNavbar;
  }
}
