import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai'
import 'dotenv/config'

const messageCache = new Map<string, ChatCompletionRequestMessage[]>()

function getCacheKey(
  groupId: string | undefined,
  sourceNumber: string
): string {
  return groupId ? groupId : sourceNumber
}

export default async (
  message: string,
  sourceNumber: string,
  sourceName: string,
  groupId?: string
) => {
  const command = message.split(' ')[0] + ' '
  const query = message.split(command)[1]
  const cacheKey = getCacheKey(groupId, sourceNumber)

  let messageHistory = messageCache.get(cacheKey) || []

  messageHistory.push({ role: 'user', content: query || '' })

  // Truncate messageHistory to the last 3 Q&A pairs.
  if (messageHistory.length > 6) {
    messageHistory.shift()
    messageHistory.shift()
  }

  messageCache.set(cacheKey, messageHistory)

  const configuration = new Configuration({ apiKey: process.env.OPENAI_KEY })
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messageHistory,
    })

    const response = completion.data.choices[0].message?.content

    // Add the AI's response to messageHistory.
    messageHistory.push({ role: 'assistant', content: response || '' })

    // Update the message history in the cache.
    messageCache.set(cacheKey, messageHistory)

    return response
  } catch (error) {
    console.log('🔴 /gpt error:', error)
    return JSON.stringify(error)
  }
}
