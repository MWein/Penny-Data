require('dotenv').config()
const express = require('express')
const app = express()

const { accountInfoController } = require('./controllers/getAccountInfo')
const { getLogsController } = require('./controllers/getLogs')
const { getGainLossController } = require('./controllers/getGainLoss')
const { getSettingsController } = require('./controllers/getSettings')
const watchlist = require('./controllers/watchlist')

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('/account-info', accountInfoController)
app.get('/logs', getLogsController)
app.get('/gain-loss', getGainLossController)
app.get('/settings', getSettingsController)
app.get('/watchlist', watchlist.getWatchlistController)

module.exports = app