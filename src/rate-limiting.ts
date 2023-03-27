const message = "I'm sorry Dave, I'm afraid I can't do that."

export const isRateLimited = (
  sourceNumber: string,
  groupId?: string
): string | void => {
  if (sourceNumber === process.env.RATE_LIMITED_NUMBER) return message
}
