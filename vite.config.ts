import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/TwoThumbsUp/", // Make sure there's a trailing slash
  server: {
    proxy: {
      '/img': {
        target: 'http://localhost:5943', // Backend is running on port 5943
        changeOrigin: true,
      }
    }
  }
})