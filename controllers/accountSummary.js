const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')
const gainLossService = require('./gainLoss')

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
      openPositions,
    })
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

module.exports = {
  accountSummaryController
}