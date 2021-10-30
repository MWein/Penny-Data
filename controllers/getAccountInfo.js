const balancesUtil = require('../tradier/getBalances')
const positionUtil = require('../tradier/getPositions')

const accountInfoController = async (req, res) => {
  try {
    const [
      balances,
      openPositions,
    ] = await Promise.all([
      balancesUtil.getBalances(),
      positionUtil.getPositions(),
    ])

    res.json({
      balances,
      openPositions
    })
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  accountInfoController
}