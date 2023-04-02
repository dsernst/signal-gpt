import { ChatCompletionRequestMessage as Message } from 'openai'
import fs from 'fs'
import { join } from 'path'

const dbPath = './db/recents'

// Make sure the db directory exists
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath, { recursive: true })

type AddMessage = (message: Message) => Message[]

export const useMessageCache = (cacheKey: string): AddMessage => {
  const cacheFilePath = join(dbPath, `${cacheKey.replace(/\//g, '%2F')}.json`)
  const messages = getRecents(cacheFilePath)

  /** Main function to add to the cache, and returns the current cache  */
  return function addMessage(message: Message): Message[] {
    messages.push(message)

    // Truncate messageHistory to the last 3 Q&A pairs.
    if (messages.length > 6) {
      messages.shift()
      messages.shift()
    }

    // Write updated cache to disk
    fs.writeFileSync(cacheFilePath, JSON.stringify(messages, null, 2), 'utf-8')

    return messages
  }
}

/** Read recent messages from disk */
function getRecents(filePath: string): Message[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (err) {
    // If the file does not exist or there's an error, return an empty array.
    console.log('🔴 /getRecents:', err)
    return []
  }
}
