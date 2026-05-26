import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/decko-core/vitest.config.ts',
  'packages/decko/vitest.config.ts',
])
