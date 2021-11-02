const network = require('../utils/network')


const getQuotes = async tickers => {
  const url = `markets/quotes?symbols=${tickers.join(',')}`
  const response = await network.get(url)
  if (response.quotes === 'null') {
    return []
  }
  if (Array.isArray(response.quotes.quote)) {
    return response.quotes.quote
  } else {
    return [ response.quotes.quote ]
  }
}


module.exports = {
  getQuotes,
}