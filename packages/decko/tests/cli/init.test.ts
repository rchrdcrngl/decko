import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { readFile, rm, mkdir } from 'node:fs/promises'
import { validateDeck } from '@deckohq/core'
import { initCommand } from '../../src/cli/commands/init.js'

let tmpDir: string
let _exitSpy: ReturnType<typeof vi.spyOn>
let logSpy: ReturnType<typeof vi.spyOn>
let _errSpy: ReturnType<typeof vi.spyOn>

beforeEach(async () => {
  tmpDir = join(tmpdir(), `decko-init-${Date.now()}`)
  await mkdir(tmpDir, { recursive: true })
  _exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  _errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(tmpDir, { recursive: true, force: true })
})

describe('init command', () => {
  it('creates output file', async () => {
    const output = join(tmpDir, 'deck.json')
    await initCommand().parseAsync(['-o', output], { from: 'user' })
    const content = await readFile(output, 'utf-8')
    expect(content.length).toBeGreaterThan(0)
  })

  it('scaffolded deck is valid JSON', async () => {
    const output = join(tmpDir, 'deck.json')
    await initCommand().parseAsync(['-o', output], { from: 'user' })
    const raw = await readFile(output, 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  it('scaffolded deck passes validateDeck()', async () => {
    const output = join(tmpDir, 'deck.json')
    await initCommand().parseAsync(['-o', output], { from: 'user' })
    const raw = await readFile(output, 'utf-8')
    const result = validateDeck(JSON.parse(raw))
    expect(result.success).toBe(true)
  })

  it('prints success message', async () => {
    const output = join(tmpDir, 'deck.json')
    await initCommand().parseAsync(['-o', output], { from: 'user' })
    const out = logSpy.mock.calls.flat().join(' ')
    expect(out).toContain('Created')
  })

  it('defaults output to deck.json in cwd', async () => {
    const original = process.cwd()
    process.chdir(tmpDir)
    try {
      await initCommand().parseAsync([], { from: 'user' })
      const raw = await readFile(join(tmpDir, 'deck.json'), 'utf-8')
      expect(raw).toContain('"version"')
    } finally {
      process.chdir(original)
    }
  })
})
