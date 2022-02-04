import * as accountSummaryUtil from '../services/accountSummary'


const accountSummaryController = async (req, res) : Promise<void> => {
  try {
    const summary = await accountSummaryUtil.accountSummary()
    res.json(summary)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}

export {
  accountSummaryController
}