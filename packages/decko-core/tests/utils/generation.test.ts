import { describe, it, expect } from 'vitest'
import { parseGenerationStream } from '../../src/utils/generation.js'

function makeStream(chunks: string[]): ReadableStream<string> {
  return new ReadableStream<string>({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

function sseFrame(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`
}

describe('parseGenerationStream()', () => {
  it('yields a start event', async () => {
    const stream = makeStream([sseFrame({ type: 'start', totalSlides: 5 })])
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ type: 'start', totalSlides: 5 })
  })

  it('yields multiple events from a single stream', async () => {
    const frames = [
      sseFrame({ type: 'start', totalSlides: 2 }),
      sseFrame({ type: 'slide_start', slideIndex: 0 }),
    ]
    const stream = makeStream(frames)
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(2)
    expect(events[0]?.type).toBe('start')
    expect(events[1]?.type).toBe('slide_start')
  })

  it('yields events split across multiple chunks', async () => {
    const full = sseFrame({ type: 'start', totalSlides: 3 })
    const half = Math.floor(full.length / 2)
    const stream = makeStream([full.slice(0, half), full.slice(half)])
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe('start')
  })

  it('skips malformed JSON frames without throwing', async () => {
    const frames = [
      'data: not-json\n\n',
      sseFrame({ type: 'start', totalSlides: 1 }),
    ]
    const stream = makeStream(frames)
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(1)
  })

  it('skips frames that do not match GenerationEventSchema', async () => {
    const frames = [
      sseFrame({ type: 'unknown-event', data: 'x' }),
      sseFrame({ type: 'start', totalSlides: 1 }),
    ]
    const stream = makeStream(frames)
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(1)
    expect(events[0]?.type).toBe('start')
  })

  it('yields an error event', async () => {
    const stream = makeStream([sseFrame({ type: 'error', message: 'timeout' })])
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events[0]).toMatchObject({ type: 'error', message: 'timeout' })
  })

  it('completes without error when stream is empty', async () => {
    const stream = makeStream([])
    const events = []
    for await (const event of parseGenerationStream(stream)) {
      events.push(event)
    }
    expect(events).toHaveLength(0)
  })
})
