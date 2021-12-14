const gainLossSchema = require('../db_models/gainLossSchema')
const PositionHistorySchema = require('../db_models/positionHistorySchema')

const {
  _retrieveDataBasedOnEnvironment,
  getGainLoss,
  gainLossGraph,
} = require('./gainLoss')


describe('_retrieveDataBasedOnEnvironment', () => {
  let select, sort
  
  beforeEach(() => {
    select = jest.fn()
    sort = jest.fn().mockReturnValue({
      select
    })
    gainLossSchema.find = jest.fn().mockReturnValue({
      sort
    })
    PositionHistorySchema.find = jest.fn().mockReturnValue({
      sort
    })
  })

  it('Returns data from the gainLoss collection if prod', async () => {
    process.env.BASEPATH = 'something' // does not include "sandbox"
    select.mockReturnValue('somethingelse')
    const result = await _retrieveDataBasedOnEnvironment(new Date(0), new Date())
    expect(result).toEqual('somethingelse')
    expect(gainLossSchema.find).toHaveBeenCalled()
    expect(select).toHaveBeenCalled()
  })

  it('Returns data from the PositionHistory collection if nonprod', async () => {
    process.env.BASEPATH = 'somethingsandbox'
    select.mockReturnValue([
      {
        _doc: { name: 'whatever' },
        costBasis: 20,
        acquired: '2021-01-01'
      }
    ])
    const result = await _retrieveDataBasedOnEnvironment(new Date(0), new Date())
    expect(result).toEqual([
      {
        name: 'whatever',
        close_date: '2021-01-01',
        gain_loss: 20,
      }
    ])
    expect(PositionHistorySchema.find).toHaveBeenCalled()
    expect(select).toHaveBeenCalled()
  })
})


describe('getGainLoss', () => {

})


describe('gainLossGraph', () => {

})