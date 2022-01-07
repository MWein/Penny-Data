import * as network from '../utils/network'
import { getOptionTradeHistory } from './getHistory'

describe('getHistory', () => {

  it('Calls the url with the given start and end dates, returns events array', async () => {
    (network.get as unknown as jest.Mock) = jest.fn().mockReturnValue({
      history: {
        event: [ 'some', 'history' ]
      }
    })
    const result = await getOptionTradeHistory('2021-01-01', '2022-01-01')
    expect(network.get).toHaveBeenCalledWith('accounts/undefined/history?limit=100000&type=trade&start=2021-01-01&end=2022-01-01')
    expect(result).toEqual([ 'some', 'history' ])
  })
})