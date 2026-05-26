import { Command } from 'commander'
import { validateDeck } from '@deckohq/core'
import { readJsonFile } from '../utils/file-io.js'
import { success, error, dim } from '../utils/output.js'

export function validateCommand(): Command {
  return new Command('validate')
    .description('Validate a deck JSON file against the Decko schema')
    .argument('<file>', 'Path to deck.json')
    .action(async (file: string) => {
      let input: unknown
      try {
        input = await readJsonFile(file)
      } catch {
        error(`Could not read file: ${file}`)
        process.exit(1)
      }

      const result = validateDeck(input)
      if (result.success) {
        success(`${file} is valid`)
        process.exit(0)
      } else {
        error(`${file} is invalid — ${result.error.issues.length} error(s)`)
        for (const issue of result.error.issues) {
          dim(`  ${issue.path.join('.')} — ${issue.message}`)
        }
        process.exit(1)
      }
    })
}
