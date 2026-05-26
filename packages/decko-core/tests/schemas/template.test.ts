import { describe, it, expect } from 'vitest'
import { TemplateDefinitionSchema } from '../../src/schemas/template.js'

const validTemplate = {
  id: 'my-template',
  name: 'My Template',
  category: 'content',
  description: 'A test template',
  slots: [
    {
      id: 'headline',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'When you need a headline',
    goodFor: ['intro slides'],
    avoid: [],
    suggestedFollowUp: [],
  },
}

describe('TemplateDefinitionSchema', () => {
  it('accepts a valid template definition', () => {
    expect(TemplateDefinitionSchema.safeParse(validTemplate).success).toBe(true)
  })

  it('accepts all valid categories', () => {
    for (const category of ['narrative', 'content', 'data', 'visual', 'technical']) {
      expect(TemplateDefinitionSchema.safeParse({ ...validTemplate, category }).success).toBe(true)
    }
  })

  it('accepts all valid layout modes', () => {
    for (const mode of ['auto', 'top-heavy', 'bottom-heavy', 'centered', 'split']) {
      expect(
        TemplateDefinitionSchema.safeParse({ ...validTemplate, layoutModes: [mode] }).success,
      ).toBe(true)
    }
  })

  it('accepts a slot with no content budget fields set', () => {
    const template = {
      ...validTemplate,
      slots: [{ id: 'media', accepts: ['media'], required: false, contentBudget: {} }],
    }
    expect(TemplateDefinitionSchema.safeParse(template).success).toBe(true)
  })

  it('accepts custom block types (x-*) in slot accepts', () => {
    const template = {
      ...validTemplate,
      slots: [{ id: 'custom', accepts: ['x-mermaid'], required: false, contentBudget: {} }],
    }
    expect(TemplateDefinitionSchema.safeParse(template).success).toBe(true)
  })

  it('rejects an invalid category', () => {
    expect(TemplateDefinitionSchema.safeParse({ ...validTemplate, category: 'random' }).success).toBe(false)
  })

  it('rejects empty slots array', () => {
    expect(TemplateDefinitionSchema.safeParse({ ...validTemplate, slots: [] }).success).toBe(false)
  })

  it('rejects empty layoutModes array', () => {
    expect(TemplateDefinitionSchema.safeParse({ ...validTemplate, layoutModes: [] }).success).toBe(false)
  })

  it('rejects missing id', () => {
    const { id: _id, ...noId } = validTemplate
    expect(TemplateDefinitionSchema.safeParse(noId).success).toBe(false)
  })

  it('rejects missing aiHints', () => {
    const { aiHints: _hints, ...noHints } = validTemplate
    expect(TemplateDefinitionSchema.safeParse(noHints).success).toBe(false)
  })

  it('rejects negative content budget values', () => {
    const template = {
      ...validTemplate,
      slots: [
        { id: 'h', accepts: ['text'], required: true, contentBudget: { maxChars: -10 } },
      ],
    }
    expect(TemplateDefinitionSchema.safeParse(template).success).toBe(false)
  })
})
