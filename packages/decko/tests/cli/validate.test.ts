import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { writeFile, rm } from 'node:fs/promises'
import { validateCommand } from '../../src/cli/commands/validate.js'

const VALID_DECK = JSON.stringify({
  version: '1',
  meta: { title: 'Test', aspectRatio: '16:9', language: 'en' },
  theme: { name: 'midnight' },
  slides: [
    {
      templateId: 'title-slide',
      slots: { headline: { type: 'text', display: 'heading', content: 'Hello' } },
    },
  ],
})

const INVALID_DECK = JSON.stringify({ version: '1' })

let tmpDir: string
let exitSpy: ReturnType<typeof vi.spyOn>
let logSpy: ReturnType<typeof vi.spyOn>
let errSpy: ReturnType<typeof vi.spyOn>

beforeEach(async () => {
  tmpDir = join(tmpdir(), `decko-test-${Date.now()}`)
  exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as never)
  logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(async () => {
  vi.restoreAllMocks()
  await rm(tmpDir, { recursive: true, force: true })
})

async function writeTemp(name: string, content: string): Promise<string> {
  const { mkdir } = await import('node:fs/promises')
  await mkdir(tmpDir, { recursive: true })
  const p = join(tmpDir, name)
  await writeFile(p, content, 'utf-8')
  return p
}

describe('validate command', () => {
  it('exits 0 for valid deck', async () => {
    const file = await writeTemp('valid.json', VALID_DECK)
    await validateCommand().parseAsync([file], { from: 'user' })
    expect(exitSpy).toHaveBeenCalledWith(0)
  })

  it('prints success message for valid deck', async () => {
    const file = await writeTemp('valid.json', VALID_DECK)
    await validateCommand().parseAsync([file], { from: 'user' })
    const output = logSpy.mock.calls.flat().join(' ')
    expect(output).toContain('valid')
  })

  it('exits 1 for invalid deck', async () => {
    const file = await writeTemp('invalid.json', INVALID_DECK)
    await validateCommand().parseAsync([file], { from: 'user' })
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('prints error message for invalid deck', async () => {
    const file = await writeTemp('invalid.json', INVALID_DECK)
    await validateCommand().parseAsync([file], { from: 'user' })
    const output = errSpy.mock.calls.flat().join(' ')
    expect(output).toContain('invalid')
  })

  it('exits 1 when file does not exist', async () => {
    await validateCommand().parseAsync(['/nonexistent/path.json'], { from: 'user' })
    expect(exitSpy).toHaveBeenCalledWith(1)
  })

  it('exits 1 for malformed JSON', async () => {
    const file = await writeTemp('bad.json', 'not json {{{')
    await validateCommand().parseAsync([file], { from: 'user' })
    expect(exitSpy).toHaveBeenCalledWith(1)
  })
})
