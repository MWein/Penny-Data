const gainLossSchema = require('../db_models/gainLossSchema')
const {
  isOption,
  determineOptionTypeFromSymbol
} = require('../utils/determineOptionType')


const getGainLoss = async (startDate, endDate) => {
  const gainLossData = await gainLossSchema
    .find({ close_date: { $gte: startDate, $lte: endDate } })
    .sort({ close_date: -1 })
    .select('-_id -__v -hashId')

  const callOptions = gainLossData.filter(gl =>
    determineOptionTypeFromSymbol(gl.symbol) === 'call')
  const putOptions = gainLossData.filter(gl =>
    determineOptionTypeFromSymbol(gl.symbol) === 'put')
  const stocks = gainLossData.filter(gl => !isOption(gl.symbol))

  const callGL = callOptions.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const putGL = putOptions.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const optionGL = callGL + putGL
  const stockGL = stocks.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const totalGL = optionGL + stockGL

  return {
    callGL,
    putGL,
    optionGL,
    stockGL,
    totalGL,
    gainLossData
  }
}


const gainLossGraph = async (startDate, endDate, granularity, optionsOnly) => {
  const gainLoss = await getGainLoss(startDate, endDate)
  const gainLossData = gainLoss.gainLossData.filter(gl => optionsOnly ? isOption(gl.symbol) : true)

  if (granularity === 'day') {
    // Creating new date out of date to avoid weird mutation error
    const date = new Date(gainLossData[gainLossData.length - 1].close_date)
    const graph = []
    let currentTotal = 0
    while (date <= endDate) {
      const dateStr = date.toISOString().split('T')[0]
      const gainLossToday = gainLossData.filter(gl => gl.close_date.toISOString().split('T')[0] === dateStr)
      const change = gainLossToday.reduce((acc, gl) => acc + gl.gain_loss, 0)
      currentTotal = currentTotal + change
      graph.push({ label: dateStr, value: currentTotal, change })
      date.setDate(date.getDate() + 1)
    }
    return graph
  } else if (granularity === 'month') {
    return []
  }
}


const getGainLossController = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0) // Beginning of time
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date() // Today
    const gainLoss = await getGainLoss(startDate, endDate)
    res.json(gainLoss)
  } catch (e) {
    res.status(500).send('Error')
  }
}

const getGainLossGraphController = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0) // Beginning of time
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date() // Today
    const granularity = req.query.granularity || 'day'
    const optionsOnly = req.query['options-only'] === 'true'
    const gainLossData = await gainLossGraph(startDate, endDate, granularity, optionsOnly)
    res.json(gainLossData)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

module.exports = {
  getGainLoss,
  gainLossGraph,
  getGainLossController,
  getGainLossGraphController,
}