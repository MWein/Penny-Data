const settingsService = require('../services/settings')


const getSettingsController = async (req, res) => {
  try {
    const settings = await settingsService.getSettings()
    res.json(settings)
  } catch (e) {
    res.status(500).send('Error')
  }
}


const setSettingsController = async (req, res) => {
  try {
    const newSettings = await settingsService.setSettings(req.body)
    res.json(newSettings)
  } catch (e) {
    res.status(500).send('Error')
  }
}


module.exports = {
  getSettingsController,
  setSettingsController,
}