import { Command } from 'commander'
import { renderCommand } from './commands/render.js'
import { validateCommand } from './commands/validate.js'
import { initCommand } from './commands/init.js'

const program = new Command()

program
  .name('decko')
  .description('JSON-first presentation framework')
  .version('0.1.0')

program.addCommand(renderCommand())
program.addCommand(validateCommand())
program.addCommand(initCommand())

program.parse()
