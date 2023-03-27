import { Configuration, OpenAIApi } from 'openai'
import 'dotenv/config'

import { useMessageCache } from '../src/recent-mgs-cache'

const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY })
const openai = new OpenAIApi(configuration)

export default async (message: string, sourceNumber: string, sourceName: string, groupId?: string) => {
  // Split on first space
  const command = message.split(' ')[0] + ' '
  const query = message.split(command)[1]

  // Use the message cache, which remembers the last few messages
  const addToCache = useMessageCache(groupId || sourceNumber)

  try {
    // Try querying the ChatGPT API
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: addToCache({ role: 'user', content: query || '' }),
    })
    // Parse out the response, store it in the cache, and return it
    const response = completion.data.choices[0].message?.content
    addToCache({ role: 'assistant', content: response || '' })
    return response
  } catch (error) {
    // Error handling
    console.log('🔴 /gpt:', error)
    return JSON.stringify(error)
  }
}
