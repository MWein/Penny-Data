const gainLossSchema = require('../db_models/gainLossSchema')

const getGainLossController = async (req, res) => {
  try {
    const gainLossData = await gainLossSchema.find().sort({ close_date: -1 }).select('-_id -__v -hashId')
    res.json(gainLossData)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  getGainLossController
}