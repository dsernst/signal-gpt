import 'signal-http'
import fs from 'fs'
import axios from 'axios'
import fastify from 'fastify'
import './logToFile.js'
import { isRateLimited } from './src/rate-limiting'

const app = fastify()

type Message = {
  sourceNumber: string
  sourceName: string
  message: string
  groupId?: string
}

app.post('/message', (req, res) => {
  // Parse the incoming messages
  const { message, sourceNumber, sourceName, groupId } = req.body as Message

  // Closure to simplify sending responses
  function respond(message: string): true {
    axios.post('http://localhost:9460/send', {
      to: sourceNumber,
      toGroup: groupId,
      message,
    })
    return !!res.send('OK')
  }

  // Check if message matches one of the available commands
  const commands = getCommands()
  const match = commands.some((command) => {
    // Must start with / or \
    if (!['/', '\\'].includes(message.slice(0, 1))) return false

    // Does it look like one of the commands?
    if (!message.slice(1).toLocaleLowerCase().startsWith(command)) return false

    // Is this user rate limited?
    const rateLimited = isRateLimited(sourceNumber, groupId)
    if (rateLimited) return respond(rateLimited)

    // Run the matching command
    return import(`./commands/${command}`).then(async (module) => {
      const result = (await module.default(message, sourceNumber, sourceName, groupId)) as string
      respond(result)
    })
  })
  if (match) return

  // Was this message not targeted at our bot?
  if (groupId && !message.startsWith('/')) return

  // Unknown command
  const msg = `Unknown command. Available options: ${commands.map((c) => `/${c}`).join(', ')}`
  respond(msg)
})

const port = 9461
app.listen({ port }, () => console.log(`🟢 GPTBot live on port ${port}`))

function getCommands(): string[] {
  const path = './commands/'
  const files = fs.readdirSync(path)
  return files.filter((file) => fs.statSync(path + file).isFile()).map((f) => f.slice(0, -3))
}
