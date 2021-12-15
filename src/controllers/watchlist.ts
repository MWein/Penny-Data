const watchlistUtil = require('../tradier/watchlist')

const getWatchlistController = async (req, res) : Promise<void> => {
  try {
    const watchlist = await watchlistUtil.getWatchlistSymbols()
    res.json(watchlist)
  } catch (e) {
    res.status(500).send('Error')
  }
}

module.exports = {
  getWatchlistController
}