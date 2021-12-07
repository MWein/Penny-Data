const logSchema = require('../db_models/logSchema')
const { getLastLogDate } = require('./pennyStatus')

describe('getLastLogDate', () => {
  it('Gets the last log date', async () => {
    const select = jest.fn()
    const sort = jest.fn().mockReturnValue({
      select,
    })
    logSchema.findOne = jest.fn().mockReturnValue({
      sort,
    })

    select.mockReturnValue({
      date: 'somedate'
    })

    const result = await getLastLogDate()
    expect(result).toEqual('somedate')
  })
})