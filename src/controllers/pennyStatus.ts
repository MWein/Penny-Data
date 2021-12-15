const pennyStatusUtil = require('../services/pennyStatus')


const pennyStatusController = async (req, res) : Promise<void> => {
  try {
    const lastLogDate = await pennyStatusUtil.getLastLogDate()

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