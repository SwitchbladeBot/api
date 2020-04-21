const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')
const winston = require('winston')
const morgan = require('morgan')

Sentry.init({ dsn: process.env.SENTRY_DSN })

const app = express()

const PORT = process.env.PORT || 80

app.use(Sentry.Handlers.requestHandler())

const logger = winston.createLogger()

if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({ level: process.env.LOGGING_LEVEL || 'silly' }))
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level} [${info.label || ''}]: ${info.message}`
      )
    ),
    level: process.env.LOGGING_LEVEL || 'silly'
  }))
}

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim(), { label: 'HTTP' }) } }))

// TODO: Set up CORS
app.use(cors())

// TODO: Add morgan logging
const contributorsRoute = require('./routes/contributors')
app.use(contributorsRoute())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`, { label: 'HTTP' })
})
