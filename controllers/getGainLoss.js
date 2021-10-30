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
    determineOptionTypeFromSymbol(gl.symbol) === 'call')
  const stocks = gainLossData.filter(gl => !isOption(gl.symbol))

  const callGL = callOptions.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const putGL = putOptions.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const optionGL = callGL + putGL
  const stockGL = stocks.reduce((acc, opt) => acc + opt.gain_loss, 0)
  const totalGL = stockGL + optionGL

  return {
    callGL,
    putGL,
    optionGL,
    stockGL,
    totalGL,
    gainLossData
  }
}


const getGainLossController = async (req, res) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(0) // Beginning of time
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date() // Today
    const gainLoss = await getGainLoss(startDate, endDate)
    res.json(gainLoss)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

module.exports = {
  getGainLoss,
  getGainLossController
}