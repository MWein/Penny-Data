require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const { pennyStatusController } = require('./src/controllers/pennyStatus')

const { accountSummaryController } = require('./src/controllers/accountSummary')
const { getLogsController } = require('./src/controllers/getLogs')
const gainLoss = require('./src/controllers/gainLoss')
const settings = require('./src/controllers/settings')
const watchlist = require('./src/controllers/watchlist')
const { getIncomeTargetsController, createIncomeTargetController } = require('./src/controllers/incomeTargets')


app.use(bodyParser.json())
app.use(cors())


// Status endpoint that checks the last action by Penny via the logs database
app.get('/penny-status', pennyStatusController)

// Balances, Orders, Positions, Month Gain, Year Gain
app.get('/account-summary', accountSummaryController)

// Watchlist Endpoints
app.get('/watchlist', watchlist.getWatchlistController)

// Dump all logs from the database
app.get('/logs', getLogsController)


app.get('/gain-loss', gainLoss.getGainLossController)
app.get('/gain-loss-graph', gainLoss.getGainLossGraphController)


// Settings
app.get('/settings', settings.getSettingsController)
app.put('/settings', settings.setSettingsController)


// Income target endpoints
app.get('/income-targets', getIncomeTargetsController)
app.post('/income-targets', createIncomeTargetController)


module.exports = app