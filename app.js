require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const { accountInfoController } = require('./controllers/getAccountInfo')
const { getLogsController } = require('./controllers/getLogs')
const { getGainLossController } = require('./controllers/getGainLoss')

const settings = require('./controllers/settings')
const watchlist = require('./controllers/watchlist')

app.use(bodyParser.json())

app.get('/logs', getLogsController)

app.get('/account-info', accountInfoController)
app.get('/gain-loss', getGainLossController)

// Settings
app.get('/settings', settings.getSettingsController)
app.put('/settings', settings.setSettingsController)

// Watchlist
app.get('/watchlist', watchlist.getWatchlistController)

module.exports = app