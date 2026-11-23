import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./costa-navbar";

@customElement("costa-shell")
export class CostaShell extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--costa-bg, #f8fafc);
      color: var(--costa-text, #0f172a);
      font-family: var(--costa-font-sans, system-ui, sans-serif);
      box-sizing: border-box;
    }

    .main-wrapper {
      flex: 1;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--costa-space-6, 1.5rem) var(--costa-space-4, 1rem);
      box-sizing: border-box;
    }

    .footer-wrapper {
      background: var(--costa-surface, #ffffff);
      border-top: 1px solid var(--costa-border, #e2e8f0);
      padding: var(--costa-space-4, 1rem);
      text-align: center;
      font-size: var(--costa-font-size-sm, 0.875rem);
      color: var(--costa-text-muted, #64748b);
    }
  `;

  @property({ type: String })
  brand = "Costa MFE Shell";

  override render() {
    return html`
      <costa-navbar brand="${this.brand}" part="navbar">
        <slot name="brand" slot="brand"></slot>
        <slot name="nav" slot="nav"></slot>
        <slot name="actions" slot="actions"></slot>
      </costa-navbar>

      <main class="main-wrapper" part="main">
        <slot></slot>
      </main>

      <footer class="footer-wrapper" part="footer">
        <slot name="footer">
          &copy; ${new Date().getFullYear()} Costa Core Microfrontend Infrastructure
        </slot>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "costa-shell": CostaShell;
  }
}
