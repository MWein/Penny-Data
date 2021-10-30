const settingSchema = require('../db_models/settingSchema')

const defaultSettings = {
  callsEnabled: true,
  putsEnabled: true,
  maxAllocation: 4000, // The maximum amount of money to put down on a single ticker
  reserve: 0, // Money that Penny shouldn't touch. BuyingPower - Reserve. For planned withdrawals.
  buyToCloseAmount: 1, // Limit price when making automated buy_to_close orders
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

module.exports = {
  defaultSettings,
  getSettingsController,
}