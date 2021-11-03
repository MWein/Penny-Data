require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const { pennyStatusController } = require('./controllers/pennyStatus')

const { accountSummaryController } = require('./controllers/accountSummary')
const { getLogsController } = require('./controllers/getLogs')
const gainLoss = require('./controllers/gainLoss')

const settings = require('./controllers/settings')
const watchlist = require('./controllers/watchlist')

app.use(bodyParser.json())
app.use(cors())

// Actually used!
app.get('/penny-status', pennyStatusController)
app.get('/account-summary', accountSummaryController)
app.get('/watchlist', watchlist.getWatchlistController)


// Not used yet
app.get('/logs', getLogsController)
app.get('/gain-loss', gainLoss.getGainLossController)
app.get('/gain-loss-graph', gainLoss.getGainLossGraphController)

// Settings
app.get('/settings', settings.getSettingsController)
app.put('/settings', settings.setSettingsController)


module.exports = app