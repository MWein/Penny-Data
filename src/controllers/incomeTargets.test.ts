import * as incomeTargetService from '../services/incomeTargets'
import {
  getIncomeTargetsController,
  createIncomeTargetController
} from './incomeTargets'
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getIncomeTargetsController', () => {
  let req
  let res
  
  beforeEach(async () => {
    (incomeTargetService.incomeTargets as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (incomeTargetService.incomeTargets as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getIncomeTargetsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    (incomeTargetService.incomeTargets as unknown as jest.Mock).mockReturnValue({
      something: 'whatever'
    })
    await getIncomeTargetsController(req, res)
    expect(res.json).toHaveBeenCalledWith({
      something: 'whatever'
    })
  })
})


describe('createIncomeTargetController', () => {
  let req
  let res
  
  beforeEach(async () => {
    (incomeTargetService.createIncomeTarget as unknown as jest.Mock) = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq({ body: { some: 'incomeTarget' } })
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    (incomeTargetService.createIncomeTarget as unknown as jest.Mock).mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await createIncomeTargetController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path, creates target from request body', async () => {
    await createIncomeTargetController(req, res)
    expect(incomeTargetService.createIncomeTarget).toHaveBeenCalledWith({ some: 'incomeTarget' })
    expect(res.send).toHaveBeenCalledWith('Success')
  })
})