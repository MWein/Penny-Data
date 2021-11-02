const logSchema = require('../db_models/logSchema')


const getLastLogDate = async () => {
  const lastLog = await logSchema.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}


const pennyStatusController = async (req, res) => {
  try {
    const logs = await getLastLogDate()
    res.json(logs)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  pennyStatusController
}