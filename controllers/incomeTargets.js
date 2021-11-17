const incomeTargetService = require('../services/incomeTargets')


const getIncomeTargetsController = async (req, res) => {
  try {
    const targets = await incomeTargetService.incomeTargets()
    res.json(targets)
  } catch (e) {
    res.status(500).send('Error')
  }
}

const createIncomeTargetController = async (req, res) => {
  try {
    await incomeTargetService.createIncomeTarget(req.body)
    res.status(200).send('Success')
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}


module.exports = {
  getIncomeTargetsController,
  createIncomeTargetController,
}