import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { Command } from 'commander'
import { validateDeck } from '@deckohq/core'
import { renderDeck } from '../../renderer/index.js'
import { loadTheme } from '../../themes/index.js'
import { readJsonFile, writeOutputFile } from '../utils/file-io.js'
import { success, error } from '../utils/output.js'

const CSS_FILES = ['decko-base.css', 'decko-templates.css'] as const
const RUNTIME_SRC = 'index.global.js'
const RUNTIME_DEST = 'decko-runtime.js'

function copyAssets(distDir: string, outDir: string, themeName: string): void {
  mkdirSync(outDir, { recursive: true })

  const cssDir = join(distDir, 'css')
  for (const file of CSS_FILES) {
    const src = join(cssDir, file)
    if (existsSync(src)) copyFileSync(src, join(outDir, file))
  }

  const themeFile = `decko-theme-${themeName}.css`
  const themeSrc = join(cssDir, themeFile)
  if (existsSync(themeSrc)) copyFileSync(themeSrc, join(outDir, themeFile))

  const runtimeSrc = join(distDir, 'browser', RUNTIME_SRC)
  if (existsSync(runtimeSrc)) copyFileSync(runtimeSrc, join(outDir, RUNTIME_DEST))
}

export function renderCommand(): Command {
  return new Command('render')
    .description('Render a deck JSON file to HTML')
    .argument('<file>', 'Path to deck.json')
    .option('-o, --output <path>', 'Output HTML file path', 'deck.html')
    .option('--theme <name>', 'Theme name', 'midnight')
    .option('--mode <mode>', 'Render mode: ssr (pre-rendered HTML) or csr (client-side rendering)', 'ssr')
    .action(async (file: string, opts: { output: string; theme: string; mode: string }) => {
      let input: unknown
      try {
        input = await readJsonFile(file)
      } catch {
        error(`Could not read file: ${file}`)
        process.exit(1)
        return
      }

      const result = validateDeck(input)
      if (!result.success) {
        error(`${file} is invalid`)
        process.exit(1)
        return
      }

      const themeName = result.data.theme?.name ?? opts.theme
      const outDir = dirname(opts.output)
      const distDir = __dirname

      let theme
      try {
        theme = loadTheme(themeName)
      } catch {
        // unknown theme — render without theme CSS
      }

      try {
        copyAssets(distDir, outDir, themeName)
      } catch {
        // asset copy failed — render will still produce HTML, just without linked assets
      }

      const cssUrls = [
        './decko-base.css',
        './decko-templates.css',
        `./decko-theme-${themeName}.css`,
      ]
      const scriptUrls = [`./${RUNTIME_DEST}`]

      try {
        const mode = opts.mode === 'csr' ? 'csr' : 'ssr'
        const rendered = renderDeck(result.data, { theme, cssUrls, scriptUrls, mode })
        await writeOutputFile(opts.output, rendered.html)
        success(`Rendered to ${opts.output}`)
      } catch (e) {
        error(`Render failed: ${e instanceof Error ? e.message : String(e)}`)
        process.exit(1)
      }
    })
}
