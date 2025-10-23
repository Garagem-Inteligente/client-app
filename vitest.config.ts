/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Configurações globais
    globals: true,
    environment: 'jsdom',

    // Configurações de setup
    setupFiles: ['./tests/unit/setup.ts'],

    // Padrões de arquivos de teste
    include: [
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],

    // Exclusões
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
    ],

    // Configurações de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'src/main.ts',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        'cypress/',
        'dist/',
        'packages/*/test{,s}/**',
        '**/*.config.{js,cjs,ts}',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,ts}',
        'src/components/**/*.stories.{js,ts,jsx,tsx}'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },

    // Configurações de UI e watch
    ui: false,
    watch: true,
    reporters: ['default'],

    // Configurações de timeout
    testTimeout: 10000,
    hookTimeout: 10000,

    // Configurações de snapshot
    snapshotFormat: {
      printBasicPrototype: false
    }
  }
})