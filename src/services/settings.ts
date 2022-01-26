import { settingsModel } from '../db_models/settingSchema'

type Settings = {
  callsEnabled?: Boolean,
  putsEnabled?: Boolean,
  closeExpiringPuts?: Boolean,
  allocateUnutilizedCash?: Boolean,
  defaultVolatility?: Number,
  reserve?: Number,
  profitTarget?: Number,
  priorityList?: Array<String>,
}

const defaultSettings: Settings = {
  callsEnabled: true,
  putsEnabled: true,
  closeExpiringPuts: false,
  allocateUnutilizedCash: false,
  defaultVolatility: 0.20, // A safety buffer to be used with stocks when calculating unutilized funds
  reserve: 0, // Money that Penny shouldn't touch. BuyingPower - Reserve. For planned withdrawals.
  profitTarget: 0.75, // Profit to set Buy-To-Close orders to
  priorityList: [],
}


const getSettings = async () : Promise<Settings> => {
  const mongoSettings = await settingsModel.find()

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
    await settingsModel.findOneAndUpdate({ key }, { key, value }, { upsert: true })
  }))

  const newSettings = await getSettings()

  return newSettings
}


export {
  defaultSettings,
  getSettings,
  setSettings,
}