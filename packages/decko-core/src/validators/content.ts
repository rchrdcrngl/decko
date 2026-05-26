import type { Block, RichText, TemplateDefinition, Slide } from '../types/index.js'

export interface ContentViolation {
  slideIndex: number
  slotId: string
  blockIndex: number
  field: 'maxChars' | 'maxWords' | 'maxLines'
  budget: number
  actual: number
}

export interface ContentValidationResult {
  valid: boolean
  violations: ContentViolation[]
}

function richTextToString(rt: RichText): string {
  if (typeof rt === 'string') return rt
  return rt.map((node) => node.text).join('')
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function countLines(text: string): number {
  return text.split('\n').length
}

function getBlockText(block: Block): string | null {
  if (block.type === 'text') return richTextToString(block.content)
  if (block.type === 'callout') return richTextToString(block.body)
  return null
}

export function validateContent(
  slides: Slide[],
  templateMap: Map<string, TemplateDefinition>,
): ContentValidationResult {
  const violations: ContentViolation[] = []

  slides.forEach((slide, slideIndex) => {
    const template = templateMap.get(slide.templateId)
    if (!template) return

    template.slots.forEach((slotDef) => {
      const slotValue = slide.slots[slotDef.id]
      if (!slotValue) return

      const blocks = Array.isArray(slotValue) ? slotValue : [slotValue]
      const { contentBudget } = slotDef

      blocks.forEach((block, blockIndex) => {
        const text = getBlockText(block)
        if (!text) return

        if (contentBudget.maxChars !== undefined && text.length > contentBudget.maxChars) {
          violations.push({
            slideIndex,
            slotId: slotDef.id,
            blockIndex,
            field: 'maxChars',
            budget: contentBudget.maxChars,
            actual: text.length,
          })
        }

        if (contentBudget.maxWords !== undefined) {
          const words = countWords(text)
          if (words > contentBudget.maxWords) {
            violations.push({
              slideIndex,
              slotId: slotDef.id,
              blockIndex,
              field: 'maxWords',
              budget: contentBudget.maxWords,
              actual: words,
            })
          }
        }

        if (contentBudget.maxLines !== undefined) {
          const lines = countLines(text)
          if (lines > contentBudget.maxLines) {
            violations.push({
              slideIndex,
              slotId: slotDef.id,
              blockIndex,
              field: 'maxLines',
              budget: contentBudget.maxLines,
              actual: lines,
            })
          }
        }
      })
    })
  })

  return { valid: violations.length === 0, violations }
}
