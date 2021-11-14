require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const { pennyStatusController } = require('./controllers/pennyStatus')

const { accountSummaryController } = require('./controllers/accountSummary')
const { getLogsController } = require('./controllers/getLogs')
const gainLoss = require('./controllers/gainLoss')
const positionGraph = require('./controllers/positionGraph')
const settings = require('./controllers/settings')
const watchlist = require('./controllers/watchlist')

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
app.get('/position-history-graph', positionGraph.getPositionGraphDataController)



// Settings
app.get('/settings', settings.getSettingsController)
app.put('/settings', settings.setSettingsController)


module.exports = app