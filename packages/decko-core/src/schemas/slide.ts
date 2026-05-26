import { z } from 'zod'
import { BlockSchema } from './blocks.js'
import { BlockAnimationSchema } from './animation.js'
import { CompositionSchema } from './composition.js'
import { LayoutModeSchema } from './template.js'
import { SlideTransitionSchema } from './transition.js'

export const SlideBackgroundSchema = z.union([
  z.object({ type: z.literal('color'), value: z.string() }),
  z.object({ type: z.literal('image'), src: z.string(), overlay: z.number().min(0).max(1).optional() }),
  z.object({ type: z.literal('gradient'), value: z.string() }),
  z.object({ type: z.literal('theme') }),
])

export const SlideAmbientSchema = z.object({
  type: z.enum(['particles', 'gradient-shift', 'aurora', 'constellation', 'ripple', 'orbs']),
  intensity: z.enum(['low', 'medium', 'high']).optional(),
})

export const SlideSlotsSchema = z.record(
  z.string(),
  z.union([BlockSchema, z.array(BlockSchema)]),
)

// Per-slot CSS positioning overrides — used with kinetic-canvas / kinetic-hero templates
export const SlotStyleSchema = z.object({
  position: z.enum(['absolute', 'relative', 'fixed']).optional(),
  top: z.string().optional(),
  left: z.string().optional(),
  right: z.string().optional(),
  bottom: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  zIndex: z.number().int().optional(),
  transformOrigin: z.string().optional(),
})

export const SlideSchema = z.object({
  id: z.string().optional(),
  templateId: z.string().min(1),
  layoutMode: LayoutModeSchema.optional(),
  background: SlideBackgroundSchema.optional(),
  slots: SlideSlotsSchema,
  composition: CompositionSchema.optional(),
  transition: SlideTransitionSchema.optional(),
  ambient: SlideAmbientSchema.optional(),
  animations: z.record(z.string(), BlockAnimationSchema).optional(),
  slotStyles: z.record(z.string(), SlotStyleSchema).optional(),
  notes: z.string().optional(),
})
