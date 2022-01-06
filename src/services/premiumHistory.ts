import * as historyUtil from '../tradier/getHistory'


const premiumEarned = async (startDate : string, endDate : string) => {
  const history = await historyUtil.getOptionTradeHistory(startDate, endDate)
  const optionHistory = history.filter(event => event.trade.trade_type === 'option')
  const totalCommission = Number(optionHistory.reduce((acc, event) => acc + event.trade.commission, 0).toFixed(2))
  const totalPremium = Number(optionHistory.reduce((acc, event) => acc + event.amount, 0).toFixed(2))

  return {
    totalPremium,
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
  const optionHistory = history.filter(event => event.trade.trade_type === 'option')

  const formattedHistory = optionHistory.map(event => ({
    amount: event.amount,
    date: event.date.split('T')[0]
  }))

  const dates = _generateDates(startDate, endDate)

  const graph = dates.reduce((acc, date, index) => {
    const events = formattedHistory.filter(x => x.date === date)
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