import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    splitting: false,
    shims: true,
    skipNodeModulesBundle: true,
    platform: 'node',
    target: 'node18',
    outDir: 'dist'
  },
  // CLI with shebang
  {
    entry: ['src/cli/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    splitting: false,
    shims: true,
    skipNodeModulesBundle: true,
    platform: 'node',
    target: 'node18',
    outDir: 'dist/cli',
    banner: {
      js: '#!/usr/bin/env node'
    }
  }
]);
