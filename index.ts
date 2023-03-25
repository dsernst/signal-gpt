import 'signal-http'
import fs from 'fs'
import axios from 'axios'
import fastify from 'fastify'

const app = fastify()

type Message = {
  sourceNumber: string
  sourceName: string
  message: string
  groupId?: string
}

app.post('/message', (req, res) => {
  function respond(message: string, sourceNumber: string, groupId?: string) {
    axios.post('http://localhost:9460/send', {
      to: sourceNumber,
      toGroup: groupId,
      message,
    })
    res.send('OK')
  }

  // Parse the incoming messages
  const { message, sourceNumber, groupId } = req.body as Message

  // Check if message matches one of the available commands
  const commands = getCommands()
  let match = false
  commands.forEach((command) => {
    if (message.startsWith(command)) {
      match = true

      // Run the matching command
      import(`./commands/${command.slice(1)}`).then((module) =>
        respond(
          module.default(message, sourceNumber, groupId) as string,
          sourceNumber,
          groupId
        )
      )
    }
  })
  if (match) return

  // Was this message not targeted at our bot?
  if (groupId && !message.startsWith('/')) return

  // Unknown command
  const msg = `Unknown command. Available options: ${commands.join(', ')}`
  respond(msg, sourceNumber, groupId)
})

app.listen({ port: 9461 }, () => {
  console.log('🟢 Signal-gpt server listening on port 9461')
})

function getCommands(): string[] {
  const path = './commands/'
  const files = fs.readdirSync(path)
  return files
    .filter((file) => fs.statSync(path + file).isFile())
    .map((f) => `/${f.slice(0, -3)}`)
}
