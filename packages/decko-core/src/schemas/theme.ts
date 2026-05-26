import { z } from 'zod'

export const MotionIntensitySchema = z.enum(['none', 'subtle', 'moderate', 'expressive'])

export const ThemeTokensSchema = z.object({
  colorAccent: z.string(),
  colorBackground: z.string(),
  colorSurface: z.string(),
  colorText: z.string(),
  colorTextMuted: z.string(),
  fontDisplay: z.string(),
  fontBody: z.string(),
  fontMono: z.string(),
  spacingSlide: z.string(),
  radiusCard: z.string(),
  motionIntensity: MotionIntensitySchema,
})

export const ThemePersonalitySchema = z.object({
  mood: z.string(),
  bestFor: z.array(z.string()),
})

export const ThemeDefinitionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  extends: z.string().optional(),
  tokens: ThemeTokensSchema,
  css: z.string().optional(),
  blocks: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
  backgrounds: z.record(z.string(), z.unknown()).optional(),
  personality: ThemePersonalitySchema,
})
