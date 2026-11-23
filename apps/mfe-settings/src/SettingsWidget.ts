import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import {
  type CostaUser,
  sessionStore,
  themeManager,
} from '@costa/core';
import '@costa/tokens/css';
import '@costa/ui';

@customElement('costa-settings-widget')
export class CostaSettingsWidget extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--costa-font-sans, system-ui, sans-serif);
      color: var(--costa-text, #0f172a);
    }

    .settings-container {
      background: var(--costa-surface, #ffffff);
      border: 1px solid var(--costa-border, #e2e8f0);
      border-radius: var(--costa-radius-lg, 0.75rem);
      padding: var(--costa-space-6, 1.5rem);
      box-shadow: var(--costa-shadow-sm, 0 1px 2px rgb(0 0 0 / 0.05));
    }

    .header {
      margin-bottom: var(--costa-space-4, 1rem);
      border-bottom: 1px solid var(--costa-border, #e2e8f0);
      padding-bottom: var(--costa-space-3, 0.75rem);
    }

    .title {
      font-size: var(--costa-font-size-xl, 1.25rem);
      font-weight: 700;
      margin: 0;
    }

    .section-title {
      font-size: var(--costa-font-size-sm, 0.875rem);
      font-weight: 600;
      color: var(--costa-text-muted, #64748b);
      text-transform: uppercase;
      margin-top: var(--costa-space-4, 1rem);
      margin-bottom: var(--costa-space-2, 0.5rem);
    }

    .button-group {
      display: flex;
      flex-wrap: wrap;
      gap: var(--costa-space-2, 0.5rem);
    }

    .btn {
      background: var(--costa-surface-hover, #f1f5f9);
      border: 1px solid var(--costa-border, #e2e8f0);
      color: var(--costa-text, #0f172a);
      padding: 0.5rem 1rem;
      border-radius: var(--costa-radius-sm, 0.25rem);
      cursor: pointer;
      font-size: var(--costa-font-size-sm, 0.875rem);
      font-weight: 500;
      transition: all var(--costa-transition-fast, 150ms ease);
    }

    .btn:hover {
      border-color: var(--costa-border-focus, #3b82f6);
      background: var(--costa-border, #e2e8f0);
    }

    .btn-primary {
      background: var(--costa-primary, #2563eb);
      color: var(--costa-primary-contrast, #ffffff);
      border-color: var(--costa-primary, #2563eb);
    }

    .btn-primary:hover {
      background: var(--costa-primary-hover, #1d4ed8);
    }
  `;

  @state()
  private currentUser: CostaUser | null = null;

  private unsubscribeSession: (() => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();
    this.currentUser = sessionStore.getUser();
    this.unsubscribeSession = sessionStore.subscribe((user) => {
      this.currentUser = user;
      this.requestUpdate();
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeSession) {
      this.unsubscribeSession();
    }
  }

  private setAdminUser() {
    sessionStore.setUser({
      id: 'usr-admin-01',
      name: 'Administrador Costa',
      email: 'admin@costa.io',
      role: 'Platform Architect',
    });
  }

  private setRegularUser() {
    sessionStore.setUser({
      id: 'usr-dev-02',
      name: 'Quezia Silva',
      email: 'quezia@costa.io',
      role: 'Senior Frontend Engineer',
    });
  }

  private logoutUser() {
    sessionStore.setUser(null);
  }

  private toggleGlobalTheme() {
    themeManager.toggleTheme();
  }

  override render() {
    return html`
      <div class="settings-container">
        <div class="header">
          <h3 class="title">⚙️ MFE Settings & Preferences (Remote 2)</h3>
          <span style="font-size: 0.8rem; color: var(--costa-text-muted);">
            Porta: 5002 | Validação Multi-Remote com Estado Compartilhado
          </span>
        </div>

        <div class="section-title">Sessão Compartilhada (@costa/core SessionStore)</div>
        <p style="margin: 0 0 0.5rem 0; font-size: 0.875rem; color: var(--costa-text);">
          Usuário Atual: <strong>${this.currentUser ? `${this.currentUser.name} (${this.currentUser.role})` : 'Nenhum usuário logado'}</strong>
        </p>

        <div class="button-group">
          <button class="btn btn-primary" @click="${this.setAdminUser}">
            Simular Login Admin
          </button>
          <button class="btn" @click="${this.setRegularUser}">
            Simular Login Engenheiro
          </button>
          <button class="btn" @click="${this.logoutUser}">
            Limpar Sessão
          </button>
        </div>

        <div class="section-title">Controle Global de Tema</div>
        <div class="button-group">
          <button class="btn" @click="${this.toggleGlobalTheme}">
            Alternar Tema Global (Light / Dark)
          </button>
        </div>

        <div style="margin-top: 1.5rem;">
          <costa-hello name="Settings Remote" badge="Remote 2"></costa-hello>
        </div>
      </div>
    `;
  }
}

export function mount(container: HTMLElement) {
  const el = document.createElement('costa-settings-widget');
  container.replaceChildren(el);
  return () => {
    el.remove();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'costa-settings-widget': CostaSettingsWidget;
  }
}
