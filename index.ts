import 'signal-http'
import axios from 'axios'
import fastify from 'fastify'

const app = fastify()

app.post('/message', (req, res) => {
  //   console.log('/message:', JSON.stringify(req.body))
  const { fromPhone, message } = req.body as {
    fromPhone: string
    message: string
  }
  axios.post('http://localhost:9460/send', {
    to: fromPhone,
    message,
  })
  res.send('OK')
})

app.listen({ port: 9461 }, () => {
  console.log('🟢 Signal-gpt server listening on port 9461')
})
