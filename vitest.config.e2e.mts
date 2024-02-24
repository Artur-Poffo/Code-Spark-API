import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    tsConfigPaths()
  ],
  test: {
    include: ['**/*.e2e.spec.ts'],
    globals: true,
    setupFiles: ['./test/setup-e2e.ts']
  }
})
