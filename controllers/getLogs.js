const logSchema = require('../db_models/logSchema')

const getLogsController = async (req, res) => {
  try {
    const logs = await logSchema.find().sort({ date: -1 }).select('-_id -__v')
    res.json(logs)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  getLogsController
}