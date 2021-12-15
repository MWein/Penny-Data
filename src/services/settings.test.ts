const { settingsModel } = require('../db_models/settingSchema')

const {
  defaultSettings,
  getSettings,
  setSettings,
} = require('./settings')


describe('getSettings', () => {
  beforeEach(() => {
    settingsModel.find = jest.fn()
  })

  it('Returns all default settings if find returns nothing', async () => {
    settingsModel.find.mockReturnValue([])
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns settings intermixed with default settings', async () => {
    settingsModel.find.mockReturnValue([
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
    settingsModel.find.mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    settingsModel.find.mockReturnValue([])
    const newSettings = await setSettings({
      hello: 'newSetting',
      goodbye: 'anothernewSetting',
      putsEnabled: true,
      reserve: -100
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledTimes(4)

    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'hello' },
      { key: 'hello', value: 'newSetting' },
      { upsert: true }
    )
    expect(settingsModel.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'goodbye' },
      { key: 'goodbye', value: 'anothernewSetting' },
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