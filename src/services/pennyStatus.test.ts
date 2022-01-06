import { logModel } from '../db_models/logSchema'
import { getLastLogDate } from './pennyStatus'

describe('getLastLogDate', () => {
  it('Gets the last log date', async () => {
    const select = jest.fn()
    const sort = jest.fn().mockReturnValue({
      select,
    })
    logModel.findOne = jest.fn().mockReturnValue({
      sort,
    })

    select.mockReturnValue({
      date: 'somedate'
    })

    const result = await getLastLogDate()
    expect(result).toEqual('somedate')
  })
})