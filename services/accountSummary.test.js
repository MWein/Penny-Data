const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const { isOption, determineOptionTypeFromSymbol, getUnderlying } = require('../utils/determineOptionType')
const gainLossService = require('./gainLoss')
const quotesUtil = require('../tradier/getQuotes')
const ordersUtil = require('../tradier/getOrders')
const uniqBy = require('lodash/uniqBy')

const {
  _getCoveredText,
  _formatOptions,
  _matchOptionsToBTCOrders,
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


describe('_formatOptions', () => {
  const mockOptions = [
    {
      symbol: 'AAPL123C1234',
      quantity: -2,
      cost_basis: -400,
    },
    {
      symbol: 'TSLA123P1234',
      quantity: -4,
      cost_basis: -200,
    },
  ]


  it('Formats a list of options and includes the expiration derived from the quotes object', () => {
    const mockQuotes = [
      {
        symbol: 'AAPL123C1234',
        expiration_date: '2021-05-29',
      },
      {
        symbol: 'TSLA123P1234',
        expiration_date: '2021-05-29',
      },
    ]
    const actual = _formatOptions(mockOptions, mockQuotes)
    expect(actual).toEqual([
      {
        contracts: 2,
        expiration: '2021-05-29',
        optionSymbol: 'AAPL123C1234',
        premium: 400,
        symbol: 'AAPL',
        type: 'call'
      },
      {
        contracts: 4,
        expiration: '2021-05-29',
        optionSymbol: 'TSLA123P1234',
        premium: 200,
        symbol: 'TSLA',
        type: 'put'
      }
    ])
  })

  it('Returns with a date if a quote for that specific option isnt returned', () => {
    const mockQuotes = [
      {
        symbol: 'AAPL123C1234',
        expiration_date: '2021-05-29',
      },
    ]
    const actual = _formatOptions(mockOptions, mockQuotes)
    expect(actual).toEqual([
      {
        contracts: 2,
        expiration: '2021-05-29',
        optionSymbol: 'AAPL123C1234',
        premium: 400,
        symbol: 'AAPL',
        type: 'call'
      },
      {
        contracts: 4,
        expiration: '2021-01-01',
        optionSymbol: 'TSLA123P1234',
        premium: 200,
        symbol: 'TSLA',
        type: 'put'
      }
    ])
  })
})