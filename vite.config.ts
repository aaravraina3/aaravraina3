import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use relative asset paths so the site works both:
  // - as a GitHub Project Page under /<repo>/ (e.g. /aaravraina3/)
  // - and at a custom domain root (e.g. aaravraina.com)
  base: './',
  plugins: [react()],
})
