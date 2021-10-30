const express = require('express')
const app = express()

const { getPositionsController } = require('./getPositions')


app.get('/positions', getPositionsController)


module.exports = app