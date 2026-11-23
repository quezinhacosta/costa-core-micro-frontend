import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@costa/ui';

interface HelloArgs {
  name: string;
  badge: string;
}

const meta: Meta<HelloArgs> = {
  title: 'Primitivos/CostaHello',
  component: 'costa-hello',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text', description: 'Nome exibido no título' },
    badge: { control: 'text', description: 'Badge informativo' },
  },
  args: {
    name: 'Desenvolvedor',
    badge: 'MFE Core',
  },
  render: (args) => html`
    <costa-hello
      .name=${args.name}
      .badge=${args.badge}
    ></costa-hello>
  `,
};

export default meta;
type Story = StoryObj<HelloArgs>;

export const Default: Story = {};

export const CustomBadge: Story = {
  args: {
    name: 'Microfrontend Remoto',
    badge: 'v1.0.0-prod',
  },
};
