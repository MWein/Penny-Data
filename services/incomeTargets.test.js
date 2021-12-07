const gainLossService = require('./gainLoss')
const incomeTargetSchema = require('../db_models/incomeTargetSchema')

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

})


describe('createIncomeTarget', () => {
  it('Creates the new record and saves it to the database', async () => {
    let saveFunc = jest.fn()
    incomeTargetSchema.mockReturnValue({
      save: saveFunc
    })
    const mockTarget = {
      some: 'target'
    }
    await createIncomeTarget(mockTarget)
    expect(incomeTargetSchema).toHaveBeenCalledWith(mockTarget)
    expect(saveFunc).toHaveBeenCalled()
  })
})