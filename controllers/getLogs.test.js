const logService = require('../services/logs')
const { getLogsController } = require('./getLogs')
const { getMockReq, getMockRes } = require('@jest-mock/express')


describe('getLogsController', () => {
  let req
  let res

  beforeEach(async () => {
    logService.getLogs = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    logService.getLogs.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getLogsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    logService.getLogs.mockReturnValue({
      something: 'whatever'
    })
    await getLogsController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})