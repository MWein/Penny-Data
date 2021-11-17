const logSchema = require('../db_models/logSchema')


const getLastLogDate = async () => {
  const lastLog = await logSchema.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}


const pennyStatusController = async (req, res) => {
  try {
    const lastLogDate = await getLastLogDate()

    res.json({
      lastLogDate
    })
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  pennyStatusController
}