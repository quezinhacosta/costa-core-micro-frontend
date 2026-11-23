import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@costa/ui';

interface ShellArgs {
  brand: string;
}

const meta: Meta<ShellArgs> = {
  title: 'Layout/CostaShell',
  component: 'costa-shell',
  tags: ['autodocs'],
  argTypes: {
    brand: { control: 'text' },
  },
  args: {
    brand: 'Costa Portal',
  },
  render: (args) => html`
    <costa-shell .brand=${args.brand}>
      <span slot="nav" style="display: flex; gap: 1rem;">
        <a href="#dashboard" style="color: var(--costa-primary); text-decoration: none; font-weight: 500;">Dashboard</a>
        <a href="#settings" style="color: var(--costa-text-muted); text-decoration: none;">Configurações</a>
      </span>
      <div style="display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <costa-hello name="Dashboard MFE" badge="Port 5001"></costa-hello>
        <costa-hello name="Settings MFE" badge="Port 5002"></costa-hello>
      </div>
    </costa-shell>
  `,
};

export default meta;
type Story = StoryObj<ShellArgs>;

export const Default: Story = {};
