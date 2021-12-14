const logSchema = require('../db_models/logSchema')
const { getLogs } = require('./logs')

describe('getLogs', () => {
  it('Gets the logs', async () => {
    const select = jest.fn()
    const sort = jest.fn().mockReturnValue({
      select,
    })
    logSchema.find = jest.fn().mockReturnValue({
      sort,
    })

    select.mockReturnValue([
      'some',
      'logs'
    ])

    const result = await getLogs()
    expect(result).toEqual([
      'some',
      'logs'
    ])
  })
})