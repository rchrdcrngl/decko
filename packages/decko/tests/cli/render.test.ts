import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFile, readFile, rm, mkdir } from 'node:fs/promises'
import { renderCommand } from '../../src/cli/commands/render.js'

const VALID_DECK = JSON.stringify({
  version: '1',
  meta: { title: 'Render Test', aspectRatio: '16:9', language: 'en' },
  theme: { name: 'midnight' },
  slides: [
    {
      templateId: 'title-slide',
      slots: {
        headline: { type: 'text', display: 'heading', content: 'Hello' },
      },
    },
  ],
})

let tmpDir: string
let exitSpy: ReturnType<typeof vi.spyOn>
let logSpy: ReturnType<typeof vi.spyOn>
let _errSpy: ReturnType<typeof vi.spyOn>

beforeEach(async () => {
  tmpDir = join(tmpdir(), `decko-render-${Date.now()}`)
  await mkdir(tmpDir, { recursive: true })
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  _errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(tmpDir, { recursive: true, force: true })
})

describe('render command', () => {
  it('produces an HTML output file', async () => {
    const input = join(tmpDir, 'deck.json')
    const output = join(tmpDir, 'out.html')
    await writeFile(input, VALID_DECK, 'utf-8')
    await renderCommand().parseAsync([input, '-o', output], { from: 'user' })
    const html = await readFile(output, 'utf-8')
    expect(html).toContain('<!DOCTYPE html>')
  })

  it('output contains deck content', async () => {
    const input = join(tmpDir, 'deck.json')
    const output = join(tmpDir, 'out.html')
    await writeFile(input, VALID_DECK, 'utf-8')
    await renderCommand().parseAsync([input, '-o', output], { from: 'user' })
    const html = await readFile(output, 'utf-8')
    expect(html).toContain('Hello')
  })

  it('prints success message on completion', async () => {
    const input = join(tmpDir, 'deck.json')
    const output = join(tmpDir, 'out.html')
    await writeFile(input, VALID_DECK, 'utf-8')
    await renderCommand().parseAsync([input, '-o', output], { from: 'user' })
    const out = logSpy.mock.calls.flat().join(' ')
    expect(out).toContain('Rendered')
  })

  it('exits 1 for invalid deck', async () => {
    const input = join(tmpDir, 'bad.json')
    await writeFile(input, JSON.stringify({ version: '1' }), 'utf-8')
    await renderCommand().parseAsync([input, '-o', join(tmpDir, 'out.html')], { from: 'user' })
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('exits 1 when input file does not exist', async () => {
    await renderCommand().parseAsync(
      ['/no/such/deck.json', '-o', join(tmpDir, 'out.html')],
      { from: 'user' },
    )
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
