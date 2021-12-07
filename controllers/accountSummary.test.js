const accountSummaryUtil = require('../services/accountSummary')
const { accountSummaryController } = require('./accountSummary')
const { getMockReq, getMockRes } = require('@jest-mock/express')


describe('accountSummaryController', () => {
  let req
  let res

  beforeEach(async () => {
    accountSummaryUtil.accountSummary = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    accountSummaryUtil.accountSummary.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await accountSummaryController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    accountSummaryUtil.accountSummary.mockReturnValue({
      something: 'whatever'
    })
    await accountSummaryController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})