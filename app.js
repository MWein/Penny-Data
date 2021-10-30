require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const { accountSummaryController } = require('./controllers/accountSummary')
const { getLogsController } = require('./controllers/getLogs')
const gainLoss = require('./controllers/gainLoss')

const settings = require('./controllers/settings')
const watchlist = require('./controllers/watchlist')

app.use(bodyParser.json())

app.get('/logs', getLogsController)

app.get('/account-summary', accountSummaryController)
app.get('/gain-loss', gainLoss.getGainLossController)
app.get('/gain-loss-graph', gainLoss.getGainLossGraphController)

// Settings
app.get('/settings', settings.getSettingsController)
app.put('/settings', settings.setSettingsController)

// Watchlist
app.get('/watchlist', watchlist.getWatchlistController)

module.exports = app