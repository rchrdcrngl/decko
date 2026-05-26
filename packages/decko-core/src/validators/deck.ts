import type { z } from 'zod'
import { DeckSchema } from '../schemas/deck.js'
import type { Deck } from '../types/index.js'

export type DeckValidationResult =
  | { success: true; data: Deck }
  | { success: false; error: z.ZodError }

export function validateDeck(input: unknown): DeckValidationResult {
  const result = DeckSchema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}

export function parseDeck(input: unknown): Deck {
  return DeckSchema.parse(input)
}
