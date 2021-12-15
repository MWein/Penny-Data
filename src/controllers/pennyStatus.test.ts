const pennyStatusUtil = require('../services/pennyStatus')
const { pennyStatusController } = require('./pennyStatus')
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('pennyStatusController', () => {
  let req
  let res
  
  beforeEach(async () => {
    pennyStatusUtil.getLastLogDate = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    pennyStatusUtil.getLastLogDate.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await pennyStatusController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    pennyStatusUtil.getLastLogDate.mockReturnValue('2020-01-01')
    await pennyStatusController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      lastLogDate: '2020-01-01'
    })
  })
})