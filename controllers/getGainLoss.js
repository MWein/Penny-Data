const gainLossSchema = require('../db_models/gainLossSchema')
const {
  isOption,
  determineOptionTypeFromSymbol
} = require('../utils/determineOptionType')

const getGainLossController = async (req, res) => {
  try {
    const gainLossData = await gainLossSchema
      .find()
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

    res.json({
      callGL,
      putGL,
      optionGL,
      stockGL,
      totalGL,
      gainLossData
    })
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  getGainLossController
}