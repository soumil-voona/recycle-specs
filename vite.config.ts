import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — tiny, cached separately
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Motion (Framer Motion) — heavy animation lib
          'motion-vendor': ['motion'],
          // Firebase — only loaded when auth/db is needed
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // MUI — large component lib
          'mui-vendor': ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
})
