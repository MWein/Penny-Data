import * as historyUtil from '../tradier/getHistory'
const uniq = require('lodash/uniq')


const _getRealizedStockHistory = history => {
  const stockHistory = history.filter(event => event.trade.trade_type === 'equity')
  const symbols = uniq(stockHistory.map(x => x.trade.symbol))
  return symbols.reduce((acc, symbol) => {
    const symbolHistory = stockHistory.filter(x => x.trade.symbol === symbol).reverse()

    let shares = 0
    let costBasisPerShare = 0
    const closedHistory = []
    for (let x = 0; x < symbolHistory.length; x++) {
      const current = symbolHistory[x]
      // For buy
      if (current.amount < 0) {
        const costBasisForTrade = current.trade.price * current.trade.quantity
        const previousCostBasis = costBasisPerShare * shares
        const totalCostBasis = costBasisForTrade + previousCostBasis
        shares += current.trade.quantity
        costBasisPerShare = totalCostBasis / shares
      }
      // For sale
      if (current.amount > 0) {
        const realizedPerShare = current.trade.price - costBasisPerShare
        const totalRealized = realizedPerShare * (current.trade.quantity * -1)
        shares += current.trade.quantity // Quantity is negative for sales
        if (shares = 0) {
          costBasisPerShare = 0
        }
        closedHistory.push({
          symbol,
          amount: totalRealized,
          date: current.date.split('T')[0]
        })
      }
    }

    return [
      ...acc,
      ...closedHistory,
    ]
  }, [])
}



const premiumEarned = async (startDate : string, endDate : string) => {
  const [
    history,
    fullHistory,
  ] = await Promise.all([
    historyUtil.getOptionTradeHistory(startDate, endDate),
    historyUtil.getOptionTradeHistory('1970-01-01', endDate)
  ])

  // TODO Filter out protective puts

  const optionHistory = history.filter(event => event.trade.trade_type === 'option')
  const totalCommission = Number(optionHistory.reduce((acc, event) => acc + event.trade.commission, 0).toFixed(2))
  const totalPremium = Number(optionHistory.reduce((acc, event) => acc + event.amount, 0).toFixed(2))

  const realizedHistory = _getRealizedStockHistory(fullHistory).filter(x => new Date(startDate).getTime() <= new Date(x.date).getTime())
  const totalRealized = Number(realizedHistory.reduce((acc, event) => acc + event.amount, 0).toFixed(2))
  

  return {
    totalPremium: totalPremium + totalRealized,
    totalCommission,
  }
}


const _generateDates = (startDate : string, endDate : string) : string[] => {
  const dates = []
  const date = new Date(startDate)

  while (!dates.includes(endDate)) {
    const dateStr = date.toISOString().split('T')[0]
    dates.push(dateStr)
    date.setDate(date.getDate() + 1)
  }
  return dates
}


const premiumGraph = async (startDate : string, endDate : string) => {
  const history = await historyUtil.getOptionTradeHistory(startDate, endDate)

  // TODO Filter out protective puts
  const optionHistory = history.filter(event => event.trade.trade_type === 'option')

  const stockHistory = _getRealizedStockHistory(history)

  const formattedOptionHistory = optionHistory.map(event => ({
    amount: event.amount,
    date: event.date.split('T')[0]
  }))

  const totalHistory = [ ...formattedOptionHistory, ...stockHistory ]

  const dates = _generateDates(startDate, endDate)

  const graph = dates.reduce((acc, date, index) => {
    const events = totalHistory.filter(x => x.date === date)
    const change = Number(events.reduce((acc, event) => acc + event.amount, 0).toFixed(2))
    const value = index === 0 ? change : Number((acc[index - 1].value + change).toFixed(2))

    return [
      ...acc,
      {
        label: date,
        value,
        change,
      }
    ]
  }, [])

  return graph
}


export {
  premiumEarned,
  premiumGraph
}