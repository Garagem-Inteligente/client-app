/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate Firebase into its own chunk
          'firebase-core': [
            'firebase/app',
            'firebase/firestore',
            'firebase/storage',
            'firebase/functions'
          ],
          // Firebase Auth in separate chunk (loaded on-demand)
          'firebase-auth': ['firebase/auth'],
          // Ionic components
          'ionic': [
            '@ionic/vue',
            '@ionic/vue-router'
          ],
          // Vue core
          'vue-vendor': [
            'vue',
            'vue-router',
            'pinia'
          ],
          // PDF and charts
          'charts': [
            'chart.js'
          ]
        }
      }
    },
    // Increase chunk size warning limit to 1000 kB (only for large dependencies)
    chunkSizeWarningLimit: 1000,
    // Enable code splitting
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})

