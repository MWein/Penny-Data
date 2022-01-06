import { logModel } from '../db_models/logSchema'

const getLogs = async () : Promise<String[]> => {
  const logs = await logModel.find().sort({ date: -1 }).select('-_id -__v')
  return logs
}

export {
  getLogs
}