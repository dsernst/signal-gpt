const { createWriteStream } = require('fs')

let outputFileStream = createWriteStream('./log.txt', { flags: 'a' })

const originalWrite = process.stdout.write

process.stdout.write = function () {
  originalWrite.apply(process.stdout, arguments)
  outputFileStream.write.apply(outputFileStream, arguments)
}
