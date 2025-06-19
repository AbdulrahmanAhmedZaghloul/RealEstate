import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0'
  },
  base: './' // 🔥 مهم لروابط الملفات والصور تشتغل صح على Netlify
})
