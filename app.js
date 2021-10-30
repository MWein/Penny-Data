const express = require('express')
const app = express()

const tradierRouter = require('./tradier/router')

app.get('/ping', (req, res) => {
  res.send('pong')
})

// Routers
app.use('/tradier', tradierRouter)

module.exports = app