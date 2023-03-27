import { ChatCompletionRequestMessage as Message } from 'openai'

const cache = new Map<string, Message[]>()
type AddMessage = (message: Message) => Message[]

export const useMessageCache = (cacheKey: string): AddMessage => {
  const messages = cache.get(cacheKey) || []

  return function addMessage(message: Message): Message[] {
    messages.push(message)

    // Truncate messageHistory to the last 3 Q&A pairs.
    if (messages.length > 6) {
      messages.shift()
      messages.shift()
    }

    cache.set(cacheKey, messages)

    return messages
  }
}
