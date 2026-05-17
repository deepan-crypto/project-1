import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Required for SPA: makes Vite dev server serve index.html for all routes
  server: {
    historyApiFallback: true,
  },
})
