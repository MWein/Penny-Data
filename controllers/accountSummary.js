const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const { isOption, determineOptionTypeFromSymbol, getUnderlying } = require('../utils/determineOptionType')
const gainLossService = require('./gainLoss')
const quotesUtil = require('../tradier/getQuotes')
const ordersUtil = require('../tradier/getOrders')


const getCoveredText = (btcOrders, numPositions) => {
  if (btcOrders === numPositions) {
    return 'yes'
  } else if (btcOrders === 0) {
    return 'no'
  }
  return 'partially'
}

const accountSummaryController = async (req, res) => {
  try {
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
    const buyToCloseOrders = ordersUtil.filterForOptionBuyToCloseOrders(orders)

    const quotes = await quotesUtil.getQuotes(optionsTickers)

    const optionsContracts = Object.values(options.map(pos => {
      return {
        symbol: getUnderlying(pos.symbol),
        type: determineOptionTypeFromSymbol(pos.symbol),
        contracts: pos.quantity * -1,
        nextExpiration: quotes.find(quote => quote.symbol === pos.symbol).expiration_date,
        premium: pos.cost_basis * -1,
      }
    }).reduce((acc, contract) => {
      const key = `${contract.symbol}${contract.type}${contract.nextExpiration}`
      const old = acc[key] || { contracts: 0, premium: 0 }

      const totalBuyToCloseOrders = buyToCloseOrders
        .filter(x => x.symbol === contract.symbol)
        .reduce((acc, x) => acc + x.quantity, 0)

      const newContracts = contract.contracts + old.contracts

      return {
        ...acc,
        [key]: {
          ...contract,
          contracts: newContracts,
          premium: contract.premium + old.premium,
          covered: getCoveredText(totalBuyToCloseOrders, newContracts)
        }
      }
    }, {}))


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