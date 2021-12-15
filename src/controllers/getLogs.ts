const logService = require('../services/logs')

const getLogsController = async (req, res) => {
  try {
    const logs = await logService.getLogs()
    res.json(logs)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  getLogsController
}