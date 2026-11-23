import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { eventBus, type CostaTheme, themeManager } from '@costa/core';
import '@costa/tokens/css';
import '@costa/ui';

@customElement('costa-dashboard-widget')
export class CostaDashboardWidget extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--costa-font-sans, system-ui, sans-serif);
      color: var(--costa-text, #0f172a);
    }

    .widget-container {
      background: var(--costa-surface, #ffffff);
      border: 1px solid var(--costa-border, #e2e8f0);
      border-radius: var(--costa-radius-lg, 0.75rem);
      padding: var(--costa-space-6, 1.5rem);
      box-shadow: var(--costa-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.05));
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--costa-space-4, 1rem);
      border-bottom: 1px solid var(--costa-border, #e2e8f0);
      padding-bottom: var(--costa-space-3, 0.75rem);
    }

    .title {
      font-size: var(--costa-font-size-xl, 1.25rem);
      font-weight: 700;
      margin: 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--costa-space-4, 1rem);
      margin-bottom: var(--costa-space-4, 1rem);
    }

    .metric-card {
      background: var(--costa-surface-hover, #f1f5f9);
      border-radius: var(--costa-radius-md, 0.5rem);
      padding: var(--costa-space-3, 0.75rem);
      border: 1px solid var(--costa-border, #e2e8f0);
    }

    .metric-label {
      font-size: var(--costa-font-size-xs, 0.75rem);
      color: var(--costa-text-muted, #64748b);
      text-transform: uppercase;
      font-weight: 600;
    }

    .metric-value {
      font-size: var(--costa-font-size-2xl, 1.5rem);
      font-weight: 700;
      color: var(--costa-primary, #2563eb);
      margin-top: 0.25rem;
    }

    .btn-ping {
      background: var(--costa-primary, #2563eb);
      color: var(--costa-primary-contrast, #ffffff);
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--costa-radius-sm, 0.25rem);
      cursor: pointer;
      font-size: var(--costa-font-size-sm, 0.875rem);
      font-weight: 500;
    }

    .btn-ping:hover {
      background: var(--costa-primary-hover, #1d4ed8);
    }
  `;

  @state()
  private pingCount = 0;

  @state()
  private currentTheme: CostaTheme = 'light';

  private unsubscribeTheme: (() => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.currentTheme = themeManager.getTheme();
    this.unsubscribeTheme = eventBus.on('theme:change', ({ theme }) => {
      this.currentTheme = theme;
      this.requestUpdate();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeTheme) {
      this.unsubscribeTheme();
    }
  }

  private emitPing() {
    this.pingCount += 1;
    eventBus.emit('mfe:navigation', {
      path: `/dashboard/metric-ping-${this.pingCount}`,
    });
  }

  override render() {
    return html`
      <div class="widget-container">
        <div class="header">
          <div>
            <h3 class="title">📊 MFE Dashboard (Remote 1)</h3>
            <span style="font-size: 0.8rem; color: var(--costa-text-muted);">
              Porta: 5001 | Tema Ativo: ${this.currentTheme}
            </span>
          </div>
          <button class="btn-ping" @click="${this.emitPing}">
            Disparar EventBus (${this.pingCount})
          </button>
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Status do MFE</div>
            <div class="metric-value">Online</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Eventos Disparados</div>
            <div class="metric-value">${this.pingCount}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Arquitetura</div>
            <div class="metric-value" style="font-size: 1.1rem; padding-top: 0.3rem;">Lit 3 + Vite</div>
          </div>
        </div>

        <div>
          <costa-hello name="Dashboard Worker" badge="Remote 1"></costa-hello>
        </div>
      </div>
    `;
  }
}

export function mount(container: HTMLElement) {
  const el = document.createElement('costa-dashboard-widget');
  container.replaceChildren(el);
  return () => {
    el.remove();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'costa-dashboard-widget': CostaDashboardWidget;
  }
}
