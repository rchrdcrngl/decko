import { z } from 'zod'

export const CompositionSchema = z.object({
  density: z.enum(['sparse', 'balanced', 'dense']).optional(),
  rhythm: z.enum(['tight', 'normal', 'loose']).optional(),
  gravity: z.enum(['top', 'center', 'bottom']).optional(),
  accent: z.string().optional(),
})
