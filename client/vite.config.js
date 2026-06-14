import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://event-sphere-blue.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://event-sphere-blue.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
