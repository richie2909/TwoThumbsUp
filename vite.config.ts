import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/TwoThumbsUp/",
  server: {
    proxy: {
      '/img': {
        target: 'http://localhost:5900',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:5900',
        changeOrigin: true,
      }
    }
  }
})