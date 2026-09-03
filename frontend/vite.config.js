import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En desarrollo, las llamadas /api/* van al backend .NET (LoginApi)
      '/api': 'http://localhost:5100',
    },
  },
})
