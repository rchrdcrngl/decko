import { describe, it, expect } from 'vitest'
import { TemplateRegistry, defaultTemplateRegistry } from '../../src/registry/template-registry.js'
import type { TemplateDefinition } from '../../src/types/index.js'

const makeTpl = (id: string, category: TemplateDefinition['category'] = 'content'): TemplateDefinition => ({
  id,
  name: `Template ${id}`,
  category,
  description: 'Test template',
  slots: [{ id: 'main', accepts: ['text'], required: true, contentBudget: {} }],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'Always',
    goodFor: ['testing'],
    avoid: [],
    suggestedFollowUp: [],
  },
})

describe('TemplateRegistry', () => {
  it('starts empty on a fresh instance', () => {
    const registry = new TemplateRegistry()
    expect(registry.list()).toHaveLength(0)
  })

  it('registers a template', () => {
    const registry = new TemplateRegistry()
    registry.register(makeTpl('hero'))
    expect(registry.has('hero')).toBe(true)
  })

  it('get() returns the registered template', () => {
    const registry = new TemplateRegistry()
    const tpl = makeTpl('hero')
    registry.register(tpl)
    expect(registry.get('hero')).toBe(tpl)
  })

  it('get() returns undefined for unknown id', () => {
    const registry = new TemplateRegistry()
    expect(registry.get('unknown')).toBeUndefined()
  })

  it('list() returns all templates', () => {
    const registry = new TemplateRegistry()
    registry.register(makeTpl('a'))
    registry.register(makeTpl('b'))
    expect(registry.list()).toHaveLength(2)
  })

  it('throws when registering a duplicate id', () => {
    const registry = new TemplateRegistry()
    registry.register(makeTpl('hero'))
    expect(() => registry.register(makeTpl('hero'))).toThrow(/already registered/)
  })

  it('byCategory() filters by category', () => {
    const registry = new TemplateRegistry()
    registry.register(makeTpl('t1', 'narrative'))
    registry.register(makeTpl('t2', 'content'))
    registry.register(makeTpl('t3', 'narrative'))
    const narrative = registry.byCategory('narrative')
    expect(narrative).toHaveLength(2)
    expect(narrative.every((t) => t.category === 'narrative')).toBe(true)
  })

  it('byCategory() returns empty array when no templates in category', () => {
    const registry = new TemplateRegistry()
    registry.register(makeTpl('t1', 'content'))
    expect(registry.byCategory('data')).toHaveLength(0)
  })

  it('validate() succeeds for a valid template definition', () => {
    const registry = new TemplateRegistry()
    const result = registry.validate(makeTpl('valid'))
    expect(result.success).toBe(true)
  })

  it('validate() fails for an invalid template', () => {
    const registry = new TemplateRegistry()
    const result = registry.validate({ id: 'bad', slots: [] })
    expect(result.success).toBe(false)
  })

  it('instances are isolated', () => {
    const a = new TemplateRegistry()
    const b = new TemplateRegistry()
    a.register(makeTpl('shared'))
    expect(b.has('shared')).toBe(false)
  })

  it('defaultTemplateRegistry is exported as a convenience instance', () => {
    expect(defaultTemplateRegistry).toBeInstanceOf(TemplateRegistry)
  })
})
