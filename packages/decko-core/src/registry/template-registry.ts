import type { z } from 'zod'
import type { TemplateDefinition, TemplateCategory } from '../types/index.js'
import { TemplateDefinitionSchema } from '../schemas/template.js'

export class TemplateRegistry {
  private readonly templates = new Map<string, TemplateDefinition>()

  register(def: TemplateDefinition): void {
    if (this.templates.has(def.id)) {
      throw new Error(`Template "${def.id}" is already registered`)
    }
    this.templates.set(def.id, def)
  }

  get(id: string): TemplateDefinition | undefined {
    return this.templates.get(id)
  }

  has(id: string): boolean {
    return this.templates.has(id)
  }

  list(): TemplateDefinition[] {
    return [...this.templates.values()]
  }

  byCategory(category: TemplateCategory): TemplateDefinition[] {
    return this.list().filter((t) => t.category === category)
  }

  validate(input: unknown): z.SafeParseReturnType<unknown, TemplateDefinition> {
    return TemplateDefinitionSchema.safeParse(input)
  }
}

export const defaultTemplateRegistry = new TemplateRegistry()
