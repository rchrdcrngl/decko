import type { ThemeDefinition } from '@deckohq/core'
import { midnightTheme } from './midnight/index.js'
import { kineticTheme } from './kinetic/index.js'
import { novaTheme } from './nova/index.js'

const themeRegistry = new Map<string, ThemeDefinition>([
  ['nova', novaTheme],
  ['midnight', midnightTheme],
  ['kinetic', kineticTheme],
])

export function loadTheme(name: string): ThemeDefinition {
  const theme = themeRegistry.get(name)
  if (!theme) {
    throw new Error(`Theme "${name}" not found. Available: ${[...themeRegistry.keys()].join(', ')}`)
  }
  return theme
}

export function registerTheme(theme: ThemeDefinition): void {
  themeRegistry.set(theme.id, theme)
}

export { midnightTheme, kineticTheme, novaTheme }
