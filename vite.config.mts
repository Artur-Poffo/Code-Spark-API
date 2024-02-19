// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vitest" />
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    globals: true
  }
})
