import 'signal-http'
import axios from 'axios'
import fastify from 'fastify'

const app = fastify()

app.post('/message', (req, res) => {
  // console.log('/message:', JSON.stringify(req.body))
  const { message, sourceNumber, groupId } = req.body as {
    sourceNumber: string
    sourceName: string
    message: string
    groupId?: string
  }
  axios.post('http://localhost:9460/send', {
    to: sourceNumber,
    toGroup: groupId,
    message,
  })
  res.send('OK')
})

app.listen({ port: 9461 }, () => {
  console.log('🟢 Signal-gpt server listening on port 9461')
})
