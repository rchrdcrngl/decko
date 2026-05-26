import type { ThemeTokens } from '@deckohq/core'

function camelToKebab(str: string): string {
  return str.replace(/([A-Z])/g, (ch) => `-${ch.toLowerCase()}`)
}

export function resolveThemeCss(
  tokens: ThemeTokens,
  overrides?: Partial<ThemeTokens>,
): string {
  const merged: ThemeTokens = overrides ? { ...tokens, ...overrides } : tokens
  const vars = (Object.entries(merged) as [string, string][])
    .map(([key, value]) => `  --decko-${camelToKebab(key)}: ${value};`)
    .join('\n')
  return `:root {\n${vars}\n}`
}
