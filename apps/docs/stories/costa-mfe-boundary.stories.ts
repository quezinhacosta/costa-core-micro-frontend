import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@costa/ui';

interface BoundaryArgs {
  mfeId: string;
  hasError: boolean;
  errorMessage: string;
}

const meta: Meta<BoundaryArgs> = {
  title: 'Resiliência/CostaMfeBoundary',
  component: 'costa-mfe-boundary',
  tags: ['autodocs'],
  argTypes: {
    mfeId: { control: 'text' },
    hasError: { control: 'boolean' },
    errorMessage: { control: 'text' },
  },
  args: {
    mfeId: 'mfe-dashboard',
    hasError: false,
    errorMessage: '',
  },
  render: (args) => html`
    <costa-mfe-boundary
      .mfeId=${args.mfeId}
      ?has-error=${args.hasError}
      .errorMessage=${args.errorMessage}
    >
      <div style="padding: 1rem; background: var(--costa-surface); border: 1px solid var(--costa-border); border-radius: 8px;">
        <h4>Microfrontend Saudável Conectado</h4>
        <p style="color: var(--costa-text-muted);">Este conteúdo está renderizando normalmente através do boundary.</p>
      </div>
    </costa-mfe-boundary>
  `,
};

export default meta;
type Story = StoryObj<BoundaryArgs>;

export const Healthy: Story = {};

export const WithError: Story = {
  args: {
    mfeId: 'mfe-payments-offline',
    hasError: true,
    errorMessage: 'Falha de conexão com remoteEntry.js em http://localhost:5005',
  },
};
