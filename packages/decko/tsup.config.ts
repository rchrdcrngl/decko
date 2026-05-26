import { defineConfig } from 'tsup'
import { cpSync, mkdirSync } from 'node:fs'

function copyCss(): void {
  mkdirSync('dist/css', { recursive: true })
  cpSync('src/css', 'dist/css', { recursive: true })
}

export default defineConfig([
  // Node.js API
  {
    entry: { index: 'src/index.ts' },
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    platform: 'node',
    external: ['@deckohq/core', 'zod'],
    tsconfig: 'tsconfig.json',
    onSuccess: async () => { copyCss() },
  },
  // CLI (CJS only, shebang injected)
  {
    entry: { cli: 'src/cli/index.ts' },
    format: ['cjs'],
    dts: false,
    splitting: false,
    sourcemap: true,
    platform: 'node',
    external: ['@deckohq/core', 'zod', 'commander'],
    banner: { js: '#!/usr/bin/env node' },
    tsconfig: 'tsconfig.json',
  },
  // Browser runtime (IIFE + ESM, minified, bundled)
  {
    entry: { 'browser/index': 'src/browser/index.ts' },
    format: ['iife', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    platform: 'browser',
    globalName: 'Decko',
    tsconfig: 'tsconfig.browser.json',
  },
  // Ambient animations module (optional, separate bundle)
  {
    entry: { 'browser/ambient': 'src/browser/ambient.ts' },
    format: ['iife', 'esm'],
    dts: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    platform: 'browser',
    globalName: 'DeckoAmbient',
    tsconfig: 'tsconfig.browser.json',
  },
])
