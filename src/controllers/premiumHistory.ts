import * as premiumHistoryUtil from '../services/premiumHistory'

const premiumEarnedController = async (req, res) : Promise<void> => {
  try {
    const startDate = req.query.start || '2020-01-01'
    const endDate = req.query.end || new Date().toISOString().slice(0, 10)
    const premiumHistory = await premiumHistoryUtil.premiumEarned(startDate, endDate)

    res.json(premiumHistory)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}


const _dateOneMonthAgo = () : string => {
  const date = new Date()
  date.setDate(date.getDate() - 90)
  return date.toISOString().split('T')[0]
}


const premiumGraphController = async (req, res) : Promise<void> => {
  try {
    const startDate = req.query.start || _dateOneMonthAgo()
    const endDate = req.query.end || new Date().toISOString().slice(0, 10)

    const premiumGraph = await premiumHistoryUtil.premiumGraph(startDate, endDate)

    res.json(premiumGraph)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}


export {
  premiumEarnedController,
  premiumGraphController
}