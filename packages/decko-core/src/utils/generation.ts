import { GenerationEventSchema } from '../schemas/generation.js'
import type { GenerationEvent } from '../types/index.js'

export async function* parseGenerationStream(
  stream: ReadableStream<string>,
): AsyncGenerator<GenerationEvent> {
  const reader = stream.getReader()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += value
      const chunks = buffer.split('\n\n')
      buffer = chunks.pop() ?? ''

      for (const chunk of chunks) {
        const dataLine = chunk
          .split('\n')
          .find((line) => line.startsWith('data:'))
        if (!dataLine) continue

        const jsonStr = dataLine.slice('data:'.length).trim()
        try {
          const parsed = JSON.parse(jsonStr) as unknown
          const result = GenerationEventSchema.safeParse(parsed)
          if (result.success) {
            yield result.data
          }
        } catch {
          // skip malformed SSE frames
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
