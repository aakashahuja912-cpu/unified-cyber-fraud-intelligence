import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {spawn} from 'child_process';

let serverSpawned = false;

export default defineConfig(({command}) => {
  if (command === 'serve' && !serverSpawned) {
    serverSpawned = true;
    console.log('Spawning backend Express process on port 3001...');
    const child = spawn('npx', ['tsx', 'server.ts'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, PORT: '3001' }
    });
    child.on('error', (err) => {
      console.error('Failed to spawn backend process:', err);
    });
    process.on('exit', () => {
      child.kill();
    });
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          ws: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
