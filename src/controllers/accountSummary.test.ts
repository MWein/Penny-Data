import * as accountSummaryUtil from '../services/accountSummary'
import { accountSummaryController } from './accountSummary'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('accountSummaryController', () => {
  let req
  let res

  beforeEach(async () => {
    (accountSummaryUtil.accountSummary as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (accountSummaryUtil.accountSummary as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await accountSummaryController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    (accountSummaryUtil.accountSummary as unknown as jest.Mock).mockReturnValue({
      something: 'whatever'
    })
    await accountSummaryController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})