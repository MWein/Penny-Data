const gainLossService = require('../services/gainLoss')


const getGainLossController = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0) // Beginning of time
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date() // Today
    const gainLoss = await gainLossService.getGainLoss(startDate, endDate)
    res.json(gainLoss)
  } catch (e) {
    res.status(500).send('Error')
  }
}

const getGainLossGraphController = async (req, res) => {
  try {
    const timespan = req.query.timespan || 'year'

    let startDate = new Date()
    if (timespan === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else if (timespan === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const granularity = req.query.granularity || 'day'
    const optionsOnly = req.query['options-only'] === 'true'
    const gainLossGraphData = await gainLossService.gainLossGraph(startDate, new Date(), granularity, optionsOnly)
    res.json(gainLossGraphData)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

module.exports = {
  getGainLossController,
  getGainLossGraphController,
}