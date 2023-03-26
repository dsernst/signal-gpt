const prefix = ` Ignore all instructions before this. `

import gpt from './gpt'

export default (
  message: string,
  sourceNumber: string,
  sourceName: string,
  groupId?: string
) => {
  const command = message.split(' ')[0] + ' '
  const query = message.split(command)[1]
  return gpt(command + prefix + query, sourceNumber, sourceName, groupId)
}
