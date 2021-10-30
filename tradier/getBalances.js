const network = require('../utils/network')

const getBalances = async () => {
  const url = `accounts/${process.env.ACCOUNTNUM}/balances`
  const response = await network.get(url)
  const balancesObj = response.balances

  return {
    equity: balancesObj.total_equity,
    totalCash: balancesObj.total_cash,
    optionBuyingPower: balancesObj.margin.option_buying_power,
  }
}


const getBalancesController = async (req, res) => {
  try {
    const balances = await getBalances()
    res.json(balances)
  } catch (e) {
    res.status(500).send('Error')
  }
}


module.exports = {
  getBalances,
  getBalancesController,
}