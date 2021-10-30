const express = require('express')
const app = express()

const { getPositionsController } = require('./getPositions')
const { getBalancesController } = require('./getBalances')

app.get('/positions', getPositionsController)
app.get('/balances', getBalancesController)


module.exports = app