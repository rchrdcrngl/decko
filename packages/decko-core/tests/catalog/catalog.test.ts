import { describe, it, expect } from 'vitest'
import { BUILT_IN_TEMPLATES, populateTemplateRegistry } from '../../src/catalog/index.js'
import { TemplateDefinitionSchema } from '../../src/schemas/template.js'
import { TemplateRegistry } from '../../src/registry/template-registry.js'

describe('Built-in template catalog', () => {
  it('has at least 20 templates', () => {
    expect(BUILT_IN_TEMPLATES.length).toBeGreaterThanOrEqual(20)
  })

  it('every template passes TemplateDefinitionSchema', () => {
    for (const tpl of BUILT_IN_TEMPLATES) {
      const result = TemplateDefinitionSchema.safeParse(tpl)
      expect(result.success, `Template "${tpl.id}" failed schema validation`).toBe(true)
    }
  })

  it('all template IDs are unique', () => {
    const ids = BUILT_IN_TEMPLATES.map((t) => t.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('all template IDs are non-empty strings', () => {
    for (const tpl of BUILT_IN_TEMPLATES) {
      expect(tpl.id).toBeTruthy()
    }
  })

  it('every template has at least one slot', () => {
    for (const tpl of BUILT_IN_TEMPLATES) {
      expect(tpl.slots.length, `Template "${tpl.id}" has no slots`).toBeGreaterThan(0)
    }
  })

  it('every slot has a contentBudget object', () => {
    for (const tpl of BUILT_IN_TEMPLATES) {
      for (const slot of tpl.slots) {
        expect(
          typeof slot.contentBudget,
          `Template "${tpl.id}" slot "${slot.id}" missing contentBudget`,
        ).toBe('object')
      }
    }
  })

  it('every template has aiHints with required fields', () => {
    for (const tpl of BUILT_IN_TEMPLATES) {
      expect(tpl.aiHints.whenToUse, `${tpl.id} missing whenToUse`).toBeTruthy()
      expect(Array.isArray(tpl.aiHints.goodFor), `${tpl.id} goodFor must be array`).toBe(true)
      expect(Array.isArray(tpl.aiHints.avoid), `${tpl.id} avoid must be array`).toBe(true)
      expect(Array.isArray(tpl.aiHints.suggestedFollowUp), `${tpl.id} suggestedFollowUp must be array`).toBe(true)
    }
  })

  it('templates cover all 5 categories', () => {
    const categories = new Set(BUILT_IN_TEMPLATES.map((t) => t.category))
    expect(categories.has('narrative')).toBe(true)
    expect(categories.has('content')).toBe(true)
    expect(categories.has('data')).toBe(true)
    expect(categories.has('visual')).toBe(true)
    expect(categories.has('technical')).toBe(true)
  })

  it('populateTemplateRegistry() registers all built-in templates', () => {
    const registry = new TemplateRegistry()
    populateTemplateRegistry(registry)
    expect(registry.list().length).toBe(BUILT_IN_TEMPLATES.length)
  })

  it('populateTemplateRegistry() throws if called twice on same registry', () => {
    const registry = new TemplateRegistry()
    populateTemplateRegistry(registry)
    expect(() => populateTemplateRegistry(registry)).toThrow(/already registered/)
  })
})
