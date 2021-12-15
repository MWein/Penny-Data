const gainLossService = require('./gainLoss')
const { incomeTargetModel } = require('../db_models/incomeTargetSchema')


// Since they are not stackable I don't have to mess with the income values
// If the relevant income is greater than the target amount, it was met
const _evaluateNonStackableTargets = (targets, scopeIncomeMap) => {
  return targets.filter(x => !x.stackable).map(target => {
    const relevantIncome = scopeIncomeMap[target.scope]
    const percentage = Math.min(
      Math.round((relevantIncome / target.amount) * 100),
      100
    )
    const met = relevantIncome > target.amount
    const left = Math.max(target.amount - relevantIncome, 0)

    return {
      ...target._doc,
      percentage,
      met,
      left
    }
  })
}


const _evaluateStackableTargets = (targets, scopeIncomeMap) => {
  return targets
    .sort((a, b) => a.amount - b.amount)
    .filter(x => x.stackable).reduce((acc, target) => {
      const startingIncome = acc.scopeIncomeMap[target.scope]

      const percentage = Math.min(
        Math.round((startingIncome / target.amount) * 100),
        100
      )
      const met = startingIncome > target.amount
      const left = Math.max(target.amount - startingIncome, 0)
      const endingIncome = Math.max(startingIncome - target.amount, 0)

      const evaluatedTarget = {
        ...target._doc,
        percentage,
        met,
        left,
      }

      const newScopeIncomeMap = {
        ...acc.scopeIncomeMap,
        [target.scope]: endingIncome
      }

      return {
        targets: [
          ...acc.targets,
          evaluatedTarget
        ],
        scopeIncomeMap: newScopeIncomeMap
      }
    }, {
      targets: [],
      scopeIncomeMap,
    }).targets
}


const incomeTargets = async () => {
  const incomeTargets = await incomeTargetModel.find().select('-__v')
  if (incomeTargets.length === 0) {
    return []
  }

  const today = new Date()
  const firstOfYear = new Date(`${today.getFullYear()}-01-01`)
  const firstOfMonth = new Date(`${today.getFullYear()}-${today.getMonth() + 1}-01`)

  const [
    allTimeGL,
    monthGL,
    yearGL,
  ] = await Promise.all([
    gainLossService.getGainLoss(new Date(0), today),
    gainLossService.getGainLoss(firstOfMonth, today),
    gainLossService.getGainLoss(firstOfYear, today),
  ])

  const scopeIncomeMap = {
    month: monthGL.totalGL,
    year: yearGL.totalGL,
    allTime: allTimeGL.totalGL
  }

  const evaluatedNonStackableTargets = _evaluateNonStackableTargets(incomeTargets, scopeIncomeMap)
  const evaluatedStackableTargets = _evaluateStackableTargets(incomeTargets, scopeIncomeMap)

  return [
    ...evaluatedNonStackableTargets,
    ...evaluatedStackableTargets
  ]
}


const createIncomeTarget = async newTarget => {
  const newRecord = new incomeTargetModel(newTarget)
  await newRecord.save()
}


module.exports = {
  _evaluateNonStackableTargets,
  _evaluateStackableTargets,
  incomeTargets,
  createIncomeTarget
}