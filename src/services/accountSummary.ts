export {}

const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const { isOption, determineOptionTypeFromSymbol, getUnderlying } = require('../utils/determineOptionType')
const gainLossService = require('./gainLoss')
const quotesUtil = require('../tradier/getQuotes')
const ordersUtil = require('../tradier/getOrders')
const uniqBy = require('lodash/uniqBy')


type OptionContract = {
  symbol: string,
  optionSymbol: string,
  type: string,
  contracts: number,
  expiration: string,
  premium: number,
  covered?: string
}


const _getCoveredText = (btcOrders, numPositions) => {
  if (btcOrders === numPositions) {
    return 'yes'
  } else if (btcOrders === 0) {
    return 'no'
  }
  return 'partially'
}


const _formatOptions = (options, quotes) : OptionContract[] =>
  options.map(option => ({
    symbol: getUnderlying(option.symbol),
    optionSymbol: option.symbol,
    type: determineOptionTypeFromSymbol(option.symbol),
    contracts: option.quantity * -1,
    expiration: quotes.find(quote => quote.symbol === option.symbol)?.expiration_date || '2021-01-01',
    premium: option.cost_basis * -1,
  }))


const _matchOptionsToBTCOrders = (formattedOptions, buyToCloseOrders) =>
  Object.values(formattedOptions.reduce((acc, contract) => {
    const key = `${contract.symbol}${contract.type}${contract.expiration}`
    const old = acc[key] || { contracts: 0, premium: 0 }

    const totalBuyToCloseOrders = buyToCloseOrders
      .filter(x => contract.optionSymbol === x.option_symbol)
      .reduce((acc, x) => acc + x.quantity, 0)

    const newContracts = contract.contracts + old.contracts

    return {
      ...acc,
      [key]: {
        ...contract,
        contracts: newContracts,
        premium: contract.premium + old.premium,
        covered: _getCoveredText(totalBuyToCloseOrders, newContracts)
      }
    }
  }, {}))
    .sort((a: OptionContract, b: OptionContract) => new Date(a.expiration).valueOf() - new Date(b.expiration).valueOf())


const accountSummary = async () => {
  const today = new Date()
  const firstOfYear = new Date(`${today.getFullYear()}-01-01`)
  const firstOfMonth = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-01`)

  const [
    balances,
    orders,
    openPositions,
    monthGainLoss,
    yearGainLoss,
  ] = await Promise.all([
    balancesUtil.getBalances(),
    ordersUtil.getOrders(),
    positionUtil.getPositions(),
    gainLossService.getGainLoss(firstOfMonth, today),
    gainLossService.getGainLoss(firstOfYear, today),
  ])

  const options = openPositions.filter(pos => isOption(pos.symbol))
  const optionsTickers = options.map(opt => opt.symbol)

  // For some reason I can't explain, Tradier sends back duplicate orders with the same ID
  const buyToCloseOrders = uniqBy(ordersUtil.filterForOptionBuyToCloseOrders(orders), 'id')

  const quotes = await quotesUtil.getQuotes(optionsTickers)

  const formattedOptions = _formatOptions(options, quotes)
  const optionsContracts = _matchOptionsToBTCOrders(formattedOptions, buyToCloseOrders)


  const monthOptionProfit = monthGainLoss.optionGL
  const monthStockProfit = monthGainLoss.stockGL
  const monthTotalProfit = monthGainLoss.totalGL
  const yearOptionProfit = yearGainLoss.optionGL
  const yearStockProfit = yearGainLoss.stockGL
  const yearTotalProfit = yearGainLoss.totalGL

  return {
    ...balances,
    monthOptionProfit,
    monthStockProfit,
    monthTotalProfit,
    yearOptionProfit,
    yearStockProfit,
    yearTotalProfit,
    optionsContracts,
  }
}


module.exports = {
  _getCoveredText,
  _formatOptions,
  _matchOptionsToBTCOrders,
  accountSummary,
}