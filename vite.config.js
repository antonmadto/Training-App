import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' agar hasil build bisa dibuka dari sub-path (GitHub Pages) maupun root
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
  },
})
