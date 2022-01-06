import { settingsModel } from '../db_models/settingSchema'

import {
  defaultSettings,
  getSettings,
  setSettings,
} from './settings'


describe('getSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
  })

  it('Returns all default settings if find returns nothing', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns settings intermixed with default settings', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([
      {
        key: 'putsEnabled',
        value: false
      },
      {
        key: 'reserve',
        value: 2000
      },
    ])
    const settings = await getSettings()
    expect(settings).toEqual({
      ...defaultSettings,
      putsEnabled: false,
      reserve: 2000
    })
  })
})


describe('setSettings', () => {
  beforeEach(() => {
    settingsModel.findOneAndUpdate = jest.fn()
  })

  it('If empty object, just returns settings', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    (settingsModel.find as unknown as jest.Mock).mockReturnValue([])
    const newSettings = await setSettings({
      callsEnabled: false,
      customTickers: [ 'tiiiicker' ],
      putsEnabled: true,
      reserve: -100
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledTimes(4)

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'callsEnabled' },
      { key: 'callsEnabled', value: false },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'customTickers' },
      { key: 'customTickers', value: [ 'tiiiicker' ] },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'putsEnabled' },
      { key: 'putsEnabled', value: true },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'reserve' },
      { key: 'reserve', value: -100 },
      { upsert: true }
    )
  })

})