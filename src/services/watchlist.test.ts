import { watchlistModel } from '../db_models/watchlistSchema'
import {
  getWatchlistSymbols
} from './watchlist'

describe('getWatchlistSymbols', () => {
  beforeEach(() => {
    watchlistModel.find = jest.fn()
  })
  
  it('Returns empty array if network call fails', async () => {
    watchlistModel.find.mockImplementationOnce(() => {
      throw new Error('Ope')
    })
    const watchlist = await getWatchlistSymbols()
    expect(watchlist).toEqual([])
  })

  it('Returns an array with one symbol if network call returns an object', async () => {
    watchlistModel.find.mockReturnValueOnce([
      { symbol: 'AAPL' },
    ])
    const watchlist = await getWatchlistSymbols()
    expect(watchlist).toEqual([ 'AAPL' ])
  })

  it('Returns an array if network call returns an array', async () => {
    watchlistModel.find.mockReturnValueOnce([
      { symbol: 'AAPL' },
      { symbol: 'TSLA' },
    ])
    const watchlist = await getWatchlistSymbols()
    expect(watchlist).toEqual([ 'AAPL', 'TSLA' ])
  })
})