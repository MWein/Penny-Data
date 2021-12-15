import * as networkUtil from '../utils/network'

const getBalances = async () => {
  const url = `accounts/${process.env.ACCOUNTNUM}/balances`
  const response = await networkUtil.get(url)
  const balancesObj = response.balances

  // Nonprod is a margin account, prod is cash
  // Check if cash exists first
  const buyingPowerObj = balancesObj.cash || balancesObj.margin
  const optionBuyingPower = buyingPowerObj.option_buying_power || buyingPowerObj.cash_available

  return {
    equity: balancesObj.total_equity,
    totalCash: balancesObj.total_cash,
    optionBuyingPower,
  }
}

module.exports = {
  getBalances
}