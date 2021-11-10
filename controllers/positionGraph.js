const PositionHistorySchema = require('../db_models/positionHistorySchema')


const getPositionHistory = async (startDate, endDate) => {
  const positionHistoryData = await PositionHistorySchema
    .find({ acquired: { $gte: startDate, $lte: endDate } })
    .sort({ acquired: -1 })
    .select('-_id -__v -hashId')

  return positionHistoryData
}


const positionHistoryGraph = async (startDate, endDate, granularity) => {
  const positionHistoryData = await getPositionHistory(startDate, endDate)

  if (granularity === 'day') {
    // Creating new date out of date to avoid weird mutation error
    const date = new Date(startDate)
    const graph = []
    let currentTotal = 0
    while (date <= endDate) {
      const dateStr = date.toISOString().split('T')[0]
      const gainLossToday = positionHistoryData.filter(gl => gl.acquired.toISOString().split('T')[0] === dateStr)
      const change = gainLossToday.reduce((acc, gl) => acc + gl.costBasis, 0)
      currentTotal = currentTotal + change
      graph.push({ label: dateStr, value: currentTotal, change })
      date.setDate(date.getDate() + 1)
    }
    return graph
  } else if (granularity === 'month') {
    // Creating new date out of date to avoid weird mutation error
    const date = new Date(startDate)
    const graph = []
    let currentTotal = 0
    while (date <= endDate) {
      const dateStr = date.toISOString().slice(0, 7)
      const gainLossToday = positionHistoryData.filter(gl => gl.acquired.toISOString().slice(0, 7) === dateStr)
      const change = gainLossToday.reduce((acc, gl) => acc + gl.costBasis, 0)
      currentTotal = currentTotal + change
      graph.push({ label: dateStr, value: currentTotal, change })
      date.setDate(date.setMonth(date.getMonth() + 1))
    }
    return graph
  } else if (granularity === 'year') {
    // Creating new date out of date to avoid weird mutation error
    const date = new Date(positionHistoryData[positionHistoryData.length - 1].acquired)
    const graph = []
    let currentTotal = 0
    while (date <= endDate) {
      const year = date.getFullYear()
      const gainLossToday = positionHistoryData.filter(gl => gl.acquired.getFullYear() === year)
      const change = gainLossToday.reduce((acc, gl) => acc + gl.costBasis, 0)
      currentTotal = currentTotal + change
      graph.push({ label: `${year}`, value: currentTotal, change })
      date.setDate(date.setMonth(date.getMonth() + 1))
    }
    return graph
  }
}


const getPositionGraphDataController = async (req, res) => {
  try {
    const timespan = req.query.timespan || 'year'

    let startDate = new Date()
    if (timespan === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1)
    } else if (timespan === 'month') {
      startDate.setMonth(startDate.getMonth() - 1)
    }

    const granularity = req.query.granularity || 'day'
    const optionsOnly = req.query['options-only'] === 'true'
    const gainLossGraphData = await positionHistoryGraph(startDate, new Date(), granularity, optionsOnly)
    res.json(gainLossGraphData)
  } catch (e) {
    console.log(e)
    res.status(500).send('Error')
  }
}


module.exports = {
  getPositionHistory,
  positionHistoryGraph,
  getPositionGraphDataController,
}