const watchlistUtil = require('../tradier/watchlist')
const { getWatchlistController } = require('./watchlist')
const { getMockReq, getMockRes } = require('@jest-mock/express')


describe('getWatchlistController', () => {
  let req
  let res

  beforeEach(async () => {
    watchlistUtil.getWatchlistSymbols = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    watchlistUtil.getWatchlistSymbols.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getWatchlistController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    watchlistUtil.getWatchlistSymbols.mockReturnValue({
      something: 'whatever'
    })
    await getWatchlistController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})