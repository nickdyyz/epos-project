import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    // Temporarily disable React Refresh to test if it's causing issues
    fastRefresh: false
  })],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
