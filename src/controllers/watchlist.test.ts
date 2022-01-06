import * as watchlistUtil from '../tradier/watchlist'
import { getWatchlistController } from './watchlist'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getWatchlistController', () => {
  let req
  let res

  beforeEach(async () => {
    (watchlistUtil.getWatchlistSymbols as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (watchlistUtil.getWatchlistSymbols as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getWatchlistController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    (watchlistUtil.getWatchlistSymbols as unknown as jest.Mock).mockReturnValue({
      something: 'whatever'
    })
    await getWatchlistController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})