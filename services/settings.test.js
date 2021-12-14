const settingSchema = require('../db_models/settingSchema')

const {
  defaultSettings,
  getSettings,
  setSettings,
} = require('./settings')


describe('getSettings', () => {
  beforeEach(() => {
    settingSchema.find = jest.fn()
  })

  it('Returns all default settings if find returns nothing', async () => {
    settingSchema.find.mockReturnValue([])
    const settings = await getSettings()
    expect(settings).toEqual(defaultSettings)
  })

  it('Returns settings intermixed with default settings', async () => {
    settingSchema.find.mockReturnValue([
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
    settingSchema.findOneAndUpdate = jest.fn()
  })

  it('If empty object, just returns settings', async () => {
    settingSchema.find.mockReturnValue([])
    const newSettings = await setSettings({})
    expect(newSettings).toEqual(defaultSettings)
    expect(settingSchema.findOneAndUpdate).not.toHaveBeenCalled()
  })

  it('Updates for each setting updated', async () => {
    settingSchema.find.mockReturnValue([])
    const newSettings = await setSettings({
      hello: 'newSetting',
      goodbye: 'anothernewSetting',
      putsEnabled: true,
      reserve: -100
    })
    expect(newSettings).toEqual(defaultSettings)
    expect(settingSchema.findOneAndUpdate).toHaveBeenCalledTimes(4)

    expect(settingSchema.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'hello' },
      { key: 'hello', value: 'newSetting' },
      { upsert: true }
    )
    expect(settingSchema.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'goodbye' },
      { key: 'goodbye', value: 'anothernewSetting' },
      { upsert: true }
    )
    expect(settingSchema.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'putsEnabled' },
      { key: 'putsEnabled', value: true },
      { upsert: true }
    )
    expect(settingSchema.findOneAndUpdate).toHaveBeenCalledWith(
      { key: 'reserve' },
      { key: 'reserve', value: -100 },
      { upsert: true }
    )
  })

})