import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    federation({
      name: 'costa_shell',
      remotes: {
        mfeDashboard: 'http://localhost:5001/assets/remoteEntry.js',
        mfeSettings: 'http://localhost:5002/assets/remoteEntry.js',
      },
      shared: ['@costa/tokens', '@costa/core', '@costa/ui'],
    }),
  ],
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
});
