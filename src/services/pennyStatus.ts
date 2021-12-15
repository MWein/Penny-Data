const { logModel } = require('../db_models/logSchema')


const getLastLogDate = async () : Promise<String> => {
  const lastLog = await logModel.findOne().sort({ date: -1 }).select('date')
  return lastLog.date
}


module.exports = {
  getLastLogDate
}