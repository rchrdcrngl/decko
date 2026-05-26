import { z } from 'zod'
import { BlockSchema, BlockTypeSchema } from './blocks.js'

export const TemplateCategorySchema = z.enum([
  'narrative',
  'content',
  'data',
  'visual',
  'technical',
])

export const LayoutModeSchema = z.enum([
  'auto',
  'top-heavy',
  'bottom-heavy',
  'centered',
  'split',
])

export const ContentBudgetSchema = z.object({
  maxChars: z.number().int().positive().optional(),
  maxWords: z.number().int().positive().optional(),
  maxLines: z.number().int().positive().optional(),
  recommendedChars: z.number().int().positive().optional(),
})

export const TemplateSlotSchema = z.object({
  id: z.string().min(1),
  accepts: z.array(z.union([BlockTypeSchema, z.string().regex(/^x-/)])).min(1),
  required: z.boolean(),
  repeatable: z.boolean().optional(),
  contentBudget: ContentBudgetSchema,
  default: BlockSchema.optional(),
})

export const TemplateDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: TemplateCategorySchema,
  description: z.string().min(1),
  slots: z.array(TemplateSlotSchema).min(1),
  layoutModes: z.array(LayoutModeSchema).min(1),
  aiHints: z.object({
    whenToUse: z.string().min(1),
    goodFor: z.array(z.string()).min(1),
    avoid: z.array(z.string()),
    suggestedFollowUp: z.array(z.string()),
  }),
})
