import { readFile, writeFile } from 'node:fs/promises'

export async function readJsonFile(path: string): Promise<unknown> {
  const content = await readFile(path, 'utf-8')
  return JSON.parse(content) as unknown
}

export async function writeOutputFile(path: string, content: string): Promise<void> {
  await writeFile(path, content, 'utf-8')
}
