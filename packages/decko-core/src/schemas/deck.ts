import { z } from 'zod'
import { ThemeTokensSchema } from './theme.js'
import { SlideSchema } from './slide.js'

export const AspectRatioSchema = z.enum(['16:9', '4:3', '1:1'])

export const DeckMetaSchema = z.object({
  title: z.string().min(1),
  author: z.string().optional(),
  org: z.string().optional(),
  date: z.string().optional(),
  aspectRatio: AspectRatioSchema.optional().default('16:9'),
  language: z.string().optional().default('en'),
})

export const DeckThemeSchema = z.object({
  name: z.string().min(1),
  tokens: ThemeTokensSchema.partial().optional(),
})

export const DeckSchema = z.object({
  version: z.literal('1'),
  meta: DeckMetaSchema,
  theme: DeckThemeSchema,
  variables: z.record(z.string(), z.string()).optional(),
  slides: z.array(SlideSchema).min(1),
})
