const express = require('express')
const cors = require('cors')
const Sentry = require('@sentry/node')

Sentry.init({ dsn: process.env.SENTRY_DSN })

const app = express()

const PORT = process.env.PORT || 80

app.use(Sentry.Handlers.requestHandler())

// TODO: Set up CORS
app.use(cors())

const contributorsRoute = require('./routes/contributors')
app.use(contributorsRoute())
// TODO: Add morgan logging

app.get('/', (req, res) => {
  res.json({ message: "Hello World" })
})

app.use(Sentry.Handlers.errorHandler())

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})