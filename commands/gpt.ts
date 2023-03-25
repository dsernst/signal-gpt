import { Configuration, OpenAIApi } from 'openai'
import 'dotenv/config'

const instructions = '. Do not prefix your response with "As an AI model"'

export default async (message: string) => {
  const command = message.split(' ')[0] + ' '
  const query = message.split(command)[1]

  const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY })
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: (query || '') + instructions }],
    })
    const response = completion.data.choices[0].message?.content
    return response
  } catch (error) {
    console.log('🔴 /gpt error:', error)
    return JSON.stringify(error)
  }
}
