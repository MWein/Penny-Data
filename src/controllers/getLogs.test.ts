import * as logService from '../services/logs'
import { getLogsController } from './getLogs'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getLogsController', () => {
  let req
  let res

  beforeEach(async () => {
    (logService.getLogs as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (logService.getLogs as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getLogsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    (logService.getLogs as unknown as jest.Mock).mockReturnValue({
      something: 'whatever'
    })
    await getLogsController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})