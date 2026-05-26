import type { z } from 'zod'
import type { Block } from '../types/index.js'
import { BlockSchema } from '../schemas/blocks.js'

export interface BlockDefinition {
  type: string
  schema: z.ZodType<Block>
}

export class BlockRegistry {
  private readonly blocks = new Map<string, BlockDefinition>()

  register(def: BlockDefinition): void {
    if (this.blocks.has(def.type)) {
      throw new Error(`Block type "${def.type}" is already registered`)
    }
    this.blocks.set(def.type, def)
  }

  get(type: string): BlockDefinition | undefined {
    return this.blocks.get(type)
  }

  has(type: string): boolean {
    return this.blocks.has(type)
  }

  list(): BlockDefinition[] {
    return [...this.blocks.values()]
  }

  validate(input: unknown): z.SafeParseReturnType<unknown, Block> {
    return BlockSchema.safeParse(input)
  }
}

export const defaultBlockRegistry = new BlockRegistry()
