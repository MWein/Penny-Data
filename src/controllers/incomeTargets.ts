import * as incomeTargetService from '../services/incomeTargets'


const getIncomeTargetsController = async (req, res) : Promise<void> => {
  try {
    const targets = await incomeTargetService.incomeTargets()
    res.json(targets)
  } catch (e) {
    res.status(500).send('Error')
  }
}

const createIncomeTargetController = async (req, res) : Promise<void> => {
  try {
    await incomeTargetService.createIncomeTarget(req.body)
    res.status(200).send('Success')
  } catch (e) {
    res.status(500).send('Error')
  }
}


export {
  getIncomeTargetsController,
  createIncomeTargetController,
}