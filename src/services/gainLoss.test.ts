// import { gainLossModel } from '../db_models/gainLossSchema'
// import { positionHistoryModel } from '../db_models/positionHistorySchema'

// import {
//   _retrieveDataBasedOnEnvironment,
//   getGainLoss,
//   gainLossGraph,
// } from './gainLoss'


// describe('_retrieveDataBasedOnEnvironment', () => {
//   let select, sort
  
//   beforeEach(() => {
//     select = jest.fn()
//     sort = jest.fn().mockReturnValue({
//       select
//     })
//     gainLossModel.find = jest.fn().mockReturnValue({
//       sort
//     })
//     positionHistoryModel.find = jest.fn().mockReturnValue({
//       sort
//     })
//   })

//   it('Returns data from the gainLoss collection if prod', async () => {
//     process.env.BASEPATH = 'something' // does not include "sandbox"
//     select.mockReturnValue('somethingelse')
//     const result = await _retrieveDataBasedOnEnvironment(new Date(0), new Date())
//     expect(result).toEqual('somethingelse')
//     expect(gainLossModel.find).toHaveBeenCalled()
//     expect(select).toHaveBeenCalled()
//   })

//   it('Returns data from the PositionHistory collection if nonprod', async () => {
//     process.env.BASEPATH = 'somethingsandbox'
//     select.mockReturnValue([
//       {
//         _doc: { name: 'whatever' },
//         costBasis: 20,
//         acquired: '2021-01-01'
//       }
//     ])
//     const result = await _retrieveDataBasedOnEnvironment(new Date(0), new Date())
//     expect(result).toEqual([
//       {
//         name: 'whatever',
//         close_date: '2021-01-01',
//         gain_loss: 20,
//       }
//     ])
//     expect(positionHistoryModel.find).toHaveBeenCalled()
//     expect(select).toHaveBeenCalled()
//   })
// })


// describe('getGainLoss', () => {

// })


// describe('gainLossGraph', () => {

// })