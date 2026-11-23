import type { Preview } from '@storybook/web-components';
import '@costa/tokens/css';
import '@costa/ui';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', title: 'Light', value: '#f8fafc' },
        { name: 'dark', title: 'Dark', value: '#090d16' },
      ],
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for Costa components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return story();
    },
  ],
};

export default preview;
