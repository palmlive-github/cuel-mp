import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // eslint-disable-next-line no-undef
        target: process.env.VITE_PROXY_TARGET || 'https://ceus',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    minify: 'terser',
    chunkSizeWarningLimit: 1200,
  },
})
