require('dotenv').config()
import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { pennyStatusController } from './controllers/pennyStatus'
const { accountSummaryController } = require('./controllers/accountSummary')
import { getLogsController } from './controllers/getLogs'
const gainLoss = require('./controllers/gainLoss')
const settings = require('./controllers/settings')
const watchlist = require('./controllers/watchlist')
const { getIncomeTargetsController, createIncomeTargetController } = require('./controllers/incomeTargets')


const app = express()


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


export default app