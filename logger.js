const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint, printf } = format

const myFormat = printf(info => {
  return `${info.timestamp} ${info.message}`
})

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console()
  ]
})

module.exports = { logger }
