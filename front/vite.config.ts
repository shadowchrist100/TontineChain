import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],

    resolve: {
      alias: {
        // @/ pointe vers front/src/
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor'
              }
              if (id.includes('@tanstack/react-query')) {
                return 'query'
              }
              if (id.includes('zustand')) {
                return 'state'
              }
              if (id.includes('ethers')) {
                return 'blockchain'
              }
              if (id.includes('date-fns')) {
                return 'ui'
              }
            }
          },
        },
      },
    },

    server: {
      port: 5173,
      proxy: {
        // En dev : /api → back/ local (port 3000 par défaut)
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/ws': {
          target: env.VITE_WS_URL || 'ws://localhost:3000',
          ws: true,
          changeOrigin: true,
        },
      },
    },

    preview: {
      port: 4173,
    },
  }
})