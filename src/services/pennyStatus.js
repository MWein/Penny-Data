const logSchema = require('../db_models/logSchema')


const getLastLogDate = async () => {
  const lastLog = await logSchema.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}


module.exports = {
  getLastLogDate
}