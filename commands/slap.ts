export default (message: string, sourceNumber: string, sourceName: string) =>
  `${sourceName} slapped ${message.slice(6)}`
