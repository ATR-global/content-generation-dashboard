import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'starter-widget',
        },
      },
    }),
    wasm(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env': '{}',
    process: '{"env":{}}',
  },
  build: {
    target: 'es2022',
    outDir: 'dist-widget',
    emptyOutDir: true,
    lib: {
      entry: fileURLToPath(new URL('./src/cdns/entry-webcomponent.ts', import.meta.url)),
      name: 'StarterWidget',
      formats: ['iife'],
      fileName: () => 'starter-widget.iife.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
