const incomeTargetService = require('../services/incomeTargets')
const {
  getIncomeTargetsController,
  createIncomeTargetController
} = require('./incomeTargets')
const { getMockReq, getMockRes } = require('@jest-mock/express')


describe('getIncomeTargetsController', () => {
  let req
  let res
  
  beforeEach(async () => {
    incomeTargetService.incomeTargets = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    incomeTargetService.incomeTargets.mockImplementation(() => {
      throw new Error('OH NOOOOO!!!')
    })
    await getIncomeTargetsController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path', async () => {
    incomeTargetService.incomeTargets.mockReturnValue({
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
    incomeTargetService.createIncomeTarget = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq({ body: { some: 'incomeTarget' } })
    res = mockRes.res
  })

  it('Returns 500 error if something fails', async () => {
    incomeTargetService.createIncomeTarget.mockImplementation(() => {
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