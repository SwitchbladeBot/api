const express = require('express')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 80

// Routes
const contributorsRoute = require('./routes/contributors')

// TODO: configure cors
app.use(cors())

app.use(contributorsRoute())
// TODO: morgan log

app.get('/', (req, res) => {
  res.json({ message: "Hello World" })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})