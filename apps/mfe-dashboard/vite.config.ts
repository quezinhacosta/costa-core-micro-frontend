import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'mfe_dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './DashboardWidget': './src/DashboardWidget.ts',
      },
      shared: ['@costa/tokens', '@costa/core', '@costa/ui'],
    }),
  ],
  server: {
    port: 5001,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
