import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/My_PortFolio/', // Absolute subdirectory base path for robust trailing-slash and relative path resolution on GitHub Pages
})
