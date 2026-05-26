import { z } from 'zod'

const DirectionSchema = z.enum(['left', 'right', 'up', 'down'])

export const CutTransitionSchema = z.object({
  type: z.literal('cut'),
})

export const FadeTransitionSchema = z.object({
  type: z.literal('fade'),
  duration: z.number().positive().optional(),
})

export const ZoomThroughTransitionSchema = z.object({
  type: z.literal('zoom-through'),
  targetId: z.string(),
})

export const ZoomOutTransitionSchema = z.object({
  type: z.literal('zoom-out'),
  originId: z.string(),
})

export const PanTransitionSchema = z.object({
  type: z.literal('pan'),
  direction: DirectionSchema,
})

export const MorphTransitionSchema = z.object({
  type: z.literal('morph'),
  fromId: z.string(),
  toId: z.string(),
})

export const ParticleBurstTransitionSchema = z.object({
  type: z.literal('particle-burst'),
  originId: z.string(),
})

export const WipeTransitionSchema = z.object({
  type: z.literal('wipe'),
  direction: DirectionSchema,
})

export const SlideTransitionSchema = z.discriminatedUnion('type', [
  CutTransitionSchema,
  FadeTransitionSchema,
  ZoomThroughTransitionSchema,
  ZoomOutTransitionSchema,
  PanTransitionSchema,
  MorphTransitionSchema,
  ParticleBurstTransitionSchema,
  WipeTransitionSchema,
])
