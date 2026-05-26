import { z } from 'zod'

export const AnimatablePropsSchema = z.object({
  x: z.number().optional(),
  y: z.number().optional(),
  z: z.number().optional(),
  opacity: z.number().min(0).max(1).optional(),
  scale: z.number().optional(),
  scaleX: z.number().optional(),
  scaleY: z.number().optional(),
  rotateX: z.number().optional(),
  rotateY: z.number().optional(),
  rotateZ: z.number().optional(),
  skewX: z.number().optional(),
  width: z.number().optional(),
})

export const BaseAnimationSchema = z.object({
  preset: z.string().optional(),
  duration: z.number().positive().optional(),
  delay: z.number().min(0).optional(),
  easing: z.string().optional(),
  mode: z.enum(['js', 'css']).optional(),
  from: AnimatablePropsSchema.optional(),
  to: AnimatablePropsSchema.optional(),
})

export const BlockAnimationSchema = BaseAnimationSchema.extend({
  target: z.enum(['block', 'chars', 'words', 'lines']).optional(),
  stagger: z.number().min(0).optional(),
  // When true and target is 'chars'|'words', each unit gets random 3D scatter start position
  scatter: z.boolean().optional(),
})

