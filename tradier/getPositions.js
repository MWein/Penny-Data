const network = require('../utils/network')


const getPositions = async () => {
  const url = `accounts/${process.env.ACCOUNTNUM}/positions`
  const response = await network.get(url)
  if (response.positions === 'null') {
    return []
  }
  if (Array.isArray(response.positions.position)) {
    return response.positions.position
  } else {
    return [ response.positions.position ]
  }
}


const getPositionsController = async (req, res) => {
  try {
    const positions = await getPositions()
    res.json(positions)
  } catch (e) {
    console.log('FUCK!', e)
    res.status(500).send('Error')
  }
}


module.exports = {
  getPositions,
  getPositionsController,
}