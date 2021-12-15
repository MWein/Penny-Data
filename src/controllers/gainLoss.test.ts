const gainLossService = require('../services/gainLoss')
const {
  getGainLossController,
  getGainLossGraphController,
} = require('./gainLoss')
import { getMockReq, getMockRes } from '@jest-mock/express'


describe('getGainLossController', () => {
  let req
  let res
  
  beforeEach(async () => {
    gainLossService.getGainLoss = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 if error thrown', async () => {
    gainLossService.getGainLoss.mockImplementation(() => {
      throw new Error('Damn')
    })
    await getGainLossController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Happy path, start and end dates provided', async () => {
    req = getMockReq({
      query: {
        startDate: '2021-01-01',
        endDate: '2021-01-07',
      }
    })
    gainLossService.getGainLoss.mockReturnValue('doesntmatter')
    await getGainLossController(req, res)
    expect(gainLossService.getGainLoss).toHaveBeenCalledWith(
      new Date('2021-01-01T00:00:00.000Z'),
      new Date('2021-01-07T00:00:00.000Z')
    )
    expect(res.json).toHaveBeenCalledWith('doesntmatter')
  })

  it('Happy path, start and end dates not provided', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    gainLossService.getGainLoss.mockReturnValue('doesntmatter')
    await getGainLossController(req, res)
    expect(gainLossService.getGainLoss).toHaveBeenCalledWith(
      new Date(0),
      new Date('2021-10-12')
    )
    expect(res.json).toHaveBeenCalledWith('doesntmatter')
    jest.useRealTimers()
  })
})


describe('getGainLossGraphController', () => {
  let req
  let res
  
  beforeEach(async () => {
    gainLossService.gainLossGraph = jest.fn()
    const mockRes = getMockRes()
    req = getMockReq()
    res = mockRes.res
  })

  it('Returns 500 if error thrown', async () => {
    gainLossService.gainLossGraph.mockImplementation(() => {
      throw new Error('Damn')
    })
    await getGainLossGraphController(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.send).toHaveBeenCalledWith('Error')
  })

  it('Returns 400 for invalid timespan', async () => {
    req = getMockReq({
      query: {
        timespan: 'bad',
        granularity: 'month',
        'options-only': 'true'
      }
    })
    await getGainLossGraphController(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith('Invalid timespan')
    expect(gainLossService.gainLossGraph).not.toHaveBeenCalled()
  })

  it('Happy path, no query provided', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    gainLossService.gainLossGraph.mockReturnValue('whatevs')
    await getGainLossGraphController(req, res)
    expect(gainLossService.gainLossGraph).toHaveBeenCalledWith(new Date('2020-10-12T00:00:00.000Z'), new Date(), 'day', false)
    expect(res.json).toHaveBeenCalledWith('whatevs')
    jest.useRealTimers()
  })

  it('Happy path, timespan = month', async () => {
    req = getMockReq({
      query: {
        timespan: 'month',
        granularity: 'month',
        'options-only': 'true'
      }
    })
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    gainLossService.gainLossGraph.mockReturnValue('whatevs')
    await getGainLossGraphController(req, res)
    expect(gainLossService.gainLossGraph).toHaveBeenCalledWith(new Date('2021-09-12T00:00:00.000Z'), new Date(), 'month', true)
    expect(res.json).toHaveBeenCalledWith('whatevs')
    jest.useRealTimers()
  })
})