const settingSchema = require('../db_models/settingSchema')

type Settings = {
  callsEnabled: Boolean,
  putsEnabled: Boolean,
  maxAllocation: Number,
  maxPositions: Number,
  reserve: Number,
  buyToCloseAmount: Number,
  customTickers: Array<String>,
  bannedTickers: Array<String>,
}

const defaultSettings: Settings = {
  callsEnabled: true,
  putsEnabled: true,
  maxAllocation: 4000, // The maximum amount of money to put down on a single ticker
  maxPositions: 5, // The maximum number of positions any one position can have
  reserve: 0, // Money that Penny shouldn't touch. BuyingPower - Reserve. For planned withdrawals.
  buyToCloseAmount: 0.01, // Limit price when making automated buy_to_close orders
  customTickers: [],
  bannedTickers: [],
}


const getSettings = async () : Promise<Settings> => {
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


const setSettings = async (changes: Settings) : Promise<Settings> => {
  await Promise.all(Object.keys(changes).map(async key => {
    const value = changes[key]
    await settingSchema.findOneAndUpdate({ key }, { key, value }, { upsert: true })
  }))

  const newSettings = await getSettings()

  return newSettings
}


export {
  defaultSettings,
  getSettings,
  setSettings,
}