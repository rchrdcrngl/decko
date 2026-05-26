import { describe, it, expect } from 'vitest'
import { BlockRegistry, defaultBlockRegistry } from '../../src/registry/block-registry.js'
import { BlockSchema } from '../../src/schemas/blocks.js'

const textBlockDef = {
  type: 'text',
  schema: BlockSchema,
}

describe('BlockRegistry', () => {
  it('starts empty on a fresh instance', () => {
    const registry = new BlockRegistry()
    expect(registry.list()).toHaveLength(0)
  })

  it('registers a block definition', () => {
    const registry = new BlockRegistry()
    registry.register(textBlockDef)
    expect(registry.has('text')).toBe(true)
  })

  it('returns the registered definition with get()', () => {
    const registry = new BlockRegistry()
    registry.register(textBlockDef)
    expect(registry.get('text')).toBe(textBlockDef)
  })

  it('returns undefined for unregistered type', () => {
    const registry = new BlockRegistry()
    expect(registry.get('nonexistent')).toBeUndefined()
  })

  it('has() returns false for unregistered type', () => {
    const registry = new BlockRegistry()
    expect(registry.has('nonexistent')).toBe(false)
  })

  it('list() returns all registered definitions', () => {
    const registry = new BlockRegistry()
    const codeDef = { type: 'code', schema: BlockSchema }
    registry.register(textBlockDef)
    registry.register(codeDef)
    expect(registry.list()).toHaveLength(2)
  })

  it('throws when registering a duplicate type', () => {
    const registry = new BlockRegistry()
    registry.register(textBlockDef)
    expect(() => registry.register(textBlockDef)).toThrow(/already registered/)
  })

  it('validate() succeeds for a valid block', () => {
    const registry = new BlockRegistry()
    const result = registry.validate({ type: 'text', content: 'hello' })
    expect(result.success).toBe(true)
  })

  it('validate() fails for an invalid block', () => {
    const registry = new BlockRegistry()
    const result = registry.validate({ type: 'unknown-type' })
    expect(result.success).toBe(false)
  })

  it('instances are isolated — registrations do not leak between instances', () => {
    const a = new BlockRegistry()
    const b = new BlockRegistry()
    a.register(textBlockDef)
    expect(b.has('text')).toBe(false)
  })

  it('defaultBlockRegistry is exported as a convenience instance', () => {
    expect(defaultBlockRegistry).toBeInstanceOf(BlockRegistry)
  })
})
