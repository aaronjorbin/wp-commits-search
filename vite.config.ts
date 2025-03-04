import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/wp-commits-search/',
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore eval warnings from flexsearch
        if (
          warning.code === 'EVAL' && 
          warning.id?.includes('flexsearch/dist/module/worker')
        ) {
          return;
        }
        warn(warning);
      }
    }
  }
})
