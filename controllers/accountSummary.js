const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const { isOption, determineOptionTypeFromSymbol, getUnderlying } = require('../utils/determineOptionType')
const gainLossService = require('./gainLoss')
const quotesUtil = require('../tradier/getQuotes')

const accountSummaryController = async (req, res) => {
  try {
    const today = new Date()
    const firstOfYear = new Date(`${today.getFullYear()}-01-01`)
    const firstOfMonth = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-01`)

    const [
      balances,
      openPositions,
      monthGainLoss,
      yearGainLoss,
    ] = await Promise.all([
      balancesUtil.getBalances(),
      positionUtil.getPositions(),
      gainLossService.getGainLoss(firstOfMonth, today),
      gainLossService.getGainLoss(firstOfYear, today),
    ])

    const options = openPositions.filter(pos => isOption(pos.symbol))
    const optionsTickers = options.map(opt => opt.symbol)
    const quotes = await quotesUtil.getQuotes(optionsTickers)

    const optionsContracts = options.map(pos => {
      return {
        symbol: getUnderlying(pos.symbol),
        type: determineOptionTypeFromSymbol(pos.symbol),
        contracts: pos.quantity * -1,
        covered: 'no', // TODO
        nextExpiration: new Date(quotes.find(quote => quote.symbol === pos.symbol).expiration_date),
        premium: pos.cost_basis * -1,
      }
    })


    const monthOptionProfit = monthGainLoss.optionGL
    const monthStockProfit = monthGainLoss.stockGL
    const monthTotalProfit = monthGainLoss.totalGL
    const yearOptionProfit = yearGainLoss.optionGL
    const yearStockProfit = yearGainLoss.stockGL
    const yearTotalProfit = yearGainLoss.totalGL

    res.json({
      ...balances,
      monthOptionProfit,
      monthStockProfit,
      monthTotalProfit,
      yearOptionProfit,
      yearStockProfit,
      yearTotalProfit,
      optionsContracts,
    })
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

module.exports = {
  accountSummaryController
}