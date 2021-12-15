const gainLossService = require('./gainLoss')
const { incomeTargetModel } = require('../db_models/incomeTargetSchema')

jest.mock('../db_models/incomeTargetSchema')

const {
  _evaluateNonStackableTargets,
  _evaluateStackableTargets,
  incomeTargets,
  createIncomeTarget
} = require('./incomeTargets')


const mockTargets = [
  {
    _doc: { name: 'first 10k!' }, // side effect from spreading a mongo document
    stackable: false,
    scope: 'allTime',
    amount: 10000,
  },
  {
    _doc: { name: 'monthly target' },
    stackable: false,
    scope: 'month',
    amount: 2000,
  },
  {
    _doc: { name: 'annual target' },
    stackable: false,
    scope: 'year',
    amount: 500000,
  },
  {
    _doc: { name: 'a met target' },
    stackable: false,
    scope: 'year',
    amount: 200,
  },
  // STACKABLE MONTHLY
  {
    _doc: { name: 'somecardpayment' },
    stackable: true,
    scope: 'month',
    amount: 52
  },
  {
    _doc: { name: 'car' },
    stackable: true,
    scope: 'month',
    amount: 300
  },
  {
    _doc: { name: 'student loans' },
    stackable: true,
    scope: 'month',
    amount: 4000
  },

  // STACKABLE ANNUAL
  {
    _doc: { name: 'something? idk' },
    stackable: true,
    scope: 'year',
    amount: 400
  },
  {
    _doc: { name: 'annual gambling binge fund' },
    stackable: true,
    scope: 'year',
    amount: 70000
  },

  // STACKABLE ALL TIME
  {
    _doc: { name: 'first 20k!' },
    stackable: true,
    scope: 'allTime',
    amount: 20000
  },
  {
    _doc: { name: 'next 20k!' },
    stackable: true,
    scope: 'allTime',
    amount: 20000
  },
]

const mockScopeIncomeMap = {
  month: 300,
  year: 10000,
  allTime: 400,
}


describe('_evaluateNonStackableTargets', () => {
  it('Returns empty array if no targets provided', () => {
    const result = _evaluateNonStackableTargets([], mockScopeIncomeMap)
    expect(result).toEqual([])
  })

  it('Evaluates each non-stackable target', () => {
    const result = _evaluateNonStackableTargets(mockTargets, mockScopeIncomeMap)
    expect(result).toEqual([
      { name: 'first 10k!', left: 9600, met: false, percentage: 4 },
      { name: 'monthly target', left: 1700, met: false, percentage: 15 },
      { name: 'annual target', left: 490000, met: false, percentage: 2 },
      { name: 'a met target', left: 0, met: true, percentage: 100 },
    ])
  })
})

describe('_evaluateStackableTargets', () => {
  it('Returns empty array if no targets provided', () => {
    const result = _evaluateStackableTargets([], mockScopeIncomeMap)
    expect(result).toEqual([])
  })

  it('Evaluates each stackable target', () => {
    const result = _evaluateStackableTargets(mockTargets, mockScopeIncomeMap)
    expect(result).toEqual([
      { left: 0, met: true, name: 'somecardpayment', percentage: 100 },
      { left: 52, met: false, name: 'car', percentage: 83 },
      { left: 0, met: true, name: 'something? idk', percentage: 100 },
      { left: 4000, met: false, name: 'student loans', percentage: 0 },
      { left: 19600, met: false, name: 'first 20k!', percentage: 2 },
      { left: 20000, met: false, name: 'next 20k!', percentage: 0 },
      { left: 60400, met: false, name: 'annual gambling binge fund', percentage: 14 },
    ])
  })
})


describe('incomeTargets', () => {
  let select

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2021-10-12').getTime())
    gainLossService.getGainLoss = jest.fn()
    select = jest.fn()
    incomeTargetModel.find = jest.fn().mockReturnValue({
      select
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('If there are no income targets in the DB, returns empty array', async () => {
    select.mockReturnValue([])
    const result = await incomeTargets()
    expect(result).toEqual([])
    expect(gainLossService.getGainLoss).not.toHaveBeenCalled()
  })

  it('Calls gainLossService to get year, month, and allTime values', async () => {
    select.mockReturnValue(mockTargets)
    gainLossService.getGainLoss.mockReturnValue({
      totalGL: 0
    })

    await incomeTargets()

    expect(gainLossService.getGainLoss).toHaveBeenCalledTimes(3)
    expect(gainLossService.getGainLoss).toHaveBeenCalledWith(
      new Date('1970-01-01T00:00:00.000Z'),
      new Date('2021-10-12T00:00:00.000Z')
    ) // All Time

    expect(gainLossService.getGainLoss).toHaveBeenCalledWith(
      new Date('2021-10-01T00:00:00.000Z'),
      new Date('2021-10-12T00:00:00.000Z')
    ) // Month

    expect(gainLossService.getGainLoss).toHaveBeenCalledWith(
      new Date('2021-01-01T00:00:00.000Z'),
      new Date('2021-10-12T00:00:00.000Z')
    ) // Year
  })

  it('Returns evaluated targets', async () => {
    select.mockReturnValue(mockTargets)
    gainLossService.getGainLoss.mockReturnValueOnce({ totalGL: 10000 }) // All Time
    gainLossService.getGainLoss.mockReturnValueOnce({ totalGL: 2000 }) // Month
    gainLossService.getGainLoss.mockReturnValueOnce({ totalGL: 4000 }) // Year

    const result = await incomeTargets()

    expect(result).toEqual([
      { left: 0, met: true, name: 'a met target', percentage: 100},
      { left: 0, met: false, name: 'monthly target', percentage: 100},
      { left: 0, met: false, name: 'first 10k!', percentage: 100},
      { left: 496000, met: false, name: 'annual target', percentage: 1},
      { left: 0, met: true, name: 'somecardpayment', percentage: 100},
      { left: 0, met: true, name: 'car', percentage: 100},
      { left: 0, met: true, name: 'something? idk', percentage: 100},
      { left: 2352, met: false, name: 'student loans', percentage: 41},
      { left: 10000, met: false, name: 'first 20k!', percentage: 50},
      { left: 20000, met: false, name: 'next 20k!', percentage: 0},
      { left: 66400, met: false, name: 'annual gambling binge fund', percentage: 5}
    ])
  })
})


describe('createIncomeTarget', () => {
  it('Creates the new record and saves it to the database', async () => {
    let saveFunc = jest.fn()
    incomeTargetModel.mockReturnValue({
      save: saveFunc
    })
    const mockTarget = {
      some: 'target'
    }
    await createIncomeTarget(mockTarget)
    expect(incomeTargetModel).toHaveBeenCalledWith(mockTarget)
    expect(saveFunc).toHaveBeenCalled()
  })
})