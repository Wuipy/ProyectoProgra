import { copyFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

function netlifySpaFallback() {
  return {
    name: 'netlify-spa-fallback',
    closeBundle() {
      const index = path.resolve(__dirname, 'dist/index.html')
      copyFileSync(index, path.resolve(__dirname, 'dist/404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] }), netlifySpaFallback()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5145',
        changeOrigin: true,
      },
    },
  },
})
