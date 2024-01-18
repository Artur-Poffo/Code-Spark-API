/// <reference types="vitest" />
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
  },
})
