import * as premiumHistoryService from './premiumHistory'
import { incomeTargetModel } from '../db_models/incomeTargetSchema'


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
  const todayStr = today.toISOString().split('T')[0]
  const firstOfYear = `${today.getFullYear()}-01-01`
  const monthStr = today.getMonth() + 1 <= 9 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`
  const firstOfMonth = `${today.getFullYear()}-${monthStr}-01`

  const [
    allTimeGL,
    monthGL,
    yearGL,
  ] = await Promise.all([
    premiumHistoryService.premiumEarned('1970-01-01', todayStr),
    premiumHistoryService.premiumEarned(firstOfMonth, todayStr),
    premiumHistoryService.premiumEarned(firstOfYear, todayStr),
  ])

  const scopeIncomeMap = {
    month: monthGL.totalPremium,
    year: yearGL.totalPremium,
    allTime: allTimeGL.totalPremium
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


export {
  _evaluateNonStackableTargets,
  _evaluateStackableTargets,
  incomeTargets,
  createIncomeTarget
}