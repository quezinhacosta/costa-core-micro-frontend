import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'mfe_settings',
      filename: 'remoteEntry.js',
      exposes: {
        './SettingsWidget': './src/SettingsWidget.ts',
      },
      shared: ['@costa/tokens', '@costa/core', '@costa/ui'],
    }),
  ],
  server: {
    port: 5002,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
