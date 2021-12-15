//const networkUtil = require('../utils/network')
import * as networkUtil from '../utils/network'

const getPositions = async () => {
  const url = `accounts/${process.env.ACCOUNTNUM}/positions`
  const response = await networkUtil.get(url)
  if (response.positions === 'null') {
    return []
  }
  if (Array.isArray(response.positions.position)) {
    return response.positions.position
  } else {
    return [ response.positions.position ]
  }
}


export {
  getPositions,
}