const settingSchema = require('../db_models/settingSchema')

const defaultSettings = {
  callsEnabled: true,
  putsEnabled: true,
  maxAllocation: 4000, // The maximum amount of money to put down on a single ticker
  reserve: 0, // Money that Penny shouldn't touch. BuyingPower - Reserve. For planned withdrawals.
  buyToCloseAmount: 1, // Limit price when making automated buy_to_close orders
}


const _getSettings = async () => {
  const mongoSettings = await settingSchema.find()

  // Replace default settings if needed
  const settings = mongoSettings.reduce((acc, setting) => (
    {
      ...acc,
      [setting.key]: setting.value
    }
  ), defaultSettings)
  
  return settings
}


const getSettingsController = async (req, res) => {
  try {
    const mongoSettings = await settingSchema.find()

    // Replace default settings if needed
    const settings = mongoSettings.reduce((acc, setting) => (
      {
        ...acc,
        [setting.key]: setting.value
      }
    ), defaultSettings)
  
    res.json(settings)
  } catch (e) {
    res.status(500).send('Error')
  }
}


const setSettingsController = async (req, res) => {
  try {
    await Promise.all(Object.keys(req.body).map(async key => {
      const value = req.body[key]
      await settingSchema.findOneAndUpdate({ key }, { key, value }, { upsert: true })
    }))
  
    const newSettings = await _getSettings()
    res.json(newSettings)
  } catch (e) {
    res.status(500).send('Error')
  }
}


module.exports = {
  defaultSettings,
  _getSettings,
  getSettingsController,
  setSettingsController,
}