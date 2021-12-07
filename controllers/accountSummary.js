const accountSummaryUtil = require('../services/accountSummary')


const accountSummaryController = async (req, res) => {
  try {
    const summary = await accountSummaryUtil.accountSummary()
    res.json(summary)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  accountSummaryController
}