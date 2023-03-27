import * as fs from 'fs'
import { customRateLimits } from './custom-rate-limits'

export type RateLimits = { [groupIdOrPhoneNumber: string]: [MaxMessages: number, TimeIntervalInSeconds: number] }

// Check if user exceeded thread's rate limit, using Token Bucket algorithm
// If they have, return a custom error message, otherwise return nothing
export function isRateLimited(sourceNumber: string, groupId?: string): string | void {
  // Get the thread's rate limits
  const [maxMessages, timeInterval] = customRateLimits[groupId || sourceNumber] || [30, 60 * 60 * 1000]

  // Load the current state for this user from disk
  let state: { messagesRemaining: number; lastRefill: number }
  const directory = `./db/rate-limits${groupId ? `/${groupId}` : ''}`
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true }) // Ensure directory exists
  const filepath = `${directory}/${sourceNumber}.json`
  try {
    state = JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (error) {
    state = { messagesRemaining: maxMessages, lastRefill: Date.now() } // Default state
  }

  // Refill the user's message allotment, based on their last refill time
  const currentTime = Date.now()
  const elapsedTime = currentTime - state.lastRefill
  const messagesToAdd = Math.floor((elapsedTime / timeInterval) * maxMessages)
  if (messagesToAdd > 0) {
    state.messagesRemaining = Math.min(state.messagesRemaining + messagesToAdd, maxMessages)
    state.lastRefill = currentTime
  }

  // Has the user exceeded the rate limit?
  if (state.messagesRemaining === 0) {
    const secondsPerMessage = timeInterval / maxMessages
    const timeLeft = secondsPerMessage - elapsedTime
    const minLeft = Math.ceil(timeLeft / (60 * 1000))
    return `Rate limited: wait ${minLeft} min`
  }

  // Otherwise, decrement their allotment, and return nothing
  state.messagesRemaining -= 1

  // Save the new state to disk
  fs.writeFileSync(filepath, JSON.stringify(state, null, 2))
}
