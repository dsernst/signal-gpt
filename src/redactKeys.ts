import { strict as assert } from 'node:assert'

export const redactKeys = (string: string): string =>
  string.replace(/Authorization":"Bearer\s+[\w-]+"/g, 'Authorization":"Bearer KEY_REDACTED')

// Test:
const inputString: string = 'Authorization":"Bearer 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"'
assert.equal(redactKeys(inputString), 'Authorization":"Bearer KEY_REDACTED')
