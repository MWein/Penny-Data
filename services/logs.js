const logSchema = require('../db_models/logSchema')

const getLogs = async () => {
  const logs = await logSchema.find().sort({ date: -1 }).select('-_id -__v')
  return logs
}

module.exports = {
  getLogs
}