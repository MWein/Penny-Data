const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const { isOption, determineOptionTypeFromSymbol, getUnderlying } = require('../utils/determineOptionType')
const gainLossService = require('./gainLoss')
const quotesUtil = require('../tradier/getQuotes')
const ordersUtil = require('../tradier/getOrders')
const uniqBy = require('lodash/uniqBy')

const {
  _getCoveredText,
  accountSummary,
} = require('./accountSummary')


describe('_getCoveredText', () => {
  it('Returns Yes if buy-to-close orders equal number of positions', () => {
    expect(_getCoveredText(5, 5)).toEqual('yes')
  })
  it('Returns no if buy-to-close orders is 0', () => {
    expect(_getCoveredText(0, 5)).toEqual('no')
  })
  it('Returns partially if buy-to-close orders is not zero but does not equal number of positions', () => {
    expect(_getCoveredText(2, 5)).toEqual('partially')
  })
})