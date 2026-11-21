import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' znači da build radi iz bilo kojeg foldera,
// npr. na GitHub Pages (https://korisnik.github.io/ime-repozitorija/).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
