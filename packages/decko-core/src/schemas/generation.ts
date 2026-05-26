import { z } from 'zod'
import { DeckSchema } from './deck.js'
import { SlideSchema } from './slide.js'

export const OutlineSlideSchema = z.object({
  index: z.number().int().nonnegative(),
  templateId: z.string(),
  title: z.string().optional(),
})

export const StartEventSchema = z.object({
  type: z.literal('start'),
  totalSlides: z.number().int().positive(),
})

export const OutlineEventSchema = z.object({
  type: z.literal('outline'),
  slides: z.array(OutlineSlideSchema),
})

export const SlideStartEventSchema = z.object({
  type: z.literal('slide_start'),
  slideIndex: z.number().int().nonnegative(),
})

export const SlideCompleteEventSchema = z.object({
  type: z.literal('slide_complete'),
  slideIndex: z.number().int().nonnegative(),
  slide: SlideSchema,
})

export const DoneEventSchema = z.object({
  type: z.literal('done'),
  deck: DeckSchema,
})

export const ErrorEventSchema = z.object({
  type: z.literal('error'),
  message: z.string(),
})

export const GenerationEventSchema = z.discriminatedUnion('type', [
  StartEventSchema,
  OutlineEventSchema,
  SlideStartEventSchema,
  SlideCompleteEventSchema,
  DoneEventSchema,
  ErrorEventSchema,
])
