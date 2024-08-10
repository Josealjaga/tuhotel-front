import path from 'node:path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@contexts': path.resolve(__dirname, './src/contexts/'),
      '@Shared': path.resolve(__dirname, './src/apps/Shared'),
    },
  },
})
