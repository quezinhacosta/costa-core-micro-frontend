import '@costa/tokens/css';
import '@costa/ui';
import {
  eventBus,
  mfeRegistry,
  sessionStore,
  themeManager,
} from '@costa/core';
import type { CostaMfeBoundary } from '@costa/ui';

// 1. Registra os manifestos dos microfrontends no core registry
mfeRegistry.registerMany([
  {
    id: 'mfe-dashboard',
    name: 'Dashboard Microfrontend',
    scope: 'mfe_dashboard',
    module: './DashboardWidget',
    url: 'http://localhost:5001/assets/remoteEntry.js',
    status: 'registered',
  },
  {
    id: 'mfe-settings',
    name: 'Settings Microfrontend',
    scope: 'mfe_settings',
    module: './SettingsWidget',
    url: 'http://localhost:5002/assets/remoteEntry.js',
    status: 'registered',
  },
]);

// 2. Elementos DOM
const mountPoint = document.getElementById('mfe-mount-point');
const boundary = document.getElementById('active-boundary') as CostaMfeBoundary | null;
const navDashboard = document.getElementById('nav-dashboard');
const navSettings = document.getElementById('nav-settings');
const sessionBadge = document.getElementById('session-badge');

// 3. Atualiza indicador de sessão compartilhada
function updateSessionBadge() {
  const user = sessionStore.getUser();
  if (sessionBadge) {
    sessionBadge.textContent = user ? `👤 ${user.name} (${user.role})` : '👤 Visitante (Anônimo)';
  }
}

// 4. Carregamento de Remote com Resiliência
async function loadRemoteView(route: 'dashboard' | 'settings') {
  if (!mountPoint || !boundary) return;

  const mfeId = route === 'dashboard' ? 'mfe-dashboard' : 'mfe-settings';
  boundary.mfeId = mfeId;
  boundary.hasError = false;
  mountPoint.innerHTML = `<p style="color: var(--costa-text-muted);">Conectando ao ${mfeId}...</p>`;

  try {
    if (route === 'dashboard') {
      // Import dinâmico do remote federation
      // @ts-ignore
      const module = await import('mfeDashboard/DashboardWidget');
      mountPoint.innerHTML = '';
      if (module.mount) {
        module.mount(mountPoint);
      } else {
        const el = document.createElement('costa-dashboard-widget');
        mountPoint.appendChild(el);
      }
      boundary.markReady();
    } else {
      // @ts-ignore
      const module = await import('mfeSettings/SettingsWidget');
      mountPoint.innerHTML = '';
      if (module.mount) {
        module.mount(mountPoint);
      } else {
        const el = document.createElement('costa-settings-widget');
        mountPoint.appendChild(el);
      }
      boundary.markReady();
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    boundary.triggerError(`Falha ao carregar microfrontend ${mfeId}: ${errorMsg}`);
  }
}

// 5. Navegação
navDashboard?.addEventListener('click', () => {
  if (navDashboard && navSettings) {
    navDashboard.style.color = 'var(--costa-primary)';
    navSettings.style.color = 'var(--costa-text-muted)';
  }
  loadRemoteView('dashboard');
});

navSettings?.addEventListener('click', () => {
  if (navDashboard && navSettings) {
    navSettings.style.color = 'var(--costa-primary)';
    navDashboard.style.color = 'var(--costa-text-muted)';
  }
  loadRemoteView('settings');
});

boundary?.addEventListener('costa-mfe:retry', (e: Event) => {
  const custom = e as CustomEvent<{ mfeId: string }>;
  const route = custom.detail.mfeId === 'mfe-settings' ? 'settings' : 'dashboard';
  loadRemoteView(route);
});

// 6. Subscrições de Eventos do Core
eventBus.on('session:change', () => {
  updateSessionBadge();
});

eventBus.on('theme:change', ({ theme }) => {
  console.log('[Shell] Tema alterado para:', theme);
});

eventBus.on('mfe:error', (payload) => {
  console.warn('[Shell Telemetria] Erro capturado:', payload);
});

// Inicialização padrão
updateSessionBadge();
loadRemoteView('dashboard');
