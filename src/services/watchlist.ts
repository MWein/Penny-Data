import { watchlistModel } from '../db_models/watchlistSchema'

const getWatchlistSymbols = async () : Promise<String[]> => {
  try {
    const watchlist = await watchlistModel.find()
    return watchlist.map(x => x.symbol)
  } catch (e) {
    return []
  }
}

export {
  getWatchlistSymbols
}